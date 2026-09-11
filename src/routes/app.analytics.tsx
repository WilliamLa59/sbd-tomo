// src/routes/app.analytics.tsx

import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
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
		e1rm: "447",
		changeKey: "squat",
	},
	{
		lift: "Bench",
		e1rm: "315",
		changeKey: "bench",
	},
	{
		lift: "Deadlift",
		e1rm: "545",
		changeKey: "deadlift",
	},
	{
		lift: "Estimated Total",
		e1rm: "1,307",
		changeKey: "total",
	},
] as const;

const personalRecords = [
	{
		lift: "Squat",
		records: [
			{ label: "Best Single", value: "405 x 1", date: "May 21 2026" },
			{ label: "Best Triple", value: "385 x 3", date: "Apr 12 2026" },
			{ label: "Best 5-Rep Set", value: "365 x 5", date: "Mar 18 2026" },
			{
				label: "Peak e1RM",
				value: "447 lb",
				date: "May 21 2026",
				isEstimate: true,
			},
		],
	},
	{
		lift: "Bench",
		records: [
			{ label: "Best Single", value: "285 x 1", date: "May 27 2026" },
			{ label: "Best Triple", value: "270 x 3", date: "Apr 19 2026" },
			{ label: "Best 5-Rep Set", value: "255 x 5", date: "Mar 21 2026" },
			{
				label: "Peak e1RM",
				value: "315 lb",
				date: "May 27 2026",
				isEstimate: true,
			},
		],
	},
	{
		lift: "Deadlift",
		records: [
			{ label: "Best Single", value: "525 x 1", date: "May 24 2026" },
			{ label: "Best Triple", value: "505 x 3", date: "Apr 16 2026" },
			{ label: "Best 5-Rep Set", value: "475 x 5", date: "Mar 25 2026" },
			{
				label: "Peak e1RM",
				value: "545 lb",
				date: "May 24 2026",
				isEstimate: true,
			},
		],
	},
] as const;

const blockProgression = [
	{
		block: "Block 6",
		squat: { percent: 1.6, pounds: 7 },
		bench: { percent: 1.2, pounds: 3 },
		deadlift: { percent: 2.1, pounds: 10 },
		total: { percent: 1.7, pounds: 20 },
	},
	{
		block: "Block 7",
		squat: { percent: 2.4, pounds: 10 },
		bench: { percent: 1.5, pounds: 4 },
		deadlift: { percent: 2.8, pounds: 14 },
		total: { percent: 2.3, pounds: 28 },
	},
	{
		block: "Block 8",
		squat: { percent: 1.1, pounds: 5 },
		bench: { percent: 0.9, pounds: 3 },
		deadlift: { percent: 1.6, pounds: 8 },
		total: { percent: 1.2, pounds: 16 },
	},
	{
		block: "Block 9",
		squat: { percent: 2.7, pounds: 12 },
		bench: { percent: 1.6, pounds: 5 },
		deadlift: { percent: 2.3, pounds: 12 },
		total: { percent: 2.3, pounds: 29 },
	},
	{
		block: "Block 10",
		squat: { percent: 3.2, pounds: 15 },
		bench: { percent: 1.8, pounds: 5 },
		deadlift: { percent: 4.1, pounds: 20 },
		total: { percent: 3.1, pounds: 40 },
	},
] as const;

const strengthTrendData = [
	{
		date: "2022-01-20",
		label: "Jan 2022",
		squat: 305,
		bench: 205,
		deadlift: 355,
	},
	{
		date: "2022-06-15",
		label: "Jun 2022",
		squat: 325,
		bench: 215,
		deadlift: 385,
	},
	{
		date: "2022-12-12",
		label: "Dec 2022",
		squat: 345,
		bench: 230,
		deadlift: 410,
	},
	{
		date: "2023-06-07",
		label: "Jun 2023",
		squat: 365,
		bench: 245,
		deadlift: 435,
	},
	{
		date: "2023-12-04",
		label: "Dec 2023",
		squat: 382,
		bench: 260,
		deadlift: 462,
	},
	{
		date: "2024-06-12",
		label: "Jun 2024",
		squat: 398,
		bench: 272,
		deadlift: 488,
	},
	{
		date: "2024-12-09",
		label: "Dec 2024",
		squat: 410,
		bench: 285,
		deadlift: 508,
	},
	{
		date: "2025-06-18",
		label: "Jun 2025",
		squat: 422,
		bench: 298,
		deadlift: 522,
	},
	{
		date: "2025-12-14",
		label: "Dec 2025",
		squat: 435,
		bench: 309,
		deadlift: 525,
	},
	{
		date: "2026-03-15",
		label: "Mar 2026",
		squat: 438,
		bench: 310,
		deadlift: 530,
	},
	{ date: "2026-04-05", label: "Apr 5", squat: 440, bench: 311, deadlift: 534 },
	{
		date: "2026-04-27",
		label: "Apr 27",
		squat: 442,
		bench: 312,
		deadlift: 538,
	},
	{
		date: "2026-05-10",
		label: "May 10",
		squat: 444,
		bench: 313,
		deadlift: 541,
	},
	{
		date: "2026-05-27",
		label: "May 27",
		squat: 447,
		bench: 315,
		deadlift: 545,
	},
] as const;

const rangeOptions = ["3M", "6M", "1Y", "All"] as const;
const liftFilterOptions = ["All", "Squat", "Bench", "Deadlift"] as const;

type RangeOption = (typeof rangeOptions)[number];
type LiftFilterOption = (typeof liftFilterOptions)[number];
type StrengthTrendPoint = (typeof strengthTrendData)[number];
type LiftChangeKey = (typeof liftMetrics)[number]["changeKey"];

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

function getRangeMonths(data: readonly StrengthTrendPoint[]) {
	const firstPoint = data[0];
	const lastPoint = data.at(-1);

	if (!firstPoint || !lastPoint) {
		return 1;
	}

	const startDate = parseTrendDate(firstPoint);
	const endDate = parseTrendDate(lastPoint);
	const monthSpan =
		(endDate.getFullYear() - startDate.getFullYear()) * 12 +
		(endDate.getMonth() - startDate.getMonth()) +
		(endDate.getDate() - startDate.getDate()) / 30;

	return Math.max(monthSpan, 1);
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
	if (range === "3M") {
		return shiftDate(latestDate, { months: -3 });
	}

	if (range === "1Y") {
		return shiftDate(latestDate, { years: -1 });
	}

	if (range === "6M") {
		return shiftDate(latestDate, { months: -6 });
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
	const [selectedRange, setSelectedRange] = useState<RangeOption>("6M");
	const chartData = getFilteredTrendData(selectedRange);
	const rangeSummary = getRangeSummary(chartData);

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

			<section className="app-section">
				<SectionHeader label="Current Strength" />

				<div className="app-section-body grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{liftMetrics.map((metric) => (
						<LiftMetricCard
							key={metric.lift}
							change={rangeSummary[metric.changeKey]}
							e1rm={metric.e1rm}
							lift={metric.lift}
							range={selectedRange}
						/>
					))}
				</div>
			</section>

			<section className="app-section">
				<StrengthTrendCard
					chartData={chartData}
					onRangeChange={setSelectedRange}
					rangeMonths={getRangeMonths(chartData)}
					rangeSummary={rangeSummary}
					selectedRange={selectedRange}
				/>
			</section>

			<section className="app-section">
				<PersonalRecordsCard />
			</section>

			<section className="app-section">
				<BlockProgressionCard />
			</section>
		</PageContainer>
	);
}

function SectionHeader({ label }: { label: string }) {
	return (
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{label}
		</p>
	);
}

type LiftMetricCardProps = {
	lift: string;
	e1rm: string;
	change: {
		percent: number;
		pounds: number;
	};
	range: RangeOption;
};

function LiftMetricCard({ lift, e1rm, change, range }: LiftMetricCardProps) {
	return (
		<Card className="shadow-none">
			<CardContent className="p-5">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
						{lift}
					</p>

					<div className="mt-4 flex items-end gap-2">
						<span className="font-mono text-3xl font-medium tracking-[-0.05em] md:text-4xl">
							{e1rm}
						</span>
						<span className="mb-1 font-mono text-xs text-muted-foreground">
							LB e1RM
						</span>
					</div>
				</div>

				<div className="mt-4 flex items-center justify-between gap-3 border-t pt-4 text-xs">
					<div>
						<p className="uppercase text-muted-foreground">{range} change</p>
						<p className="mt-1 font-mono text-sm font-medium">
							{formatSignedPounds(change.pounds)}
						</p>
					</div>

					<div className="text-right">
						<p className="mt-1 inline-flex items-center justify-end gap-1 font-mono text-sm font-medium text-success">
							<ArrowUpRight className="size-3.5" />
							{formatSignedPercent(change.percent)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function StrengthTrendCard({
	chartData,
	rangeMonths,
	rangeSummary,
	selectedRange,
	onRangeChange,
}: {
	chartData: readonly StrengthTrendPoint[];
	rangeMonths: number;
	rangeSummary: Record<LiftChangeKey, { percent: number; pounds: number }>;
	selectedRange: RangeOption;
	onRangeChange: (range: RangeOption) => void;
}) {
	const [selectedLift, setSelectedLift] = useState<LiftFilterOption>("All");

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Strength progression
						</p>

						<h2 className="mt-2 text-base font-medium tracking-tight">
							Estimated 1RM over time
						</h2>
					</div>

					<div className="flex flex-wrap justify-end gap-3">
						<div className="flex flex-wrap gap-1">
							{liftFilterOptions.map((lift) => (
								<Button
									key={lift}
									type="button"
									variant={selectedLift === lift ? "secondary" : "ghost"}
									size="xs"
									onClick={() => setSelectedLift(lift)}
								>
									{lift}
								</Button>
							))}
						</div>

						<div className="flex flex-wrap gap-1">
							{rangeOptions.map((range) => (
								<Button
									key={range}
									type="button"
									variant={selectedRange === range ? "secondary" : "ghost"}
									size="xs"
									onClick={() => onRangeChange(range)}
								>
									{range}
								</Button>
							))}
						</div>
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
							{(selectedLift === "All" || selectedLift === "Squat") && (
								<Line
									type="monotone"
									dataKey="squat"
									name="Squat"
									stroke="var(--brand)"
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
								/>
							)}
							{(selectedLift === "All" || selectedLift === "Bench") && (
								<Line
									type="monotone"
									dataKey="bench"
									name="Bench"
									stroke="var(--chart-3)"
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
								/>
							)}
							{(selectedLift === "All" || selectedLift === "Deadlift") && (
								<Line
									type="monotone"
									dataKey="deadlift"
									name="Deadlift"
									stroke="var(--chart-5)"
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
								/>
							)}
						</LineChart>
					</ResponsiveContainer>
				</div>

				<div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
					{(selectedLift === "All" || selectedLift === "Squat") && (
						<LegendSwatch className="bg-brand" label="Squat" />
					)}
					{(selectedLift === "All" || selectedLift === "Bench") && (
						<LegendSwatch className="bg-chart-3" label="Bench" />
					)}
					{(selectedLift === "All" || selectedLift === "Deadlift") && (
						<LegendSwatch className="bg-chart-5" label="Deadlift" />
					)}
				</div>

				<div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-4">
					<RangeSummary
						change={rangeSummary.squat}
						label="Squat"
						months={rangeMonths}
					/>
					<RangeSummary
						change={rangeSummary.bench}
						label="Bench"
						months={rangeMonths}
					/>
					<RangeSummary
						change={rangeSummary.deadlift}
						label="Deadlift"
						months={rangeMonths}
					/>
					<RangeSummary
						change={rangeSummary.total}
						label="Total"
						months={rangeMonths}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function PersonalRecordsCard() {
	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
						Personal records
					</p>

					<h2 className="mt-2 text-base font-medium tracking-tight">
						Best performances by lift
					</h2>
				</div>

				<div className="mt-6 grid gap-4 lg:grid-cols-3">
					{personalRecords.map((group) => (
						<div key={group.lift} className="min-w-0 border bg-background">
							<div className="flex items-center justify-between gap-3 border-b px-4 py-3">
								<h3 className="text-sm font-medium">{group.lift}</h3>
								<Badge variant="secondary">PRs</Badge>
							</div>

							<div>
								{group.records.map((record) => (
									<div
										key={`${group.lift}-${record.label}`}
										className={cn(
											"grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b px-4 py-3 last:border-b-0",
											"isEstimate" in record &&
												record.isEstimate &&
												"bg-muted/35",
										)}
									>
										<p className="min-w-0 text-xs text-muted-foreground">
											{record.label}
										</p>

										<p
											className={cn(
												"text-right font-mono text-sm font-medium",
												"isEstimate" in record &&
													record.isEstimate &&
													"text-success",
											)}
										>
											{record.value}
										</p>

										<p className="col-start-2 text-right font-mono text-xs text-muted-foreground">
											{record.date}
										</p>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

function BlockProgressionCard() {
	const highestImprovement = Math.max(
		...blockProgression.flatMap((block) => [
			block.squat.percent,
			block.bench.percent,
			block.deadlift.percent,
			block.total.percent,
		]),
	);

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
						Block progression
					</p>

					<h2 className="mt-2 text-base font-medium tracking-tight">
						Completed block strength changes
					</h2>
				</div>

				<div className="mt-6 overflow-x-auto border">
					<table className="w-full min-w-[42rem] border-collapse text-left text-sm">
						<thead className="border-b bg-muted/35 text-xs uppercase tracking-[0.12em] text-muted-foreground">
							<tr>
								<th className="px-4 py-3 font-medium">Block</th>
								<th className="px-4 py-3 font-medium">Squat</th>
								<th className="px-4 py-3 font-medium">Bench</th>
								<th className="px-4 py-3 font-medium">Deadlift</th>
								<th className="px-4 py-3 font-medium">Total</th>
							</tr>
						</thead>

						<tbody>
							{blockProgression.map((block) => (
								<tr key={block.block} className="border-b last:border-b-0">
									<td className="px-4 py-3 font-medium">{block.block}</td>
									<BlockProgressionCell
										change={block.squat}
										highlight={block.squat.percent === highestImprovement}
									/>
									<BlockProgressionCell
										change={block.bench}
										highlight={block.bench.percent === highestImprovement}
									/>
									<BlockProgressionCell
										change={block.deadlift}
										highlight={block.deadlift.percent === highestImprovement}
									/>
									<BlockProgressionCell
										change={block.total}
										highlight={block.total.percent === highestImprovement}
									/>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}

function BlockProgressionCell({
	change,
	highlight,
}: {
	change: {
		percent: number;
		pounds: number;
	};
	highlight?: boolean;
}) {
	return (
		<td className={cn("px-4 py-3", highlight && "bg-brand-subtle")}>
			<p className="font-mono text-sm font-medium text-success">
				{formatSignedPercent(change.percent)}
			</p>
			<p className="mt-1 font-mono text-xs text-muted-foreground">
				{formatSignedPounds(change.pounds)}
			</p>
		</td>
	);
}

function RangeSummary({
	label,
	change,
	months,
}: {
	label: string;
	change: {
		percent: number;
		pounds: number;
	};
	months: number;
}) {
	const averagePerMonth = change.pounds / months;

	return (
		<div>
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="mt-1 inline-flex items-center gap-1 font-mono text-sm font-medium text-success">
				<ArrowUpRight className="size-3.5" />
				{formatSignedPounds(change.pounds)}
			</p>
			<p className="mt-1 font-mono text-xs text-muted-foreground">
				{formatSignedPercent(change.percent)}
			</p>
			<p className="mt-1 font-mono text-xs text-muted-foreground">
				{formatSignedPounds(averagePerMonth, 1)}/mo
			</p>
		</div>
	);
}

function formatSignedPounds(value: number, digits = 0) {
	const formatted = value.toFixed(digits);

	if (value > 0) {
		return `+${formatted} lb`;
	}

	if (value < 0) {
		return `${formatted} lb`;
	}

	return `${Number(formatted)} lb`;
}

function formatSignedPercent(value: number) {
	if (value > 0) {
		return `+${value.toFixed(1)}%`;
	}

	return `${value.toFixed(1)}%`;
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
