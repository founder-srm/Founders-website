export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      acceptedentries: {
        Row: {
          attendance: boolean | null;
          email_first: string | null;
          email_lead: string | null;
          gender_first: string | null;
          gender_fourth: string | null;
          gender_lead: string | null;
          gender_second: string | null;
          gender_third: string | null;
          idea_desc: string | null;
          name_first: string | null;
          name_fourth: string | null;
          name_lead: string | null;
          name_second: string | null;
          name_third: string | null;
          phone_first: number | null;
          phone_lead: number | null;
          presentation_link: string | null;
          qr_id: string | null;
          registration_first: string | null;
          registration_fourth: string | null;
          registration_lead: string | null;
          registration_second: string | null;
          registration_third: string | null;
          'Team Numbers': number;
          track_name: string | null;
        };
        Insert: {
          attendance?: boolean | null;
          email_first?: string | null;
          email_lead?: string | null;
          gender_first?: string | null;
          gender_fourth?: string | null;
          gender_lead?: string | null;
          gender_second?: string | null;
          gender_third?: string | null;
          idea_desc?: string | null;
          name_first?: string | null;
          name_fourth?: string | null;
          name_lead?: string | null;
          name_second?: string | null;
          name_third?: string | null;
          phone_first?: number | null;
          phone_lead?: number | null;
          presentation_link?: string | null;
          qr_id?: string | null;
          registration_first?: string | null;
          registration_fourth?: string | null;
          registration_lead?: string | null;
          registration_second?: string | null;
          registration_third?: string | null;
          'Team Numbers': number;
          track_name?: string | null;
        };
        Update: {
          attendance?: boolean | null;
          email_first?: string | null;
          email_lead?: string | null;
          gender_first?: string | null;
          gender_fourth?: string | null;
          gender_lead?: string | null;
          gender_second?: string | null;
          gender_third?: string | null;
          idea_desc?: string | null;
          name_first?: string | null;
          name_fourth?: string | null;
          name_lead?: string | null;
          name_second?: string | null;
          name_third?: string | null;
          phone_first?: number | null;
          phone_lead?: number | null;
          presentation_link?: string | null;
          qr_id?: string | null;
          registration_first?: string | null;
          registration_fourth?: string | null;
          registration_lead?: string | null;
          registration_second?: string | null;
          registration_third?: string | null;
          'Team Numbers'?: number;
          track_name?: string | null;
        };
        Relationships: [];
      };
      bootcampregistration: {
        Row: {
          day1_an_in: boolean | null;
          day1_an_out: boolean | null;
          day1_fn_in: boolean | null;
          day1_fn_out: boolean | null;
          day2_an_in: boolean | null;
          day2_an_out: boolean | null;
          day2_fn_in: boolean | null;
          day2_fn_out: boolean | null;
          day3_an_in: boolean | null;
          day3_an_out: boolean | null;
          day3_fn_in: boolean | null;
          day3_fn_out: boolean | null;
          day4_an_in: boolean | null;
          day4_an_out: boolean | null;
          day4_fn_in: boolean | null;
          day4_fn_out: boolean | null;
          day5_an_in: boolean | null;
          day5_an_out: boolean | null;
          day5_fn_in: boolean | null;
          day5_fn_out: boolean | null;
          Email: string;
          id: string;
          Name: string;
          'Phone Number': number;
        };
        Insert: {
          day1_an_in?: boolean | null;
          day1_an_out?: boolean | null;
          day1_fn_in?: boolean | null;
          day1_fn_out?: boolean | null;
          day2_an_in?: boolean | null;
          day2_an_out?: boolean | null;
          day2_fn_in?: boolean | null;
          day2_fn_out?: boolean | null;
          day3_an_in?: boolean | null;
          day3_an_out?: boolean | null;
          day3_fn_in?: boolean | null;
          day3_fn_out?: boolean | null;
          day4_an_in?: boolean | null;
          day4_an_out?: boolean | null;
          day4_fn_in?: boolean | null;
          day4_fn_out?: boolean | null;
          day5_an_in?: boolean | null;
          day5_an_out?: boolean | null;
          day5_fn_in?: boolean | null;
          day5_fn_out?: boolean | null;
          Email: string;
          id?: string;
          Name: string;
          'Phone Number': number;
        };
        Update: {
          day1_an_in?: boolean | null;
          day1_an_out?: boolean | null;
          day1_fn_in?: boolean | null;
          day1_fn_out?: boolean | null;
          day2_an_in?: boolean | null;
          day2_an_out?: boolean | null;
          day2_fn_in?: boolean | null;
          day2_fn_out?: boolean | null;
          day3_an_in?: boolean | null;
          day3_an_out?: boolean | null;
          day3_fn_in?: boolean | null;
          day3_fn_out?: boolean | null;
          day4_an_in?: boolean | null;
          day4_an_out?: boolean | null;
          day4_fn_in?: boolean | null;
          day4_fn_out?: boolean | null;
          day5_an_in?: boolean | null;
          day5_an_out?: boolean | null;
          day5_fn_in?: boolean | null;
          day5_fn_out?: boolean | null;
          Email?: string;
          id?: string;
          Name?: string;
          'Phone Number'?: number;
        };
        Relationships: [];
      };
      contactentries: {
        Row: {
          description: string | null;
          email: string | null;
          id: string | null;
          inserted_at: string;
          name: string | null;
          phone: number | null;
          subject: string | null;
        };
        Insert: {
          description?: string | null;
          email?: string | null;
          id?: string | null;
          inserted_at?: string;
          name?: string | null;
          phone?: number | null;
          subject?: string | null;
        };
        Update: {
          description?: string | null;
          email?: string | null;
          id?: string | null;
          inserted_at?: string;
          name?: string | null;
          phone?: number | null;
          subject?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          banner_image: string;
          created_at: string;
          description: string;
          end_date: string;
          event_type: Database['public']['Enums']['event-type'] | null;
          id: string;
          is_featured: boolean | null;
          more_info: string | null;
          publish_date: string;
          rules: string | null;
          slug: string;
          start_date: string;
          tags: string[];
          title: string;
          typeform_config: Json;
          venue: string;
        };
        Insert: {
          banner_image: string;
          created_at?: string;
          description: string;
          end_date: string;
          event_type?: Database['public']['Enums']['event-type'] | null;
          id?: string;
          is_featured?: boolean | null;
          more_info?: string | null;
          publish_date: string;
          rules?: string | null;
          slug?: string;
          start_date: string;
          tags: string[];
          title: string;
          typeform_config: Json;
          venue: string;
        };
        Update: {
          banner_image?: string;
          created_at?: string;
          description?: string;
          end_date?: string;
          event_type?: Database['public']['Enums']['event-type'] | null;
          id?: string;
          is_featured?: boolean | null;
          more_info?: string | null;
          publish_date?: string;
          rules?: string | null;
          slug?: string;
          start_date?: string;
          tags?: string[];
          title?: string;
          typeform_config?: Json;
          venue?: string;
        };
        Relationships: [];
      };
      eventslist: {
        Row: {
          banner_url: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          isfeatured: boolean;
          moreinfo: string | null;
          name: string | null;
          start_date: string;
          updated_at: string | null;
          venue: string | null;
        };
        Insert: {
          banner_url?: string | null;
          description?: string | null;
          end_date?: string | null;
          id: string;
          isfeatured?: boolean;
          moreinfo?: string | null;
          name?: string | null;
          start_date: string;
          updated_at?: string | null;
          venue?: string | null;
        };
        Update: {
          banner_url?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          isfeatured?: boolean;
          moreinfo?: string | null;
          name?: string | null;
          start_date?: string;
          updated_at?: string | null;
          venue?: string | null;
        };
        Relationships: [];
      };
      eventsregistrations: {
        Row: {
          application_id: string;
          created_at: string;
          details: Json;
          event_id: string;
          event_title: string;
          id: string;
          ticket_id: number;
        };
        Insert: {
          application_id?: string;
          created_at?: string;
          details: Json;
          event_id?: string;
          event_title: string;
          id?: string;
          ticket_id?: number;
        };
        Update: {
          application_id?: string;
          created_at?: string;
          details?: Json;
          event_id?: string;
          event_title?: string;
          id?: string;
          ticket_id?: number;
        };
        Relationships: [];
      };
      newsletter: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      'null-eventsregistration': {
        Row: {
          attendance: boolean;
          email_first: string | null;
          email_lead: string;
          gender_first: string;
          gender_fourth: string;
          gender_lead: string;
          gender_second: string;
          gender_third: string;
          id: number;
          idea_desc: string;
          inserted_at: string;
          name_first: string;
          name_fourth: string | null;
          name_lead: string;
          name_second: string | null;
          name_third: string | null;
          phone_first: number;
          phone_lead: number;
          presentation_link: string | null;
          qr_id: string;
          registration_first: string | null;
          registration_fourth: string | null;
          registration_lead: string;
          registration_second: string | null;
          registration_third: string | null;
          track_name: string;
        };
        Insert: {
          attendance?: boolean;
          email_first?: string | null;
          email_lead: string;
          gender_first: string;
          gender_fourth: string;
          gender_lead: string;
          gender_second: string;
          gender_third: string;
          id?: never;
          idea_desc: string;
          inserted_at?: string;
          name_first: string;
          name_fourth?: string | null;
          name_lead: string;
          name_second?: string | null;
          name_third?: string | null;
          phone_first: number;
          phone_lead: number;
          presentation_link?: string | null;
          qr_id?: string;
          registration_first?: string | null;
          registration_fourth?: string | null;
          registration_lead: string;
          registration_second?: string | null;
          registration_third?: string | null;
          track_name: string;
        };
        Update: {
          attendance?: boolean;
          email_first?: string | null;
          email_lead?: string;
          gender_first?: string;
          gender_fourth?: string;
          gender_lead?: string;
          gender_second?: string;
          gender_third?: string;
          id?: never;
          idea_desc?: string;
          inserted_at?: string;
          name_first?: string;
          name_fourth?: string | null;
          name_lead?: string;
          name_second?: string | null;
          name_third?: string | null;
          phone_first?: number;
          phone_lead?: number;
          presentation_link?: string | null;
          qr_id?: string;
          registration_first?: string | null;
          registration_fourth?: string | null;
          registration_lead?: string;
          registration_second?: string | null;
          registration_third?: string | null;
          track_name?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          author: string;
          author_image: string;
          content: string;
          created_at: string;
          id: number;
          image: string;
          published_at: string;
          slug: string;
          summary: string;
          tag: Database['public']['Enums']['blog-post-types'] | null;
          title: string;
        };
        Insert: {
          author: string;
          author_image?: string;
          content: string;
          created_at?: string;
          id?: never;
          image: string;
          published_at?: string;
          slug: string;
          summary: string;
          tag?: Database['public']['Enums']['blog-post-types'] | null;
          title: string;
        };
        Update: {
          author?: string;
          author_image?: string;
          content?: string;
          created_at?: string;
          id?: never;
          image?: string;
          published_at?: string;
          slug?: string;
          summary?: string;
          tag?: Database['public']['Enums']['blog-post-types'] | null;
          title?: string;
        };
        Relationships: [];
      };
      team: {
        Row: {
          created_at: string;
          id: number;
          image: string | null;
          join_date: string | null;
          name: string | null;
          position: string | null;
          rollno: string | null;
          socials: Json | null;
          tagline: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          image?: string | null;
          join_date?: string | null;
          name?: string | null;
          position?: string | null;
          rollno?: string | null;
          socials?: Json | null;
          tagline?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          image?: string | null;
          join_date?: string | null;
          name?: string | null;
          position?: string | null;
          rollno?: string | null;
          socials?: Json | null;
          tagline?: string | null;
        };
        Relationships: [];
      };
      triumphtalkregistration: {
        Row: {
          Address: string;
          attendance: boolean;
          Department: string;
          Email_Address: string;
          qrID: string;
          Section: string;
          Student_EmailID: string;
          Student_Name: string;
          Student_Registration_No: string;
          StudentPhoneNumber: string;
          YearofStudy: string;
        };
        Insert: {
          Address: string;
          attendance?: boolean;
          Department: string;
          Email_Address: string;
          qrID?: string;
          Section: string;
          Student_EmailID: string;
          Student_Name: string;
          Student_Registration_No: string;
          StudentPhoneNumber: string;
          YearofStudy: string;
        };
        Update: {
          Address?: string;
          attendance?: boolean;
          Department?: string;
          Email_Address?: string;
          qrID?: string;
          Section?: string;
          Student_EmailID?: string;
          Student_Name?: string;
          Student_Registration_No?: string;
          StudentPhoneNumber?: string;
          YearofStudy?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      'blog-post-types':
        | 'SuccessStories'
        | 'StudentEntrepreneurs'
        | 'TechInnovation'
        | 'StartupTips'
        | 'Technical'
        | 'Projects'
        | 'Hackathons'
        | 'Foundathon'
        | 'Ideathon'
        | 'OpenHouse'
        | 'Other';
      'event-type': 'online' | 'offline' | 'hybrid';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
