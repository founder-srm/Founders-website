'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
// import { useToast } from '@/hooks/use-toast'
import { FormBuilder } from './form-builder'
import { z } from 'zod'

import type { Event } from '@/types/events'
// import { createEvent } from '@/actions/typeform-upload'


interface FormField {
  name: string
  label: string
  fieldType: string
  required: boolean
  options?: string[]
}

function generateZodSchema(fields: FormField[]) {
  const schemaObj: Record<string, any> = {}
  fields.forEach(field => {
    let fieldSchema: any
    switch (field.fieldType) {
      case 'text':
      case 'textarea':
        fieldSchema = z.string()
        if (field.validation?.minLength) fieldSchema = fieldSchema.min(field.validation.minLength)
        if (field.validation?.maxLength) fieldSchema = fieldSchema.max(field.validation.maxLength)
        if (field.validation?.pattern) fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern))
        break
      case 'date':
        fieldSchema = z.string().refine(val => !Number.isNaN(Date.parse(val)), {
          message: 'Invalid date',
        })
        break
      case 'checkbox':
        if (field.checkboxType === 'multiple') {
          fieldSchema = z.array(z.string()).default([])
        } else {
          fieldSchema = z.boolean().default(false)
        }
        break
      case 'radio':
      case 'select':
        fieldSchema = z.enum(field.options as [string, ...string[]])
        break
      case 'slider':
        fieldSchema = z.number().min(field.min ?? 0).max(field.max ?? 100)
        break
      default:
        fieldSchema = z.any()
    }
    schemaObj[field.name] = field.required ? fieldSchema : fieldSchema.optional()
  })
  return z.object(schemaObj)
}

export default function EventFormBuilderPage() {
  const [formFields, setFormFields] = useState<FormField[]>([])
  // const { toast } = useToast()
  
  const dynamicSchema = generateZodSchema(formFields)
  const form = useForm<any>({
    resolver: zodResolver(dynamicSchema),
  })

  const onSubmit = (data: Event) => {
    console.log("Form data:", data)
    console.log("Form fields:", formFields)
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset>
            <div className="space-y-6">
              {/* Basic Event Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <Input {...form.register('title')} placeholder="Event Title" />
                <Input {...form.register('venue')} placeholder="Venue" />
                <Input {...form.register('start_date')} type="datetime-local" />
                <Input {...form.register('end_date')} type="datetime-local" />
                <Input {...form.register('publish_date')} type="datetime-local" />
                <Input {...form.register('banner_image')} type="url" placeholder="Banner Image URL" />
              </div>
              
              <Textarea {...form.register('description')} placeholder="Event Description" />
              <Textarea {...form.register('rules')} placeholder="Event Rules" />
              <Textarea {...form.register('more_info')} placeholder="Additional Information" />
              
              {/* Dynamic Form Builder */}
              <FormBuilder 
                fields={formFields}
                onChange={setFormFields}
              />

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline">Cancel</Button>
                <Button type="submit" onClick={() => { console.log("Button submit clicked"); console.log(formFields); form.handleSubmit(onSubmit);}}>
                  Create Event
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </Card>
    </div>
  )
}