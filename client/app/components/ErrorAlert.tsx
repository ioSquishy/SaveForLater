interface ErrorAlertProps {
	title?: string;
	message: string;
	onRetry: () => void;
	onRestart: () => void;
}

export default function ErrorAlert({
	title = "Processing Paused",
	message,
	onRetry,
	onRestart,
}: ErrorAlertProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center px-6" role="alertdialog" aria-modal="true" aria-live="assertive">
			<div className="absolute inset-0 bg-[rgb(14_14_19_/_72%)] backdrop-blur-[6px]" />

			<section
				className="glass-panel relative z-10 w-full max-w-[24.375rem] p-7"
				style={{
					borderRadius: "2rem",
					background: "rgb(27 27 32 / 58%)",
					boxShadow: "0 20px 44px rgb(188 174 220 / 15%)",
				}}
			>
				<p className="label text-[var(--primary)]">Error</p>
				<h2 className="mt-2 text-[1.75rem] leading-[1.05] text-[var(--error)]">{title}</h2>
				<p className="mt-4 text-sm text-[rgb(202_195_216_/_92%)]">{message}</p>

				<div className="mt-8 flex flex-col gap-3">
					<button type="button" className="btn-primary w-full" onClick={onRetry}>
						Try Again
					</button>
					<button type="button" className="btn-tertiary w-full" onClick={onRestart}>
						Start Over
					</button>
				</div>
			</section>
		</div>
	);
}
