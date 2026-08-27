export type BlockLiftTarget = {
	lift: "Squat" | "Bench" | "Deadlift";
	startE1rm: number;
	currentE1rm: number;
	targetE1rm: number;
	targetReps: 1 | 2 | 3;
};

type BlockTargetsCardProps = {
	targets: readonly BlockLiftTarget[];
};

export function BlockTargetsCard({ targets }: BlockTargetsCardProps) {
	return (
		<div className="grid gap-3 md:grid-cols-3">
			{targets.map((target) => (
				<LiftTargetCard key={target.lift} target={target} />
			))}
		</div>
	);
}

function LiftTargetCard({ target }: { target: BlockLiftTarget }) {
	const progress = getTargetProgress(target);

	return (
		<div className="border p-4">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="text-sm font-medium">{target.lift}</h3>
					<p className="mt-1 text-xs text-muted-foreground">
						Target {formatRepIntent(target.targetReps)}
					</p>
				</div>
				<span className="font-mono text-xs text-muted-foreground">
					{Math.round(progress)}%
				</span>
			</div>

			<div className="mt-4 grid grid-cols-3 gap-3 text-xs">
				<TargetStat label="Start" value={target.startE1rm} />
				<TargetStat label="Current" value={target.currentE1rm} />
				<TargetStat label="Target" value={target.targetE1rm} />
			</div>

			<div className="mt-4 h-1.5 overflow-hidden bg-muted">
				<div className="h-full bg-brand" style={{ width: `${progress}%` }} />
			</div>
		</div>
	);
}

function TargetStat({ label, value }: { label: string; value: number }) {
	return (
		<div className="min-w-0">
			<p className="text-muted-foreground">{label}</p>
			<p className="mt-1 truncate font-mono text-sm font-medium">
				{value.toLocaleString()} lb
			</p>
		</div>
	);
}

function formatRepIntent(reps: BlockLiftTarget["targetReps"]) {
	switch (reps) {
		case 1:
			return "single";
		case 2:
			return "double";
		case 3:
			return "triple";
	}
}

function getTargetProgress(target: BlockLiftTarget) {
	const gainTarget = target.targetE1rm - target.startE1rm;

	if (gainTarget <= 0) {
		return 100;
	}

	const gainSoFar = target.currentE1rm - target.startE1rm;

	return Math.min(100, Math.max(0, (gainSoFar / gainTarget) * 100));
}
