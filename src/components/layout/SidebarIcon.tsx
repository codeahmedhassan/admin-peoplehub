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
        case "payroll":
            return (
                <svg {...strokeProps} className="w-4 h-4">
                    <rect height="14" rx="2" width="20" x="2" y="5" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
            );
        case "attendance":
            return (
                <svg {...strokeProps} className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
            );
        case "performance":
            return (
                <svg {...strokeProps} className="w-4 h-4">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
        default:
            return null;
    }
}