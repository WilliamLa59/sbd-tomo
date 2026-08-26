import { Check, Circle, Dumbbell, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrainingDayStatus = "completed" | "current" | "planned";

type TrainingDay = {
	date: string;
	label: string;
	focus: string;
	status: TrainingDayStatus;
};

type ProgramBlockCalendarCardProps = {
	title: string;
	dateRange: string;
	startDate: string;
	endDate: string;
	trainingDays: readonly TrainingDay[];
	className?: string;
};

const weekdays = [
	{ key: "sun", label: "S" },
	{ key: "mon", label: "M" },
	{ key: "tue", label: "T" },
	{ key: "wed", label: "W" },
	{ key: "thu", label: "T" },
	{ key: "fri", label: "F" },
	{ key: "sat", label: "S" },
];

const visibleWeekRows = 4;
const calendarRowHeightRem = 5.75;
const previewRowHeightRem = 2.75;

export function ProgramBlockCalendarCard({
	title,
	dateRange,
	startDate,
	endDate,
	trainingDays,
	className,
}: ProgramBlockCalendarCardProps) {
	const start = parseDate(startDate);
	const end = parseDate(endDate);

	const trainingDayMap = new Map(trainingDays.map((day) => [day.date, day]));

	const activeDate = trainingDays.find((day) => day.status === "current")?.date;

	const weeks = getBlockWeeks(start, end);

	const rowOffset = getWeekOffset(
		weeks,
		activeDate ? parseDate(activeDate) : undefined,
	);

	return (
		<Card className={cn("shadow-none", className)}>
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Program block
						</p>

						<h2 className="mt-2 text-base font-medium tracking-tight">
							{title}
						</h2>

						<p className="mt-2 text-sm text-muted-foreground">{dateRange}</p>
					</div>

					<Badge variant="secondary">
						{getProgramWeekCount(start, end)} weeks
					</Badge>
				</div>

				<div className="mt-6">
					<CalendarGrid
						weeks={weeks}
						initialWeekOffset={rowOffset}
						blockStart={start}
						blockEnd={end}
						trainingDayMap={trainingDayMap}
					/>
				</div>

				<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
					<LegendItem
						icon={<Check className="size-3.5 text-success" />}
						label="Completed"
					/>

					<LegendItem
						icon={<Timer className="size-3.5 text-brand" />}
						label="Today"
					/>

					<LegendItem
						icon={<Dumbbell className="size-3.5 text-muted-foreground" />}
						label="Planned"
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function CalendarGrid({
	weeks,
	initialWeekOffset,
	blockStart,
	blockEnd,
	trainingDayMap,
}: {
	weeks: Date[][];
	initialWeekOffset: number;
	blockStart: Date;
	blockEnd: Date;
	trainingDayMap: Map<string, TrainingDay>;
}) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;

		if (!scrollContainer) {
			return;
		}

		const rowHeight = scrollContainer.scrollHeight / weeks.length;
		scrollContainer.scrollTop = initialWeekOffset * rowHeight;
	}, [initialWeekOffset, weeks.length]);

	return (
		<div>
			<CalendarRangeHeader weeks={weeks.slice(0, visibleWeekRows)} />

			<div className="grid grid-cols-7 border-l border-t">
				{weekdays.map((day) => (
					<div
						key={day.key}
						className="flex h-7 items-center justify-center border-b border-r text-[0.68rem] font-medium text-muted-foreground"
					>
						{day.label}
					</div>
				))}
			</div>

			<div
				ref={scrollContainerRef}
				className="relative overflow-y-auto border-l"
				style={{
					height: `${visibleWeekRows * calendarRowHeightRem + previewRowHeightRem}rem`,
					maskImage:
						"linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
				}}
			>
				{weeks.map((week) => (
					<div key={toIsoDate(week[0])} className="grid grid-cols-7">
						{week.map((date) => {
							const isoDate = toIsoDate(date);
							const trainingDay = trainingDayMap.get(isoDate);

							const isInBlock = date >= blockStart && date <= blockEnd;

							return (
								<CalendarCell
									key={isoDate}
									date={date}
									isInBlock={isInBlock}
									trainingDay={trainingDay}
								/>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}
function CalendarRangeHeader({ weeks }: { weeks: Date[][] }) {
	if (!weeks.length) return null;

	const firstDate = weeks[0][0];
	const lastWeek = weeks[weeks.length - 1];
	const lastDate = lastWeek[lastWeek.length - 1];

	const sameMonth =
		firstDate.getMonth() === lastDate.getMonth() &&
		firstDate.getFullYear() === lastDate.getFullYear();

	return (
		<div className="mb-3 flex items-center justify-between">
			<h3 className="text-sm font-medium">
				{sameMonth
					? formatMonth(firstDate)
					: `${formatMonth(firstDate)} – ${formatMonth(lastDate)}`}
			</h3>

			<span className="font-mono text-xs text-muted-foreground">
				{lastDate.getFullYear()}
			</span>
		</div>
	);
}

function CalendarCell({
	date,
	isInBlock,
	trainingDay,
}: {
	date: Date;
	isInBlock: boolean;
	trainingDay?: TrainingDay;
}) {
	return (
		<div
			className={cn(
				"relative flex h-23 flex-col border-b border-r p-2",
				isInBlock
					? "bg-brand-subtle/45"
					: "bg-muted/20 text-muted-foreground/40",
				trainingDay && "bg-background",
				trainingDay?.status === "current" && "ring-1 ring-inset ring-brand",
			)}
		>
			<div className="flex items-center justify-between gap-1">
				<div className="flex min-w-0 items-center gap-1">
					<span
						className={cn(
							"font-mono text-[0.68rem]",
							isInBlock ? "text-foreground" : "text-muted-foreground/40",
						)}
					>
						{date.getDate()}
					</span>

					{date.getDate() === 1 && (
						<span className="truncate text-[0.58rem] font-medium uppercase text-muted-foreground">
							{formatShortMonth(date)}
						</span>
					)}
				</div>

				{trainingDay && <TrainingDayIcon status={trainingDay.status} />}
			</div>

			{trainingDay && (
				<div className="mt-auto min-w-0">
					<p className="truncate text-[0.65rem] font-medium">
						{trainingDay.label}
					</p>

					<p className="truncate text-[0.62rem] text-muted-foreground">
						{trainingDay.focus}
					</p>
				</div>
			)}
		</div>
	);
}

function TrainingDayIcon({ status }: { status: TrainingDayStatus }) {
	if (status === "completed") {
		return <Check className="size-3.5 text-success" />;
	}

	if (status === "current") {
		return <Timer className="size-3.5 text-brand" />;
	}

	return <Circle className="size-3 fill-muted text-muted-foreground" />;
}

function LegendItem({ icon, label }: { icon: ReactNode; label: string }) {
	return (
		<span className="inline-flex items-center gap-1.5">
			{icon}
			{label}
		</span>
	);
}

function getBlockWeeks(startDate: Date, endDate: Date) {
	const firstWeekStart = startOfWeek(startDate);
	const lastWeekEnd = endOfWeek(endDate);

	const weeks: Date[][] = [];

	let cursor = new Date(firstWeekStart);

	while (cursor <= lastWeekEnd) {
		const week = Array.from({ length: 7 }, (_, index) => {
			const date = new Date(cursor);
			date.setDate(cursor.getDate() + index);
			return date;
		});

		weeks.push(week);

		cursor = new Date(cursor);
		cursor.setDate(cursor.getDate() + 7);
	}

	return weeks;
}

function getWeekOffset(weeks: Date[][], activeDate?: Date) {
	if (!activeDate) {
		return 0;
	}

	const activeWeekIndex = weeks.findIndex((week) =>
		week.some((date) => sameDay(date, activeDate)),
	);

	if (activeWeekIndex === -1) {
		return 0;
	}

	const maxOffset = Math.max(weeks.length - visibleWeekRows, 0);

	/*
	 * Keep the current week as the second visible row
	 * whenever possible.
	 *
	 * week 1 current:
	 * [1, 2, 3, 4]
	 *
	 * week 2 current:
	 * [1, 2, 3, 4]
	 *
	 * week 3 current:
	 * [2, 3, 4, 5]
	 *
	 * week 4 current:
	 * [3, 4, 5, 6]
	 */
	return Math.min(Math.max(activeWeekIndex - 1, 0), maxOffset);
}

function startOfWeek(date: Date) {
	const result = new Date(date);
	result.setDate(date.getDate() - date.getDay());
	result.setHours(0, 0, 0, 0);

	return result;
}

function endOfWeek(date: Date) {
	const result = startOfWeek(date);
	result.setDate(result.getDate() + 6);

	return result;
}

function getProgramWeekCount(startDate: Date, endDate: Date) {
	const millisecondsPerDay = 1000 * 60 * 60 * 24;

	const days =
		Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay) +
		1;

	return Math.ceil(days / 7);
}

function parseDate(value: string) {
	const [year, month, day] = value.split("-").map(Number);

	return new Date(year, month - 1, day);
}

function toIsoDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function sameDay(date: Date, otherDate: Date) {
	return (
		date.getFullYear() === otherDate.getFullYear() &&
		date.getMonth() === otherDate.getMonth() &&
		date.getDate() === otherDate.getDate()
	);
}

function formatMonth(date: Date) {
	return new Intl.DateTimeFormat("en", {
		month: "long",
	}).format(date);
}

function formatShortMonth(date: Date) {
	return new Intl.DateTimeFormat("en", {
		month: "short",
	}).format(date);
}
