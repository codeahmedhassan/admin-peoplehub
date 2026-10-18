import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/employee-detail";
import EditEmployeeView from "@/components/dashboard/employees/edit/EditEmployeeView";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const employee = getEmployeeById(id);
    return {
        title: employee ? `Edit ${employee.name} · PeopleHub` : "Employee Not Found",
    };
}

export default async function EditEmployeePage({ params }: PageProps) {
    const { id } = await params;
    const employee = getEmployeeById(id);
    if (!employee) notFound();

    return <EditEmployeeView employee={employee} />;
}