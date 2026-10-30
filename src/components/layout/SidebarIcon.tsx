import { PiPerson } from "react-icons/pi";

interface SidebarIconProps {
    name: string;
    className?: string;
}

export default function SidebarIcon({
    name,
    className = "w-4.5 h-4.5 text-slate-500",
}: SidebarIconProps) {
    const strokeProps = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        viewBox: "0 0 24 24",
        className,
    };

    switch (name) {
        case "dashboard":
            return (
                <svg {...strokeProps}>
                    <rect height="7" rx="1.5" width="7" x="3" y="3" />
                    <rect height="7" rx="1.5" width="7" x="14" y="3" />
                    <rect height="7" rx="1.5" width="7" x="14" y="14" />
                    <rect height="7" rx="1.5" width="7" x="3" y="14" />
                </svg>
            );
        case "add":
            return (
                <PiPerson />
            );
        case "attendance":
            return (
                <svg {...strokeProps} className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            );
        case "payroll":
            return (
                <svg {...strokeProps} className="w-4 h-4">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            );
        case "timeoff":
            return (
                <svg {...strokeProps} className="w-4 h-4">
                    <path d="M16 2v4M8 2v4M3 10h18" />
                    <path d="M9 16l2 2 4-4" />
                </svg>
            );
        case "projects":
            return (
                <svg {...strokeProps}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            );
        case "teams":
            return (
                <svg {...strokeProps}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        case "schedule":
            return (
                <svg {...strokeProps}>
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
            );
        case "analytics":
            return (
                <svg {...strokeProps}>
                    <line x1="18" x2="18" y1="20" y2="10" />
                    <line x1="12" x2="12" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
            );
        case "devices":
            return (
                <svg {...strokeProps}>
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                </svg>
            );
        case "settings":
            return (
                <svg {...strokeProps}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            );
        case "logout":
            return (
                <svg {...strokeProps}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
            );
        case "user":
            return (
                <svg {...strokeProps}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            );
        case "building":
            return (
                <svg {...strokeProps}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" strokeLinecap="round" />
                </svg>
            );
        case "chevron-up":
            return (
                <svg {...strokeProps}>
                    <polyline points="18 15 12 9 6 15" />
                </svg>
            );
        case "chevron-down":
            return (
                <svg {...strokeProps}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            );
        default:
            return null;
    }
}