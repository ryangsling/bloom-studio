import Button from "@/components/Button";
import type { Salon } from "@/types/salon";

const NAV_LINKS: { label: string; href?: string }[] = [
  { label: "Services", href: "#services" },
  { label: "About" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#find-us" },
];

export interface HeaderProps {
  salon: Salon;
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export function Header({ salon, menuOpen, onToggleMenu }: HeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-[22px] pt-[20px] pb-[16px]">
        <div className="font-[family-name:var(--font-display)] text-[22px] leading-none font-medium italic">
          {salon.salonName}
        </div>
        <button
          onClick={onToggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-m-[8px] flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-[8px]"
        >
          <span className="block h-[2px] w-[22px] bg-[var(--color-text-primary)]" />
          <span className="block h-[2px] w-[22px] bg-[var(--color-text-primary)]" />
        </button>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[var(--color-bg-surface)] px-[22px] py-[20px]">
          <div className="mb-[36px] flex items-center justify-between">
            <div className="font-[family-name:var(--font-display)] text-[22px] italic">
              {salon.salonName}
            </div>
            <button
              onClick={onToggleMenu}
              aria-label="Close menu"
              className="-m-[8px] cursor-pointer border-none bg-transparent p-[8px] text-[22px] leading-none text-[var(--color-text-primary)]"
            >
              &times;
            </button>
          </div>

          {NAV_LINKS.map((link) =>
            link.href ? (
              <a
                key={link.label}
                href={link.href}
                onClick={onToggleMenu}
                className="border-b border-[var(--color-border-hairline)] py-[16px] font-[family-name:var(--font-display)] text-[26px] leading-none no-underline"
              >
                {link.label}
              </a>
            ) : (
              <span
                key={link.label}
                className="border-b border-[var(--color-border-hairline)] py-[16px] font-[family-name:var(--font-display)] text-[26px] leading-none text-[var(--color-text-muted)]"
              >
                {link.label}
              </span>
            ),
          )}

          <div className="mt-auto flex flex-col gap-[12px] pt-[24px]">
            <div className="font-medium text-[15px] text-[var(--color-text-secondary)]">
              {salon.phone}
            </div>
            <Button variant="primary">Book now</Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Header;
