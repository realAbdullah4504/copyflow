import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useModal } from "@/hooks";
import { useStudents } from "@/hooks/queries/useStudents";
import { useStudentMutations } from "@/hooks/mutations/useStudentMutations";
import type { Student } from "@/types";
import {
  StudentsTable,
  StudentModal,
  getStudentColumns,
} from "@/components/students";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const StudentsPage = () => {
  const { user } = useAuth();
  const adminId = user?.adminId;
  const { students, isLoading } = useStudents(adminId!);
  const { createStudent, updateStudent, deleteStudent, isCreating, isUpdating, isDeleting } =
    useStudentMutations();
  const { modal, openModal, closeModal } = useModal<Student>();
  const [classFilter, setClassFilter] = useState("all");

  // Build available classes from actual student data
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>();
    students.forEach((s) => classSet.add(`${s.grade}-${s.section}`));
    // Sort: by grade then section
    return Array.from(classSet).sort((a, b) => {
      const [gA, sA] = a.split("-");
      const [gB, sB] = b.split("-");
      return gA === gB ? sA.localeCompare(sB) : Number(gA) - Number(gB);
    });
  }, [students]);

  // Filter and sort students by class (grade-section), then last name
  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (classFilter !== "all") {
      const [g, s] = classFilter.split("-");
      list = list.filter((st) => st.grade === g && st.section === s);
    }
    return list.sort((a, b) => {
      const classA = `${a.grade}-${a.section}`;
      const classB = `${b.grade}-${b.section}`;
      if (classA !== classB) {
        const [gA, sA] = classA.split("-");
        const [gB, sB] = classB.split("-");
        if (gA !== gB) return Number(gA) - Number(gB);
        return sA.localeCompare(sB);
      }
      return a.lastName.localeCompare(b.lastName);
    });
  }, [students, classFilter]);

  const handlers = {
    onAddConfirm: (data: { firstName: string; lastName: string; grade: string; section: string }) => {
      createStudent(
        { ...data, adminId: adminId! },
        { onSuccess: closeModal }
      );
    },
    onEditConfirm: (data: { firstName: string; lastName: string; grade: string; section: string }) => {
      if (!modal.data) return;
      updateStudent(
        { id: modal.data.id, ...data },
        { onSuccess: closeModal }
      );
    },
    onDeleteConfirm: () => {
      if (!modal.data) return;
      deleteStudent(modal.data.id, { onSuccess: closeModal });
    },
  };

  const columns = getStudentColumns(
    (student) => openModal("editStudent", student),
    (student) => openModal("deleteStudent", student)
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student roster and records
          </p>
        </div>
        <Button onClick={() => openModal("newStudent")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {availableClasses.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StudentsTable data={filteredStudents} columns={columns} isLoading={isLoading} />

      <StudentModal
        student={modal.data ?? null}
        type={modal.type || ""}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={handlers}
        isSubmitting={isCreating || isUpdating || isDeleting}
      />
    </div>
  );
};

export default StudentsPage;
