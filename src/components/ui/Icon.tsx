import type { ReactNode, SVGProps } from 'react';
export type IconName =
  | 'arrow'
  | 'chevron'
  | 'user'
  | 'people'
  | 'user-plus'
  | 'laptop'
  | 'monitor'
  | 'settings'
  | 'bell'
  | 'play'
  | 'pause'
  | 'timer'
  | 'check'
  | 'bolt'
  | 'message'
  | 'ruler'
  | 'link'
  | 'dots'
  | 'close';
const paths: Record<IconName, ReactNode> = {
  arrow: (
    <>
      <path d="M6 18 18 6M7 6h11v11" />
    </>
  ),
  chevron: (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M3 21a9 9 0 0 1 18 0" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20v-1a7 7 0 0 1 14 0v1M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6 6 0 0 1 4 5" />
    </>
  ),
  'user-plus': (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20v-1a7 7 0 0 1 13-3M19 11v8M15 15h8" />
    </>
  ),
  laptop: (
    <>
      <rect x="4" y="4" width="16" height="13" rx="2" />
      <path d="M4 17H2v3h20v-3h-2M9 8h3M9 11h1" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="1.5" />
      <path d="M12 17v4M8 21h8" />
    </>
  ),
  settings: (
    <>
      <path
        d="m9 3 .7-2h4.6l.7 2 2 .9 2.1-.3 2.3 4-1.4 1.7.2 2.3 1.3 1.8-2.3 4-2.3-.3-1.8 1.2-.7 2h-4.6l-.7-2L7 18.4l-2.1.3-2.3-4L4 13l-.2-2.3-1.3-1.8 2.3-4 2.3.3Z"
        transform="translate(0 1) scale(1 .95)"
      />
      <circle cx="12" cy="11.7" r="3.5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-2 7-2 9h16c0-2-2-2-2-9ZM10 21h4M12 2V1" />
    </>
  ),
  play: (
    <>
      <path d="m7 4 13 8-13 8Z" />
    </>
  ),
  pause: (
    <>
      <path d="M8 4v16M16 4v16" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 1h6M18 3l3 3M3 6l3-3" />
    </>
  ),
  check: (
    <>
      <path d="m5 12 4 4L19 6" />
    </>
  ),
  bolt: (
    <>
      <path d="m14 2-9 12h6l-1 8 9-13h-6Z" />
    </>
  ),
  message: (
    <>
      <path d="M20 11a8 8 0 0 1-8 8 9 9 0 0 1-4-.8L3 20l1.6-5A8 8 0 1 1 20 11Z" />
      <path d="M8 11h.1M12 11h.1M16 11h.1" strokeWidth="2.5" />
    </>
  ),
  ruler: (
    <>
      <path d="m3 16 13-13 5 5L8 21ZM12 7l3 3M9 10l2 2M6 13l3 3" />
    </>
  ),
  link: (
    <>
      <path
        d="m10 14 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M13 17a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-1 1"
        transform="translate(1 -1) scale(.92)"
      />
    </>
  ),
  dots: (
    <>
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M6 18 18 6" />
    </>
  ),
};
export function Icon({
  name,
  className = '',
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      {...props}
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
