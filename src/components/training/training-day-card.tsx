import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TrainingDayStatus =
	| "completed"
	| "current"
	| "upcoming"
	| "skipped"
	| "partial";

export type TrainingSet = {
	weight: number;
	unit: string;
	reps: number;
	rpe?: number | string | null;
};

type TrainingSetDisplay = string | TrainingSet;

export type TrainingDay = {
	id: string;
	day: string;
	title: string;
	primaryLift: string;
	status: TrainingDayStatus;
	topSet?: TrainingSetDisplay;
	backdowns?: TrainingSetDisplay | readonly TrainingSetDisplay[];
	plannedTopSet?: TrainingSetDisplay;
	plannedBackdowns?: readonly TrainingSetDisplay[];
	planned?: string;
	actual?: string;
	rpe?: string;
	note?: string;
};

type TrainingDayCardProps = {
	day: TrainingDay;
};

export function TrainingDayCard({ day }: TrainingDayCardProps) {
	const isCompleted = day.status === "completed";
	const isCurrent = day.status === "current";
	const isSkipped = day.status === "skipped";
	const isPartial = day.status === "partial";
	const statusLabel = getStatusLabel(day.status);
	const actualBackdowns = toSetList(day.backdowns);
	const plannedBackdowns = day.plannedBackdowns ?? [];
	const showActual = isCompleted || isCurrent || isPartial;
	const actualTopSet = day.topSet ? [day.topSet] : [];
	const prescribedTopSet = day.plannedTopSet
		? [day.plannedTopSet]
		: actualTopSet;
	const prescribedBackdowns =
		plannedBackdowns.length > 0 ? plannedBackdowns : actualBackdowns;

	return (
		<Card className={cn("shadow-none", !showActual && "bg-muted/30")}>
			<CardContent className="p-4 sm:p-5">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto] lg:items-center">
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<p className="text-sm font-medium">{day.day}</p>
							<Badge variant={isCompleted ? "secondary" : "outline"}>
								{statusLabel}
							</Badge>
						</div>

						<h3 className="mt-2 truncate text-base font-medium tracking-tight">
							{day.title}
						</h3>
						<p className="mt-1 text-xs text-muted-foreground">
							{day.primaryLift}
						</p>
					</div>

					<div className="grid gap-4 text-xs sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
						<SessionSection
							backdowns={prescribedBackdowns}
							title="Prescribed"
							topSet={prescribedTopSet}
						/>
						<SessionSection
							backdowns={showActual && !isSkipped ? actualBackdowns : []}
							empty={!showActual || isSkipped}
							title="Actual"
							topSet={showActual && !isSkipped ? actualTopSet : []}
						/>

						{day.note ? (
							<div className="min-w-0 border-t pt-3 sm:col-span-2">
								<p className="text-muted-foreground">Note</p>
								<p className="mt-1 truncate text-xs text-foreground/80">
									{day.note}
								</p>
							</div>
						) : null}
					</div>

					<Button className="w-full lg:w-auto" size="sm" variant="outline">
						{showActual ? <Check className="size-3.5" /> : null}
						View Session
						<ArrowRight className="size-3.5" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function SessionSection({
	backdowns,
	empty,
	title,
	topSet,
}: {
	backdowns: readonly TrainingSetDisplay[];
	empty?: boolean;
	title: string;
	topSet: readonly TrainingSetDisplay[];
}) {
	return (
		<div className="min-w-0 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 first:sm:border-l-0 first:sm:pl-0">
			<p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
				{title}
			</p>

			<div className="mt-3 grid gap-3">
				<SessionSetGroup empty={empty} label="Top Set" sets={topSet} />
				<SessionSetGroup empty={empty} label="Backdowns" sets={backdowns} />
			</div>
		</div>
	);
}

function SessionSetGroup({
	empty,
	label,
	sets,
}: {
	empty?: boolean;
	label: string;
	sets: readonly TrainingSetDisplay[];
}) {
	if (empty || sets.length === 0) {
		return (
			<div className="min-w-0">
				<p className="text-muted-foreground">{label}</p>
				<p className="mt-1 font-mono text-sm font-medium text-muted-foreground">
					—
				</p>
			</div>
		);
	}

	const setOccurrences = new Map<string, number>();

	return (
		<div className="min-w-0">
			<p className="text-muted-foreground">{label}</p>
			{sets.map((set) => {
				const display = formatSet(set);
				const occurrence = setOccurrences.get(display.full) ?? 0;
				setOccurrences.set(display.full, occurrence + 1);

				return (
					<p
						className="mt-1 truncate font-mono text-sm font-medium"
						key={`${display.full}-${occurrence}`}
					>
						<span className="hidden sm:inline">{display.full}</span>
						<span className="sm:hidden">{display.compact}</span>
					</p>
				);
			})}
		</div>
	);
}

function toSetList(
	sets?: TrainingSetDisplay | readonly TrainingSetDisplay[],
): readonly TrainingSetDisplay[] {
	if (!sets) {
		return [];
	}

	return Array.isArray(sets) ? sets : [sets];
}

function formatSet(set: TrainingSetDisplay) {
	if (typeof set === "string") {
		return parseFormattedSet(set) ?? { compact: set, full: set };
	}

	return formatSetParts(set.weight, set.unit, set.reps, set.rpe);
}

function parseFormattedSet(set: string) {
	const match = set.match(
		/^(\d+(?:\.\d+)?)\s+([a-zA-Z]+)\s*[×x]\s*(\d+)(?:\s*(?:\[(.*?)\]\(.*?\)|@\s*([0-9.]+)))?$/,
	);

	if (!match) {
		return null;
	}

	const [, weight, unit, reps, bracketRpe, atRpe] = match;

	return formatSetParts(weight, unit, reps, bracketRpe ?? atRpe);
}

function formatSetParts(
	weight: number | string,
	unit: string,
	reps: number | string,
	rpe?: number | string | null,
) {
	const baseFull = `${weight} ${unit} × ${reps}`;
	const baseCompact = `${weight} ${unit}×${reps}`;

	if (rpe === null || typeof rpe === "undefined" || rpe === "") {
		return {
			compact: baseCompact,
			full: baseFull,
		};
	}

	return {
		compact: `${baseCompact} @ ${rpe}`,
		full: `${baseFull} @ ${rpe}`,
	};
}

function getStatusLabel(status: TrainingDayStatus) {
	switch (status) {
		case "completed":
			return "Completed";
		case "current":
			return "Current";
		case "skipped":
			return "Skipped";
		case "partial":
			return "Partial";
		case "upcoming":
			return "Upcoming";
	}
}
