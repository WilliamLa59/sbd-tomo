import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type WeekMetricDelta = {
	value: string;
	direction: "positive" | "negative" | "neutral";
	compareWeek: number;
};

export type WeekSummaryDeltaMap = {
	totalVolume?: WeekMetricDelta;
	squatVolume?: WeekMetricDelta;
	benchVolume?: WeekMetricDelta;
	deadliftVolume?: WeekMetricDelta;
	averageRpe?: WeekMetricDelta;
	e1rmChange?: WeekMetricDelta;
};

type WeekSummaryCardProps = {
	week: number;
	completedSessions: number;
	totalSessions: number;
	totalVolume: string;
	squatVolume: string;
	benchVolume: string;
	deadliftVolume: string;
	averageRpe: string;
	e1rmChange: string;
	adherence: string;
	status?: string;
	deltas?: WeekSummaryDeltaMap;
};

export function WeekSummaryCard({
	week,
	completedSessions,
	totalSessions,
	totalVolume,
	squatVolume,
	benchVolume,
	deadliftVolume,
	averageRpe,
	e1rmChange,
	adherence,
	status,
	deltas,
}: WeekSummaryCardProps) {
	const stats = [
		{
			label: "Total Volume",
			value: `${totalVolume} lb`,
			delta: deltas?.totalVolume,
		},
		{ label: "Squat", value: `${squatVolume} lb`, delta: deltas?.squatVolume },
		{ label: "Bench", value: `${benchVolume} lb`, delta: deltas?.benchVolume },
		{
			label: "Deadlift",
			value: `${deadliftVolume} lb`,
			delta: deltas?.deadliftVolume,
		},
		{ label: "Avg Session RPE", value: averageRpe, delta: deltas?.averageRpe },
		{ label: "Program Adherence", value: adherence },
		{
			label: "Weekly e1RM Change",
			value: e1rmChange,
			delta: deltas?.e1rmChange,
		},
	];

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Selected week
						</p>
						<h2 className="mt-2 text-xl font-medium tracking-tight">
							Week {week}
							{status ? (
								<span className="text-muted-foreground"> - {status}</span>
							) : null}
						</h2>
					</div>

					<p className="text-sm text-muted-foreground">
						<span className="font-mono text-foreground">
							{completedSessions}
						</span>{" "}
						/ {totalSessions} sessions completed
					</p>
				</div>

				<div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-7">
					{stats.map((stat) => (
						<div key={stat.label}>
							<p className="text-xs text-muted-foreground">{stat.label}</p>
							<p className="mt-1 font-mono text-sm font-medium">{stat.value}</p>
							{stat.delta ? <MetricDelta delta={stat.delta} /> : null}
							{!stat.delta &&
							week === 1 &&
							stat.label !== "Program Adherence" ? (
								<p className="mt-1 text-xs text-muted-foreground">Baseline</p>
							) : null}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function MetricDelta({ delta }: { delta: WeekMetricDelta }) {
	return (
		<p
			className={cn(
				"mt-1 text-xs text-muted-foreground",
				delta.direction === "positive" && "text-success",
				delta.direction === "negative" && "text-destructive",
			)}
		>
			{delta.value} vs W{delta.compareWeek}
		</p>
	);
}
