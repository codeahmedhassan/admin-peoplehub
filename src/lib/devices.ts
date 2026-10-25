// ============================================================
// DEVICE SETTINGS — types, seed data, helpers
// ============================================================

import { EMPLOYEES, type Employee } from "@/lib/constants";

export type DeviceStatus = "Active" | "Revoked";

export interface Device {
    id: string;
    name: string;
    location: string;
    status: DeviceStatus;
    lastSeen: string;      // ISO date or friendly string
    createdAt: string;
    apiKeyPreview: string; // "pk_live_•••• 4f2a"
}

export interface DeviceUserMapping {
    deviceId: string;
    empId: string;
    deviceUserId: string;  // "42", "107", "" if unmapped
    linkedAt?: string;
}

// ---------- Seed data ----------
export const DEVICES: Device[] = [
    {
        id: "dev-1",
        name: "Front Entrance Terminal",
        location: "Ground Floor",
        status: "Active",
        lastSeen: "2 min ago",
        createdAt: "2024-01-15",
        apiKeyPreview: "pk_live_•••• 4f2a",
    },
    {
        id: "dev-2",
        name: "Warehouse Scanner",
        location: "Warehouse B",
        status: "Active",
        lastSeen: "1 hour ago",
        createdAt: "2024-02-08",
        apiKeyPreview: "pk_live_•••• 91c7",
    },
    {
        id: "dev-3",
        name: "Old Reception Reader",
        location: "Ground Floor",
        status: "Revoked",
        lastSeen: "3 weeks ago",
        createdAt: "2023-11-02",
        apiKeyPreview: "pk_live_•••• 8e10",
    },
];

// ---------- Seed device-user mappings ----------
export const DEVICE_MAPPINGS: DeviceUserMapping[] = [
    { deviceId: "dev-1", empId: "EMP-001", deviceUserId: "42", linkedAt: "2024-02-01" },
    { deviceId: "dev-1", empId: "EMP-003", deviceUserId: "107", linkedAt: "2024-02-14" },
    { deviceId: "dev-2", empId: "EMP-002", deviceUserId: "9", linkedAt: "2024-03-02" },
];

// ---------- Helpers ----------
export function getMappingFor(
    mappings: DeviceUserMapping[],
    deviceId: string,
    empId: string
): DeviceUserMapping | undefined {
    return mappings.find((m) => m.deviceId === deviceId && m.empId === empId);
}

export function generateDeviceApiKey(): string {
    // Demo-only. Replace with real backend-generated key.
    const random = Array.from({ length: 32 }, () =>
        "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
    ).join("");
    return `pk_live_${random}`;
}

export function getEmployeesForDevice(_deviceId: string): Employee[] {
    // In real app: maybe filter by branch/department
    return EMPLOYEES;
}