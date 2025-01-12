'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

type FormField = {
  name: string
  label: string
  fieldType: string
  required: boolean
  options?: string[]
  description?: string
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  checkboxType?: 'single' | 'multiple'
  min?: number
  max?: number
  items?: { id: string; label: string }[]
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'slider', label: 'Slider' },
] as const

type FieldType = typeof FIELD_TYPES[number]['value']

export function FormBuilder({
  fields,
  onChange
}: {
  fields: FormField[]
  onChange: (fields: FormField[]) => void
}) {
  const [selectedType, setSelectedType] = useState<FieldType | ''>('')

  const addField = (type: FieldType) => {
    const newField: FormField = {
      name: `field_${fields.length}`,
      label: '',
      fieldType: type,
      required: false,
      options: type === 'select' || type === 'radio' ? [] : undefined
    }
    onChange([...fields, newField])
  }

  const updateField = (index: number, data: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...data }
    onChange(newFields)
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index)
    onChange(newFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select 
          value={selectedType}
          onValueChange={(value: FieldType) => setSelectedType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
          {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={() => selectedType && addField(selectedType)}
          disabled={!selectedType}
        >
          Add Field
        </Button>
      </div>

      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="formFields">
          {(dropProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {fields.map((field, index) => (
                <Draggable key={field.name} draggableId={field.name} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 mb-4"
                    >
                      <div className="grid gap-4">
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                          placeholder="Field Label"
                        />
                        
                        {(field.fieldType === 'select' || field.fieldType === 'radio') && (
                          <div>
                            <Input
                              value={field.options?.join(',')}
                              onChange={(e) => updateField(index, { 
                                options: e.target.value.split(',')
                              })}
                              placeholder="Options (comma-separated)"
                            />
                          </div>
                        )}

                        {(field.fieldType === 'slider') && (
                          <div>
                            <Input
                              type="range"
                              min={field.min ?? 0}
                              max={field.max ?? 100}
                              onChange={(e) => updateField(index, { min: parseInt(e.target.value, 10) })}
                            />
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateField(index, { 
                              required: !field.required 
                            })}
                          >
                            {field.required ? 'Required' : 'Optional'}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeField(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
