import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AttendanceRateCard from "@/components/dashboard/AttendanceRateCard";
import RecentPayrollTable from "@/components/dashboard/RecentPayrollTable";
import UpcomingHRTasksCard from "@/components/dashboard/UpcomingHRTasksCard";
import PeopleHubTutorialCard from "@/components/dashboard/PeopleHubTutorialCard";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />

      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN */}
        <div className="col-span-12 xl:col-span-7 flex flex-col gap-6">
          <AttendanceRateCard />
          <RecentPayrollTable />
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
          <UpcomingHRTasksCard />
          <PeopleHubTutorialCard />
        </div>
      </div>
    </>
  );
}