export interface HandoffPromptProps {
  onOpen: () => void;
}

export function HandoffPrompt({ onOpen }: HandoffPromptProps) {
  return (
    <div className="flex justify-center pt-[4px]">
      <button
        onClick={onOpen}
        className="cursor-pointer border-none bg-transparent p-[4px] text-[12.5px] font-medium text-[var(--color-text-secondary)] underline"
      >
        Connect me to a real person
      </button>
    </div>
  );
}

export default HandoffPrompt;
