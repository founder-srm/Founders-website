export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          ip_address: string
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Relationships: []
      }
      flow_state: {
        Row: {
          auth_code: string
          auth_code_issued_at: string | null
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at: string | null
          id: string
          provider_access_token: string | null
          provider_refresh_token: string | null
          provider_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_code: string
          auth_code_issued_at?: string | null
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_code?: string
          auth_code_issued_at?: string | null
          authentication_method?: string
          code_challenge?: string
          code_challenge_method?: Database["auth"]["Enums"]["code_challenge_method"]
          created_at?: string | null
          id?: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identities: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity_data: Json
          last_sign_in_at: string | null
          provider: string
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data: Json
          last_sign_in_at?: string | null
          provider: string
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data?: Json
          last_sign_in_at?: string | null
          provider?: string
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      instances: {
        Row: {
          created_at: string | null
          id: string
          raw_base_config: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      mfa_amr_claims: {
        Row: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Update: {
          authentication_method?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mfa_amr_claims_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_challenges: {
        Row: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code: string | null
          verified_at: string | null
          web_authn_session_data: Json | null
        }
        Insert: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Update: {
          created_at?: string
          factor_id?: string
          id?: string
          ip_address?: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_challenges_auth_factor_id_fkey"
            columns: ["factor_id"]
            isOneToOne: false
            referencedRelation: "mfa_factors"
            referencedColumns: ["id"]
          },
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name: string | null
          id: string
          last_challenged_at: string | null
          phone: string | null
          secret: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
          web_authn_aaguid: string | null
          web_authn_credential: Json | null
        }
        Insert: {
          created_at: string
          factor_type: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id: string
          last_challenged_at?: string | null
          phone?: string | null
          secret?: string | null
          status: Database["auth"]["Enums"]["factor_status"]
          updated_at: string
          user_id: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Update: {
          created_at?: string
          factor_type?: Database["auth"]["Enums"]["factor_type"]
          friendly_name?: string | null
          id?: string
          last_challenged_at?: string | null
          phone?: string | null
          secret?: string | null
          status?: Database["auth"]["Enums"]["factor_status"]
          updated_at?: string
          user_id?: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "mfa_factors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      one_time_tokens: {
        Row: {
          created_at: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relates_to?: string
          token_hash?: string
          token_type?: Database["auth"]["Enums"]["one_time_token_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "one_time_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          id: number
          instance_id: string | null
          parent: string | null
          revoked: boolean | null
          session_id: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      saml_providers: {
        Row: {
          attribute_mapping: Json | null
          created_at: string | null
          entity_id: string
          id: string
          metadata_url: string | null
          metadata_xml: string
          name_id_format: string | null
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id: string
          id: string
          metadata_url?: string | null
          metadata_xml: string
          name_id_format?: string | null
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id?: string
          id?: string
          metadata_url?: string | null
          metadata_xml?: string
          name_id_format?: string | null
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_providers_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      saml_relay_states: {
        Row: {
          created_at: string | null
          flow_state_id: string | null
          for_email: string | null
          id: string
          redirect_to: string | null
          request_id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id: string
          redirect_to?: string | null
          request_id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id?: string
          redirect_to?: string | null
          request_id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saml_relay_states_flow_state_id_fkey"
            columns: ["flow_state_id"]
            isOneToOne: false
            referencedRelation: "flow_state"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saml_relay_states_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          version: string
        }
        Insert: {
          version: string
        }
        Update: {
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          aal: Database["auth"]["Enums"]["aal_level"] | null
          created_at: string | null
          factor_id: string | null
          id: string
          ip: unknown | null
          not_after: string | null
          refreshed_at: string | null
          tag: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id: string
          ip?: unknown | null
          not_after?: string | null
          refreshed_at?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          aal?: Database["auth"]["Enums"]["aal_level"] | null
          created_at?: string | null
          factor_id?: string | null
          id?: string
          ip?: unknown | null
          not_after?: string | null
          refreshed_at?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sso_domains_sso_provider_id_fkey"
            columns: ["sso_provider_id"]
            isOneToOne: false
            referencedRelation: "sso_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      sso_providers: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_admin_account: boolean | null
          is_anonymous: boolean
          is_sso_user: boolean
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id: string
          instance_id?: string | null
          invited_at?: string | null
          is_admin_account?: boolean | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_admin_account?: boolean | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      jwt: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      aal_level: "aal1" | "aal2" | "aal3"
      code_challenge_method: "s256" | "plain"
      factor_status: "unverified" | "verified"
      factor_type: "totp" | "webauthn" | "phone"
      one_time_token_type:
        | "confirmation_token"
        | "reauthentication_token"
        | "recovery_token"
        | "email_change_token_new"
        | "email_change_token_current"
        | "phone_change_token"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      acceptedentries: {
        Row: {
          attendance: boolean | null
          email_first: string | null
          email_lead: string | null
          gender_first: string | null
          gender_fourth: string | null
          gender_lead: string | null
          gender_second: string | null
          gender_third: string | null
          idea_desc: string | null
          name_first: string | null
          name_fourth: string | null
          name_lead: string | null
          name_second: string | null
          name_third: string | null
          phone_first: number | null
          phone_lead: number | null
          presentation_link: string | null
          qr_id: string | null
          registration_first: string | null
          registration_fourth: string | null
          registration_lead: string | null
          registration_second: string | null
          registration_third: string | null
          "Team Numbers": number
          track_name: string | null
        }
        Insert: {
          attendance?: boolean | null
          email_first?: string | null
          email_lead?: string | null
          gender_first?: string | null
          gender_fourth?: string | null
          gender_lead?: string | null
          gender_second?: string | null
          gender_third?: string | null
          idea_desc?: string | null
          name_first?: string | null
          name_fourth?: string | null
          name_lead?: string | null
          name_second?: string | null
          name_third?: string | null
          phone_first?: number | null
          phone_lead?: number | null
          presentation_link?: string | null
          qr_id?: string | null
          registration_first?: string | null
          registration_fourth?: string | null
          registration_lead?: string | null
          registration_second?: string | null
          registration_third?: string | null
          "Team Numbers": number
          track_name?: string | null
        }
        Update: {
          attendance?: boolean | null
          email_first?: string | null
          email_lead?: string | null
          gender_first?: string | null
          gender_fourth?: string | null
          gender_lead?: string | null
          gender_second?: string | null
          gender_third?: string | null
          idea_desc?: string | null
          name_first?: string | null
          name_fourth?: string | null
          name_lead?: string | null
          name_second?: string | null
          name_third?: string | null
          phone_first?: number | null
          phone_lead?: number | null
          presentation_link?: string | null
          qr_id?: string | null
          registration_first?: string | null
          registration_fourth?: string | null
          registration_lead?: string | null
          registration_second?: string | null
          registration_third?: string | null
          "Team Numbers"?: number
          track_name?: string | null
        }
        Relationships: []
      }
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
      bootcampregistration: {
        Row: {
          day1_an_in: boolean | null
          day1_an_out: boolean | null
          day1_fn_in: boolean | null
          day1_fn_out: boolean | null
          day2_an_in: boolean | null
          day2_an_out: boolean | null
          day2_fn_in: boolean | null
          day2_fn_out: boolean | null
          day3_an_in: boolean | null
          day3_an_out: boolean | null
          day3_fn_in: boolean | null
          day3_fn_out: boolean | null
          day4_an_in: boolean | null
          day4_an_out: boolean | null
          day4_fn_in: boolean | null
          day4_fn_out: boolean | null
          day5_an_in: boolean | null
          day5_an_out: boolean | null
          day5_fn_in: boolean | null
          day5_fn_out: boolean | null
          Email: string
          id: string
          Name: string
          "Phone Number": number
        }
        Insert: {
          day1_an_in?: boolean | null
          day1_an_out?: boolean | null
          day1_fn_in?: boolean | null
          day1_fn_out?: boolean | null
          day2_an_in?: boolean | null
          day2_an_out?: boolean | null
          day2_fn_in?: boolean | null
          day2_fn_out?: boolean | null
          day3_an_in?: boolean | null
          day3_an_out?: boolean | null
          day3_fn_in?: boolean | null
          day3_fn_out?: boolean | null
          day4_an_in?: boolean | null
          day4_an_out?: boolean | null
          day4_fn_in?: boolean | null
          day4_fn_out?: boolean | null
          day5_an_in?: boolean | null
          day5_an_out?: boolean | null
          day5_fn_in?: boolean | null
          day5_fn_out?: boolean | null
          Email: string
          id?: string
          Name: string
          "Phone Number": number
        }
        Update: {
          day1_an_in?: boolean | null
          day1_an_out?: boolean | null
          day1_fn_in?: boolean | null
          day1_fn_out?: boolean | null
          day2_an_in?: boolean | null
          day2_an_out?: boolean | null
          day2_fn_in?: boolean | null
          day2_fn_out?: boolean | null
          day3_an_in?: boolean | null
          day3_an_out?: boolean | null
          day3_fn_in?: boolean | null
          day3_fn_out?: boolean | null
          day4_an_in?: boolean | null
          day4_an_out?: boolean | null
          day4_fn_in?: boolean | null
          day4_fn_out?: boolean | null
          day5_an_in?: boolean | null
          day5_an_out?: boolean | null
          day5_fn_in?: boolean | null
          day5_fn_out?: boolean | null
          Email?: string
          id?: string
          Name?: string
          "Phone Number"?: number
        }
        Relationships: []
      }
      contactentries: {
        Row: {
          description: string | null
          email: string | null
          id: string | null
          inserted_at: string
          name: string | null
          phone: number | null
          subject: string | null
        }
        Insert: {
          description?: string | null
          email?: string | null
          id?: string | null
          inserted_at?: string
          name?: string | null
          phone?: number | null
          subject?: string | null
        }
        Update: {
          description?: string | null
          email?: string | null
          id?: string | null
          inserted_at?: string
          name?: string | null
          phone?: number | null
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
          more_info: string | null
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
          more_info?: string | null
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
          more_info?: string | null
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
      eventslist: {
        Row: {
          banner_url: string | null
          description: string | null
          end_date: string | null
          id: string
          isfeatured: boolean
          moreinfo: string | null
          name: string | null
          start_date: string
          updated_at: string | null
          venue: string | null
        }
        Insert: {
          banner_url?: string | null
          description?: string | null
          end_date?: string | null
          id: string
          isfeatured?: boolean
          moreinfo?: string | null
          name?: string | null
          start_date: string
          updated_at?: string | null
          venue?: string | null
        }
        Update: {
          banner_url?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          isfeatured?: boolean
          moreinfo?: string | null
          name?: string | null
          start_date?: string
          updated_at?: string | null
          venue?: string | null
        }
        Relationships: []
      }
      eventsregistrations: {
        Row: {
          application_id: string
          created_at: string
          details: Json
          event_id: string
          event_title: string
          id: string
          is_approved: boolean
          ticket_id: number
        }
        Insert: {
          application_id?: string
          created_at?: string
          details: Json
          event_id?: string
          event_title: string
          id?: string
          is_approved?: boolean
          ticket_id?: number
        }
        Update: {
          application_id?: string
          created_at?: string
          details?: Json
          event_id?: string
          event_title?: string
          id?: string
          is_approved?: boolean
          ticket_id?: number
        }
        Relationships: []
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
      "null-eventsregistration": {
        Row: {
          attendance: boolean
          email_first: string | null
          email_lead: string
          gender_first: string
          gender_fourth: string
          gender_lead: string
          gender_second: string
          gender_third: string
          id: number
          idea_desc: string
          inserted_at: string
          name_first: string
          name_fourth: string | null
          name_lead: string
          name_second: string | null
          name_third: string | null
          phone_first: number
          phone_lead: number
          presentation_link: string | null
          qr_id: string
          registration_first: string | null
          registration_fourth: string | null
          registration_lead: string
          registration_second: string | null
          registration_third: string | null
          track_name: string
        }
        Insert: {
          attendance?: boolean
          email_first?: string | null
          email_lead: string
          gender_first: string
          gender_fourth: string
          gender_lead: string
          gender_second: string
          gender_third: string
          id?: never
          idea_desc: string
          inserted_at?: string
          name_first: string
          name_fourth?: string | null
          name_lead: string
          name_second?: string | null
          name_third?: string | null
          phone_first: number
          phone_lead: number
          presentation_link?: string | null
          qr_id?: string
          registration_first?: string | null
          registration_fourth?: string | null
          registration_lead: string
          registration_second?: string | null
          registration_third?: string | null
          track_name: string
        }
        Update: {
          attendance?: boolean
          email_first?: string | null
          email_lead?: string
          gender_first?: string
          gender_fourth?: string
          gender_lead?: string
          gender_second?: string
          gender_third?: string
          id?: never
          idea_desc?: string
          inserted_at?: string
          name_first?: string
          name_fourth?: string | null
          name_lead?: string
          name_second?: string | null
          name_third?: string | null
          phone_first?: number
          phone_lead?: number
          presentation_link?: string | null
          qr_id?: string
          registration_first?: string | null
          registration_fourth?: string | null
          registration_lead?: string
          registration_second?: string | null
          registration_third?: string | null
          track_name?: string
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
      triumphtalkregistration: {
        Row: {
          Address: string
          attendance: boolean
          Department: string
          Email_Address: string
          qrID: string
          Section: string
          Student_EmailID: string
          Student_Name: string
          Student_Registration_No: string
          StudentPhoneNumber: string
          YearofStudy: string
        }
        Insert: {
          Address: string
          attendance?: boolean
          Department: string
          Email_Address: string
          qrID?: string
          Section: string
          Student_EmailID: string
          Student_Name: string
          Student_Registration_No: string
          StudentPhoneNumber: string
          YearofStudy: string
        }
        Update: {
          Address?: string
          attendance?: boolean
          Department?: string
          Email_Address?: string
          qrID?: string
          Section?: string
          Student_EmailID?: string
          Student_Name?: string
          Student_Registration_No?: string
          StudentPhoneNumber?: string
          YearofStudy?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
      "event-type": "online" | "offline" | "hybrid"
      "user-role": "user" | "moderator" | "admin" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
