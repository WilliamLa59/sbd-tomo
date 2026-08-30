import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CurrentBlockHeaderProps = {
	title: string;
	currentWeek: number;
	totalWeeks: number;
	dateRange: string;
};

export function CurrentBlockHeader({
	title,
	currentWeek,
	totalWeeks,
	dateRange,
}: CurrentBlockHeaderProps) {
	const progressPercent = Math.min(
		100,
		Math.max(0, (currentWeek / totalWeeks) * 100),
	);

	return (
		<Card className="shadow-none">
			<CardContent className="p-5 sm:p-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="min-w-0">
						<h1 className="text-2xl font-medium tracking-tight md:text-3xl">
							{title}
						</h1>
						<p className="mt-2 text-sm text-muted-foreground">
							Week {currentWeek} of {totalWeeks}
						</p>
						<p className="mt-1 text-sm text-muted-foreground">{dateRange}</p>
					</div>

					<div className="w-full sm:w-72">
						<div className="flex items-center justify-between gap-3 text-xs">
							<span className="text-muted-foreground">Block progress</span>
							<span className="font-mono font-medium">
								{Math.round(progressPercent)}%
							</span>
						</div>

						<div className="mt-2 h-2 overflow-hidden bg-muted">
							<div
								className="h-full bg-brand"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>

						<Button
							className="mt-4 w-full sm:w-auto"
							size="sm"
							variant="outline"
						>
							View Program
							<ArrowRight className="size-3.5" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
