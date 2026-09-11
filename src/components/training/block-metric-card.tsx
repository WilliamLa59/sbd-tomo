import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BlockMetricCardProps = {
	label: string;
	value: string | null;
	unit?: string;
	change?: number;
	detail?: string;
	icon?: LucideIcon;
	valueClassName?: string;
};

export function BlockMetricCard({
	label,
	value,
	unit,
	change,
	detail,
	icon: Icon,
	valueClassName,
}: BlockMetricCardProps) {
	return (
		<Card className="shadow-none">
			<CardContent className="p-5">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							{label}
						</p>

						<div className="mt-4 flex items-end gap-2">
							<span
								className={cn(
									"font-mono text-2xl font-medium tracking-[-0.05em] md:text-3xl",
									valueClassName,
								)}
							>
								{value ?? "-"}
							</span>

							{value && unit && (
								<span className="mb-1 font-mono text-xs text-muted-foreground">
									{unit}
								</span>
							)}
						</div>
					</div>

					{Icon && (
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
							<Icon className="size-4" />
						</div>
					)}
				</div>

				{(typeof change === "number" || detail) && (
					<div className="mt-4 flex items-center gap-2 text-xs">
						{typeof change === "number" && (
							<span className="inline-flex items-center gap-1 font-medium text-success">
								<ArrowUpRight className="size-3.5" />
								{change.toFixed(1)}%
							</span>
						)}

						{detail && <span className="text-muted-foreground">{detail}</span>}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
