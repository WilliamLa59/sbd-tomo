import { Lightbulb } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrainingCuesCardProps = {
	cues: readonly string[];
	className?: string;
};

export function TrainingCuesCard({ cues, className }: TrainingCuesCardProps) {
	return (
		<Card className={cn("shadow-none", className)}>
			<CardContent className="p-4">
				<div className="flex flex-col gap-3">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand">
							<Lightbulb className="size-4" />
						</div>

						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Training cues
						</p>
					</div>

					<ul className="flex min-w-0 flex-col gap-x-6 gap-y-1.5 text-[0.95rem] text-muted-foreground sm:flex-row sm:flex-wrap">
						{cues.map((cue) => (
							<li key={cue} className="flex min-w-0 items-start gap-2">
								<span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
								<span className="min-w-0">{cue}</span>
							</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
