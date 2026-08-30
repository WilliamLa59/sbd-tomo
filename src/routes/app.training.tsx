// src/routes/app.training.tsx

import { createFileRoute } from "@tanstack/react-router";
import { Activity, Dumbbell, Sigma, TrendingUp } from "lucide-react";
import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { BlockMetricCard } from "@/components/training/block-metric-card";
import { BlockStrengthProgressionCard } from "@/components/training/block-strength-progression-card";
import { BlockTargetsCard } from "@/components/training/block-targets-card";
import {
	type BlockWeekOption,
	BlockWeekSelector,
} from "@/components/training/block-week-selector";
import { CurrentBlockHeader } from "@/components/training/current-block-header";
import {
	type TrainingDay,
	TrainingDayCard,
} from "@/components/training/training-day-card";
import { WeekSummaryCard } from "@/components/training/week-summary-card";
import { WeeklyVolumeCard } from "@/components/training/weekly-volume-card";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/app/training")({
	component: TrainingPage,
});

type ActiveTrainingBlock = {
	title: string;
	currentWeek: number;
	totalWeeks: number;
	dateRange: string;
};

const activeBlock: ActiveTrainingBlock | null = {
	title: "Block 13 - Volume / Strength",
	currentWeek: 3,
	totalWeeks: 6,
	dateRange: "Aug 10 - Sep 18",
};

const blockMetrics = [
	{
		label: "Squat e1RM",
		value: "462",
		unit: "LB",
		change: 5.5,
		detail: "this block",
		icon: TrendingUp,
	},
	{
		label: "Bench e1RM",
		value: "315",
		unit: "LB",
		change: 4.3,
		detail: "this block",
		icon: TrendingUp,
	},
	{
		label: "Deadlift e1RM",
		value: "487",
		unit: "LB",
		change: 3.4,
		detail: "this block",
		icon: TrendingUp,
	},
	{
		label: "Week Volume",
		value: "28,800",
		unit: "LB",
		detail: "current week actual",
		icon: Activity,
	},
	{
		label: "Block Volume",
		value: "81,200",
		unit: "LB",
		detail: "accumulated actual",
		icon: Sigma,
	},
] as const;

const strengthProgression = [
	{
		week: "Week 1",
		squat: { absolute: 438, percentChange: 0 },
		bench: { absolute: 302, percentChange: 0 },
		deadlift: { absolute: 471, percentChange: 0 },
	},
	{
		week: "Week 2",
		squat: { absolute: 448, percentChange: 2.3 },
		bench: { absolute: 307, percentChange: 1.7 },
		deadlift: { absolute: 478, percentChange: 1.5 },
	},
	{
		week: "Week 3",
		squat: { absolute: 462, percentChange: 5.5 },
		bench: { absolute: 315, percentChange: 4.3 },
		deadlift: { absolute: 487, percentChange: 3.4 },
	},
] as const;

const weeklyVolume = [
	{
		week: "Week 1",
		tonnage: { squat: 9400, bench: 8700, deadlift: 7100, total: 25200 },
		sets: { squat: 12, bench: 16, deadlift: 9, total: 37 },
		reps: { squat: 42, bench: 58, deadlift: 31, total: 131 },
	},
	{
		week: "Week 2",
		tonnage: { squat: 10200, bench: 9100, deadlift: 7900, total: 27200 },
		sets: { squat: 13, bench: 16, deadlift: 10, total: 39 },
		reps: { squat: 45, bench: 60, deadlift: 34, total: 139 },
	},
	{
		week: "Week 3",
		tonnage: { squat: 10600, bench: 9800, deadlift: 8400, total: 28800 },
		sets: { squat: 14, bench: 17, deadlift: 10, total: 41 },
		reps: { squat: 47, bench: 63, deadlift: 35, total: 145 },
	},
] as const;

const blockTargets = [
	{
		lift: "Squat",
		start: "425 lb × 4 [7](7)",
		current: "445 lb × 3 [8](8)",
		target: "455 lb × 2 [7](7)",
		targetReps: 2,
	},
	{
		lift: "Bench",
		start: "285 lb × 4 [7](7)",
		current: "290 lb × 3 [7](7)",
		target: "305 lb × 1 [7](7)",
		targetReps: 1,
	},
	{
		lift: "Deadlift",
		start: "435 lb × 4 [7](7.5)",
		current: "445 lb × 3 [7](7)",
		target: "475 lb × 1 [7](7)",
		targetReps: 1,
	},
] as const;

const blockWeeks: readonly BlockWeekOption[] = [
	{ week: 1, status: "completed" },
	{ week: 2, status: "completed" },
	{ week: 3, status: "current" },
	{ week: 4, status: "upcoming" },
	{ week: 5, status: "upcoming" },
	{ week: 6, status: "upcoming" },
] as const;

const weekSummaries = {
	1: {
		week: 1,
		status: "Completed",
		completedSessions: 5,
		totalSessions: 5,
		totalVolume: "25,200",
		squatVolume: "9,400",
		benchVolume: "8,700",
		deadliftVolume: "7,100",
	},
	2: {
		week: 2,
		status: "Completed",
		completedSessions: 5,
		totalSessions: 5,
		totalVolume: "27,200",
		squatVolume: "10,200",
		benchVolume: "9,100",
		deadliftVolume: "7,900",
	},
	3: {
		week: 3,
		status: "Current",
		completedSessions: 3,
		totalSessions: 5,
		totalVolume: "28,800",
		squatVolume: "10,600",
		benchVolume: "9,800",
		deadliftVolume: "8,400",
	},
	4: {
		week: 4,
		status: "Upcoming",
		completedSessions: 0,
		totalSessions: 5,
		totalVolume: "0",
		squatVolume: "0",
		benchVolume: "0",
		deadliftVolume: "0",
	},
	5: {
		week: 5,
		status: "Upcoming",
		completedSessions: 0,
		totalSessions: 5,
		totalVolume: "0",
		squatVolume: "0",
		benchVolume: "0",
		deadliftVolume: "0",
	},
	6: {
		week: 6,
		status: "Upcoming",
		completedSessions: 0,
		totalSessions: 4,
		totalVolume: "0",
		squatVolume: "0",
		benchVolume: "0",
		deadliftVolume: "0",
	},
} as const;

const trainingDaysByWeek: Record<number, readonly TrainingDay[]> = {
	1: [
		{
			id: "w1-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			topSet: "425 lb × 4 [7](7)",
			backdowns: [
				"365 lb × 5 [6](6)",
				"365 lb × 5 [6](6)",
				"365 lb × 5 [6](6)",
			],
			plannedTopSet: "425 lb × 4 [7](7)",
			plannedBackdowns: [
				"365 lb × 5 [6](6)",
				"365 lb × 5 [6](6)",
				"365 lb × 5 [6](6)",
			],
			status: "completed",
			note: "Moved well once I slowed the descent.",
		},
		{
			id: "w1-d2",
			day: "Tuesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			topSet: "285 lb × 4 [7](7)",
			backdowns: [
				"245 lb × 5 [6](6)",
				"245 lb × 5 [6](6)",
				"245 lb × 5 [6](6)",
				"245 lb × 5 [6](6)",
			],
			plannedTopSet: "285 lb × 4 [7](7)",
			status: "completed",
		},
		{
			id: "w1-d3",
			day: "Wednesday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			topSet: "435 lb × 4 [7](7.5)",
			backdowns: [
				"385 lb × 4 [6](6)",
				"385 lb × 4 [6](6)",
				"385 lb × 4 [6](6)",
			],
			plannedTopSet: "435 lb × 4 [7](7)",
			plannedBackdowns: [
				"385 lb × 4 [6](6)",
				"385 lb × 4 [6](6)",
				"385 lb × 4 [6](6)",
			],
			status: "completed",
		},
	],
	2: [
		{
			id: "w2-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			topSet: "435 lb × 3 [7](7)",
			backdowns: [
				"375 lb × 5 [6](6)",
				"375 lb × 5 [6](6)",
				"375 lb × 5 [7](7)",
				"375 lb × 5 [7](7)",
			],
			plannedTopSet: "435 lb × 3 [7](7)",
			status: "completed",
			note: "Bar path stayed tighter than last week.",
		},
		{
			id: "w2-d2",
			day: "Tuesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			topSet: "295 lb × 3 [7](7.5)",
			backdowns: [
				"255 lb × 4 [6](6)",
				"255 lb × 4 [6](6)",
				"255 lb × 4 [6](6)",
				"255 lb × 4 [6](6)",
			],
			plannedTopSet: "295 lb × 3 [7](7)",
			status: "completed",
		},
		{
			id: "w2-d3",
			day: "Thursday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			topSet: "445 lb × 3 [7](7)",
			backdowns: [
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
			],
			plannedTopSet: "445 lb × 3 [7](7)",
			status: "completed",
		},
	],
	3: [
		{
			id: "w3-d1",
			day: "Monday",
			title: "Competition Bench",
			primaryLift: "Bench",
			topSet: "290 lb × 3 [7](7)",
			backdowns: [
				"255 lb × 4 [6](6)",
				"255 lb × 4 [6](6)",
				"255 lb × 4 [7](7)",
			],
			plannedTopSet: "290 lb × 3 [7](7)",
			status: "completed",
		},
		{
			id: "w3-d2",
			day: "Tuesday",
			title: "Competition Squat",
			primaryLift: "Squat",
			topSet: "445 lb × 3 [8](8)",
			backdowns: ["375 lb × 4 [7](7)", "365 lb × 5 [7](7)"],
			plannedTopSet: "445 lb × 3 [7](7)",
			plannedBackdowns: ["375 lb × 4 [7](7)", "365 lb × 5 [7](7)"],
			status: "completed",
			note: "Brace was off initially. Wider stance + hips back fixed groove.",
		},
		{
			id: "w3-d3",
			day: "Wednesday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			topSet: "455 lb × 3 [7](7)",
			backdowns: [
				"405 lb × 3 [6](6)",
				"405 lb × 3 [6](6)",
				"405 lb × 3 [6](6)",
			],
			plannedTopSet: "455 lb × 3 [7](7)",
			status: "completed",
			note: "Locked in lats before the first pull and kept speed consistent.",
		},
		{
			id: "w3-d4",
			day: "Thursday",
			title: "Competition Bench",
			primaryLift: "Bench",
			plannedTopSet: "300 lb × 2 [7](7)",
			plannedBackdowns: [
				"265 lb × 4 [6](6)",
				"265 lb × 4 [6](6)",
				"265 lb × 4 [6](6)",
			],
			status: "upcoming",
		},
		{
			id: "w3-d5",
			day: "Friday",
			title: "Competition Squat",
			primaryLift: "Squat",
			plannedTopSet: "455 lb × 2 [7](7)",
			plannedBackdowns: [
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
			],
			status: "upcoming",
		},
	],
	4: [
		{
			id: "w4-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			plannedTopSet: "455 lb × 2 [7](7)",
			plannedBackdowns: [
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
				"395 lb × 4 [6](6)",
			],
			status: "upcoming",
		},
		{
			id: "w4-d2",
			day: "Tuesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			plannedTopSet: "300 lb × 2 [7](7)",
			plannedBackdowns: [
				"265 lb × 4 [6](6)",
				"265 lb × 4 [6](6)",
				"265 lb × 4 [6](6)",
				"265 lb × 4 [6](6)",
			],
			status: "upcoming",
		},
		{
			id: "w4-d3",
			day: "Thursday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			plannedTopSet: "465 lb × 2 [7](7)",
			plannedBackdowns: [
				"415 lb × 3 [6](6)",
				"415 lb × 3 [6](6)",
				"415 lb × 3 [6](6)",
			],
			status: "upcoming",
		},
	],
	5: [
		{
			id: "w5-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			plannedTopSet: "465 lb × 1 [7](7)",
			plannedBackdowns: [
				"405 lb × 3 [6](6)",
				"405 lb × 3 [6](6)",
				"405 lb × 3 [6](6)",
			],
			status: "upcoming",
		},
		{
			id: "w5-d2",
			day: "Wednesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			plannedTopSet: "305 lb × 1 [7](7)",
			plannedBackdowns: [
				"270 lb × 3 [6](6)",
				"270 lb × 3 [6](6)",
				"270 lb × 3 [6](6)",
			],
			status: "upcoming",
		},
		{
			id: "w5-d3",
			day: "Friday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			plannedTopSet: "475 lb × 1 [7](7)",
			plannedBackdowns: ["425 lb × 2 [6](6)", "425 lb × 2 [6](6)"],
			status: "upcoming",
		},
	],
	6: [
		{
			id: "w6-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			plannedTopSet: "435 lb × 1 [6](6)",
			plannedBackdowns: [],
			status: "upcoming",
		},
		{
			id: "w6-d2",
			day: "Wednesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			plannedTopSet: "285 lb × 1 [6](6)",
			plannedBackdowns: [],
			status: "upcoming",
		},
		{
			id: "w6-d3",
			day: "Friday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			plannedTopSet: "455 lb × 1 [6](6)",
			plannedBackdowns: [],
			status: "upcoming",
		},
	],
};

function TrainingPage() {
	if (!activeBlock || activeBlock.currentWeek > activeBlock.totalWeeks) {
		return <NoActiveBlockState />;
	}

	return <ActiveTrainingBlockPage activeBlock={activeBlock} />;
}

function ActiveTrainingBlockPage({
	activeBlock,
}: {
	activeBlock: ActiveTrainingBlock;
}) {
	const [selectedWeek, setSelectedWeek] = useState<number>(
		activeBlock.currentWeek,
	);
	const weekSummary = weekSummaries[selectedWeek as keyof typeof weekSummaries];
	const trainingDays = trainingDaysByWeek[selectedWeek] ?? [];

	return (
		<PageContainer className="pt-5 md:pt-7">
			<CurrentBlockHeader {...activeBlock} />

			<section className="app-section">
				<SectionLabel>Block Overview</SectionLabel>

				<div className="app-section-body grid gap-4">
					<BlockTargetsCard targets={blockTargets} />

					<div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr))]">
						{blockMetrics.map((metric) => (
							<BlockMetricCard key={metric.label} {...metric} />
						))}
					</div>
				</div>
			</section>

			<section className="app-section">
				<div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
					<BlockStrengthProgressionCard data={strengthProgression} />
					<WeeklyVolumeCard
						accumulatedVolume="81,200"
						currentWeek={activeBlock.currentWeek}
						data={weeklyVolume}
					/>
				</div>
			</section>

			<section className="app-section">
				<SectionLabel>Block Breakdown</SectionLabel>

				<div className="app-section-body">
					<BlockWeekSelector
						onSelectWeek={setSelectedWeek}
						selectedWeek={selectedWeek}
						weeks={blockWeeks}
					/>
				</div>
			</section>

			<section className="app-section">
				<div className="grid gap-3">
					<WeekSummaryCard {...weekSummary} />
				</div>

				<div className="mt-5 flex items-center justify-between gap-3">
					<SectionLabel>Training Days</SectionLabel>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Dumbbell className="size-3.5" />
						Week {selectedWeek} drill-down
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

function NoActiveBlockState() {
	return (
		<PageContainer className="pt-5 md:pt-7">
			<Card className="shadow-none">
				<CardContent className="p-8">
					<h1 className="text-2xl font-medium tracking-tight">
						No active block
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Training metrics will appear once a current powerlifting block is
						active.
					</p>
				</CardContent>
			</Card>
		</PageContainer>
	);
}

function SectionLabel({ children }: { children: string }) {
	return (
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{children}
		</p>
	);
}
