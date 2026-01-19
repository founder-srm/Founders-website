"use server";

import { createClient } from "@/utils/supabase/elevatedClient";
import { getuserbyid } from "@/app/(auth)/auth/actions";

export interface ClubMember {
  id: string;
  user_id: string;
  club_id: string;
  email: string;
  user_role: "club_rep" | "member";
  is_verified: boolean;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
  };
}

export async function fetchClubMembers(clubId: string): Promise<{
  data: ClubMember[] | null;
  error: string | null;
}> {
  try {
    const supabase = createClient();

    const { data: clubMembers, error } = await supabase
      .from("clubuseraccount")
      .select("*")
      .eq("club_id", clubId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching club members:", error);
      return { data: null, error: error.message };
    }

    const membersWithDetails: ClubMember[] = await Promise.all(
      (clubMembers || []).map(async (member) => {
        try {
          const { data: userData } = await getuserbyid(member.user_id);
          return {
            ...member,
            user_metadata: userData?.user?.user_metadata,
          };
        } catch {
          return member;
        }
      })
    );

    return { data: membersWithDetails, error: null };
  } catch (err) {
    console.error("Error in fetchClubMembers:", err);
    return { data: null, error: "Failed to fetch club members" };
  }
}

export async function getClubById(clubId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .eq("id", clubId)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Error fetching club:", err);
    return { data: null, error: "Failed to fetch club" };
  }
}

export async function updateMemberRole(
  memberId: string,
  newRole: "club_rep" | "member"
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("clubuseraccount")
      .update({ user_role: newRole })
      .eq("id", memberId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Error updating member role:", err);
    return { success: false, error: "Failed to update member role" };
  }
}

export async function updateMemberVerification(
  memberId: string,
  isVerified: boolean
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("clubuseraccount")
      .update({ is_verified: isVerified })
      .eq("id", memberId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Error updating member verification:", err);
    return { success: false, error: "Failed to update member verification" };
  }
}

export async function removeMember(
  memberId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("clubuseraccount")
      .delete()
      .eq("id", memberId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Error removing member:", err);
    return { success: false, error: "Failed to remove member" };
  }
}

export async function updateClubProfilePicture(
  clubId: string,
  profilePictureUrl: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("clubs")
      .update({ profile_picture: profilePictureUrl })
      .eq("id", clubId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Error updating club profile picture:", err);
    return { success: false, error: "Failed to update profile picture" };
  }
}

export async function uploadClubImage(
  clubId: string,
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const file = formData.get("file") as File;

    if (!file) {
      return { url: null, error: "No file provided" };
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { url: null, error: "File too large. Maximum size is 5MB." };
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${clubId}/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("club-assets")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { url: null, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("club-assets")
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    console.error("Error uploading club image:", err);
    return { url: null, error: "Failed to upload image" };
  }
}
