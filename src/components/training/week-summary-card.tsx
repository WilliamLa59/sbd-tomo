import { Card, CardContent } from "@/components/ui/card";

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
	status?: string;
};

export function WeekSummaryCard({
	week,
	completedSessions,
	totalSessions,
	totalVolume,
	squatVolume,
	benchVolume,
	deadliftVolume,
	status,
}: WeekSummaryCardProps) {
	const stats = [
		{
			label: "Total Volume",
			value: `${totalVolume} lb`,
		},
		{ label: "Squat Volume", value: `${squatVolume} lb` },
		{ label: "Bench Volume", value: `${benchVolume} lb` },
		{
			label: "Deadlift Volume",
			value: `${deadliftVolume} lb`,
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

				<div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<div key={stat.label}>
							<p className="text-xs text-muted-foreground">{stat.label}</p>
							<p className="mt-1 font-mono text-sm font-medium">{stat.value}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
