import { useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { ChartLegend } from "@/components/training/block-strength-progression-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WeeklyVolumeMetric = "tonnage" | "sets" | "reps";

type WeeklyVolumePoint = {
	week: string;
	tonnage: LiftMetricValues;
	sets: LiftMetricValues;
	reps: LiftMetricValues;
};

type LiftMetricValues = {
	squat: number;
	bench: number;
	deadlift: number;
	total: number;
};

type WeeklyVolumeCardProps = {
	data: readonly WeeklyVolumePoint[];
	accumulatedVolume: string;
	currentWeek: number;
};

export function WeeklyVolumeCard({
	data,
	accumulatedVolume,
	currentWeek,
}: WeeklyVolumeCardProps) {
	const [metric, setMetric] = useState<WeeklyVolumeMetric>("tonnage");
	const chartData = data.map((point) => ({
		week: point.week,
		...point[metric],
	}));
	const currentWeekPoint =
		data.find((point) => point.week === `Week ${currentWeek}`) ??
		data[data.length - 1];
	const unitLabel = metric === "tonnage" ? "LB" : metric.toUpperCase();

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Weekly volume
						</p>
						<h2 className="mt-2 text-base font-medium tracking-tight">
							Volume by lift
						</h2>
					</div>

					<MetricSelector selectedMetric={metric} onSelectMetric={setMetric} />
				</div>

				<div className="mt-6 h-72 w-full">
					<ResponsiveContainer height="100%" width="100%">
						<BarChart
							data={chartData}
							margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
						>
							<CartesianGrid
								stroke="var(--border)"
								strokeDasharray="3 3"
								vertical={false}
							/>
							<XAxis
								axisLine={false}
								dataKey="week"
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
								tickLine={false}
								tickMargin={10}
							/>
							<YAxis
								axisLine={false}
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
								tickFormatter={(value) => formatAxisTick(Number(value), metric)}
								tickLine={false}
							/>
							<Tooltip
								content={
									<VolumeTooltip metric={metric} unitLabel={unitLabel} />
								}
							/>
							<Bar
								dataKey="squat"
								fill="var(--brand)"
								name="Squat"
								stackId="volume"
							/>
							<Bar
								dataKey="bench"
								fill="var(--chart-3)"
								name="Bench"
								stackId="volume"
							/>
							<Bar
								dataKey="deadlift"
								fill="var(--chart-5)"
								name="Deadlift"
								stackId="volume"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				<ChartLegend />

				<div className="mt-5 min-h-10 border-t pt-5 text-xs">
					{metric === "tonnage" ? (
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">
								Accumulated block volume
							</span>
							<span className="font-mono font-medium">
								{accumulatedVolume} lb
							</span>
						</div>
					) : (
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<span className="text-muted-foreground">
								Current week {metric}
							</span>
							<CurrentWeekMetricSummary
								metric={currentWeekPoint[metric]}
								unitLabel={unitLabel.toLowerCase()}
							/>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function CurrentWeekMetricSummary({
	metric,
	unitLabel,
}: {
	metric: LiftMetricValues;
	unitLabel: string;
}) {
	return (
		<div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono font-medium">
			<span>
				{metric.total.toLocaleString()} {unitLabel}
			</span>
			<span className="text-muted-foreground">
				S {metric.squat.toLocaleString()} / B {metric.bench.toLocaleString()} /
				D {metric.deadlift.toLocaleString()}
			</span>
		</div>
	);
}

function MetricSelector({
	selectedMetric,
	onSelectMetric,
}: {
	selectedMetric: WeeklyVolumeMetric;
	onSelectMetric: (metric: WeeklyVolumeMetric) => void;
}) {
	const options: Array<{ label: string; value: WeeklyVolumeMetric }> = [
		{ label: "Tonnage", value: "tonnage" },
		{ label: "Sets", value: "sets" },
		{ label: "Reps", value: "reps" },
	];

	return (
		<div className="inline-flex w-fit border bg-background p-0.5">
			{options.map((option) => (
				<Button
					aria-pressed={selectedMetric === option.value}
					className={cn(
						"h-7 px-2.5",
						selectedMetric === option.value && "bg-muted text-foreground",
					)}
					key={option.value}
					onClick={() => onSelectMetric(option.value)}
					size="xs"
					type="button"
					variant="ghost"
				>
					{option.label}
				</Button>
			))}
		</div>
	);
}

function formatAxisTick(value: number, metric: WeeklyVolumeMetric) {
	if (metric === "tonnage") {
		return `${value / 1000}k`;
	}

	return value.toLocaleString();
}

function VolumeTooltip({
	active,
	payload,
	label,
	unitLabel,
}: {
	active?: boolean;
	payload?: Array<{
		name?: string;
		value?: number | string;
		payload?: LiftMetricValues;
	}>;
	label?: string;
	metric: WeeklyVolumeMetric;
	unitLabel: string;
}) {
	if (!active || !payload?.length) {
		return null;
	}

	const total = payload[0]?.payload?.total ?? 0;

	return (
		<div className="rounded-lg border bg-popover px-3 py-2 shadow-sm">
			<p className="text-xs text-muted-foreground">{label}</p>

			<div className="mt-2 space-y-1">
				{payload.map((item) => (
					<p
						className="flex items-center justify-between gap-4 font-mono text-xs text-popover-foreground"
						key={item.name}
					>
						<span className="text-muted-foreground">{item.name}</span>
						<span>
							{Number(item.value ?? 0).toLocaleString()} {unitLabel}
						</span>
					</p>
				))}
				<p className="flex items-center justify-between gap-4 border-t pt-1 font-mono text-xs text-popover-foreground">
					<span className="text-muted-foreground">Total</span>
					<span>
						{Number(total).toLocaleString()} {unitLabel}
					</span>
				</p>
			</div>
		</div>
	);
}
