import { createClient } from '@/utils/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../../../../database.types';
import type { TypedSupabaseClient } from '@/utils/types';
import { useMutation } from '@tanstack/react-query';

export async function updateRegistrationAttendance(
  RegistrationId: string,
  Attendance: Database['public']['Enums']['attendance']
): Promise<{ error: PostgrestError | null; status: number }> {
  const supabase = createClient();
  const { error, status } = await supabase
    .from('eventsregistrations')
    .update({ attendance: Attendance })
    .eq('id', RegistrationId)
    .single();

  return { error, status };
}

export async function updateRegistrationApproval(
  RegistrationId: string,
  Approval: Database['public']['Enums']['registration-status']
): Promise<{ error: PostgrestError | null; status: number }> {
  const supabase = createClient();
  const { error, status } = await supabase
    .from('eventsregistrations')
    .update({ is_approved: Approval })
    .eq('id', RegistrationId)
    .single();

  return { error, status };
}

export async function updateRegistrationAttendanceHook(
  client: TypedSupabaseClient,
  props: {
    RegistrationId: string;
    Attendance: Database['public']['Enums']['attendance'];
  }
) {
  return client
    .from('eventsregistrations')
    .update({ attendance: props.Attendance })
    .eq('id', props.RegistrationId)
    .throwOnError()
    .single();
}

export async function updateRegistrationApprovalHook(
  client: TypedSupabaseClient,
  props: {
    RegistrationId: string;
    Approval: Database['public']['Enums']['registration-status'];
  }
) {
  return client
    .from('eventsregistrations')
    .update({ is_approved: props.Approval })
    .eq('id', props.RegistrationId)
    .throwOnError()
    .single();
}

export function useUpdateRegistrationAttendanceMutation() {
  const supabase = createClient();

  const mutationFn = async ({
    RegistrationId,
    Attendance,
  }: {
    RegistrationId: string;
    Attendance: Database['public']['Enums']['attendance'];
  }) => {
    return updateRegistrationAttendanceHook(supabase, {
      RegistrationId,
      Attendance,
    }).then(res => res.data);
  };

  return useMutation({ mutationFn });
}

export function useUpdateRegistrationApprovalMutation() {
  const supabase = createClient();

  const mutationFn = async ({
    RegistrationId,
    Approval,
  }: {
    RegistrationId: string;
    Approval: Database['public']['Enums']['registration-status'];
  }) => {
    return updateRegistrationApprovalHook(supabase, {
      RegistrationId,
      Approval,
    }).then(res => res.data);
  };

  return useMutation({ mutationFn });
}
