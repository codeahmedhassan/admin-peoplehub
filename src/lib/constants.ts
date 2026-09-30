export const BRAND = {
    name: "PeopleHub",
    workspace: "Esajee's",
    greeting: "Good Morning,",
} as const;

export interface NavItem {
    label: string;
    href: string;
    icon: string;
}

export const MENU_ITEMS: NavItem[] = [
    { label: "Dashboard", href: "/", icon: "dashboard" },
    { label: "Projects", href: "/projects", icon: "projects" },
    { label: "Teams", href: "/teams", icon: "teams" },
    { label: "Schedule", href: "/schedule", icon: "schedule" },
    { label: "Analytics", href: "/analytics", icon: "analytics" },
];

export const PROFILE_SUB_ITEMS: NavItem[] = [
    { label: "Payroll", href: "/payroll", icon: "payroll" },
    { label: "Attendance", href: "/attendance", icon: "attendance" },
    { label: "Performance", href: "/performance", icon: "performance" },
    { label: "Time-off", href: "/time-off", icon: "timeoff" },
];

// A route is "profile-active" if the current path starts with any of these
export const PROFILE_ROUTES = PROFILE_SUB_ITEMS.map((item) => item.href);

export const CURRENT_USER = {
    name: "Miquella",
    email: "miquella@gmail.com",
    avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAgvIKBXN99-pS472Qog3rgY7l-RKGU6Ga8-kJe2IJLmUbeocnuLfr7ZKBaPbBbMwpSJ2Dz62Ro-qYRMcraVNfKq2DC2M0Nz4hACitBQdg9lxtt-IlOBLsf6HeP50oFUEkRNZp_f2oqTIj2-4-JO0tgI2JPgctYFFXSrdi8EqR-lJhkK5Pd6Uou3lmA8D4YfSp4utm4ga6VAF9dZx_PxGyDDvHIT-nHwQ_EUvEIWv6et5slLINQ1_8nuA",
} as const;

export const HEADER_USER_AVATAR =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC4aJo02-saY00lSb6yaEa7Y64F5JP1m8kw-HaoUCnEnNxZaasRQDdGFb7jFafBv_UIyEvpbsUmXnlkcfCtzAlZzwKsTMZAHAvDWyx2jKlWGeYzjSAAVtxMsF84tcvZFJv3d_BR91lwQ3gkp6jdMyWjoCBbbLsLhPfU6ZoXWuFhNACgxxj49CJXo4_AjnZm2rWev48n7e3TUFHMk-Ydwqd8PgqWypmCnVJv4bOsTIACbPjdTrXZipukHA";

// ---------- Attendance Rate ----------
export interface AttendanceBar {
    month: string;
    lateHeight: number; // px
    onTimeHeight: number; // px
}

export const ATTENDANCE_RATE = {
    percentage: "8.35%",
    description: "Total employees attendance are increasing every week",
    period: "Monthly",
    legend: [
        { label: "On-time", color: "#1557D6" },
        { label: "Late attend", color: "#B5EE1C" },
        { label: "Absent", color: "#CBD5E1" },
    ],
    bars: [
        { month: "JAN", lateHeight: 48, onTimeHeight: 64 },
        { month: "FEB", lateHeight: 64, onTimeHeight: 48 },
        { month: "MAR", lateHeight: 40, onTimeHeight: 96 },
        { month: "APR", lateHeight: 56, onTimeHeight: 112 },
        { month: "MAY", lateHeight: 48, onTimeHeight: 70 },
        { month: "JUN", lateHeight: 56, onTimeHeight: 80 },
        { month: "JUL", lateHeight: 48, onTimeHeight: 80 },
        { month: "AUG", lateHeight: 48, onTimeHeight: 96 },
    ] as AttendanceBar[],
} as const;

// ---------- Recent Payroll ----------
export type PayrollStatus = "Completed" | "Delayed";

export interface PayrollRow {
    no: number;
    name: string;
    position: string;
    date: string;
    status: PayrollStatus;
    avatar: string;
}

export const RECENT_PAYROLL: PayrollRow[] = [
    {
        no: 1,
        name: "Royhan Muhammad",
        position: "Product Designer",
        date: "12/03/2023",
        status: "Completed",
        avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDIMqXYs7d_-ny7f3SWsdJvZFU3zxBcgl5MGOyWJM87LEpDmp6CZT_9W431brC2YYWE-V4DAYg97f3JVCQgKcHVxHixuyhdyc6CH0v-ivqxUXnA9ISp68aDV65F9TgJwSECL2v87-KO_a8IfFJtn9BQ2HwDL_jYtoT-zQNTa4prsqqmY6aGCmerzbWtBGIZm9VCTHQtu46EVXJnvwwxnDdffVCtfTf6BMoBpWbzylnLFaQ2w_xhCjJpdA",
    },
    {
        no: 2,
        name: "Muhammad irfan affian",
        position: "Backend developer",
        date: "12/03/2023",
        status: "Delayed",
        avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDVJaw-CoLcFxPMKIalXn_qutvS9vBxFaWlBAGp_OipRTfSAghwoGM7_-Dok6yf_xlD5qbPOqiX6mXpDi6fWDi5QfUnVKJ6BCGbg4MxZ_3_sifBohUbtG_z8_lSzBvUcUUr-PMP0CMPM9anJgUaZTarOMRVY_SeGzRJZVIpuu-ysxYk9vq5-L99qQxBc9olcTrlA3XVBshqDlGESHAlCJmgPPsQ3JgFoZ8R7pNmQwBci5lTh7vLX9lk2A",
    },
    {
        no: 3,
        name: "Tosan garditama",
        position: "Front end developer",
        date: "12/03/2023",
        status: "Completed",
        avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCDBkP6mmWCQnmuoqFChh3vALJhhvng3swOxbHlgXnd8fb4YouwwllFwibpY6jWuSsZ5KcOCqMrJnvFP5pblVx6tOiN9RF7vcCYlsBfIAPavfesvtwDLuZDj_xW0l3vwdJPm4OIa1ZQj9vM2T8DMv04V9T_6NjrtGAUo9C19ioIOZb_oQAE0nkKJV5QAY6XpU7h1MCUb3XMyk5Q8mXUlRcRRO-JeZyCf18-V6BzIcZBjyjmzC40LAh4Rw",
    },
];

// ---------- Upcoming HR Tasks ----------
export interface DateOption {
    day: string;
    weekday: string;
    isSelected: boolean;
}

export const HR_TASK_DATES: DateOption[] = [
    { day: "14", weekday: "Sat", isSelected: false },
    { day: "15", weekday: "Sun", isSelected: false },
    { day: "16", weekday: "Mon", isSelected: true },
    { day: "17", weekday: "Tue", isSelected: false },
    { day: "18", weekday: "Wed", isSelected: false },
    { day: "19", weekday: "Thu", isSelected: false },
    { day: "20", weekday: "Fri", isSelected: false },
];

export interface HRTask {
    time: string;
    title: string;
    subtitle: string;
    icon: "interview" | "onboarding" | "meeting" | "review";
    bgClass: string;
    textClass: string;
}

export const HR_TASKS: HRTask[] = [
    {
        time: "09:00 - 10:00 AM",
        title: "Interview",
        subtitle: "Product Designer",
        icon: "interview",
        bgClass: "bg-blue-50",
        textClass: "text-blue-600",
    },
    {
        time: "11:00 - 12:00 PM",
        title: "New Employee",
        subtitle: "Onboarding",
        icon: "onboarding",
        bgClass: "bg-emerald-50",
        textClass: "text-emerald-600",
    },
    {
        time: "02:00 - 03:00 PM",
        title: "Team Meeting",
        subtitle: "HR & Management",
        icon: "meeting",
        bgClass: "bg-amber-50",
        textClass: "text-amber-600",
    },
    {
        time: "04:00 - 05:00 PM",
        title: "Review Employee",
        subtitle: "Performance",
        icon: "review",
        bgClass: "bg-rose-50",
        textClass: "text-rose-600",
    },
];

// ---------- Tutorial Card ----------
export const TUTORIAL_CARD = {
    title: "Learn how to use PeopleHub",
    subtitle: "with onboarding tutorial",
    buttonLabel: "Watch Tutorial",
    badge: "6 Mins",
} as const;