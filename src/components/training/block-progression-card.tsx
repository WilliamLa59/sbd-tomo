import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BlockProgressionCardProps = {
	className?: string;
	entries: BlockProgressionEntry[];
};

export function BlockProgressionCard({
	className,
	entries,
}: BlockProgressionCardProps) {
	return (
		<Card className={cn("shadow-none", className)}>
			<CardContent className="p-4 sm:p-5">
				<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
					Block Progression
				</p>

				<div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
					{entries.map((entry) => (
						<ProgressionMetric key={entry.label} entry={entry} />
					))}
				</div>
			</CardContent>
		</Card>
	);
}

type BlockProgressionEntry = {
	changePercent: number;
	currentE1rm: number;
	highlight?: boolean;
	label: string;
	unit?: string;
};

function ProgressionMetric({ entry }: { entry: BlockProgressionEntry }) {
	const isPositive = entry.changePercent >= 0;
	const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

	return (
		<div
			className={cn(
				"min-w-0 border px-3 py-3",
				entry.highlight
					? "border-brand/40 bg-brand-subtle"
					: "border-border bg-background",
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<p
					className={cn(
						"text-xs font-medium uppercase tracking-[0.12em]",
						entry.highlight ? "text-brand" : "text-muted-foreground",
					)}
				>
					{entry.label}
				</p>

				<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
					<TrendingUp className="size-4" />
				</div>
			</div>

			<div className="mt-3 flex items-end gap-1.5">
				<span className="font-mono text-xl font-medium tracking-[-0.05em]">
					{entry.currentE1rm}
				</span>

				<span className="mb-0.5 font-mono text-xs text-muted-foreground">
					{entry.unit ?? "lb"}
				</span>
			</div>

			<div
				className={cn(
					"mt-2 flex items-center gap-1 text-xs font-medium",
					isPositive ? "text-success" : "text-destructive",
				)}
			>
				<ChangeIcon className="size-3.5" />
				{isPositive ? "+" : ""}
				{entry.changePercent}% from start
			</div>
		</div>
	);
}
