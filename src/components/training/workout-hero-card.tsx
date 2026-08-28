// src/components/training/workout-hero-card.tsx

import {
	AlertTriangle,
	Check,
	CircleDashed,
	type LucideIcon,
	MinusCircle,
} from "lucide-react";
import { useId, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type WorkoutSet = {
	id: number;
	weight: number;
	reps: number;
	rpe: number;
	completed?: boolean;
};

type WorkoutHeroCardProps = {
	exercise: string;

	topSet: {
		weight: number;
		reps: number;
		rpe: number;
		completed?: boolean;
	};

	backdowns: WorkoutSet[];

	className?: string;
};

type SetStatus =
	| "go-up"
	| "matched"
	| "major-overshoot"
	| "pending"
	| "sandbagged"
	| "slight-overshoot"
	| "too-ez";

type ActualSet = {
	weight: number | "";
	reps: number | "";
	rpe: number | "";
};

export function WorkoutHeroCard({
	exercise,
	topSet,
	backdowns,
	className,
}: WorkoutHeroCardProps) {
	const prescribedSets = useMemo(
		() => [{ id: 0, label: "Top", ...topSet }, ...backdowns],
		[topSet, backdowns],
	);
	const [actualSets, setActualSets] = useState<Record<number, ActualSet>>(() =>
		Object.fromEntries(
			prescribedSets.map((set) => [
				set.id,
				set.completed
					? {
							weight: set.weight,
							reps: set.reps,
							rpe: set.rpe,
						}
					: {
							weight: "",
							reps: "",
							rpe: "",
						},
			]),
		),
	);
	const statuses = prescribedSets.map((set) =>
		getSetStatus(set, actualSets[set.id]),
	);
	const actionLabel = statuses.every((status) => status !== "pending")
		? "View Workout"
		: statuses.some((status) => status !== "pending")
			? "Continue Workout"
			: "Start Workout";

	function updateActual(setId: number, field: keyof ActualSet, value: string) {
		const parsedValue = getActualValue(field, value);

		setActualSets((current) => ({
			...current,
			[setId]: {
				...current[setId],
				[field]: parsedValue,
			},
		}));
	}

	return (
		<Card className={cn("overflow-hidden shadow-none", className)}>
			<CardContent className="p-0">
				<div className="p-5 sm:p-6">
					<p className="text-xs font-medium uppercase tracking-[0.12em] text-brand">
						Current Workout
					</p>

					<div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h2 className="text-lg font-medium tracking-tight sm:text-xl">
								{exercise}
							</h2>

							<p className="mt-1 font-mono text-xs text-muted-foreground">
								{topSet.weight} lb × {topSet.reps} · RPE {topSet.rpe} top set
							</p>
						</div>

						<Button className="w-full sm:w-auto">{actionLabel}</Button>
					</div>
				</div>

				<div className="border-t">
					<div className="hidden grid-cols-[4rem_minmax(8rem,1fr)_5rem_5rem_5rem_8rem] gap-3 border-b px-5 py-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground sm:grid sm:px-6">
						<span>Set</span>
						<span>Target</span>
						<span>Weight</span>
						<span>Reps</span>
						<span>RPE</span>
						<span>Status</span>
					</div>

					{prescribedSets.map((set, index) => (
						<SetRow
							key={set.id}
							actual={actualSets[set.id]}
							index={index + 1}
							onChange={(field, value) => updateActual(set.id, field, value)}
							status={getSetStatus(set, actualSets[set.id])}
							target={set}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function SetRow({
	actual,
	index,
	onChange,
	status,
	target,
}: {
	actual: ActualSet;
	index: number;
	onChange: (field: keyof ActualSet, value: string) => void;
	status: SetStatus;
	target: WorkoutSet & { label?: string };
}) {
	const statusContent = setStatusContent[status];
	const StatusIcon = statusContent.icon;

	return (
		<div className="grid gap-3 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[4rem_minmax(8rem,1fr)_5rem_5rem_5rem_8rem] sm:items-center sm:px-6 sm:py-3">
			<div className="flex items-center justify-between gap-3 sm:block">
				<span className="font-mono text-xs text-muted-foreground">
					{target.label ?? `Set ${index}`}
				</span>

				<StatusBadge className="sm:hidden" icon={StatusIcon} status={status}>
					{statusContent.label}
				</StatusBadge>
			</div>

			<p className="font-mono text-sm">
				{target.weight} lb
				<span className="mx-2 text-muted-foreground">×</span>
				{target.reps}
				<span className="mx-2 text-muted-foreground">·</span>
				RPE {target.rpe}
			</p>

			<ActualField
				ariaLabel={`${target.label ?? `Set ${index}`} actual weight`}
				label="Weight"
				value={actual.weight}
				onChange={(value) => onChange("weight", value)}
			/>

			<ActualField
				ariaLabel={`${target.label ?? `Set ${index}`} actual reps`}
				label="Reps"
				value={actual.reps}
				onChange={(value) => onChange("reps", value)}
			/>

			<ActualField
				ariaLabel={`${target.label ?? `Set ${index}`} actual RPE`}
				label="RPE"
				max="10"
				step="0.5"
				value={actual.rpe}
				onChange={(value) => onChange("rpe", value)}
			/>

			<StatusBadge
				className="hidden sm:inline-flex"
				icon={StatusIcon}
				status={status}
			>
				{statusContent.label}
			</StatusBadge>
		</div>
	);
}

function ActualField({
	ariaLabel,
	label,
	onChange,
	max,
	step = "1",
	value,
}: {
	ariaLabel: string;
	label: string;
	max?: string;
	onChange: (value: string) => void;
	step?: string;
	value: number | "";
}) {
	const inputId = useId();

	return (
		<label className="grid gap-1" htmlFor={inputId}>
			<span className="text-xs font-medium text-muted-foreground sm:hidden">
				{label}
			</span>

			<Input
				aria-label={ariaLabel}
				className="font-mono"
				id={inputId}
				inputMode="decimal"
				max={max}
				min="0"
				onChange={(event) => onChange(event.target.value)}
				step={step}
				type="number"
				value={value}
			/>
		</label>
	);
}

function StatusBadge({
	children,
	className,
	icon: Icon,
	status,
}: {
	children: string;
	className?: string;
	icon: LucideIcon;
	status: SetStatus;
}) {
	return (
		<Badge
			variant="outline"
			className={cn(
				"gap-1.5",
				(status === "matched" || status === "too-ez") &&
					"border-success/30 text-success",
				status === "slight-overshoot" && "border-warning/40 text-warning",
				status === "go-up" && "border-warning/40 text-warning",
				status === "major-overshoot" &&
					"border-destructive/30 text-destructive",
				status === "sandbagged" && "border-destructive/30 text-destructive",
				status === "pending" && "text-muted-foreground",
				className,
			)}
		>
			<Icon className="size-3" />
			{children}
		</Badge>
	);
}

function getSetStatus(
	target: Pick<WorkoutSet, "weight" | "reps" | "rpe">,
	actual?: ActualSet,
): SetStatus {
	if (
		!actual ||
		actual.weight === "" ||
		actual.reps === "" ||
		actual.rpe === ""
	) {
		return "pending";
	}

	const overshoot = Math.max(
		actual.reps - target.reps,
		actual.rpe - target.rpe,
	);

	if (overshoot > 1) {
		return "major-overshoot";
	}

	if (overshoot > 0) {
		return "slight-overshoot";
	}

	const undershoot = Math.max(
		target.reps - actual.reps,
		target.rpe - actual.rpe,
	);

	if (undershoot >= 0.5 && undershoot <= 1) {
		return "too-ez";
	}

	if (undershoot > 1 && undershoot <= 2) {
		return "go-up";
	}

	if (undershoot > 2) {
		return "sandbagged";
	}

	if (
		actual.weight === target.weight &&
		actual.reps === target.reps &&
		actual.rpe === target.rpe
	) {
		return "matched";
	}

	return "pending";
}

const setStatusContent: Record<
	SetStatus,
	{
		icon: LucideIcon;
		label: string;
	}
> = {
	matched: {
		icon: Check,
		label: "Matched",
	},
	"go-up": {
		icon: AlertTriangle,
		label: "Go up",
	},
	"major-overshoot": {
		icon: AlertTriangle,
		label: "Major Overshoot",
	},
	"slight-overshoot": {
		icon: AlertTriangle,
		label: "Slight Overshoot",
	},
	sandbagged: {
		icon: MinusCircle,
		label: "Sandbagged",
	},
	pending: {
		icon: CircleDashed,
		label: "Pending",
	},
	"too-ez": {
		icon: Check,
		label: "Too EZ",
	},
};

function getActualValue(field: keyof ActualSet, value: string) {
	if (value === "") {
		return "";
	}

	const numberValue = Number(value);

	if (field === "rpe") {
		return Math.min(numberValue, 10);
	}

	return numberValue;
}
