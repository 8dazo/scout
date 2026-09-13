import { type SVGProps } from "react";

interface ArrowRightIconProps extends SVGProps<SVGSVGElement> {
  strokeWidth?: number;
}

export function ArrowRightIcon({
  className = "w-5 h-5",
  strokeWidth = 2.5,
  ...props
}: ArrowRightIconProps) {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
