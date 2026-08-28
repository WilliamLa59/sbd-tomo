import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { BlockStrengthProgressionCard } from "@/components/training/block-strength-progression-card";
import {
	type BlockWeekOption,
	BlockWeekSelector,
} from "@/components/training/block-week-selector";
import { TrainingDayCard } from "@/components/training/training-day-card";
import { WeekSummaryCard } from "@/components/training/week-summary-card";
import { WeeklyVolumeCard } from "@/components/training/weekly-volume-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	type BlockPr,
	getHistoricalBlock,
	type HistoricalBlock,
	type Lift,
} from "@/data/history";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/history/$blockId")({
	component: HistoricalBlockPage,
});

function HistoricalBlockPage() {
	const { blockId } = Route.useParams();
	const block = getHistoricalBlock(blockId);
	const [selectedWeek, setSelectedWeek] = useState(1);

	if (!block) {
		return (
			<PageContainer className="pt-5 md:pt-7">
				<Card className="shadow-none">
					<CardContent className="p-6">
						<h1 className="text-xl font-medium tracking-tight">
							Block not found
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							This historical training block is not available.
						</p>
						<Link
							className={cn(
								buttonVariants({ variant: "outline", size: "sm" }),
								"mt-5",
							)}
							to="/app/history"
						>
							<ArrowLeft className="size-3.5" />
							Back to History
						</Link>
					</CardContent>
				</Card>
			</PageContainer>
		);
	}

	const weekSummary = block.weekSummaries[selectedWeek];
	const trainingDays = block.trainingDaysByWeek[selectedWeek] ?? [];
	const highlights = getBlockHighlights(block);
	const statusCounts = getSessionStatusCounts(block);
	const blockNotes = block.endingNotes ?? block.notes;
	const combinedE1rmChange = block.liftAnalysis.reduce(
		(total, lift) => total + lift.endE1rm - lift.startE1rm,
		0,
	);
	const weeks: BlockWeekOption[] = Array.from(
		{ length: block.weeks },
		(_, index) => ({
			week: index + 1,
			status: "completed",
		}),
	);

	return (
		<PageContainer className="pt-5 md:pt-7">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Link
						className={cn(
							buttonVariants({ variant: "ghost", size: "sm" }),
							"-ml-2 mb-3",
						)}
						to="/app/history"
					>
						<ArrowLeft className="size-3.5" />
						Back to History
					</Link>
					<div className="flex flex-wrap items-center gap-2">
						<h1 className="text-2xl font-medium tracking-tight md:text-3xl">
							{block.title}
						</h1>
						<Badge variant="secondary">{block.status}</Badge>
					</div>
					<p className="mt-2 text-sm text-muted-foreground">
						{block.dateRange} · {block.weeks} weeks
					</p>
				</div>
			</div>

			{block.intent ? (
				<section className="app-section">
					<Card className="shadow-none">
						<CardContent className="p-5 sm:p-6">
							<SectionLabel>Block Intent</SectionLabel>
							<p className="mt-3 text-sm leading-6 text-foreground/80">
								{block.intent}
							</p>
						</CardContent>
					</Card>
				</section>
			) : null}

			{blockNotes ? (
				<section className="app-section">
					<Card className="shadow-none">
						<CardContent className="p-5 sm:p-6">
							<SectionLabel>Block Ending Notes</SectionLabel>
							<p className="mt-3 text-sm leading-6 text-foreground/80">
								{blockNotes}
							</p>
						</CardContent>
					</Card>
				</section>
			) : null}

			<section className="app-section">
				<Card className="shadow-none">
					<CardContent className="p-5 sm:p-6">
						<SectionLabel>Final Block Outcome</SectionLabel>
						<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
							{block.liftAnalysis.map((lift) => (
								<ResultStat
									key={lift.key}
									label={lift.lift}
									value={`${formatSigned(lift.endE1rm - lift.startE1rm)} lb e1RM`}
								/>
							))}
							<ResultStat
								label="Combined"
								value={`${formatSigned(combinedE1rmChange)} lb`}
							/>
							<ResultStat
								label="Sessions"
								value={`${block.completedSessions} / ${block.totalSessions}`}
							/>
							<ResultStat label="Adherence" value={`${block.adherence}%`} />
							<ResultStat
								label="Total volume"
								value={`${formatNumber(block.totalVolume)} lb`}
							/>
						</div>
						<div className="mt-5 grid gap-3 border-t pt-4 text-xs sm:grid-cols-3">
							<ResultStat
								label="Completed"
								value={String(statusCounts.completed)}
							/>
							<ResultStat
								label="Skipped"
								value={String(statusCounts.skipped)}
							/>
							<ResultStat
								label="Partial"
								value={String(statusCounts.partial)}
							/>
						</div>
					</CardContent>
				</Card>
			</section>

			{block.strengthAtEnd ? (
				<section className="app-section">
					<Card className="shadow-none">
						<CardContent className="p-5 sm:p-6">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
								<div>
									<SectionLabel>Strength at Block End</SectionLabel>
									<p className="mt-2 text-xs text-muted-foreground">
										Actual logged strength and estimated strength are shown
										separately.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-4 text-xs sm:text-right">
									<ResultStat
										label="Actual SBD Total"
										value={`${formatNumber(getActualTotal(block))} lb`}
									/>
									<ResultStat
										label="e1RM Total"
										value={`${formatNumber(getE1rmTotal(block))} lb`}
									/>
								</div>
							</div>

							<div className="mt-5 overflow-x-auto">
								<table className="w-full min-w-[520px] text-sm">
									<thead className="text-muted-foreground">
										<tr className="border-b">
											<th className="pb-2 text-left font-medium">Measure</th>
											{liftOrder.map((lift) => (
												<th className="pb-2 text-right font-medium" key={lift}>
													{liftLabels[lift]}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										<StrengthRow
											getValue={(lift) =>
												block.strengthAtEnd?.[lift]?.actualOneRm
											}
											label="Actual 1RM"
										/>
										<StrengthRow
											getValue={(lift) =>
												block.strengthAtEnd?.[lift]?.bestThreeRm
											}
											label="Best 3RM"
										/>
										<StrengthRow
											getValue={(lift) =>
												block.strengthAtEnd?.[lift]?.bestFiveRm
											}
											label="Best 5RM"
										/>
										<StrengthRow
											getValue={(lift) => block.strengthAtEnd?.[lift]?.endE1rm}
											label="End e1RM"
										/>
									</tbody>
								</table>
							</div>

							{hasThreeRmComparison(block) ? (
								<div className="mt-5 grid gap-3 border-t pt-4 text-xs sm:grid-cols-3">
									{liftOrder.map((lift) => (
										<ResultStat
											key={lift}
											label={`${liftLabels[lift]} 3RM`}
											value={`${block.startingRepPrs?.[lift]?.three} x 3 -> ${block.endingRepPrs?.[lift]?.three} x 3`}
										/>
									))}
								</div>
							) : null}
						</CardContent>
					</Card>
				</section>
			) : null}

			<section className="app-section">
				<SectionLabel>Block PRs</SectionLabel>
				{block.prs && block.prs.length > 0 ? (
					<div className="app-section-body grid gap-3 md:grid-cols-3">
						{block.prs.map((pr) => (
							<Card className="shadow-none" key={getPrKey(pr)}>
								<CardContent className="p-4">
									<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
										{liftLabels[pr.lift]}
									</p>
									<p className="mt-3 font-mono text-lg font-medium">
										{formatPrSet(pr)}
									</p>
									<div className="mt-3 flex items-center justify-between gap-3 text-xs">
										<span className="font-medium">{pr.reps}RM PR</span>
										<span className="text-muted-foreground">
											Week {pr.week}
										</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<Card className="app-section-body shadow-none">
						<CardContent className="p-5 text-sm text-muted-foreground">
							No new PRs this block.
						</CardContent>
					</Card>
				)}
			</section>

			<section className="app-section">
				<SectionLabel>Block Analysis</SectionLabel>
				<div className="app-section-body grid gap-4 lg:grid-cols-3">
					{block.liftAnalysis.map((lift) => (
						<Card className="shadow-none" key={lift.key}>
							<CardContent className="p-5">
								<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
									{lift.lift}
								</p>

								<div className="mt-5 grid gap-3">
									<AnalysisStat
										label="Start e1RM"
										value={`${lift.startE1rm} lb`}
									/>
									<AnalysisStat
										label="Peak e1RM"
										value={`${lift.peakE1rm} lb`}
									/>
									<AnalysisStat label="End e1RM" value={`${lift.endE1rm} lb`} />
									<AnalysisStat
										label="Net change"
										value={`${formatSigned(lift.endE1rm - lift.startE1rm)} lb / ${formatPercent(
											getPercentChange(lift.endE1rm, lift.startE1rm),
										)}`}
										valueClassName={
											lift.endE1rm >= lift.startE1rm
												? "text-success"
												: "text-destructive"
										}
									/>
									<AnalysisStat label="Peak week" value={lift.peakWeek} />
									<AnalysisStat
										label="Best logged set"
										value={lift.bestPerformance}
									/>
									<AnalysisStat
										label="Total work sets"
										value={String(lift.totalWorkSets)}
									/>
									<AnalysisStat
										label="Avg top-set RPE"
										value={lift.averageTopSetRpe.toFixed(1)}
									/>
									<AnalysisStat
										label="Avg RPE variance"
										value={formatSignedDecimal(lift.averageRpeVariance)}
										valueClassName={
											lift.averageRpeVariance > 0
												? "text-warning"
												: lift.averageRpeVariance < 0
													? "text-success"
													: undefined
										}
									/>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			<section className="app-section">
				<SectionLabel>Block Highlights</SectionLabel>
				<Card className="app-section-body shadow-none">
					<CardContent className="p-4">
						<div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
							<HighlightStat
								label="Peak strength week"
								value={highlights.peakStrengthWeek}
							/>
							<HighlightStat
								label="Highest volume"
								value={`${highlights.highestVolumeWeek} - ${formatNumber(
									highlights.highestVolume,
								)} lb`}
							/>
							<HighlightStat
								label="Lowest avg RPE"
								value={`${highlights.lowestRpeWeek} - ${highlights.lowestRpe}`}
							/>
							<HighlightStat
								label="Highest avg RPE"
								value={`${highlights.highestRpeWeek} - ${highlights.highestRpe}`}
							/>
							<HighlightStat
								label="Sessions"
								value={`${block.completedSessions} / ${block.totalSessions}`}
							/>
							{highlights.mostImprovedLift ? (
								<HighlightStat
									label="Most improved lift"
									value={highlights.mostImprovedLift}
								/>
							) : null}
						</div>
					</CardContent>
				</Card>
			</section>

			{block.programAdjustments && block.programAdjustments.length > 0 ? (
				<section className="app-section">
					<Card className="shadow-none">
						<CardContent className="p-5 sm:p-6">
							<SectionLabel>Program Adjustments</SectionLabel>
							<p className="mt-3 text-sm text-foreground/80">
								{block.programAdjustments.length} adjustments during this block
							</p>
							<div className="mt-4 grid gap-2 text-sm">
								{block.programAdjustments.map((adjustment) => (
									<p
										className="grid gap-2 border-t pt-2 sm:grid-cols-[80px_minmax(0,1fr)]"
										key={`${adjustment.week}-${adjustment.description}`}
									>
										<span className="text-xs text-muted-foreground">
											Week {adjustment.week}
										</span>
										<span>{adjustment.description}</span>
									</p>
								))}
							</div>
						</CardContent>
					</Card>
				</section>
			) : null}

			<section className="app-section">
				<div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
					<BlockStrengthProgressionCard data={block.strengthProgression} />
					<WeeklyVolumeCard
						accumulatedVolume={formatNumber(block.totalVolume)}
						currentWeek={selectedWeek}
						data={block.weeklyVolume}
					/>
				</div>
			</section>

			<section className="app-section">
				<SectionLabel>Block Breakdown</SectionLabel>
				<div className="app-section-body">
					<BlockWeekSelector
						onSelectWeek={setSelectedWeek}
						selectedWeek={selectedWeek}
						weeks={weeks}
					/>
				</div>
			</section>

			<section className="app-section">
				{weekSummary ? <WeekSummaryCard {...weekSummary} /> : null}

				<div className="mt-5 flex items-center justify-between gap-3">
					<SectionLabel>Historical Training Days</SectionLabel>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Dumbbell className="size-3.5" />
						Week {selectedWeek}
					</div>
				</div>

				<div className="app-section-body grid gap-3">
					{trainingDays.map((day) => (
						<TrainingDayCard day={day} key={day.id} />
					))}
				</div>
			</section>
		</PageContainer>
	);
}

function AnalysisStat({
	label,
	value,
	valueClassName,
}: {
	label: string;
	value: string;
	valueClassName?: string;
}) {
	return (
		<div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 border-b pb-2 last:border-b-0 last:pb-0">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p
				className={cn(
					"text-right font-mono text-sm font-medium",
					valueClassName,
				)}
			>
				{value}
			</p>
		</div>
	);
}

function HighlightStat({ label, value }: { label: string; value: string }) {
	return (
		<p className="font-mono">
			<span className="font-sans text-muted-foreground">{label}:</span> {value}
		</p>
	);
}

function ResultStat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="mt-1 font-mono text-sm font-medium">{value}</p>
		</div>
	);
}

function StrengthRow({
	label,
	getValue,
}: {
	label: string;
	getValue: (lift: Lift) => number | undefined;
}) {
	return (
		<tr className="border-b last:border-b-0">
			<td className="py-3 text-muted-foreground">{label}</td>
			{liftOrder.map((lift) => (
				<td className="py-3 text-right font-mono font-medium" key={lift}>
					{formatStrengthValue(getValue(lift))}
				</td>
			))}
		</tr>
	);
}

function SectionLabel({ children }: { children: string }) {
	return (
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{children}
		</p>
	);
}

const liftOrder: readonly Lift[] = ["squat", "bench", "deadlift"];

const liftLabels: Record<Lift, string> = {
	squat: "Squat",
	bench: "Bench",
	deadlift: "Deadlift",
};

function getPercentChange(end: number, start: number) {
	return Number((((end - start) / start) * 100).toFixed(1));
}

function formatPercent(value: number) {
	return value > 0 ? `+${value}%` : `${value}%`;
}

function formatNumber(value: number) {
	return value.toLocaleString("en-US");
}

function formatSigned(value: number) {
	return value > 0 ? `+${value}` : String(value);
}

function formatSignedDecimal(value: number) {
	return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function formatStrengthValue(value: number | undefined) {
	return typeof value === "number" ? `${formatNumber(value)} lb` : "Not logged";
}

function formatPrSet(pr: BlockPr) {
	return `${formatNumber(pr.weight)} x ${pr.reps}${pr.rpe ? ` @ ${pr.rpe}` : ""}`;
}

function getPrKey(pr: BlockPr) {
	return `${pr.lift}-${pr.reps}-${pr.weight}-${pr.week}`;
}

function getActualTotal(block: HistoricalBlock) {
	return liftOrder.reduce(
		(total, lift) => total + (block.strengthAtEnd?.[lift]?.actualOneRm ?? 0),
		0,
	);
}

function getE1rmTotal(block: HistoricalBlock) {
	return liftOrder.reduce(
		(total, lift) =>
			total +
			(block.strengthAtEnd?.[lift]?.endE1rm ??
				block.lifts.find((blockLift) => blockLift.key === lift)?.endE1rm ??
				0),
		0,
	);
}

function hasThreeRmComparison(block: HistoricalBlock) {
	return liftOrder.every(
		(lift) =>
			block.startingRepPrs?.[lift]?.three && block.endingRepPrs?.[lift]?.three,
	);
}

function getSessionStatusCounts(block: HistoricalBlock) {
	const counts = { completed: 0, skipped: 0, partial: 0 };

	for (const day of Object.values(block.trainingDaysByWeek).flat()) {
		if (day.status === "completed") {
			counts.completed += 1;
		}
		if (day.status === "skipped") {
			counts.skipped += 1;
		}
		if (day.status === "partial") {
			counts.partial += 1;
		}
	}

	return counts;
}

function getBlockHighlights(block: HistoricalBlock) {
	const peakStrengthPoint = block.strengthProgression.reduce((best, point) =>
		point.squat + point.bench + point.deadlift >
		best.squat + best.bench + best.deadlift
			? point
			: best,
	);
	const highestVolumePoint = block.weeklyVolume.reduce((best, point) =>
		point.tonnage.total > best.tonnage.total ? point : best,
	);
	const weekSummaries = Object.values(block.weekSummaries);
	const lowestRpeWeek = weekSummaries.reduce((best, week) =>
		Number(week.averageRpe) < Number(best.averageRpe) ? week : best,
	);
	const highestRpeWeek = weekSummaries.reduce((best, week) =>
		Number(week.averageRpe) > Number(best.averageRpe) ? week : best,
	);
	const mostImprovedLift = block.liftAnalysis.reduce((best, lift) =>
		getPercentChange(lift.endE1rm, lift.startE1rm) >
		getPercentChange(best.endE1rm, best.startE1rm)
			? lift
			: best,
	);

	return {
		peakStrengthWeek: peakStrengthPoint.week.replace("Week ", "W"),
		highestVolumeWeek: highestVolumePoint.week.replace("Week ", "W"),
		highestVolume: highestVolumePoint.tonnage.total,
		lowestRpeWeek: `W${lowestRpeWeek.week}`,
		lowestRpe: lowestRpeWeek.averageRpe,
		highestRpeWeek: `W${highestRpeWeek.week}`,
		highestRpe: highestRpeWeek.averageRpe,
		mostImprovedLift: `${mostImprovedLift.lift} ${formatPercent(
			getPercentChange(mostImprovedLift.endE1rm, mostImprovedLift.startE1rm),
		)}`,
	};
}
