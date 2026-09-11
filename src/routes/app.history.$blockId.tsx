import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Dumbbell, Sigma, TrendingUp } from "lucide-react";
import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { BlockMetricCard } from "@/components/training/block-metric-card";
import { BlockStrengthProgressionCard } from "@/components/training/block-strength-progression-card";
import {
	type BlockWeekOption,
	BlockWeekSelector,
} from "@/components/training/block-week-selector";
import { TrainingDayCard } from "@/components/training/training-day-card";
import { WeekSummaryCard } from "@/components/training/week-summary-card";
import { WeeklyVolumeCard } from "@/components/training/weekly-volume-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getHistoricalBlock, type HistoricalBlock } from "@/data/history";
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
	const statusCounts = getSessionStatusCounts(block);
	const blockNotes = block.endingNotes ?? block.notes;
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
							<SectionLabel>Block Review</SectionLabel>
							<p className="mt-3 text-sm leading-6 text-foreground/80">
								{blockNotes}
							</p>
						</CardContent>
					</Card>
				</section>
			) : null}

			<section className="app-section">
				<SectionLabel>Final Block Outcome</SectionLabel>
				<div className="app-section-body grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
					{block.liftAnalysis.map((lift) => {
						const e1rmChange = lift.endE1rm - lift.startE1rm;

						return (
							<BlockMetricCard
								change={getPercentChange(lift.endE1rm, lift.startE1rm)}
								detail="from block start"
								icon={TrendingUp}
								key={lift.key}
								label={`${lift.lift} net e1RM`}
								unit="LB"
								value={formatSigned(e1rmChange)}
							/>
						);
					})}
					<BlockMetricCard
						detail="performed work"
						icon={Sigma}
						label="Total Volume"
						unit="LB"
						value={formatNumber(block.totalVolume)}
					/>
					<BlockMetricCard
						detail="completed / partial / skipped"
						icon={Dumbbell}
						label="Session Counts"
						valueClassName="text-xl md:text-2xl"
						value={`${statusCounts.completed} / ${statusCounts.partial} / ${statusCounts.skipped}`}
					/>
				</div>
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
										value={`${lift.peakE1rm} lb · ${lift.peakWeek}`}
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
									<AnalysisStat
										label="Peak e1RM Set"
										value={lift.bestPerformance}
									/>
									<AnalysisStat
										label="Total work sets"
										value={String(lift.totalWorkSets)}
									/>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
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

function SectionLabel({ children }: { children: string }) {
	return (
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{children}
		</p>
	);
}

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
