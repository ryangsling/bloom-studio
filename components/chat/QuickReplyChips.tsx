export interface QuickReplyChip {
  label: string;
  onClick: () => void;
}

export interface QuickReplyChipsProps {
  chips: QuickReplyChip[];
}

export function QuickReplyChips({ chips }: QuickReplyChipsProps) {
  return (
    <div className="flex flex-wrap gap-[8px] pl-[2px]">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onClick}
          className="cursor-pointer rounded-[var(--radius-pill)] border-[1.5px] border-[var(--color-secondary-button-border)] bg-[var(--color-bg-surface)] px-[16px] py-[9px] text-[13px] font-semibold text-[var(--color-secondary-button-text)]"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export default QuickReplyChips;
