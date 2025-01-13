'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type TypeFormField = {
  fieldType:
    | 'text'
    | 'radio'
    | 'select'
    | 'slider'
    | 'checkbox'
    | 'date'
    | 'textarea';
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
  checkboxType?: 'single' | 'multiple';
  items?: Array<{ id: string; label: string }>;
};

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'slider', label: 'Slider' },
] as const;

type FieldType = (typeof FIELD_TYPES)[number]['value'];

const createCleanField = (type: FieldType): TypeFormField => {
  const baseField = {
    name: '',
    label: '',
    fieldType: type,
    required: false,
  };

  switch (type) {
    case 'slider':
      return {
        ...baseField,
        min: 0,
        max: 10,
      };
    
    case 'text':
    case 'textarea':
      return {
        ...baseField,
        description: '',
        validation: {
          minLength: 2, // default to 2
          maxLength: 100,
        },
      };
    
    case 'select':
    case 'radio':
      return {
        ...baseField,
        options: [],
      };
    
    case 'checkbox':
      return {
        ...baseField,
        checkboxType: 'single',
        items: type === 'checkbox' ? [] : undefined,
      };
    
    default:
      return baseField;
  }
};

function CheckboxItemsEditor({ 
  items = [], 
  onChange 
}: { 
  items: Array<{ id: string; label: string }>;
  onChange: (items: Array<{ id: string; label: string }>) => void;
}) {
  const [newId, setNewId] = useState('')
  const [newLabel, setNewLabel] = useState('')

  const addItem = () => {
    if (newId && newLabel) {
      onChange([...items, { id: newId, label: newLabel }])
      setNewId('')
      setNewLabel('')
    }
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input value={item.id} disabled />
            <Input value={item.label} disabled />
            <Button 
              variant="destructive" 
              size="icon"
              onClick={() => removeItem(index)}
            >
              X
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Item ID (e.g., tech)"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
          />
          <Input
            placeholder="Item Label (e.g., Technology)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Button onClick={addItem} disabled={!newId || !newLabel}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export function FormBuilder({
  fields,
  onChange,
  onFieldsChange,
}: {
  fields: TypeFormField[];
  onChange: (fields: TypeFormField[]) => void;
  onFieldsChange?: (fields: TypeFormField[]) => void;
}) {
  const [selectedType, setSelectedType] = useState<FieldType | ''>('');

  const addField = (type: FieldType) => {
    const newField = createCleanField(type);
    onChange([...fields, newField]);
  };

  const updateField = (index: number, data: Partial<TypeFormField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...data };
    onChange(newFields);
    onFieldsChange?.(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onChange(newFields);
  };

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
          {dropProvided => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {fields.map((field, index) => {
                const safeId = field.name || `field-${index}`;
                return (
                  <Draggable
                    key={safeId}
                    draggableId={safeId}
                    index={index}
                  >
                    {provided => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-4 mb-4"
                      >
                        <div className="grid gap-4">
                          {/* Add a field for 'name' so users can set it */}
                          <div className="space-y-2">
                            <Label>Field Internal Name</Label>
                            <Input
                              value={field.name}
                              onChange={e =>
                                updateField(index, { name: e.target.value })
                              }
                              placeholder="e.g. fullName"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={e =>
                                updateField(index, { label: e.target.value })
                              }
                              placeholder="Enter field label"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                              value={field.description}
                              onChange={e =>
                                updateField(index, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Enter field description"
                            />
                          </div>

                          {(field.fieldType === 'text' ||
                            field.fieldType === 'textarea') && (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label>Min Length of Characters</Label>
                                <Input
                                  type="number"
                                  placeholder="Min Length"
                                  value={field.validation?.minLength?.toString() || ''}
                                  onChange={e =>
                                    updateField(index, {
                                      validation: {
                                        ...field.validation,
                                        minLength: Number.parseInt(e.target.value),
                                      },
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Max Length of Characters</Label>
                                <Input
                                  type="number"
                                  placeholder="Max Length"
                                  value={field.validation?.maxLength?.toString() || ''}
                                  onChange={e =>
                                    updateField(index, {
                                      validation: {
                                        ...field.validation,
                                        maxLength: Number.parseInt(e.target.value),
                                      },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {(field.fieldType === 'select' ||
                            field.fieldType === 'radio') && (
                            <Input
                              value={field.options?.join(',') || ''}
                              onChange={e =>
                                updateField(index, {
                                  options: e.target.value.split(','),
                                })
                              }
                              placeholder="Options (comma-separated)"
                            />
                          )}

                          {field.fieldType === 'checkbox' && (
                            <div className="space-y-2">
                              <Select
                                value={field.checkboxType}
                                onValueChange={(value: 'single' | 'multiple') =>
                                  updateField(index, { checkboxType: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Checkbox Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="single">
                                    Single Checkbox
                                  </SelectItem>
                                  <SelectItem value="multiple">
                                    Multiple Choice
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              {field.checkboxType === 'multiple' && (
                                <div className="space-y-2">
                                  <Label>Checkbox Items</Label>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" className="w-full">
                                        Manage Items ({field.items?.length || 0} items)
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Manage Checkbox Items</DialogTitle>
                                      </DialogHeader>
                                      <CheckboxItemsEditor
                                        items={field.items || []}
                                        onChange={(items) => updateField(index, { items })}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}
                            </div>
                          )}

                          {field.fieldType === 'slider' && (
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="Min Value"
                                value={field.min?.toString() || ''}
                                onChange={e =>
                                  updateField(index, {
                                    min: Number.parseInt(e.target.value),
                                  })
                                }
                              />
                              <Input
                                type="number"
                                placeholder="Max Value"
                                value={field.max?.toString() || ''}
                                onChange={e =>
                                  updateField(index, {
                                    max: Number.parseInt(e.target.value),
                                  })
                                }
                              />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`required-${field.name}`}
                              checked={field.required}
                              onCheckedChange={checked =>
                                updateField(index, {
                                  required: checked,
                                })
                              }
                            />
                            <Label htmlFor={`required-${field.name}`}>
                              Required field
                            </Label>
                          </div>

                          <div className="flex justify-end space-x-2">
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
                );
              })}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
