'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  FileCheck,
  Loader2,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import type { ClubSignupFormData } from '../actions';
import { clubsignup } from '../actions';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ============================================================================
// DATA
// ============================================================================

const STEPS = [
  { id: 1, name: 'Personal Info', description: 'Basic details', icon: User },
  { id: 2, name: 'Club Info', description: 'Club Details', icon: Boxes },
  // {
  //   id: 3,
  //   name: "Verification",
  //   description: "Verify Club Email",
  //   icon: ShieldCheck,
  // },
  { id: 3, name: 'Review', description: 'Final check', icon: FileCheck },
];

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const profileSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First Name should be atleast 2 letters long' })
      .max(50, { message: 'First Name can be only 50 letters long' }),
    lastName: z
      .string()
      .min(2, { message: 'Last Name should be atleast 2 letters long' })
      .max(50, { message: 'Last Name can be only 50 letters long' }),
    repMail: z.email({ message: 'Please enter a valid email address' }),
    repPhone: z
      .string()
      .min(10, { message: 'Please enter a valid phone number' })
      .max(50, { message: 'Please enter a valid phone number' }),
    repPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    repConfirmPassword: z.string(),
  })
  .refine(data => data.repPassword === data.repConfirmPassword, {
    message: "Passwords don't match",
    path: ['repConfirmPassword'],
  });

const clubSchema = z.object({
  clubName: z
    .string()
    .min(2, { message: 'Club Name should be atleast 2 letters long' }),
  clubMail: z.email({ message: 'Please enter a valid email address' }),
  clubWebsite: z.url().optional(),
});

// ============================================================================
// COMPONENTS
// ============================================================================

function SidebarStep({
  step,
  currentStep,
}: {
  step: (typeof STEPS)[0];
  currentStep: number;
}) {
  const Icon = step.icon;
  const isCompleted = currentStep > step.id;
  const isCurrent = currentStep === step.id;

  return (
    <div className="relative flex items-center gap-4 py-4">
      {/* Vertical Line */}
      {step.id !== STEPS.length && (
        <div className="absolute left-6 top-10 h-full w-[2px] bg-border/30">
          <motion.div
            className="h-full w-full bg-primary"
            initial={{ height: '0%' }}
            animate={{ height: isCompleted ? '100%' : '0%' }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Icon Bubble */}
      <motion.div
        className={cn(
          'relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
          isCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : isCurrent
              ? 'border-primary bg-background text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]'
              : 'border-border/50 bg-background/50 text-muted-foreground'
        )}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check className="h-5 w-5" strokeWidth={3} />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </motion.div>

      {/* Text Info */}
      <div className="flex flex-col">
        <span
          className={cn(
            'text-sm font-semibold transition-colors duration-300',
            isCurrent || isCompleted
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {step.name}
        </span>
        <span className="text-xs text-muted-foreground/70">
          {step.description}
        </span>
      </div>
    </div>
  );
}

// function InputField({
//   label,
//   placeholder,
//   type = "text",
// }: {
//   label: string;
//   placeholder: string;
//   type?: string;
// }) {
//   return (
//     <div className="space-y-2">
//       <Label
//         htmlFor={label.toLowerCase().replace(/\s/g, "-")}
//         className="text-sm font-medium"
//       >
//         {label} <span className="text-destructive">*</span>
//       </Label>
//       <Input
//         id={label.toLowerCase().replace(/\s/g, "-")}
//         type={type}
//         placeholder={placeholder}
//         className="rounded-lg border-border/40 bg-background/40 backdrop-blur transition-all focus:border-primary/50 focus:bg-background/60"
//       />
//     </div>
//   );
// }

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/20 bg-background/40 p-3 backdrop-blur transition-colors hover:bg-background/60">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function WizardForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    repMail: '',
    repPhone: '',
    repPassword: '',
    repConfirmPassword: '',
  });
  const [clubFormData, setClubFormData] = useState<z.infer<typeof clubSchema>>({
    clubName: '',
    clubMail: '',
    clubWebsite: undefined,
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  });
  const clubForm = useForm<z.infer<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    mode: 'onChange',
  });

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setProfileFormData(values);
    // ✅ This will be type-safe and validated.
    console.log(values);
    setCurrentStep(currentStep + 1);
  }
  function onClubSubmit(values: z.infer<typeof clubSchema>) {
    setClubFormData({
      clubName: values.clubName,
      clubMail: values.clubMail,
      clubWebsite: values.clubWebsite,
    });
    // ✅ This will be type-safe and validated.
    console.log(values);
    setCurrentStep(currentStep + 1);
  }

  // const handleRepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setRepFormData({ ...repFormData, [e.target.name]: e.target.value });
  // };

  const handleNext = async () => {
    if (currentStep === 1) {
      profileForm.handleSubmit(onProfileSubmit)();
    } else if (currentStep === 2) {
      clubForm.handleSubmit(onClubSubmit)();
    } else if (currentStep === STEPS.length) {
      // Final submission logic - pass all collected data
      const submitData: ClubSignupFormData = {
        email: profileFormData.repMail,
        password: profileFormData.repPassword,
        confirmPassword: profileFormData.repConfirmPassword,
        firstName: profileFormData.firstName,
        lastName: profileFormData.lastName,
        phone: profileFormData.repPhone,
        clubName: clubFormData.clubName,
        clubEmail: clubFormData.clubMail,
        clubWebsite: clubFormData.clubWebsite,
        terms: true,
      };

      setIsSubmitting(true);
      try {
        const result = await clubsignup(submitData);

        if (result && !result.success) {
          // Handle specific error cases
          if (result.code === 'USER_EXISTS') {
            toast.error('Account already exists', {
              description:
                'A user with this email is already registered. Please log in instead.',
              action: {
                label: 'Go to Login',
                onClick: () => router.push('/auth/login'),
              },
            });
          } else {
            toast.error('Signup failed', {
              description:
                result.error ||
                'An unexpected error occurred. Please try again.',
            });
          }
          setIsSubmitting(false);
          return;
        }

        // Success - redirect to club dashboard
        toast.success('Account created!', {
          description: 'Redirecting to your club dashboard...',
        });
        router.push('/club-dashboard');
      } catch (error) {
        console.error('Signup error:', error);
        toast.error('Signup failed', {
          description: 'An unexpected error occurred. Please try again.',
        });
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background p-6 lg:p-12 w-full">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <Badge
            variant="outline"
            className="mb-4 inline-flex items-center gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Club Representative
          </Badge>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Account Setup
          </h1>
          <p className="text-muted-foreground">
            Complete the steps below to verify your profile
          </p>
        </div>

        {/* Main Card Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-3xl border border-border/40 bg-background/40 backdrop-blur-xl"
        >
          {/* Glass Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

          <div className="grid lg:grid-cols-[320px_1fr]">
            {/* Left Sidebar - Steps */}
            <div className="border-b border-border/40 bg-background/30 p-8 lg:border-b-0 lg:border-r">
              <div className="space-y-1">
                {STEPS.map(step => (
                  <SidebarStep
                    key={step.id}
                    step={step}
                    currentStep={currentStep}
                  />
                ))}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex flex-col p-8 lg:p-12">
              <div className="flex-1">
                <motion.div
                  key={currentStep}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-8"
                >
                  {/* Step Header */}
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {STEPS[currentStep - 1].name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {STEPS[currentStep - 1].description}
                    </p>
                  </div>

                  {/* Form Content */}
                  <div className="min-h-[300px]">
                    {currentStep === 1 && (
                      <Form {...profileForm}>
                        <form className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Doe"
                                      {...field}
                                      // onChange={handleRepInputChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="repMail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="name@example.com"
                                      {...field}
                                      // onChange={handleRepInputChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="repPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Your Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="97846 28401"
                                      {...field}
                                      // onChange={handleRepInputChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={profileForm.control}
                            name="repPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Set Password</FormLabel>
                                <FormControl>
                                  <Input
                                    // placeholder="name@example.com"
                                    {...field}
                                    type={'password'}
                                    // onChange={handleRepInputChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="repConfirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input
                                    // placeholder="name@example.com"
                                    {...field}
                                    type={'password'}
                                    // onChange={handleRepInputChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    )}

                    {currentStep === 2 && (
                      <Form {...clubForm}>
                        <form className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <FormField
                              control={clubForm.control}
                              name="clubName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Club Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Club Name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={clubForm.control}
                              name="clubMail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Club Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="club@example.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={clubForm.control}
                            name="clubWebsite"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Club Website{' '}
                                  <span className="text-xs text-muted-foreground">
                                    (Optional)
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://www.example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    )}

                    {/* {currentStep === 3 && (
                      <h1>Verification Flow</h1>
                      // <div className="space-y-8">
                      //   <div className="space-y-4">
                      //     <Label className="text-base">
                      //       Notification Method
                      //     </Label>
                      //     <div className="grid gap-4 sm:grid-cols-3">
                      //       {["Email", "SMS", "Both"].map((option) => (
                      //         <label
                      //           key={option}
                      //           className="relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border/40 bg-background/40 p-4 text-center transition-all hover:border-primary/50 hover:bg-background/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      //         >
                      //           <input
                      //             type="radio"
                      //             name="notification"
                      //             className="sr-only"
                      //           />
                      //           <span className="text-sm font-medium">
                      //             {option}
                      //           </span>
                      //         </label>
                      //       ))}
                      //     </div>
                      //   </div>

                      //   <div className="space-y-4">
                      //     <Label className="text-base">Theme Preference</Label>
                      //     <div className="grid gap-4 sm:grid-cols-3">
                      //       {["Auto", "Light", "Dark"].map((option) => (
                      //         <label
                      //           key={option}
                      //           className="relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-border/40 bg-background/40 p-4 text-center transition-all hover:border-primary/50 hover:bg-background/60 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      //         >
                      //           <input
                      //             type="radio"
                      //             name="theme"
                      //             className="sr-only"
                      //           />
                      //           <span className="text-sm font-medium">
                      //             {option}
                      //           </span>
                      //         </label>
                      //       ))}
                      //     </div>
                      //   </div>
                      // </div>
                    )} */}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="rounded-xl border border-border/40 bg-background/20 p-6">
                          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Personal Information
                          </h3>
                          <div className="grid gap-3">
                            <ReviewItem
                              label="Full Name"
                              value={`${profileFormData.firstName} ${profileFormData.lastName}`}
                            />
                            <ReviewItem
                              label="Email Address"
                              value={profileFormData.repMail}
                            />
                            <ReviewItem
                              label="Phone Number"
                              value={profileFormData.repPhone}
                            />
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/40 bg-background/20 p-6">
                          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Club Information
                          </h3>
                          <div className="grid gap-3">
                            <ReviewItem
                              label="Club Name"
                              value={clubFormData.clubName}
                            />
                            <ReviewItem
                              label="Club Email"
                              value={clubFormData.clubMail}
                            />
                            <ReviewItem
                              label="Club Website"
                              value={
                                clubFormData.clubWebsite || 'Not Provided!'
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Footer / Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-8">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                  className="gap-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="gap-2 rounded-full bg-primary px-8 hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating account...
                    </>
                  ) : currentStep === STEPS.length ? (
                    <>
                      Submit
                      <Check className="size-4" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WizardForm;
