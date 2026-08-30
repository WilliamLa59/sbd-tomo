export type BlockLiftTarget = {
	lift: "Squat" | "Bench" | "Deadlift";
	start: string | null;
	current: string | null;
	target: string;
	targetReps: 1 | 2 | 3 | 4 | 5;
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
	return (
		<div className="border p-4">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="text-sm font-medium">{target.lift}</h3>
					<p className="mt-1 text-xs text-muted-foreground">
						Target {formatRepIntent(target.targetReps)}
					</p>
				</div>
			</div>

			<div className="mt-4 grid gap-2 text-xs">
				<TargetStat label="Start" value={target.start} />
				<TargetStat label="Current" value={target.current} />
				<TargetStat label="Target" value={target.target} />
			</div>
		</div>
	);
}

function TargetStat({ label, value }: { label: string; value: string | null }) {
	const display = value ? formatSet(value) : null;

	return (
		<div className="grid min-w-0 gap-1 sm:grid-cols-[64px_minmax(0,1fr)] sm:items-baseline">
			<p className="text-muted-foreground">{label}</p>
			<p className="font-mono text-sm font-medium">
				{display ? (
					<>
						<span className="hidden sm:inline">{display.full}</span>
						<span className="sm:hidden">{display.compact}</span>
					</>
				) : (
					"-"
				)}
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
		default:
			return `${reps} reps`;
	}
}

function formatSet(set: string) {
	const match = set.match(
		/^(\d+(?:\.\d+)?)\s+([a-zA-Z]+)\s*[×x]\s*(\d+)(?:\s*(?:\[(.*?)\]\(.*?\)|@\s*([0-9.]+)))?$/,
	);

	if (!match) {
		return { compact: set, full: set };
	}

	const [, weight, unit, reps, bracketRpe, atRpe] = match;
	const rpe = bracketRpe ?? atRpe;
	const baseFull = `${weight} ${unit} × ${reps}`;
	const baseCompact = `${weight} ${unit}×${reps}`;

	if (!rpe) {
		return {
			compact: baseCompact,
			full: baseFull,
		};
	}

	return {
		compact: `${baseCompact} @ ${rpe}`,
		full: `${baseFull} @ ${rpe}`,
	};
}
