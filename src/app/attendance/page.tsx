import AttendancePage from "@/components/dashboard/attendance/AttendancePage";

export const metadata = {
    title: "Attendance · PeopleHub",
    description: "Daily and weekly attendance overview",
};

export default function AttendanceRoute() {
    return <AttendancePage />;
}