export interface RestartHeaderProps {
  onRestartClick: () => void;
}

export default function RestartHeader({ onRestartClick }: RestartHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onRestartClick}
        className="mb-9 inline-flex w-fit items-center gap-2 text-[1.125rem] font-bold tracking-[-0.025em] text-[var(--primary)]"
      >
        <img src="/restart_icon.svg" alt="" aria-hidden="true" className="size-4" />
        <span>Restart</span>
      </button>
    </>
  )
}