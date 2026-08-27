import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BlockWeekStatus = "completed" | "current" | "upcoming";

export type BlockWeekOption = {
	week: number;
	status: BlockWeekStatus;
};

type BlockWeekSelectorProps = {
	weeks: readonly BlockWeekOption[];
	selectedWeek: number;
	onSelectWeek: (week: number) => void;
};

export function BlockWeekSelector({
	weeks,
	selectedWeek,
	onSelectWeek,
}: BlockWeekSelectorProps) {
	return (
		<div className="-mx-1 overflow-x-auto px-1">
			<div className="flex min-w-max gap-3">
				{weeks.map((week) => {
					const isSelected = week.week === selectedWeek;

					return (
						<Button
							className={cn(
								"h-auto min-w-36 justify-between gap-4 border px-4 py-3",
								isSelected && "border-foreground bg-muted",
							)}
							key={week.week}
							onClick={() => onSelectWeek(week.week)}
							type="button"
							variant="outline"
						>
							<span className="text-left">
								<span className="block text-sm font-medium">
									Week {week.week}
								</span>
								<span className="mt-1 block text-xs text-muted-foreground">
									{formatWeekStatus(week.status)}
								</span>
							</span>

							<Badge
								variant={week.status === "current" ? "default" : "secondary"}
							>
								{week.status === "current" ? "Now" : week.week}
							</Badge>
						</Button>
					);
				})}
			</div>
		</div>
	);
}

function formatWeekStatus(status: BlockWeekStatus) {
	switch (status) {
		case "completed":
			return "Completed";
		case "current":
			return "Current";
		case "upcoming":
			return "Upcoming";
	}
}
