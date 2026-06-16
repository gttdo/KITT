// Minimal inline icon set (no icon dependency).
const S = ({ children, className = '', size = 16, ...p }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...p}
  >
    {children}
  </svg>
)

export const Check = (p) => <S {...p}><path d="M20 6 9 17l-5-5" /></S>
export const X = (p) => <S {...p}><path d="M18 6 6 18M6 6l12 12" /></S>
export const Plus = (p) => <S {...p}><path d="M12 5v14M5 12h14" /></S>
export const Sparkle = (p) => (
  <S {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />
  </S>
)
export const Shield = (p) => (
  <S {...p}>
    <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </S>
)
export const Eye = (p) => (
  <S {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </S>
)
export const Pencil = (p) => (
  <S {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
  </S>
)
export const Alert = (p) => (
  <S {...p}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  </S>
)
export const Doc = (p) => (
  <S {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </S>
)
export const Clock = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>
)
export const Download = (p) => (
  <S {...p}><path d="M12 3v12M7 11l5 4 5-4M5 21h14" /></S>
)
export const Dot = ({ className = '', size = 8 }) => (
  <span className={`inline-block rounded-full ${className}`} style={{ width: size, height: size }} />
)
