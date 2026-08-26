// src/components/analytics/metric-card.tsx

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
	label: string;
	value: string;
	unit?: string;
	change?: number;
	detail?: string;
	stats?: readonly {
		label: string;
		value: string;
	}[];
	icon?: ReactNode;
	className?: string;
};

export function MetricCard({
	label,
	value,
	unit,
	change,
	detail,
	stats,
	icon,
	className,
}: MetricCardProps) {
	const hasChange = typeof change === "number";
	const isPositive = hasChange && change >= 0;

	return (
		<Card className={cn("shadow-none", className)}>
			<CardContent className="flex h-full flex-col p-5">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							{label}
						</p>

						<div className="mt-4 flex items-end gap-2">
							<span className="font-mono text-3xl font-medium tracking-[-0.05em] md:text-4xl">
								{value}
							</span>

							{unit && (
								<span className="mb-1 font-mono text-xs text-muted-foreground">
									{unit}
								</span>
							)}
						</div>
					</div>

					{icon && (
						<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
							{icon}
						</div>
					)}
				</div>

				{(hasChange || detail) && (
					<div className="mt-4 flex items-center gap-2 text-xs">
						{hasChange && (
							<span
								className={cn(
									"inline-flex items-center gap-1 font-medium",
									isPositive ? "text-success" : "text-destructive",
								)}
							>
								{isPositive ? (
									<ArrowUpRight className="size-3.5" />
								) : (
									<ArrowDownRight className="size-3.5" />
								)}
								{Math.abs(change).toFixed(1)}%
							</span>
						)}

						{detail && <span className="text-muted-foreground">{detail}</span>}
					</div>
				)}

				{!!stats?.length && (
					<div className="mt-auto grid gap-3 border-t pt-5">
						{stats.map((stat) => (
							<div
								key={stat.label}
								className="flex items-center justify-between gap-3 text-xs"
							>
								<span className="text-muted-foreground">{stat.label}</span>

								<span className="font-mono font-medium">{stat.value}</span>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
