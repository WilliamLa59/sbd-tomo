import { useState } from "react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StrengthProgressionView = "absolute" | "percent";

type StrengthProgressionPoint = {
	week: string;
	squat: number;
	bench: number;
	deadlift: number;
};

type BlockStrengthProgressionCardProps = {
	data: readonly StrengthProgressionPoint[];
};

export function BlockStrengthProgressionCard({
	data,
}: BlockStrengthProgressionCardProps) {
	const [view, setView] = useState<StrengthProgressionView>("absolute");
	const chartData =
		view === "absolute"
			? data
			: data.map((point) => normalizePoint(point, data[0]));

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Strength progression
						</p>
						<h2 className="mt-2 text-base font-medium tracking-tight">
							{view === "absolute"
								? "Estimated 1RM by week"
								: "Change from block start"}
						</h2>
					</div>

					<ViewSelector selectedView={view} onSelectView={setView} />
				</div>

				<div className="mt-6 h-72 w-full">
					<ResponsiveContainer height="100%" width="100%">
						<LineChart
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
								tickFormatter={(value) =>
									view === "absolute" ? `${value}` : `${value}%`
								}
								tickLine={false}
							/>
							<Tooltip content={<BlockChartTooltip view={view} />} />
							<Line
								activeDot={{ r: 4 }}
								dataKey="squat"
								dot={false}
								name="Squat"
								stroke="var(--brand)"
								strokeWidth={2}
								type="monotone"
							/>
							<Line
								activeDot={{ r: 4 }}
								dataKey="bench"
								dot={false}
								name="Bench"
								stroke="var(--chart-3)"
								strokeWidth={2}
								type="monotone"
							/>
							<Line
								activeDot={{ r: 4 }}
								dataKey="deadlift"
								dot={false}
								name="Deadlift"
								stroke="var(--chart-5)"
								strokeWidth={2}
								type="monotone"
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<ChartLegend />
			</CardContent>
		</Card>
	);
}

function ViewSelector({
	selectedView,
	onSelectView,
}: {
	selectedView: StrengthProgressionView;
	onSelectView: (view: StrengthProgressionView) => void;
}) {
	const options: Array<{ label: string; value: StrengthProgressionView }> = [
		{ label: "Absolute", value: "absolute" },
		{ label: "% Change", value: "percent" },
	];

	return (
		<div className="inline-flex w-fit border bg-background p-0.5">
			{options.map((option) => (
				<Button
					aria-pressed={selectedView === option.value}
					className={cn(
						"h-7 px-2.5",
						selectedView === option.value && "bg-muted text-foreground",
					)}
					key={option.value}
					onClick={() => onSelectView(option.value)}
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

function normalizePoint(
	point: StrengthProgressionPoint,
	start?: StrengthProgressionPoint,
) {
	return {
		week: point.week,
		squat: getPercentChange(point.squat, start?.squat),
		bench: getPercentChange(point.bench, start?.bench),
		deadlift: getPercentChange(point.deadlift, start?.deadlift),
	};
}

function getPercentChange(value: number, start = value) {
	return Number((((value - start) / start) * 100).toFixed(1));
}

export function ChartLegend() {
	return (
		<div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
			<LegendSwatch className="bg-brand" label="Squat" />
			<LegendSwatch className="bg-chart-3" label="Bench" />
			<LegendSwatch className="bg-chart-5" label="Deadlift" />
		</div>
	);
}

function LegendSwatch({
	className,
	label,
}: {
	className: string;
	label: string;
}) {
	return (
		<span className="inline-flex items-center gap-2">
			<span className={cn("size-2 rounded-full", className)} />
			{label}
		</span>
	);
}

function BlockChartTooltip({
	active,
	payload,
	label,
	view,
}: {
	active?: boolean;
	payload?: Array<{
		name?: string;
		value?: number | string;
	}>;
	label?: string;
	view: StrengthProgressionView;
}) {
	if (!active || !payload?.length) {
		return null;
	}

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
							{view === "absolute"
								? `${Number(item.value ?? 0).toLocaleString()} LB`
								: `${Number(item.value ?? 0).toLocaleString()}%`}
						</span>
					</p>
				))}
			</div>
		</div>
	);
}
