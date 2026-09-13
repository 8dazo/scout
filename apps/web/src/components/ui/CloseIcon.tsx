import { type SVGProps } from "react";

interface CloseIconProps extends SVGProps<SVGSVGElement> {
  strokeWidth?: number;
}

export function CloseIcon({
  className = "w-6 h-6",
  strokeWidth = 2.5,
  ...props
}: CloseIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
