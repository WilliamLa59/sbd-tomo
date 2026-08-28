// src/routes/app.index.tsx

import { createFileRoute } from "@tanstack/react-router";

import { PageContainer } from "@/components/layout/page-container";
import { BlockProgressionCard } from "@/components/training/block-progression-card";
import { NextWorkoutCard } from "@/components/training/next-workout-card";
import { ProgramBlockCalendarCard } from "@/components/training/program-block-calendar-card";
import { TrainingCuesCard } from "@/components/training/training-cues-card";
import { WorkoutHeroCard } from "@/components/training/workout-hero-card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/app/")({
	component: DashboardPage,
});

const backdowns = [
	{
		id: 1,
		weight: 365,
		reps: 5,
		rpe: 6,
		completed: true,
	},
	{
		id: 2,
		weight: 365,
		reps: 5,
		rpe: 7,
		completed: true,
	},
	{
		id: 3,
		weight: 365,
		reps: 5,
		rpe: 7,
		completed: false,
	},
];

const trainingCues = [
	"Hips back",
	"Belt to hips",
	"Feet shoulder width apart",
] as const;

const currentBlockName = "Hypertrophy Block 2";
const currentTrainingDate = "2026-06-04";

const blockTrainingDays = [
	{
		date: "2026-05-19",
		label: "W1 D1",
		focus: "Squat",
		status: "completed",
	},
	{
		date: "2026-05-21",
		label: "W1 D2",
		focus: "Bench",
		status: "completed",
	},
	{
		date: "2026-05-23",
		label: "W1 D3",
		focus: "Deadlift",
		status: "completed",
	},
	{
		date: "2026-05-26",
		label: "W2 D1",
		focus: "Squat",
		status: "completed",
	},
	{
		date: "2026-05-28",
		label: "W2 D2",
		focus: "Bench",
		status: "completed",
	},
	{
		date: "2026-05-30",
		label: "W2 D3",
		focus: "Pull",
		status: "completed",
	},
	{
		date: "2026-06-02",
		label: "W3 D1",
		focus: "Deadlift",
		status: "completed",
	},
	{
		date: "2026-06-04",
		label: "W3 D2",
		focus: "Squat",
		status: "current",
	},
	{
		date: "2026-06-06",
		label: "W3 D3",
		focus: "Bench",
		status: "planned",
	},
	{
		date: "2026-06-09",
		label: "W4 D1",
		focus: "Squat",
		status: "planned",
	},
	{
		date: "2026-06-11",
		label: "W4 D2",
		focus: "Bench",
		status: "planned",
	},
	{
		date: "2026-06-13",
		label: "W4 D3",
		focus: "Deadlift",
		status: "planned",
	},
	{
		date: "2026-06-16",
		label: "W5 D1",
		focus: "Squat",
		status: "planned",
	},
	{
		date: "2026-06-18",
		label: "W5 D2",
		focus: "Bench",
		status: "planned",
	},
	{
		date: "2026-06-20",
		label: "W5 D3",
		focus: "Pull",
		status: "planned",
	},
	{
		date: "2026-06-23",
		label: "W6 D1",
		focus: "Peak",
		status: "planned",
	},
	{
		date: "2026-06-25",
		label: "W6 D2",
		focus: "Bench",
		status: "planned",
	},
	{
		date: "2026-06-27",
		label: "W6 D3",
		focus: "Test",
		status: "planned",
	},
] as const;

function DashboardPage() {
	const { data: session } = authClient.useSession();
	const userName = session?.user.name?.split(" ")[0];

	return (
		<PageContainer className="pt-5 md:pt-7">
			<div>
				<h1 className="text-2xl font-medium tracking-tight md:text-3xl">
					Good afternoon{userName ? `, ${userName}` : ""}
				</h1>

				<p className="mt-2 text-sm text-muted-foreground">
					{formatTrainingDate(currentTrainingDate)}
				</p>

				<p className="mt-1 text-sm text-muted-foreground">
					Week 3 - Day 2 of {currentBlockName}
				</p>
			</div>

			<section className="app-section">
				<SectionLabel>Today</SectionLabel>

				<TrainingCuesCard className="app-section-body" cues={trainingCues} />

				<div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
					<WorkoutHeroCard
						exercise="Competition Squat"
						topSet={{
							weight: 405,
							reps: 3,
							rpe: 7,
							completed: true,
						}}
						backdowns={backdowns}
					/>

					<div className="min-w-0">
						<NextWorkoutCard
							variant="default"
							title="Bench Press Focus"
							block="Week 3"
							day="Day 3"
							exercises={[
								{
									name: "Competition Bench",
									weightUnit: "lb",
									ratingUnit: "RPE",
									topSet: {
										weight: 275,
										reps: 3,
										rating: 7,
									},
									backdowns: {
										weight: 255,
										sets: 3,
										reps: 5,
										rating: 6,
									},
								},
								{
									name: "Paused Bench",
								},
								{
									name: "Accessories",
								},
							]}
						/>
					</div>
				</div>

				<BlockProgressionCard
					className="mt-4"
					entries={[
						{
							label: "Squat e1RM",
							currentE1rm: 447,
							changePercent: 3.2,
							highlight: true,
						},
						{
							label: "Bench e1RM",
							currentE1rm: 315,
							changePercent: 1.6,
						},
						{
							label: "Deadlift e1RM",
							currentE1rm: 545,
							changePercent: 2.3,
						},
						{
							label: "Estimated Total",
							currentE1rm: 1307,
							changePercent: 2.4,
						},
					]}
				/>
			</section>

			<section className="app-section">
				<SectionLabel>Your current block</SectionLabel>

				<ProgramBlockCalendarCard
					className="app-section-body"
					title={currentBlockName}
					dateRange="May 19 - Jun 28"
					startDate="2026-05-19"
					endDate="2026-06-28"
					trainingDays={blockTrainingDays}
				/>
			</section>
		</PageContainer>
	);
}

function formatTrainingDate(value: string) {
	const [year, month, day] = value.split("-").map(Number);
	const date = new Date(year, month - 1, day);
	const monthName = new Intl.DateTimeFormat("en", {
		month: "long",
	}).format(date);

	return `${monthName} ${getOrdinalDay(day)} ${year}`;
}

function getOrdinalDay(day: number) {
	if (day >= 11 && day <= 13) {
		return `${day}th`;
	}

	switch (day % 10) {
		case 1:
			return `${day}st`;
		case 2:
			return `${day}nd`;
		case 3:
			return `${day}rd`;
		default:
			return `${day}th`;
	}
}

function SectionLabel({ children }: { children: string }) {
	return (
		<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{children}
		</p>
	);
}
