export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      absence_alert_notes: {
        Row: {
          id: string
          last_absence_date: string
          noted_at: string
          noted_by: string | null
          student_id: string
          term_id: string
        }
        Insert: {
          id?: string
          last_absence_date: string
          noted_at?: string
          noted_by?: string | null
          student_id: string
          term_id: string
        }
        Update: {
          id?: string
          last_absence_date?: string
          noted_at?: string
          noted_by?: string | null
          student_id?: string
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "absence_alert_notes_noted_by_fkey"
            columns: ["noted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_alert_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "absence_alert_notes_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          academic_year: string
          class_id: string | null
          created_at: string
          id: string
          lesson_date: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          class_id?: string | null
          created_at?: string
          id?: string
          lesson_date: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          class_id?: string | null
          created_at?: string
          id?: string
          lesson_date?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          active: boolean
          created_at: string | null
          grade: string
          id: string
          subject: string
          teacher_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          grade: string
          id?: string
          subject: string
          teacher_id: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          grade?: string
          id?: string
          subject?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          academic_year: string
          class_id: string
          conduct: Database["public"]["Enums"]["conduct_grade"] | null
          created_at: string
          id: string
          mark: number | null
          notes: string | null
          student_id: string
          term: string
          updated_at: string
        }
        Insert: {
          academic_year: string
          class_id: string
          conduct?: Database["public"]["Enums"]["conduct_grade"] | null
          created_at?: string
          id?: string
          mark?: number | null
          notes?: string | null
          student_id: string
          term?: string
          updated_at?: string
        }
        Update: {
          academic_year?: string
          class_id?: string
          conduct?: Database["public"]["Enums"]["conduct_grade"] | null
          created_at?: string
          id?: string
          mark?: number | null
          notes?: string | null
          student_id?: string
          term?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          receiver_id: string
          sender_id: string | null
          submission_id: string | null
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          receiver_id: string
          sender_id?: string | null
          submission_id?: string | null
          title?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          receiver_id?: string
          sender_id?: string | null
          submission_id?: string | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          admin_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string
        }
        Insert: {
          active?: boolean | null
          admin_id?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role: string
        }
        Update: {
          active?: boolean | null
          admin_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          class_id: string | null
          created_at: string | null
          grade: string
          id: string
          lesson_days: string[]
          period: number | null
          teacher_id: string | null
          updated_at: string | null
          viewed: boolean | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          grade: string
          id?: string
          lesson_days: string[]
          period?: number | null
          teacher_id?: string | null
          updated_at?: string | null
          viewed?: boolean | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          grade?: string
          id?: string
          lesson_days?: string[]
          period?: number | null
          teacher_id?: string | null
          updated_at?: string | null
          viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_enrollments: {
        Row: {
          academic_year: string
          active: boolean
          class_id: string
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          academic_year: string
          active?: boolean
          class_id: string
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          academic_year?: string
          active?: boolean
          class_id?: string
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          active: boolean
          admin_id: string
          created_at: string
          first_name: string
          grade: string
          id: string
          last_name: string
          section: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          admin_id: string
          created_at?: string
          first_name: string
          grade: string
          id?: string
          last_name: string
          section?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          admin_id?: string
          created_at?: string
          first_name?: string
          grade?: string
          id?: string
          last_name?: string
          section?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_files: {
        Row: {
          content_type: string | null
          created_at: string | null
          file_name: string | null
          file_size: number | null
          id: string
          sort_order: number | null
          storage_path: string
          submission_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          sort_order?: number | null
          storage_path: string
          submission_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          id?: string
          sort_order?: number | null
          storage_path?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          class_id: string
          copies: number | null
          created_at: string | null
          file_type: string
          files: string[] | null
          id: string
          lesson_date: string
          notes: string | null
          paper_color: string | null
          print_settings: Json | null
          status: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          copies?: number | null
          created_at?: string | null
          file_type: string
          files?: string[] | null
          id?: string
          lesson_date: string
          notes?: string | null
          paper_color?: string | null
          print_settings?: Json | null
          status?: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          copies?: number | null
          created_at?: string | null
          file_type?: string
          files?: string[] | null
          id?: string
          lesson_date?: string
          notes?: string | null
          paper_color?: string | null
          print_settings?: Json | null
          status?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      terms: {
        Row: {
          academic_year: string
          created_at: string
          end_date: string
          id: string
          is_active: boolean
          name: string
          start_date: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean
          name: string
          start_date: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean
          name?: string
          start_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_delete_user: { Args: { target_uuid: string }; Returns: undefined }
      compute_academic_year: { Args: { d: string }; Returns: string }
      delete_old_notifications: { Args: never; Returns: undefined }
      get_users_by_admin: {
        Args: { admin_uuid: string }
        Returns: {
          active: boolean | null
          admin_id: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string
        }[]
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { u: string }; Returns: boolean }
      is_teacher_for_class: {
        Args: { p_class_id: string; p_teacher_id: string }
        Returns: boolean
      }
      is_teacher_for_student: {
        Args: { p_student_id: string; p_teacher_id: string }
        Returns: boolean
      }
    }
    Enums: {
      attendance_status: "present" | "absent" | "late" | "excused"
      conduct_grade: "S+" | "S" | "S*" | "S-"
      submission_status: "pending" | "printed" | "censored"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["present", "absent", "late", "excused"],
      conduct_grade: ["S+", "S", "S*", "S-"],
      submission_status: ["pending", "printed", "censored"],
    },
  },
} as const
