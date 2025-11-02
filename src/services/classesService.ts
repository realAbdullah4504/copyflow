import { supabase } from "@/lib/supabaseClient";
import type { ClassEntity } from "@/types";
import { AppError } from "@/utils";

export const classesService = {
  async getByTeacher(
    teacherId: string,
    status?: boolean
  ): Promise<ClassEntity[]> {
    let query = supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (typeof status === "boolean") {
      query = query.eq("active", status);
    }

    const { data: classes, error } = await query;

    if (error) {
      throw await AppError.from(error);
    }

    if (!classes) {
      throw await AppError.from({
        message: "Classes not found",
        status: 404,
      });
    }

    return classes.map((c) => ({
      id: c.id,
      teacherId: c.teacher_id,
      subject: c.subject,
      grade: c.grade,
      active: c.active,
      createdAt: new Date(c.created_at),
      updatedAt: new Date(c.updated_at),
    }));
  },

  async create(
    data: Omit<ClassEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ClassEntity> {
    type Database = {
      public: {
        Tables: {
          classes: {
            Row: {
              id: string;
              teacher_id: string;
              subject: string;
              grade: string;
              active: boolean;
              created_at: string;
              updated_at: string;
            };
            Insert: Omit<
              Database["public"]["Tables"]["classes"]["Row"],
              "id" | "created_at" | "updated_at"
            >;
          };
        };
      };
    };

    const insertData: Database["public"]["Tables"]["classes"]["Insert"] = {
      teacher_id: data.teacherId,
      subject: data.subject,
      grade: data.grade,
      active: true,
    };

    const { data: classData, error } = await supabase
      .from("classes")
      .insert(insertData)
      .select()
      .single<Database["public"]["Tables"]["classes"]["Row"]>();

    if (error) {
      throw await AppError.from(error);
    }

    if (!classData) {
      throw await AppError.from({
        message: "Failed to create class",
        status: 500,
      });
    }

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
    };
  },

  async update(
    id: string,
    updates: Partial<ClassEntity>
  ): Promise<ClassEntity> {
    // Define the database row type (if not already defined)
    type Database = {
      public: {
        Tables: {
          classes: {
            Row: {
              id: string;
              teacher_id: string;
              subject: string;
              grade: string;
              active: boolean;
              created_at: string;
              updated_at: string;
            };
            Update: Partial<
              Omit<
                Database["public"]["Tables"]["classes"]["Row"],
                "id" | "created_at" | "updated_at"
              >
            >;
          };
        };
      };
    };

    const updateData: Database["public"]["Tables"]["classes"]["Update"] = {
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.subject !== undefined && { subject: updates.subject }),
      ...(updates.grade !== undefined && { grade: updates.grade }),
    };

    const { data: classData, error } = await supabase
      .from("classes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single<Database["public"]["Tables"]["classes"]["Row"]>();

    if (error) {
      throw await AppError.from(error);
    }

    if (!classData) {
      throw await AppError.from({
        message: "Class not found",
        status: 404,
      });
    }

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
    };
  },

  async toggleActive(id: string): Promise<ClassEntity> {
    // First, get the current class to toggle its active status
    const { data: currentClass, error: fetchError } = await supabase
      .from("classes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw await AppError.from(fetchError);
    }

    if (!currentClass) {
      throw await AppError.from({
        message: "Class not found",
        status: 404,
      });
    }

    // Toggle the active status
    const { data: updatedClass, error: updateError } = await supabase
      .from("classes")
      .update({
        active: !currentClass.active,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw await AppError.from(updateError);
    }

    if (!updatedClass) {
      throw await AppError.from({
        message: "Failed to update class status",
        status: 500,
      });
    }

    return {
      id: updatedClass.id,
      teacherId: updatedClass.teacher_id,
      subject: updatedClass.subject,
      grade: updatedClass.grade,
      active: updatedClass.active,
      createdAt: new Date(updatedClass.created_at),
      updatedAt: new Date(updatedClass.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      throw await AppError.from(error);
    }
  },
};
