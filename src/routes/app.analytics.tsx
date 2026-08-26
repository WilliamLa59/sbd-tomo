// src/routes/app.analytics.tsx

import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Award } from "lucide-react";
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

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/analytics")({
	component: AnalyticsPage,
});

const liftMetrics = [
	{
		lift: "Squat",
		pr: "405",
		e1rm: "447",
		change: 2.7,
		prDate: "May 21 2026",
	},
	{
		lift: "Bench",
		pr: "285",
		e1rm: "315",
		change: 1.9,
		prDate: "May 27 2026",
	},
	{
		lift: "Deadlift",
		pr: "525",
		e1rm: "545",
		change: 3.4,
		prDate: "May 24 2026",
	},
	{
		lift: "Total",
		pr: "1,215",
		e1rm: "1,307",
		change: 2.8,
		prDate: "May 27 2026",
	},
] as const;

const strengthTrendData = [
	{
		date: "2022-01-20",
		label: "Jan 2022",
		squat: 275,
		bench: 185,
		deadlift: 335,
	},
	{
		date: "2022-06-15",
		label: "Jun 2022",
		squat: 295,
		bench: 195,
		deadlift: 365,
	},
	{
		date: "2022-12-12",
		label: "Dec 2022",
		squat: 315,
		bench: 205,
		deadlift: 385,
	},
	{
		date: "2023-06-07",
		label: "Jun 2023",
		squat: 335,
		bench: 225,
		deadlift: 415,
	},
	{
		date: "2023-12-04",
		label: "Dec 2023",
		squat: 350,
		bench: 240,
		deadlift: 440,
	},
	{
		date: "2024-06-12",
		label: "Jun 2024",
		squat: 365,
		bench: 250,
		deadlift: 465,
	},
	{
		date: "2024-12-09",
		label: "Dec 2024",
		squat: 375,
		bench: 260,
		deadlift: 485,
	},
	{
		date: "2025-06-18",
		label: "Jun 2025",
		squat: 385,
		bench: 270,
		deadlift: 505,
	},
	{
		date: "2025-12-14",
		label: "Dec 2025",
		squat: 395,
		bench: 280,
		deadlift: 515,
	},
	{
		date: "2026-03-15",
		label: "Mar 2026",
		squat: 395,
		bench: 280,
		deadlift: 515,
	},
	{ date: "2026-04-05", label: "Apr 5", squat: 395, bench: 280, deadlift: 515 },
	{
		date: "2026-04-27",
		label: "Apr 27",
		squat: 395,
		bench: 280,
		deadlift: 515,
	},
	{
		date: "2026-05-10",
		label: "May 10",
		squat: 395,
		bench: 280,
		deadlift: 515,
	},
	{
		date: "2026-05-27",
		label: "May 27",
		squat: 405,
		bench: 285,
		deadlift: 525,
	},
] as const;

const prMilestones = [
	{
		lift: "Squat",
		records: [
			{ date: "May 21 2026", weight: 405 },
			{ date: "Dec 14 2025", weight: 395 },
			{ date: "Jun 18 2025", weight: 385 },
			{ date: "Dec 9 2024", weight: 375 },
			{ date: "Jun 12 2024", weight: 365 },
			{ date: "Dec 4 2023", weight: 350 },
			{ date: "Jun 7 2023", weight: 335 },
			{ date: "Dec 12 2022", weight: 315 },
			{ date: "Jun 15 2022", weight: 295 },
			{ date: "Jan 20 2022", weight: 275 },
		],
	},
	{
		lift: "Bench",
		records: [
			{ date: "May 27 2026", weight: 285 },
			{ date: "Dec 16 2025", weight: 280 },
			{ date: "Jun 20 2025", weight: 270 },
			{ date: "Dec 11 2024", weight: 260 },
			{ date: "Jun 14 2024", weight: 250 },
			{ date: "Dec 6 2023", weight: 240 },
			{ date: "Jun 9 2023", weight: 225 },
			{ date: "Dec 14 2022", weight: 205 },
			{ date: "Jun 17 2022", weight: 195 },
			{ date: "Jan 22 2022", weight: 185 },
		],
	},
	{
		lift: "Deadlift",
		records: [
			{ date: "May 24 2026", weight: 525 },
			{ date: "Dec 18 2025", weight: 515 },
			{ date: "Jun 22 2025", weight: 505 },
			{ date: "Dec 13 2024", weight: 485 },
			{ date: "Jun 16 2024", weight: 465 },
			{ date: "Dec 8 2023", weight: 440 },
			{ date: "Jun 11 2023", weight: 415 },
			{ date: "Dec 16 2022", weight: 385 },
			{ date: "Jun 19 2022", weight: 365 },
			{ date: "Jan 24 2022", weight: 335 },
		],
	},
] as const;

const rangeOptions = ["All", "5Y", "1Y", "YTD", "6M", "1M"] as const;

type RangeOption = (typeof rangeOptions)[number];
type StrengthTrendPoint = (typeof strengthTrendData)[number];

const totalOutlook = {
	actualTotal: "1,215",
	estimatedTotal: "1,307",
	gap: "+92",
	bestMovingLift: "Deadlift",
	bestMovingChange: 3.4,
	lastPrLift: "Bench",
	lastPrWeight: "285 lb",
	lastPrDate: "May 27 2026",
} as const;

function getFilteredTrendData(
	range: RangeOption,
): readonly StrengthTrendPoint[] {
	const latestPoint = strengthTrendData.at(-1);

	if (!latestPoint || range === "All") {
		return strengthTrendData;
	}

	const latestDate = parseTrendDate(latestPoint);
	const cutoffDate = getRangeCutoffDate(range, latestDate);

	if (!cutoffDate) {
		return strengthTrendData;
	}

	const filteredData = strengthTrendData.filter(
		(point) => parseTrendDate(point) >= cutoffDate,
	);

	return filteredData.length > 0 ? filteredData : [latestPoint];
}

function getRangeSummary(data: readonly StrengthTrendPoint[]) {
	const firstPoint = data[0];
	const lastPoint = data.at(-1);

	if (!firstPoint || !lastPoint) {
		return {
			squat: { percent: 0, pounds: 0 },
			bench: { percent: 0, pounds: 0 },
			deadlift: { percent: 0, pounds: 0 },
			total: { percent: 0, pounds: 0 },
		};
	}

	const firstTotal = firstPoint.squat + firstPoint.bench + firstPoint.deadlift;
	const lastTotal = lastPoint.squat + lastPoint.bench + lastPoint.deadlift;

	return {
		squat: getRangeChange(firstPoint.squat, lastPoint.squat),
		bench: getRangeChange(firstPoint.bench, lastPoint.bench),
		deadlift: getRangeChange(firstPoint.deadlift, lastPoint.deadlift),
		total: getRangeChange(firstTotal, lastTotal),
	};
}

function getRangeChange(start: number, end: number) {
	return {
		percent: getPercentChange(start, end),
		pounds: end - start,
	};
}

function getPercentChange(start: number, end: number) {
	if (start === 0) {
		return 0;
	}

	return ((end - start) / start) * 100;
}

function getRangeCutoffDate(range: RangeOption, latestDate: Date) {
	if (range === "YTD") {
		return new Date(latestDate.getFullYear(), 0, 1);
	}

	if (range === "5Y") {
		return shiftDate(latestDate, { years: -5 });
	}

	if (range === "1Y") {
		return shiftDate(latestDate, { years: -1 });
	}

	if (range === "6M") {
		return shiftDate(latestDate, { months: -6 });
	}

	if (range === "1M") {
		return shiftDate(latestDate, { months: -1 });
	}

	return null;
}

function shiftDate(
	date: Date,
	shift: {
		months?: number;
		years?: number;
	},
) {
	const shiftedDate = new Date(date);

	if (shift.years) {
		shiftedDate.setFullYear(shiftedDate.getFullYear() + shift.years);
	}

	if (shift.months) {
		shiftedDate.setMonth(shiftedDate.getMonth() + shift.months);
	}

	return shiftedDate;
}

function parseTrendDate(point: StrengthTrendPoint) {
	return new Date(`${point.date}T00:00:00`);
}

function AnalyticsPage() {
	return (
		<PageContainer className="pt-5 md:pt-7">
			<div>
				<h1 className="text-2xl font-medium tracking-tight md:text-3xl">
					Progress Overview
				</h1>

				<p className="mt-2 text-sm text-muted-foreground">
					Strength trends, PRs, and training progress
				</p>
			</div>

			<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{liftMetrics.map((metric) => (
					<LiftMetricCard key={metric.lift} {...metric} />
				))}
			</div>

			<div className="mt-4">
				<TotalOutlookCard />
			</div>

			<div className="mt-4">
				<StrengthTrendCard />
			</div>

			<div className="mt-4">
				<PrMilestonesCard />
			</div>
		</PageContainer>
	);
}

function TotalOutlookCard() {
	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
						Total outlook
					</p>

					<div className="mt-4 flex items-end gap-2">
						<span className="font-mono text-3xl font-medium tracking-[-0.05em] md:text-4xl">
							{totalOutlook.estimatedTotal}
						</span>
						<span className="mb-1 font-mono text-xs text-muted-foreground">
							LB EST.
						</span>
					</div>
				</div>

				<div className="mt-5 grid gap-3 border-t pt-5">
					<OutlookRow
						label="Actual total"
						value={`${totalOutlook.actualTotal} lb`}
					/>
					<OutlookRow label="Estimated gap" value={`${totalOutlook.gap} lb`} />
					<OutlookRow
						label="Best moving lift"
						value={`${totalOutlook.bestMovingLift} +${totalOutlook.bestMovingChange.toFixed(1)}%`}
						valueClassName="text-success"
					/>
					<OutlookRow
						label="Last 1RM PR"
						value={`${totalOutlook.lastPrLift} ${totalOutlook.lastPrWeight}`}
					/>
				</div>

				<p className="mt-3 text-xs text-muted-foreground">
					{totalOutlook.lastPrDate}
				</p>
			</CardContent>
		</Card>
	);
}

function OutlookRow({
	label,
	value,
	valueClassName,
}: {
	label: string;
	value: string;
	valueClassName?: string;
}) {
	return (
		<div className="flex items-center justify-between gap-3 text-xs">
			<span className="text-muted-foreground">{label}</span>
			<span className={cn("font-mono font-medium", valueClassName)}>
				{value}
			</span>
		</div>
	);
}

type LiftMetricCardProps = {
	lift: string;
	pr: string;
	e1rm: string;
	change: number;
	prDate: string;
};

function LiftMetricCard({
	lift,
	pr,
	e1rm,
	change,
	prDate,
}: LiftMetricCardProps) {
	return (
		<Card className="shadow-none">
			<CardContent className="p-5">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							{lift}
						</p>

						<div className="mt-4 flex items-end gap-2">
							<span className="font-mono text-3xl font-medium tracking-[-0.05em] md:text-4xl">
								{pr}
							</span>
							<span className="mb-1 font-mono text-xs text-muted-foreground">
								LB PR
							</span>
						</div>
					</div>

					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
						<Award className="size-4" />
					</div>
				</div>

				<div className="mt-4 flex items-center justify-between gap-3 border-t pt-4 text-xs">
					<div>
						<p className="text-muted-foreground">Current PR</p>
						<p className="mt-1 text-xs text-muted-foreground">{prDate}</p>
					</div>

					<div className="text-right">
						<p className="text-muted-foreground">Estimated 1RM</p>
						<p className="mt-1 font-mono text-sm font-medium">{e1rm} lb</p>
					</div>
				</div>

				<div className="mt-3 flex justify-end text-xs">
					<span className="inline-flex items-center gap-1 font-medium text-success">
						<ArrowUpRight className="size-3.5" />
						{change.toFixed(1)}%
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

function StrengthTrendCard() {
	const [selectedRange, setSelectedRange] = useState<RangeOption>("6M");
	const chartData = getFilteredTrendData(selectedRange);
	const summary = getRangeSummary(chartData);

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							1RM progress
						</p>

						<h2 className="mt-2 text-base font-medium tracking-tight">
							Max strength by lift
						</h2>
					</div>

					<div className="flex flex-wrap gap-1">
						{rangeOptions.map((range) => (
							<Button
								key={range}
								type="button"
								variant={selectedRange === range ? "secondary" : "ghost"}
								size="xs"
								onClick={() => setSelectedRange(range)}
							>
								{range}
							</Button>
						))}
					</div>
				</div>

				<div className="mt-6 h-72 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={chartData}
							margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
						>
							<CartesianGrid
								vertical={false}
								stroke="var(--border)"
								strokeDasharray="3 3"
							/>
							<XAxis
								dataKey="label"
								axisLine={false}
								tickLine={false}
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
								tickMargin={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
							/>
							<Tooltip content={<StrengthTooltip />} />
							<Line
								type="monotone"
								dataKey="squat"
								name="Squat"
								stroke="var(--brand)"
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="bench"
								name="Bench"
								stroke="var(--chart-3)"
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4 }}
							/>
							<Line
								type="monotone"
								dataKey="deadlift"
								name="Deadlift"
								stroke="var(--chart-5)"
								strokeWidth={2}
								dot={false}
								activeDot={{ r: 4 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
					<LegendSwatch className="bg-brand" label="Squat" />
					<LegendSwatch className="bg-chart-3" label="Bench" />
					<LegendSwatch className="bg-chart-5" label="Deadlift" />
				</div>

				<div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-4">
					<RangeSummary label="Squat" change={summary.squat} />
					<RangeSummary label="Bench" change={summary.bench} />
					<RangeSummary label="Deadlift" change={summary.deadlift} />
					<RangeSummary label="Total" change={summary.total} />
				</div>
			</CardContent>
		</Card>
	);
}

function PrMilestonesCard() {
	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
						1RM milestones
					</p>

					<h2 className="mt-2 text-base font-medium tracking-tight">
						Max progression by lift
					</h2>
				</div>

				<div className="mt-6 grid gap-4 lg:grid-cols-3">
					{prMilestones.map((group) => (
						<div key={group.lift} className="min-w-0 border bg-background">
							<div className="flex items-center justify-between gap-3 border-b px-4 py-3">
								<h3 className="text-sm font-medium">{group.lift}</h3>
								<Badge variant="secondary">1RM</Badge>
							</div>

							<div className="max-h-80 overflow-y-auto">
								{group.records.map((record, index) => {
									const previousRecord = group.records[index + 1];
									const increase = previousRecord
										? record.weight - previousRecord.weight
										: undefined;

									return (
										<div
											key={`${group.lift}-${record.date}-${record.weight}`}
											className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0"
										>
											<p className="font-mono text-xs text-muted-foreground">
												{record.date}
											</p>

											<p className="min-w-0 font-mono text-sm font-medium">
												{record.weight} lb
											</p>

											{increase ? (
												<span className="font-mono text-xs font-medium text-success">
													+{increase}
												</span>
											) : (
												<span className="font-mono text-xs text-muted-foreground">
													Base
												</span>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function RangeSummary({
	label,
	change,
}: {
	label: string;
	change: {
		percent: number;
		pounds: number;
	};
}) {
	return (
		<div>
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="mt-1 inline-flex items-center gap-1 font-mono text-sm font-medium text-success">
				<ArrowUpRight className="size-3.5" />
				{change.percent.toFixed(1)}%
			</p>
			<p className="mt-1 font-mono text-xs text-muted-foreground">
				{formatPoundChange(change.pounds)} lb
			</p>
		</div>
	);
}

function formatPoundChange(value: number) {
	if (value > 0) {
		return `+${value}`;
	}

	return value.toString();
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

function StrengthTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: Array<{
		name?: string;
		value?: number | string;
	}>;
	label?: string;
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
						key={item.name}
						className="flex items-center justify-between gap-4 font-mono text-xs text-popover-foreground"
					>
						<span className="text-muted-foreground">{item.name}</span>
						<span>{Number(item.value ?? 0).toLocaleString()} LB</span>
					</p>
				))}
			</div>
		</div>
	);
}
