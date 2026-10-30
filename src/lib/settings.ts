// ============================================================
// SETTINGS — types, options, seed data
// ============================================================

// ---------- Roles ----------
export type SystemRole = "Admin" | "Manager" | "HR" | "Employee" | "Viewer";

export const SYSTEM_ROLES: SystemRole[] = [
    "Admin",
    "Manager",
    "HR",
    "Employee",
    "Viewer",
];

// Simulated current user role — replace with auth context later
export const CURRENT_USER_ROLE: SystemRole = "Admin";

// ---------- Company Profile ----------
export const INDUSTRIES = [
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Education",
    "Consulting",
    "Other",
];

export const TIMEZONES = [
    "UTC-08:00 Pacific Time",
    "UTC-05:00 Eastern Time",
    "UTC+00:00 London",
    "UTC+01:00 Berlin",
    "UTC+04:00 Dubai",
    "UTC+05:00 Karachi",
    "UTC+05:30 Mumbai",
    "UTC+08:00 Singapore",
    "UTC+09:00 Tokyo",
    "UTC+10:00 Sydney",
];

// ---------- Financial & Payroll ----------
export const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD"];

export const PAYROLL_CYCLES = [
    "Monthly (Last day of month)",
    "Monthly (15th)",
    "Bi-Weekly",
    "Weekly",
    "Semi-Monthly",
];

// ---------- Attendance & Leave ----------
export const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;

export interface Holiday {
    id: string;
    name: string;
    date: string; // YYYY-MM-DD
}

// ---------- Workspace Modules ----------
export interface ModuleToggle {
    key: string;
    label: string;
    description: string;
    defaultOn: boolean;
}

export const WORKSPACE_MODULES: ModuleToggle[] = [
    { key: "payroll", label: "Payroll", description: "Salary runs, payslips, and pay history.", defaultOn: true },
    { key: "attendance", label: "Attendance", description: "Clock in / out, attendance tracking.", defaultOn: true },
    { key: "performance", label: "Performance", description: "Reviews, goals, and feedback cycles.", defaultOn: true },
    { key: "timeoff", label: "Time-off", description: "Leave requests and balance tracking.", defaultOn: true },
    { key: "projects", label: "Projects", description: "Project tracking and assignments.", defaultOn: false },
    { key: "devices", label: "Devices", description: "Hardware device registration and mapping.", defaultOn: true },
];

// ---------- Roles (access) seed data ----------
export interface UserWithRole {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: SystemRole;
    lastActive: string;
}

export const USERS_WITH_ACCESS: UserWithRole[] = [
    { id: "u-1", name: "Miquella", email: "miquella@gmail.com", role: "Admin", lastActive: "2 min ago" },
    { id: "u-2", name: "Sarah Jenkins", email: "sarah@worknest.io", role: "HR", lastActive: "1 hour ago" },
    { id: "u-3", name: "David Park", email: "david@worknest.io", role: "Manager", lastActive: "Yesterday" },
    { id: "u-4", name: "Lena Hoffmann", email: "lena@worknest.io", role: "Employee", lastActive: "3 days ago" },
    { id: "u-5", name: "Marcus Reid", email: "marcus@worknest.io", role: "Viewer", lastActive: "1 week ago" },
];

// ---------- Notifications ----------
export interface NotificationPref {
    key: string;
    label: string;
    description: string;
    category: "email" | "inapp";
}

export const NOTIFICATION_PREFS: NotificationPref[] = [
    { key: "new-employee", label: "New employee joins", description: "Get notified when someone new is added to your workspace.", category: "email" },
    { key: "payroll-day", label: "Payroll day reminders", description: "Receive reminders when payroll runs.", category: "email" },
    { key: "leave-request", label: "Leave requests", description: "Notify me when my team submits leave requests.", category: "email" },
    { key: "performance-review", label: "Performance reviews", description: "Notify me about upcoming review cycles.", category: "email" },

    { key: "inapp-announcements", label: "Workspace announcements", description: "In-app messages from workspace admins.", category: "inapp" },
    { key: "inapp-chat", label: "Chat messages", description: "Direct messages from colleagues.", category: "inapp" },
    { key: "inapp-schedule", label: "Schedule changes", description: "Updates to my schedule or shift.", category: "inapp" },
];