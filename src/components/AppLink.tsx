import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useAppRouter } from "@/app/AppRouter";

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

export function AppLink({ to, onClick, target, rel, ...props }: AppLinkProps) {
  const { navigate } = useAppRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      target === "_blank" ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to);
  };

  return (
    <a {...props} href={to} target={target} rel={rel} onClick={handleClick} />
  );
}
