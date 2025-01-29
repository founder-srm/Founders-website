import { createClient } from "@/utils/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "../../../../database.types";

export async function updateRegistrationAttendance(
    RegistrationId: string,
    Attendance: Database['public']['Enums']['attendance']
  ): Promise<{ error: PostgrestError | null; status: number }> {
    
    const supabase = createClient();
    const {error, status} = await supabase
      .from('eventsregistrations')
      .update({ attendance: Attendance })
      .eq('id', RegistrationId)
      .single();


    return { error, status};
  }

export async function updateRegistrationApproval(
    RegistrationId: string,
    Approval: Database['public']['Enums']['registration-status']
  ): Promise<{ error: PostgrestError | null; status: number }> {
    
    const supabase = createClient();
    const {error, status} = await supabase
      .from('eventsregistrations')
      .update({ is_approved: Approval })
      .eq('id', RegistrationId)
      .single();


    return { error, status};
  }