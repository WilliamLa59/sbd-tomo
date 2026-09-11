import type { TrainingDay } from "@/components/training/training-day-card";
import type { WeekSummaryDeltaMap } from "@/components/training/week-summary-card";

export type Lift = "squat" | "bench" | "deadlift";

export type LiftProgression = {
	lift: "Squat" | "Bench" | "Deadlift";
	key: Lift;
	startE1rm: number;
	endE1rm: number;
};

export type LiftBlockAnalysis = LiftProgression & {
	peakE1rm: number;
	peakWeek: string;
	bestPerformance: string;
	totalWorkSets: number;
};

export type BlockAdjustment = {
	week: number;
	description: string;
};

export type StrengthProgressionPoint = {
	week: string;
	squat: number;
	bench: number;
	deadlift: number;
};

export type WeeklyVolumePoint = {
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

export type HistoricalWeekSummary = {
	week: number;
	status: string;
	completedSessions: number;
	totalSessions: number;
	totalVolume: string;
	squatVolume: string;
	benchVolume: string;
	deadliftVolume: string;
	averageRpe: string;
	e1rmChange: string;
	adherence: string;
	deltas?: WeekSummaryDeltaMap;
};

export type HistoricalBlock = {
	id: string;
	title: string;
	dateRange: string;
	startDate: string;
	weeks: number;
	totalVolume: number;
	completedSessions: number;
	totalSessions: number;
	lifts: readonly LiftProgression[];
	liftAnalysis: readonly LiftBlockAnalysis[];
	intent?: string;
	endingNotes?: string;
	programAdjustments?: readonly BlockAdjustment[];
	strengthProgression: readonly StrengthProgressionPoint[];
	weeklyVolume: readonly WeeklyVolumePoint[];
	weekSummaries: Record<number, HistoricalWeekSummary>;
	trainingDaysByWeek: Record<number, readonly TrainingDay[]>;
	notes?: string;
};

export const currentHistoryBlock = {
	title: "Block 13 - Volume / Strength",
	to: "/app/training",
} as const;

export const historicalBlocks: readonly HistoricalBlock[] = [
	{
		id: "block-12",
		title: "Block 12 - Volume + Singles",
		dateRange: "Jun 29 - Aug 7",
		startDate: "2026-06-29",
		weeks: 6,
		totalVolume: 184_200,
		completedSessions: 27,
		totalSessions: 30,
		intent:
			"Build work capacity across the big 3 while maintaining regular exposure to heavy singles.",
		lifts: [
			{ lift: "Squat", key: "squat", startE1rm: 438, endE1rm: 465 },
			{ lift: "Bench", key: "bench", startE1rm: 300, endE1rm: 315 },
			{ lift: "Deadlift", key: "deadlift", startE1rm: 455, endE1rm: 480 },
		],
		liftAnalysis: [
			liftAnalysis(
				"Squat",
				"squat",
				438,
				468,
				465,
				"Week 5",
				"455 x 2 @ 8",
				42,
			),
			liftAnalysis(
				"Bench",
				"bench",
				300,
				318,
				315,
				"Week 5",
				"315 x 1 @ 8",
				64,
			),
			liftAnalysis(
				"Deadlift",
				"deadlift",
				455,
				485,
				480,
				"Week 5",
				"475 x 2 @ 7",
				36,
			),
		],
		programAdjustments: [
			{ week: 5, description: "Bench volume reduced" },
			{ week: 6, description: "Deadlift backdowns removed" },
		],
		strengthProgression: [
			{ week: "Week 1", squat: 438, bench: 300, deadlift: 455 },
			{ week: "Week 2", squat: 445, bench: 304, deadlift: 462 },
			{ week: "Week 3", squat: 452, bench: 307, deadlift: 468 },
			{ week: "Week 4", squat: 456, bench: 310, deadlift: 472 },
			{ week: "Week 5", squat: 468, bench: 318, deadlift: 485 },
			{ week: "Week 6", squat: 465, bench: 315, deadlift: 480 },
		],
		weeklyVolume: [
			weekVolume("Week 1", 10_800, 9_600, 8_700, 39, 17, 10, 142, 62, 35),
			weekVolume("Week 2", 11_400, 10_100, 9_200, 41, 18, 11, 148, 65, 38),
			weekVolume("Week 3", 11_900, 10_400, 9_600, 42, 18, 11, 151, 66, 39),
			weekVolume("Week 4", 12_600, 10_800, 9_900, 43, 19, 11, 154, 68, 40),
			weekVolume("Week 5", 10_900, 8_700, 8_200, 36, 15, 9, 126, 54, 31),
			weekVolume("Week 6", 11_600, 10_500, 9_600, 40, 18, 10, 139, 63, 34),
		],
		weekSummaries: {
			1: weekSummary(
				1,
				5,
				5,
				29_100,
				10_800,
				9_600,
				8_700,
				"7.0",
				"+1.8%",
				"100%",
			),
			2: weekSummary(
				2,
				5,
				5,
				30_700,
				11_400,
				10_100,
				9_200,
				"7.2",
				"+3.1%",
				"96%",
				"+5.5%",
			),
			3: weekSummary(
				3,
				4,
				5,
				31_900,
				11_900,
				10_400,
				9_600,
				"7.3",
				"+4.2%",
				"92%",
				"+3.9%",
			),
			4: weekSummary(
				4,
				5,
				5,
				33_300,
				12_600,
				10_800,
				9_900,
				"7.4",
				"+4.9%",
				"96%",
				"+4.4%",
			),
			5: weekSummary(
				5,
				4,
				5,
				27_800,
				10_900,
				8_700,
				8_200,
				"7.1",
				"+5.4%",
				"88%",
				"-16.5%",
				"negative",
			),
			6: weekSummary(
				6,
				4,
				5,
				31_700,
				11_600,
				10_500,
				9_600,
				"7.6",
				"+5.9%",
				"92%",
				"+14.0%",
			),
		},
		trainingDaysByWeek: makeTrainingDays("b12", "Volume + Singles"),
		endingNotes:
			"Deadlift positioning improved significantly after Week 3. Bench volume was reduced in Week 5 due to fatigue.",
		notes:
			"Deadlift positioning improved significantly after Week 3. Bench volume was reduced in Week 5 due to fatigue.",
	},
	{
		id: "block-11",
		title: "Block 11 - Strength",
		dateRange: "May 18 - Jun 26",
		startDate: "2026-05-18",
		weeks: 6,
		totalVolume: 161_850,
		completedSessions: 28,
		totalSessions: 30,
		intent:
			"Increase heavy single consistency while keeping enough backdown work to hold weekly skill practice.",
		lifts: [
			{ lift: "Squat", key: "squat", startE1rm: 422, endE1rm: 438 },
			{ lift: "Bench", key: "bench", startE1rm: 292, endE1rm: 300 },
			{ lift: "Deadlift", key: "deadlift", startE1rm: 444, endE1rm: 455 },
		],
		liftAnalysis: [
			liftAnalysis(
				"Squat",
				"squat",
				422,
				441,
				438,
				"Week 5",
				"435 x 2 @ 8",
				38,
			),
			liftAnalysis(
				"Bench",
				"bench",
				292,
				302,
				300,
				"Week 5",
				"295 x 2 @ 8",
				58,
			),
			liftAnalysis(
				"Deadlift",
				"deadlift",
				444,
				458,
				455,
				"Week 5",
				"450 x 2 @ 7",
				32,
			),
		],
		strengthProgression: [
			{ week: "Week 1", squat: 422, bench: 292, deadlift: 444 },
			{ week: "Week 2", squat: 426, bench: 294, deadlift: 447 },
			{ week: "Week 3", squat: 430, bench: 296, deadlift: 450 },
			{ week: "Week 4", squat: 434, bench: 298, deadlift: 452 },
			{ week: "Week 5", squat: 441, bench: 302, deadlift: 458 },
			{ week: "Week 6", squat: 438, bench: 300, deadlift: 455 },
		],
		weeklyVolume: [
			weekVolume("Week 1", 9_700, 8_800, 7_500, 34, 16, 9, 118, 57, 29),
			weekVolume("Week 2", 10_100, 9_100, 7_800, 35, 16, 9, 121, 58, 30),
			weekVolume("Week 3", 10_400, 9_300, 8_000, 36, 17, 9, 124, 60, 31),
			weekVolume("Week 4", 10_800, 9_500, 8_300, 37, 17, 10, 126, 61, 32),
			weekVolume("Week 5", 9_600, 8_700, 7_600, 31, 15, 8, 105, 52, 26),
			weekVolume("Week 6", 8_900, 8_250, 7_700, 29, 14, 8, 96, 49, 25),
		],
		weekSummaries: {
			1: weekSummary(
				1,
				5,
				5,
				26_000,
				9_700,
				8_800,
				7_500,
				"7.2",
				"+1.1%",
				"100%",
			),
			2: weekSummary(
				2,
				5,
				5,
				27_000,
				10_100,
				9_100,
				7_800,
				"7.4",
				"+2.0%",
				"96%",
				"+3.8%",
			),
			3: weekSummary(
				3,
				5,
				5,
				27_700,
				10_400,
				9_300,
				8_000,
				"7.6",
				"+2.8%",
				"96%",
				"+2.6%",
			),
			4: weekSummary(
				4,
				5,
				5,
				28_600,
				10_800,
				9_500,
				8_300,
				"7.7",
				"+3.5%",
				"96%",
				"+3.2%",
			),
			5: weekSummary(
				5,
				4,
				5,
				25_900,
				9_600,
				8_700,
				7_600,
				"7.5",
				"+3.8%",
				"92%",
				"-9.4%",
				"negative",
			),
			6: weekSummary(
				6,
				4,
				5,
				24_850,
				8_900,
				8_250,
				7_700,
				"7.8",
				"+4.0%",
				"96%",
				"-4.1%",
				"negative",
			),
		},
		trainingDaysByWeek: makeTrainingDays("b11", "Strength"),
		endingNotes:
			"Heavy singles stayed consistent. Squat confidence improved while deadlift volume stayed intentionally conservative.",
		notes:
			"Heavy singles stayed consistent. Squat confidence improved while deadlift volume stayed intentionally conservative.",
	},
	{
		id: "block-10",
		title: "Block 10 - Hypertrophy",
		dateRange: "Apr 6 - May 8",
		startDate: "2026-04-06",
		weeks: 5,
		totalVolume: 176_400,
		completedSessions: 24,
		totalSessions: 25,
		intent:
			"Accumulate submaximal hypertrophy work across squat, bench, and deadlift variations.",
		lifts: [
			{ lift: "Squat", key: "squat", startE1rm: 415, endE1rm: 422 },
			{ lift: "Bench", key: "bench", startE1rm: 286, endE1rm: 292 },
			{ lift: "Deadlift", key: "deadlift", startE1rm: 438, endE1rm: 444 },
		],
		liftAnalysis: [
			liftAnalysis(
				"Squat",
				"squat",
				415,
				424,
				422,
				"Week 4",
				"395 x 5 @ 8",
				50,
			),
			liftAnalysis(
				"Bench",
				"bench",
				286,
				293,
				292,
				"Week 4",
				"275 x 5 @ 8",
				76,
			),
			liftAnalysis(
				"Deadlift",
				"deadlift",
				438,
				445,
				444,
				"Week 4",
				"425 x 4 @ 7",
				40,
			),
		],
		strengthProgression: [
			{ week: "Week 1", squat: 415, bench: 286, deadlift: 438 },
			{ week: "Week 2", squat: 417, bench: 288, deadlift: 439 },
			{ week: "Week 3", squat: 419, bench: 289, deadlift: 441 },
			{ week: "Week 4", squat: 424, bench: 293, deadlift: 445 },
			{ week: "Week 5", squat: 422, bench: 292, deadlift: 444 },
		],
		weeklyVolume: [
			weekVolume("Week 1", 12_200, 11_400, 10_100, 45, 21, 12, 178, 82, 45),
			weekVolume("Week 2", 12_900, 11_900, 10_600, 47, 22, 12, 186, 86, 47),
			weekVolume("Week 3", 13_600, 12_500, 11_000, 49, 23, 13, 192, 89, 49),
			weekVolume("Week 4", 14_100, 12_700, 11_400, 50, 23, 13, 198, 91, 50),
			weekVolume("Week 5", 11_900, 10_800, 9_300, 41, 19, 10, 160, 74, 38),
		],
		weekSummaries: {
			1: weekSummary(
				1,
				5,
				5,
				33_700,
				12_200,
				11_400,
				10_100,
				"6.8",
				"+0.8%",
				"100%",
			),
			2: weekSummary(
				2,
				5,
				5,
				35_400,
				12_900,
				11_900,
				10_600,
				"7.0",
				"+1.4%",
				"96%",
				"+5.0%",
			),
			3: weekSummary(
				3,
				5,
				5,
				37_100,
				13_600,
				12_500,
				11_000,
				"7.1",
				"+2.0%",
				"96%",
				"+4.8%",
			),
			4: weekSummary(
				4,
				5,
				5,
				38_200,
				14_100,
				12_700,
				11_400,
				"7.3",
				"+2.5%",
				"96%",
				"+3.0%",
			),
			5: weekSummary(
				5,
				4,
				5,
				32_000,
				11_900,
				10_800,
				9_300,
				"7.0",
				"+2.9%",
				"88%",
				"-16.2%",
				"negative",
			),
		},
		trainingDaysByWeek: makeTrainingDays("b10", "Hypertrophy", 5),
	},
];

export function getHistoricalBlock(blockId: string) {
	return historicalBlocks.find((block) => block.id === blockId);
}

function liftAnalysis(
	lift: LiftBlockAnalysis["lift"],
	key: Lift,
	startE1rm: number,
	peakE1rm: number,
	endE1rm: number,
	peakWeek: string,
	bestPerformance: string,
	totalWorkSets: number,
): LiftBlockAnalysis {
	return {
		lift,
		key,
		startE1rm,
		peakE1rm,
		endE1rm,
		peakWeek,
		bestPerformance,
		totalWorkSets,
	};
}

function weekVolume(
	week: string,
	squatTonnage: number,
	benchTonnage: number,
	deadliftTonnage: number,
	squatSets: number,
	benchSets: number,
	deadliftSets: number,
	squatReps: number,
	benchReps: number,
	deadliftReps: number,
): WeeklyVolumePoint {
	return {
		week,
		tonnage: {
			squat: squatTonnage,
			bench: benchTonnage,
			deadlift: deadliftTonnage,
			total: squatTonnage + benchTonnage + deadliftTonnage,
		},
		sets: {
			squat: squatSets,
			bench: benchSets,
			deadlift: deadliftSets,
			total: squatSets + benchSets + deadliftSets,
		},
		reps: {
			squat: squatReps,
			bench: benchReps,
			deadlift: deadliftReps,
			total: squatReps + benchReps + deadliftReps,
		},
	};
}

function weekSummary(
	week: number,
	completedSessions: number,
	totalSessions: number,
	totalVolume: number,
	squatVolume: number,
	benchVolume: number,
	deadliftVolume: number,
	averageRpe: string,
	e1rmChange: string,
	adherence: string,
	totalVolumeDelta?: string,
	totalVolumeDirection: "positive" | "negative" | "neutral" = "positive",
): HistoricalWeekSummary {
	return {
		week,
		status: "Completed",
		completedSessions,
		totalSessions,
		totalVolume: formatNumber(totalVolume),
		squatVolume: formatNumber(squatVolume),
		benchVolume: formatNumber(benchVolume),
		deadliftVolume: formatNumber(deadliftVolume),
		averageRpe,
		e1rmChange,
		adherence,
		deltas: totalVolumeDelta
			? {
					totalVolume: {
						value: totalVolumeDelta,
						direction: totalVolumeDirection,
						compareWeek: week - 1,
					},
					e1rmChange: {
						value: "+0.6 pct",
						direction: "positive",
						compareWeek: week - 1,
					},
				}
			: undefined,
	};
}

function makeTrainingDays(
	idPrefix: string,
	blockType: string,
	weeks = 6,
): Record<number, readonly TrainingDay[]> {
	return Object.fromEntries(
		Array.from({ length: weeks }, (_, index) => {
			const week = index + 1;

			return [
				week,
				[
					session(
						idPrefix,
						week,
						1,
						"Monday",
						`${blockType} Squat`,
						"Squat",
						"425 lb x 3 @ 7",
						"365 lb - 4 x 4 @ 6",
						"7.1",
					),
					session(
						idPrefix,
						week,
						2,
						"Tuesday",
						`${blockType} Bench`,
						"Bench",
						"285 lb x 4 @ 7",
						"245 lb - 4 x 5 @ 6",
						"7.0",
					),
					session(
						idPrefix,
						week,
						3,
						"Wednesday",
						"Secondary Pull",
						"Deadlift",
						"405 lb x 4 @ 7",
						"355 lb - 3 x 5 @ 6",
						"7.2",
					),
					session(
						idPrefix,
						week,
						4,
						"Thursday",
						"Bench Volume",
						"Bench",
						"255 lb - 4 x 6 @ 7",
						"Rows + triceps",
						"6.9",
					),
					week === weeks
						? {
								id: `${idPrefix}-w${week}-d5`,
								day: "Friday",
								title: "Fatigue-managed accessories",
								primaryLift: "SBD",
								status: "skipped",
								planned: "Light SBD technique",
								actual: "Skipped",
								note: "Skipped to manage fatigue before the next block.",
							}
						: session(
								idPrefix,
								week,
								5,
								"Friday",
								`${blockType} SBD`,
								"SBD",
								"Top single @ 7",
								"Backdowns by feel",
								"7.4",
							),
				],
			];
		}),
	);
}

function session(
	idPrefix: string,
	week: number,
	dayNumber: number,
	day: string,
	title: string,
	primaryLift: string,
	topSet: string,
	backdowns: string,
	rpe: string,
): TrainingDay {
	const baseDay: TrainingDay = {
		id: `${idPrefix}-w${week}-d${dayNumber}`,
		day,
		title,
		primaryLift,
		topSet,
		backdowns,
		planned: topSet.replace(" lb", ""),
		actual: topSet.replace(" lb", ""),
		rpe,
		status: "completed",
		note:
			dayNumber === 1
				? "Kept technique consistent and matched the planned loading."
				: undefined,
	};

	const prTopSet = getPrTopSet(idPrefix, week, dayNumber);
	if (prTopSet) {
		return {
			...baseDay,
			topSet: prTopSet,
			planned: prTopSet.replace(" lb", ""),
			actual: prTopSet.replace(" lb", ""),
			rpe: prTopSet.split("@ ")[1] ?? rpe,
			note: "New rep max recorded during the block.",
		};
	}

	if (idPrefix === "b12" && week === 3 && dayNumber === 4) {
		return {
			...baseDay,
			status: "partial",
			actual: "Top work completed; backdowns reduced",
			note: "Completed top work but cut backdown volume short.",
		};
	}

	if (
		(idPrefix === "b12" && week === 5 && dayNumber === 2) ||
		(idPrefix === "b11" && week === 5 && dayNumber === 3)
	) {
		return {
			...baseDay,
			status: "skipped",
			actual: "Skipped",
			note: "Skipped session.",
		};
	}

	return baseDay;
}

function getPrTopSet(
	idPrefix: string,
	week: number,
	dayNumber: number,
): string | undefined {
	const key = `${idPrefix}-w${week}-d${dayNumber}`;
	const prTopSets: Record<string, string> = {
		"b12-w5-d1": "455 lb x 2 @ 8",
		"b12-w5-d3": "475 lb x 2 @ 7",
		"b12-w6-d2": "315 lb x 1 @ 8",
		"b11-w5-d1": "435 lb x 2 @ 8",
		"b11-w5-d2": "295 lb x 2 @ 8",
		"b10-w4-d1": "395 lb x 5 @ 8",
	};

	return prTopSets[key];
}

function formatNumber(value: number) {
	return value.toLocaleString("en-US");
}
