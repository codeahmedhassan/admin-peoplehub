import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/employee-detail";
import EmployeeDetailView from "@/components/dashboard/employees/detail/EmployeeDetailView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const employee = getEmployeeById(id);
    return {
        title: employee
            ? `${employee.name} · PeopleHub`
            : "Employee Not Found · PeopleHub",
    };
}

export default async function EmployeeDetailPage({ params }: PageProps) {
    const { id } = await params;
    const employee = getEmployeeById(id);
    if (!employee) notFound();

    return <EmployeeDetailView employee={employee} />;
}