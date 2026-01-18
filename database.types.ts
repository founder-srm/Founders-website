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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      adminuseraccount: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string
          user_role: Database["public"]["Enums"]["user-role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user-role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user-role"]
        }
        Relationships: []
      }
      club_representatives: {
        Row: {
          club_email: string
          club_name: string
          club_website: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          status: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          club_email: string
          club_name: string
          club_website?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          club_email?: string
          club_name?: string
          club_website?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      clubs: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      clubuseraccount: {
        Row: {
          club_id: string
          created_at: string
          email: string
          id: string
          is_verified: boolean
          user_id: string
          user_role: Database["public"]["Enums"]["club_user_role"]
        }
        Insert: {
          club_id: string
          created_at?: string
          email: string
          id?: string
          is_verified?: boolean
          user_id: string
          user_role?: Database["public"]["Enums"]["club_user_role"]
        }
        Update: {
          club_id?: string
          created_at?: string
          email?: string
          id?: string
          is_verified?: boolean
          user_id?: string
          user_role?: Database["public"]["Enums"]["club_user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "clubuseraccount_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      contactentries: {
        Row: {
          company: string | null
          company_size: string | null
          country: string | null
          description: string | null
          email: string | null
          id: string
          inserted_at: string
          name: string | null
          phone: number | null
          referral: string | null
          subject: string | null
        }
        Insert: {
          company?: string | null
          company_size?: string | null
          country?: string | null
          description?: string | null
          email?: string | null
          id?: string
          inserted_at?: string
          name?: string | null
          phone?: number | null
          referral?: string | null
          subject?: string | null
        }
        Update: {
          company?: string | null
          company_size?: string | null
          country?: string | null
          description?: string | null
          email?: string | null
          id?: string
          inserted_at?: string
          name?: string | null
          phone?: number | null
          referral?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          always_approve: boolean
          banner_image: string
          created_at: string
          description: string
          end_date: string
          event_type: Database["public"]["Enums"]["event-type"] | null
          id: string
          is_featured: boolean | null
          is_gated: boolean | null
          more_info: string | null
          more_info_text: string | null
          publish_date: string
          rules: string | null
          slug: string
          start_date: string
          tags: string[]
          title: string
          typeform_config: Json
          venue: string
        }
        Insert: {
          always_approve?: boolean
          banner_image: string
          created_at?: string
          description: string
          end_date: string
          event_type?: Database["public"]["Enums"]["event-type"] | null
          id?: string
          is_featured?: boolean | null
          is_gated?: boolean | null
          more_info?: string | null
          more_info_text?: string | null
          publish_date: string
          rules?: string | null
          slug?: string
          start_date: string
          tags: string[]
          title: string
          typeform_config: Json
          venue: string
        }
        Update: {
          always_approve?: boolean
          banner_image?: string
          created_at?: string
          description?: string
          end_date?: string
          event_type?: Database["public"]["Enums"]["event-type"] | null
          id?: string
          is_featured?: boolean | null
          is_gated?: boolean | null
          more_info?: string | null
          more_info_text?: string | null
          publish_date?: string
          rules?: string | null
          slug?: string
          start_date?: string
          tags?: string[]
          title?: string
          typeform_config?: Json
          venue?: string
        }
        Relationships: []
      }
      eventsregistrations: {
        Row: {
          application_id: string
          attendance: Database["public"]["Enums"]["attendance"]
          created_at: string
          details: Json
          event_id: string
          event_title: string
          id: string
          is_approved: Database["public"]["Enums"]["registration-status"]
          is_team_entry: boolean | null
          registration_email: string
          ticket_id: number
        }
        Insert: {
          application_id?: string
          attendance?: Database["public"]["Enums"]["attendance"]
          created_at?: string
          details: Json
          event_id?: string
          event_title: string
          id?: string
          is_approved?: Database["public"]["Enums"]["registration-status"]
          is_team_entry?: boolean | null
          registration_email: string
          ticket_id?: number
        }
        Update: {
          application_id?: string
          attendance?: Database["public"]["Enums"]["attendance"]
          created_at?: string
          details?: Json
          event_id?: string
          event_title?: string
          id?: string
          is_approved?: Database["public"]["Enums"]["registration-status"]
          is_team_entry?: boolean | null
          registration_email?: string
          ticket_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "eventsregistrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string
          author_image: string
          content: string
          created_at: string
          id: number
          image: string
          published_at: string
          slug: string
          summary: string
          tag: Database["public"]["Enums"]["blog-post-types"] | null
          title: string
        }
        Insert: {
          author: string
          author_image?: string
          content: string
          created_at?: string
          id?: never
          image: string
          published_at?: string
          slug: string
          summary: string
          tag?: Database["public"]["Enums"]["blog-post-types"] | null
          title: string
        }
        Update: {
          author?: string
          author_image?: string
          content?: string
          created_at?: string
          id?: never
          image?: string
          published_at?: string
          slug?: string
          summary?: string
          tag?: Database["public"]["Enums"]["blog-post-types"] | null
          title?: string
        }
        Relationships: []
      }
      team: {
        Row: {
          created_at: string
          id: number
          image: string | null
          join_date: string | null
          name: string | null
          position: string | null
          rollno: string | null
          socials: Json | null
          tagline: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          join_date?: string | null
          name?: string | null
          position?: string | null
          rollno?: string | null
          socials?: Json | null
          tagline?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          join_date?: string | null
          name?: string | null
          position?: string | null
          rollno?: string | null
          socials?: Json | null
          tagline?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extended_search_registrations: {
        Args: { search_query: string }
        Returns: {
          application_id: string
          attendance: Database["public"]["Enums"]["attendance"]
          created_at: string
          details: Json
          event_id: string
          event_title: string
          id: string
          is_approved: Database["public"]["Enums"]["registration-status"]
          registration_email: string
          ticket_id: number
        }[]
      }
      get_event_registrations: {
        Args: never
        Returns: {
          application_id: string
          attendance: Database["public"]["Enums"]["attendance"]
          created_at: string
          details: Json
          event_id: string
          event_slug: string
          event_title_from_registration: string
          is_approved: boolean
          registration_id: string
          ticket_id: number
          user_email: string
        }[]
      }
      mark_attendance: { Args: { registration_id: string }; Returns: undefined }
      reset_attendance: { Args: { input_event_id: string }; Returns: undefined }
      toggle_attendance: {
        Args: {
          new_attendance: Database["public"]["Enums"]["attendance"]
          registration_id: string
        }
        Returns: string
      }
    }
    Enums: {
      attendance: "Present" | "Absent"
      "blog-post-types":
        | "SuccessStories"
        | "StudentEntrepreneurs"
        | "TechInnovation"
        | "StartupTips"
        | "Technical"
        | "Projects"
        | "Hackathons"
        | "Foundathon"
        | "Ideathon"
        | "OpenHouse"
        | "Other"
      club_user_role: "club_rep" | "admin"
      "event-type": "online" | "offline" | "hybrid"
      "registration-status": "SUBMITTED" | "ACCEPTED" | "REJECTED" | "INVALID"
      "user-role": "user" | "moderator" | "admin" | "owner"
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
      attendance: ["Present", "Absent"],
      "blog-post-types": [
        "SuccessStories",
        "StudentEntrepreneurs",
        "TechInnovation",
        "StartupTips",
        "Technical",
        "Projects",
        "Hackathons",
        "Foundathon",
        "Ideathon",
        "OpenHouse",
        "Other",
      ],
      club_user_role: ["club_rep", "admin"],
      "event-type": ["online", "offline", "hybrid"],
      "registration-status": ["SUBMITTED", "ACCEPTED", "REJECTED", "INVALID"],
      "user-role": ["user", "moderator", "admin", "owner"],
    },
  },
} as const
