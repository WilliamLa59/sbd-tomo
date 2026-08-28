import { ArrowRight, Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TrainingDayStatus =
	| "completed"
	| "upcoming"
	| "skipped"
	| "partial";

export type TrainingDay = {
	id: string;
	day: string;
	title: string;
	primaryLift: string;
	status: TrainingDayStatus;
	topSet?: string;
	backdowns?: string;
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
	const isSkipped = day.status === "skipped";
	const isPartial = day.status === "partial";

	return (
		<Card className={cn("shadow-none", !isCompleted && "bg-muted/30")}>
			<CardContent className="p-4 sm:p-5">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto] lg:items-center">
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<p className="text-sm font-medium">{day.day}</p>
							<Badge variant={isCompleted ? "secondary" : "outline"}>
								{isCompleted
									? "Completed"
									: isSkipped
										? "Skipped"
										: isPartial
											? "Partial"
											: "Upcoming"}
							</Badge>
						</div>

						<h3 className="mt-2 truncate text-base font-medium tracking-tight">
							{day.title}
						</h3>
						<p className="mt-1 text-xs text-muted-foreground">
							{day.primaryLift}
						</p>
					</div>

					<div className="grid gap-3 text-xs sm:grid-cols-2">
						<SessionStat label="Top set" value={day.topSet ?? "Not logged"} />
						<SessionStat
							label="Backdowns"
							value={day.backdowns ?? "Not logged"}
						/>
						<SessionStat label="RPE" value={day.rpe ?? "Not logged"} />

						{day.planned && day.actual && (
							<div className="border-t pt-3 sm:col-span-2">
								<div className="grid gap-2 sm:grid-cols-2">
									<SessionStat label="Planned" value={day.planned} />
									<SessionStat label="Actual" value={day.actual} />
								</div>
							</div>
						)}

						{(isCompleted || isSkipped || isPartial) && day.note ? (
							<div className="min-w-0 border-t pt-3 sm:col-span-2">
								<p className="text-muted-foreground">Note</p>
								<p className="mt-1 truncate text-xs text-foreground/80">
									{day.note}
								</p>
							</div>
						) : null}
					</div>

					<Button className="w-full lg:w-auto" size="sm" variant="outline">
						{isCompleted ? <Check className="size-3.5" /> : null}
						View Session
						<ArrowRight className="size-3.5" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

function SessionStat({ label, value }: { label: string; value: string }) {
	return (
		<div className="min-w-0">
			<p className="text-muted-foreground">{label}</p>
			<p className="mt-1 truncate font-mono text-sm font-medium">{value}</p>
		</div>
	);
}
