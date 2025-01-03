"use client";
import { createContext, useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type FormField = {
  fieldType: "text" | "radio" | "select" | "slider" | "checkbox" | "date" | "textarea";
  label: string;
  name: string;
  description?: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  checkboxType?: "single" | "multiple"; // Add this property
  items?: Array<{ id: string; label: string }>; // Add this for multiple checkboxes
};

function generateZodSchema(fields: FormField[]) {
  const schemaObj: Record<string, any> = {};
  
  fields.forEach((field) => {
    let fieldSchema: any;
    
    switch (field.fieldType) {
      case "text":
        fieldSchema = z.string();
        if (field.validation?.minLength) fieldSchema = fieldSchema.min(field.validation.minLength);
        if (field.validation?.maxLength) fieldSchema = fieldSchema.max(field.validation.maxLength);
        if (field.validation?.pattern) fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern));
        break;
      case "date":
        fieldSchema = z.date();
        break;
      case "checkbox":
        if (field.checkboxType === "multiple") {
          fieldSchema = z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
          });
        } else {
          fieldSchema = z.boolean().default(false);
        }
        break;
      case "radio":
      case "select":
        fieldSchema = z.enum(field.options as [string, ...string[]]);
        break;
      case "slider":
        fieldSchema = z.number()
          .min(field.min || 0)
          .max(field.max || 100);
        break;
      case "textarea":
        fieldSchema = z.string();
        if (field.validation?.minLength) fieldSchema = fieldSchema.min(field.validation.minLength);
        if (field.validation?.maxLength) fieldSchema = fieldSchema.max(field.validation.maxLength);
        break;
    }

    if (field.required) {
      schemaObj[field.name] = fieldSchema;
    } else {
      schemaObj[field.name] = fieldSchema.optional();
    }
  });

  return z.object(schemaObj);
}

export function TypeformMultiStep({ fields }: { fields: FormField[] }) {
  const [step, setStep] = useState(0);
  const formSchema = generateZodSchema(fields);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function renderField(field: FormField) {
    return (
      <FormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {(() => {
                switch (field.fieldType) {
                  case "text":
                    return <Input {...formField} />;
                    
                  case "date":
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            {formField.value ? (
                              format(formField.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formField.value}
                            onSelect={formField.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );
                    
                  case "radio":
                    return (
                      <RadioGroup
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                        className="flex flex-col space-y-1"
                      >
                        {field.options?.map((opt) => (
                          <FormItem key={opt} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={opt} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {opt}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    );

                  case "select":
                    return (
                      <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {field.options?.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );

                  case "slider":
                    return (
                      <Slider
                        defaultValue={[formField.value || field.min || 0]}
                        max={field.max || 100}
                        step={1}
                        onValueChange={([value]) => formField.onChange(value)}
                      />
                    );

                  case "checkbox":
                    if (field.checkboxType === "multiple" && field.items) {
                      return (
                        <div className="space-y-2">
                          {field.items.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name={field.name}
                              render={({ field: arrayField }) => (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={arrayField.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? arrayField.onChange([...arrayField.value || [], item.id])
                                          : arrayField.onChange(
                                              arrayField.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      );
                    }
                    return (
                      <div className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={formField.value}
                            onCheckedChange={formField.onChange}
                          />
                        </FormControl>
                      </div>
                    );

                  case "textarea":
                    return (
                      <Textarea
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="resize-none"
                        {...formField}
                      />
                    );

                  // ...implement other field types similarly...
                }
              })()}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Handle form submission
    console.log(data);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Progress value={((step + 1) / fields.length) * 100} className="mb-8" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {renderField(fields[step])}
          
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <Button type="submit">
              {step < fields.length - 1 ? "Next" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}