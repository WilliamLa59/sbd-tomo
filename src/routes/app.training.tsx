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

export const Route = createFileRoute("/app/training")({
	component: TrainingPage,
});

const activeBlock = {
	title: "Block 13 - Volume / Strength",
	currentWeek: 3,
	totalWeeks: 6,
	dateRange: "Aug 10 - Sep 18",
	progressPercent: 50,
} as const;

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
		value: "31,420",
		unit: "LB",
		detail: "current week",
		icon: Activity,
	},
	{
		label: "Block Volume",
		value: "82,750",
		unit: "LB",
		detail: "accumulated",
		icon: Sigma,
	},
] as const;

const strengthProgression = [
	{ week: "Week 1", squat: 438, bench: 302, deadlift: 471 },
	{ week: "Week 2", squat: 448, bench: 307, deadlift: 478 },
	{ week: "Week 3", squat: 462, bench: 315, deadlift: 487 },
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
		startE1rm: 438,
		currentE1rm: 462,
		targetE1rm: 475,
		targetReps: 2,
	},
	{
		lift: "Bench",
		startE1rm: 302,
		currentE1rm: 315,
		targetE1rm: 325,
		targetReps: 3,
	},
	{
		lift: "Deadlift",
		startE1rm: 471,
		currentE1rm: 487,
		targetE1rm: 500,
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
		averageRpe: "7.1",
		e1rmChange: "+2.8%",
		adherence: "96%",
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
		averageRpe: "7.3",
		e1rmChange: "+3.1%",
		adherence: "95%",
		deltas: {
			totalVolume: { value: "+7.9%", direction: "positive", compareWeek: 1 },
			squatVolume: { value: "+8.5%", direction: "positive", compareWeek: 1 },
			benchVolume: { value: "+4.6%", direction: "positive", compareWeek: 1 },
			deadliftVolume: {
				value: "+11.3%",
				direction: "positive",
				compareWeek: 1,
			},
			averageRpe: { value: "+0.2", direction: "neutral", compareWeek: 1 },
			e1rmChange: { value: "+0.3 pct", direction: "positive", compareWeek: 1 },
		},
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
		averageRpe: "7.4",
		e1rmChange: "+3.6%",
		adherence: "94%",
		deltas: {
			totalVolume: { value: "+5.9%", direction: "positive", compareWeek: 2 },
			squatVolume: { value: "+3.9%", direction: "positive", compareWeek: 2 },
			benchVolume: { value: "+7.7%", direction: "positive", compareWeek: 2 },
			deadliftVolume: { value: "+6.3%", direction: "positive", compareWeek: 2 },
			averageRpe: { value: "+0.1", direction: "neutral", compareWeek: 2 },
			e1rmChange: { value: "+0.5 pct", direction: "positive", compareWeek: 2 },
		},
	},
	4: {
		week: 4,
		status: "Upcoming",
		completedSessions: 0,
		totalSessions: 5,
		totalVolume: "30,100",
		squatVolume: "11,200",
		benchVolume: "10,200",
		deadliftVolume: "8,700",
		averageRpe: "-",
		e1rmChange: "Planned",
		adherence: "Planned",
		deltas: {
			totalVolume: { value: "+4.5%", direction: "positive", compareWeek: 3 },
			squatVolume: { value: "+5.7%", direction: "positive", compareWeek: 3 },
			benchVolume: { value: "+4.1%", direction: "positive", compareWeek: 3 },
			deadliftVolume: { value: "+3.6%", direction: "positive", compareWeek: 3 },
		},
	},
	5: {
		week: 5,
		status: "Upcoming",
		completedSessions: 0,
		totalSessions: 5,
		totalVolume: "31,400",
		squatVolume: "11,700",
		benchVolume: "10,600",
		deadliftVolume: "9,100",
		averageRpe: "-",
		e1rmChange: "Planned",
		adherence: "Planned",
		deltas: {
			totalVolume: { value: "+4.3%", direction: "positive", compareWeek: 4 },
			squatVolume: { value: "+4.5%", direction: "positive", compareWeek: 4 },
			benchVolume: { value: "+3.9%", direction: "positive", compareWeek: 4 },
			deadliftVolume: { value: "+4.6%", direction: "positive", compareWeek: 4 },
		},
	},
	6: {
		week: 6,
		status: "Upcoming",
		completedSessions: 0,
		totalSessions: 4,
		totalVolume: "22,600",
		squatVolume: "8,400",
		benchVolume: "7,800",
		deadliftVolume: "6,400",
		averageRpe: "-",
		e1rmChange: "Taper",
		adherence: "Planned",
		deltas: {
			totalVolume: { value: "-28.0%", direction: "negative", compareWeek: 5 },
			squatVolume: { value: "-28.2%", direction: "negative", compareWeek: 5 },
			benchVolume: { value: "-26.4%", direction: "negative", compareWeek: 5 },
			deadliftVolume: {
				value: "-29.7%",
				direction: "negative",
				compareWeek: 5,
			},
		},
	},
} as const;

const trainingDaysByWeek: Record<number, readonly TrainingDay[]> = {
	1: [
		{
			id: "w1-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			topSet: "425 lb x 4 @ 7",
			backdowns: "365 lb - 3 x 5 @ 6",
			planned: "425 x 4 @ 7",
			actual: "425 x 4 @ 7",
			status: "completed",
			note: "Moved well once I slowed the descent.",
		},
		{
			id: "w1-d2",
			day: "Tuesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			topSet: "285 lb x 4 @ 7",
			backdowns: "245 lb - 4 x 5 @ 6",
			planned: "285 x 4 @ 7",
			actual: "285 x 4 @ 7",
			status: "completed",
		},
		{
			id: "w1-d3",
			day: "Wednesday",
			title: "Deadlift Volume",
			primaryLift: "Deadlift",
			topSet: "435 lb x 4 @ 7",
			backdowns: "385 lb - 3 x 4 @ 6",
			planned: "435 x 4 @ 7",
			actual: "435 x 4 @ 7.5",
			status: "completed",
		},
	],
	2: [
		{
			id: "w2-d1",
			day: "Monday",
			title: "Squat + Bench Volume",
			primaryLift: "Squat",
			topSet: "435 lb x 3 @ 7",
			backdowns: "375 lb - 4 x 5 @ 6-7",
			planned: "435 x 3 @ 7",
			actual: "435 x 3 @ 7",
			status: "completed",
			note: "Bar path stayed tighter than last week.",
		},
		{
			id: "w2-d2",
			day: "Tuesday",
			title: "Bench Press Focus",
			primaryLift: "Bench",
			topSet: "295 lb x 3 @ 7",
			backdowns: "255 lb - 4 x 4 @ 6",
			planned: "295 x 3 @ 7",
			actual: "295 x 3 @ 7.5",
			status: "completed",
		},
		{
			id: "w2-d3",
			day: "Thursday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			topSet: "445 lb x 3 @ 7",
			backdowns: "395 lb - 3 x 4 @ 6",
			planned: "445 x 3 @ 7",
			actual: "445 x 3 @ 7",
			status: "completed",
		},
	],
	3: [
		{
			id: "w3-d1",
			day: "Monday",
			title: "Competition Bench",
			primaryLift: "Bench",
			topSet: "290 lb x 3 @ 7",
			backdowns: "255 lb - 3 x 4 @ 6-7",
			planned: "290 x 3 @ 7",
			actual: "290 x 3 @ 7",
			status: "completed",
		},
		{
			id: "w3-d2",
			day: "Tuesday",
			title: "Competition Squat",
			primaryLift: "Squat",
			topSet: "445 lb x 3 @ 8",
			backdowns: "375 x 4 / 365 x 5",
			planned: "445 x 3 @ 7",
			actual: "445 x 3 @ 8",
			status: "completed",
			note: "Brace was off initially. Wider stance + hips back fixed groove.",
		},
		{
			id: "w3-d3",
			day: "Wednesday",
			title: "Light Bench / Upper",
			primaryLift: "Bench",
			topSet: "250 lb - 2 x 6 @ 7",
			backdowns: "Rows + triceps",
			planned: "250 x 6 @ 7",
			actual: "250 x 6 @ 7",
			status: "completed",
			note: "Press felt crisp; kept elbows tucked consistently.",
		},
		{
			id: "w3-d4",
			day: "Thursday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			topSet: "455 lb x 3 @ 7",
			backdowns: "405 lb - 3 x 3 @ 6",
			status: "upcoming",
		},
		{
			id: "w3-d5",
			day: "Friday",
			title: "Pause Squat + Heavy Bench",
			primaryLift: "Squat / Bench",
			topSet: "Pause squat 365 x 4",
			backdowns: "Bench 275 lb - 4 x 3",
			status: "upcoming",
		},
	],
	4: [
		{
			id: "w4-d1",
			day: "Monday",
			title: "Competition Squat",
			primaryLift: "Squat",
			topSet: "455 lb x 2 @ 7",
			backdowns: "395 lb - 4 x 4 @ 6",
			status: "upcoming",
		},
		{
			id: "w4-d2",
			day: "Tuesday",
			title: "Competition Bench",
			primaryLift: "Bench",
			topSet: "300 lb x 2 @ 7",
			backdowns: "265 lb - 4 x 4 @ 6",
			status: "upcoming",
		},
		{
			id: "w4-d3",
			day: "Thursday",
			title: "Competition Deadlift",
			primaryLift: "Deadlift",
			topSet: "465 lb x 2 @ 7",
			backdowns: "415 lb - 3 x 3 @ 6",
			status: "upcoming",
		},
	],
	5: [
		{
			id: "w5-d1",
			day: "Monday",
			title: "Heavy Squat",
			primaryLift: "Squat",
			topSet: "465 lb x 1 @ 7",
			backdowns: "405 lb - 3 x 3 @ 6",
			status: "upcoming",
		},
		{
			id: "w5-d2",
			day: "Wednesday",
			title: "Heavy Bench",
			primaryLift: "Bench",
			topSet: "305 lb x 1 @ 7",
			backdowns: "270 lb - 3 x 3 @ 6",
			status: "upcoming",
		},
		{
			id: "w5-d3",
			day: "Friday",
			title: "Heavy Deadlift",
			primaryLift: "Deadlift",
			topSet: "475 lb x 1 @ 7",
			backdowns: "425 lb - 3 x 2 @ 6",
			status: "upcoming",
		},
	],
	6: [
		{
			id: "w6-d1",
			day: "Monday",
			title: "Squat Opener Practice",
			primaryLift: "Squat",
			topSet: "435 lb x 1 @ 6",
			backdowns: "Light technique work",
			status: "upcoming",
		},
		{
			id: "w6-d2",
			day: "Wednesday",
			title: "Bench Opener Practice",
			primaryLift: "Bench",
			topSet: "285 lb x 1 @ 6",
			backdowns: "Light technique work",
			status: "upcoming",
		},
		{
			id: "w6-d3",
			day: "Friday",
			title: "Test Day",
			primaryLift: "SBD",
			topSet: "Planned heavy singles",
			backdowns: "None",
			status: "upcoming",
		},
	],
};

function TrainingPage() {
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
						accumulatedVolume="82,750"
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

function SectionLabel({ children }: { children: string }) {
	return (
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{children}
		</p>
	);
}
