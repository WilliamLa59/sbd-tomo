import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	currentHistoryBlock,
	type HistoricalBlock,
	historicalBlocks,
	type Lift,
} from "@/data/history";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/history")({
	component: HistoryPage,
});

type SortOption = "newest" | "oldest";
type LiftFilter = "all" | Lift;

function HistoryPage() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [searchQuery, setSearchQuery] = useState("");
	const [sort, setSort] = useState<SortOption>("newest");
	const [liftFilter, setLiftFilter] = useState<LiftFilter>("all");

	const filteredBlocks = useMemo(() => {
		return [...historicalBlocks]
			.filter((block) =>
				block.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
			)
			.filter((block) =>
				liftFilter === "all"
					? true
					: block.lifts.some((lift) => lift.key === liftFilter),
			)
			.sort((a, b) => {
				const direction = sort === "newest" ? -1 : 1;
				return direction * a.startDate.localeCompare(b.startDate);
			});
	}, [searchQuery, sort, liftFilter]);

	if (pathname !== "/app/history") {
		return <Outlet />;
	}

	return (
		<PageContainer className="pt-5 md:pt-7">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-medium tracking-tight md:text-3xl">
						Training History
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Review completed blocks, sessions, and past performance.
					</p>
				</div>

				<p className="text-sm text-muted-foreground">
					<span className="font-mono text-foreground">
						{historicalBlocks.length}
					</span>{" "}
					completed blocks
				</p>
			</header>

			<div className="mt-6">
				<Link
					className="flex flex-col gap-2 border bg-muted/30 p-4 text-sm transition-colors hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
					to={currentHistoryBlock.to}
				>
					<span>
						<span className="text-muted-foreground">Current block:</span>{" "}
						<span className="font-medium">{currentHistoryBlock.title}</span>
					</span>
					<span className="inline-flex items-center gap-1 text-xs font-medium">
						View in Training
						<ArrowRight className="size-3.5" />
					</span>
				</Link>
			</div>

			<section className="app-section">
				<div className="grid gap-3 border bg-card p-3 sm:grid-cols-[minmax(220px,1fr)_auto_auto] sm:items-center">
					<div className="relative block min-w-0">
						<Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-3.5 text-muted-foreground" />
						<Input
							aria-label="Search blocks"
							className="pl-8"
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="Search blocks..."
							type="search"
							value={searchQuery}
						/>
					</div>

					<select
						aria-label="Sort blocks"
						className="h-8 border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
						onChange={(event) => setSort(event.target.value as SortOption)}
						value={sort}
					>
						<option value="newest">Newest</option>
						<option value="oldest">Oldest</option>
					</select>

					<div className="inline-flex w-fit border bg-background p-0.5">
						{liftFilters.map((filter) => (
							<button
								aria-pressed={liftFilter === filter.value}
								className={cn(
									"h-7 px-2.5 text-xs font-medium transition-colors hover:bg-muted",
									liftFilter === filter.value && "bg-muted text-foreground",
								)}
								key={filter.value}
								onClick={() => setLiftFilter(filter.value)}
								type="button"
							>
								{filter.label}
							</button>
						))}
					</div>
				</div>
			</section>

			<section className="app-section">
				{filteredBlocks.length > 0 ? (
					<div className="grid gap-4">
						{filteredBlocks.map((block) => (
							<HistoryBlockCard block={block} key={block.id} />
						))}
					</div>
				) : (
					<EmptyState />
				)}
			</section>
		</PageContainer>
	);
}

function HistoryBlockCard({ block }: { block: HistoricalBlock }) {
	return (
		<Card className="shadow-none">
			<CardContent className="p-4 sm:p-5">
				<div className="grid gap-5 xl:grid-cols-[minmax(180px,0.8fr)_minmax(360px,1.3fr)_minmax(220px,0.7fr)_auto] xl:items-center">
					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-2">
							<h2 className="truncate text-base font-medium tracking-tight">
								{block.title}
							</h2>
							<Badge variant="secondary">{block.status}</Badge>
						</div>
						<p className="mt-2 text-sm text-muted-foreground">
							{block.dateRange}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{block.weeks} weeks
						</p>
					</div>

					<div className="min-w-0 overflow-x-auto">
						<table className="w-full min-w-80 text-left text-xs">
							<thead className="text-muted-foreground">
								<tr className="border-b">
									<th className="pb-2 font-medium">Lift</th>
									<th className="pb-2 text-right font-medium">Start</th>
									<th className="pb-2 text-right font-medium">End</th>
									<th className="pb-2 text-right font-medium">Change</th>
								</tr>
							</thead>
							<tbody>
								{block.lifts.map((lift) => {
									const change = getPercentChange(lift.endE1rm, lift.startE1rm);

									return (
										<tr className="border-b last:border-b-0" key={lift.key}>
											<td className="py-2 font-medium">{lift.lift}</td>
											<td className="py-2 text-right font-mono">
												{lift.startE1rm}
											</td>
											<td className="py-2 text-right font-mono">
												{lift.endE1rm}
											</td>
											<td
												className={cn(
													"py-2 text-right font-mono",
													change > 0 && "text-success",
													change < 0 && "text-destructive",
												)}
											>
												{formatPercent(change)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="grid gap-3 text-xs sm:grid-cols-3 xl:block xl:space-y-3">
						<ArchiveStat
							label="Total volume"
							value={`${formatNumber(block.totalVolume)} lb`}
						/>
						<ArchiveStat
							label="Sessions"
							value={`${block.completedSessions} / ${block.totalSessions}`}
						/>
						<ArchiveStat label="Adherence" value={`${block.adherence}%`} />
					</div>

					<Link
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"w-full xl:w-auto",
						)}
						params={{ blockId: block.id }}
						to="/app/history/$blockId"
					>
						View Block
						<ArrowRight className="size-3.5" />
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}

function ArchiveStat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<p className="text-muted-foreground">{label}</p>
			<p className="mt-1 font-mono text-sm font-medium">{value}</p>
		</div>
	);
}

function EmptyState() {
	return (
		<Card className="shadow-none">
			<CardContent className="p-8 text-center">
				<h2 className="text-lg font-medium tracking-tight">
					No completed blocks yet
				</h2>
				<p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
					Completed training blocks will appear here once you finish your first
					block.
				</p>
				<Link
					className={cn(
						buttonVariants({ variant: "outline", size: "sm" }),
						"mt-5",
					)}
					to="/app/training"
				>
					View Current Training
				</Link>
			</CardContent>
		</Card>
	);
}

const liftFilters: Array<{ label: string; value: LiftFilter }> = [
	{ label: "All", value: "all" },
	{ label: "Squat", value: "squat" },
	{ label: "Bench", value: "bench" },
	{ label: "Deadlift", value: "deadlift" },
];

function getPercentChange(end: number, start: number) {
	return Number((((end - start) / start) * 100).toFixed(1));
}

function formatPercent(value: number) {
	return value > 0 ? `+${value}%` : `${value}%`;
}

function formatNumber(value: number) {
	return value.toLocaleString("en-US");
}
