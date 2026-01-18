"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getuserbyid } from "@/app/(auth)/auth/actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useClub from "@/hooks/use-club";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/stores/session";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";

const formSchema = z.object({
  uuid: z.uuid("Please enter a valid UUID."),
});

const AddMemberButton = () => {
  const user = useUser();
  const { isClub, club, loading: clubLoading } = useClub({ user });
  const [foundUser, setFoundUser] = useState<{
    id: string;
    email?: string | undefined;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uuid: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Searching for UUID:", data.uuid);

    const { data: userData, error: err } = await getuserbyid(data.uuid);

    console.log("Response:", { userData, err });

    if (err || !userData?.user) {
      console.log("User not found or error occurred");
      form.setError("uuid", { message: "No user found with this UUID." });
      setFoundUser(null);
      setIsLoading(false);
      return;
    }

    console.log("User found:", userData.user);
    setFoundUser(userData.user);
    setIsLoading(false);
  }

  async function handleAddMember() {
    if (!foundUser || !club) return;

    setIsSaving(true);
    const supabase = createClient();

    try {
      // First, find or create the club entry in the clubs table
      let clubId: string;

      // Check if club exists by name
      const { data: existingClub } = await supabase
        .from("clubs")
        .select("id")
        .eq("name", club.club_name)
        .single();

      if (existingClub) {
        clubId = existingClub.id;
      } else {
        // Create the club if it doesn't exist
        const { data: newClub, error: clubCreateError } = await supabase
          .from("clubs")
          .insert({
            name: club.club_name,
          })
          .select("id")
          .single();

        if (clubCreateError || !newClub) {
          toast({
            title: "Error",
            description: "Failed to create club entry. Please try again.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }

        clubId = newClub.id;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from("clubuseraccount")
        .select("*")
        .eq("user_id", foundUser.id)
        .eq("club_id", clubId)
        .single();

      if (existingMember) {
        toast({
          title: "Already a member",
          description: "This user is already a member of your club.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      // Add the member
      const { error } = await supabase.from("clubuseraccount").insert({
        user_id: foundUser.id,
        club_id: clubId,
        email: foundUser.email || "",
        user_role: "member",
        is_verified: false,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      toast({
        title: "Success",
        description: "Member added successfully!",
      });

      // Reset form and close dialog
      form.reset();
      setFoundUser(null);
      setIsSaving(false);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  }

  if (clubLoading) {
    return null;
  }

  if (!isClub || !club) {
    return null;
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          form.reset();
          setFoundUser(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Ask your team member&apos;s UUID. They can find it under their
            account settings after they&apos;ve created an account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <FormField
              control={form.control}
              name="uuid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UUID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter member UUID"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>Member&apos;s UUID</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Search User
            </Button>

            {foundUser && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={
                        foundUser.user_metadata?.avatar_url || "/FC-logo1.png"
                      }
                      alt="User Avatar"
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {foundUser.user_metadata?.full_name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {foundUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={!foundUser || isSaving}
            onClick={handleAddMember}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddMemberButton;
