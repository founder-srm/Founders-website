'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { urlFor } from '@/sanity/lib/image';
import { createClient } from '@/utils/supabase/client';
import { Avatar, AvatarImage } from './ui/avatar';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {message: 'Name must be at least 2 characters.',})
    .max(20, { message: 'Name cannot be greater than 20 characters.' }),
  email: z.email(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .max(10, { message: 'Phone number cannot be longer than 10 digits.' }),
  message: z.string().min(10, { message: 'Message should be at least 10 characters' }),
  referral: z.string().optional(),
});

export function BookDemoForm({
  submitButtonText,
  thankYouMessage,
}: {
  title: string | null;
  subtitle: string | null;
  submitButtonText: string | null;
  thankYouMessage: string | null;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      referral: '',
    },
  });

  const supabase = createClient();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from('contactentries').insert([
      {
        name: values.name,
        phone: Number.parseInt(values.phone, 10),
        email: values.email,
        description: values.message,
        referral: values.referral,
      },
    ]);
    if (error) {
      console.error('Error inserting data:', error);
      alert(
        `There was an error! Details: "${error.message || error} That's all we know!`
      );
    } else {
      toast({
        title: 'Form submitted!',
        description: thankYouMessage,
      });
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="z-10 space-y-6 w-full">
        <div className="w-full space-y-6 rounded-xl border border-border bg-background px-6 py-10 shadow-sm">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="12345 67890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="someone@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Your message..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about us?
                  <span className="text-muted-foreground"> (Optional)</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="search">Web Search</SelectItem>
                    <SelectItem value="team">Founders Club Team</SelectItem>
                    <SelectItem value="socialmedia">Social Media</SelectItem>
                    <SelectItem value="we cool">
                      Someone told you we are cool!
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
              )}
          />

          <div className="flex w-full flex-col justify-end space-y-3 pt-2">
            <Button type="submit">{submitButtonText}</Button>
            <div className="text-xs text-muted-foreground">
              For more information about how we handle your personal
              information, please visit our{' '}
              <Link href="/PrivacyPolicy" className="underline">
                privacy policy
              </Link>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AvatarGroup({ teamMembers }: { teamMembers?: any[] | null }) {
  // If no team members are provided, use placeholder avatars
  if (!teamMembers || teamMembers.length === 0) {
    return (
      <div className="mt-16 flex overflow-hidden">
        <Avatar className="size-11 -ml-0">
          <AvatarImage
            src="https://shadcnblocks.com/images/block/avatar-1.webp"
            alt="Avatar 1"
          />
        </Avatar>
        <Avatar className="size-11 -ml-4">
          <AvatarImage
            src="https://shadcnblocks.com/images/block/avatar-3.webp"
            alt="Avatar 2"
          />
        </Avatar>
        <Avatar className="size-11 -ml-4">
          <AvatarImage
            src="https://shadcnblocks.com/images/block/avatar-2.webp"
            alt="Avatar 3"
          />
        </Avatar>
      </div>
    );
  }

  // Use team members from Sanity
  return (
    <div className="mt-16 flex overflow-hidden">
      {teamMembers.map((member, index) => (
        <Avatar
          key={member._id}
          className={`size-11 ${index === 0 ? '-ml-0' : '-ml-4'}`}
        >
          <AvatarImage
            src={
              member.image ? urlFor(member.image).width(100).url() : undefined
            }
            alt={`${member.name || 'Team member'}`}
          />
          {!member.image && (
            <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center">
              {member.name?.charAt(0) || '?'}
            </div>
          )}
        </Avatar>
      ))}
    </div>
  );
}
