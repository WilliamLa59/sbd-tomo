import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PlateLoadCardProps = {
	weight: number;
	unit?: "lb" | "kg";
	barWeight?: number;
	plateWeight?: number;
	className?: string;
};

export function PlateLoadCard({
	weight,
	unit = "lb",
	barWeight = 45,
	plateWeight = 45,
	className,
}: PlateLoadCardProps) {
	const platesPerSide = Math.max(
		Math.floor((weight - barWeight) / 2 / plateWeight),
		0,
	);

	return (
		<Card className={cn("shadow-none", className)}>
			<CardContent className="p-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
							Plate load
						</p>

						<p className="mt-2 font-mono text-lg font-medium">
							{platesPerSide} x {plateWeight}
							<span className="ml-1 text-xs text-muted-foreground">
								{unit} plates / side
							</span>
						</p>
					</div>

					<div className="flex min-w-0 items-center justify-end">
						<PlateStack count={platesPerSide} />
						<div className="h-1 w-12 bg-muted-foreground/30 sm:w-16" />
						<div className="h-2 w-10 bg-foreground/75" />
						<div className="h-1 w-12 bg-muted-foreground/30 sm:w-16" />
						<PlateStack count={platesPerSide} reverse />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function PlateStack({ count, reverse }: { count: number; reverse?: boolean }) {
	const plates = Array.from({ length: count }, (_, index) => index);

	return (
		<div className={cn("flex items-center", reverse && "flex-row-reverse")}>
			{plates.map((plate) => (
				<div
					key={plate}
					className="h-12 w-2.5 border bg-brand-subtle ring-1 ring-brand/20 first:w-3.5"
				/>
			))}
		</div>
	);
}
