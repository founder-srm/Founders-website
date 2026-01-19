'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Calendar,
  CheckSquare,
  ExternalLink,
  FileUp,
  GripVertical,
  Link2,
  List,
  Radio,
  Sliders,
  Text,
  TextCursorInput,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TypeFormField } from '../../../../../../../schema.zod';

const FIELD_TYPES = [
  { value: 'text', label: 'Short Text', icon: TextCursorInput },
  { value: 'textarea', label: 'Long Text', icon: Text },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'radio', label: 'Radio', icon: Radio },
  { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { value: 'date', label: 'Date', icon: Calendar },
  { value: 'slider', label: 'Slider', icon: Sliders },
  { value: 'url', label: 'URL / Link', icon: Link2 },
  { value: 'file', label: 'File Upload', icon: FileUp },
  { value: 'redirect', label: 'Redirect Link', icon: ExternalLink },
  { value: 'member_select', label: 'Team Member Select', icon: Users },
] as const;

type FieldType = (typeof FIELD_TYPES)[number]['value'];

const createCleanField = (type: FieldType): TypeFormField => {
  const baseField: TypeFormField = {
    name: `field_${Date.now()}`,
    label: '',
    fieldType: type,
    required: false,
  };

  switch (type) {
    case 'slider':
      return { ...baseField, min: 0, max: 10 };
    case 'text':
    case 'textarea':
      return {
        ...baseField,
        description: '',
        validation: { minLength: 2, maxLength: 500 },
      };
    case 'select':
    case 'radio':
      return { ...baseField, options: [] };
    case 'checkbox':
      return { ...baseField, checkboxType: 'single', items: [] };
    case 'url':
      return {
        ...baseField,
        urlPlaceholder: 'https://example.com',
        validation: { pattern: '^https?://.+' },
      };
    case 'file':
      return {
        ...baseField,
        acceptedFileTypes: 'image/*,application/pdf',
        maxFileSizeMB: 5,
        bucketPath: 'registrations',
      };
    case 'redirect':
      return {
        ...baseField,
        redirectUrl: '',
        redirectLabel: 'Visit Link',
        required: false,
      };
    case 'member_select':
      return {
        ...baseField,
        label: 'Select Team Members',
        minMembers: 1,
        maxMembers: undefined,
        required: true,
      };
    default:
      return baseField;
  }
};

function getFieldIcon(fieldType: string) {
  const field = FIELD_TYPES.find(f => f.value === fieldType);
  return field ? field.icon : Text;
}

// Checkbox Items Editor Component
function CheckboxItemsEditor({
  items = [],
  onChange,
}: {
  items: Array<{ id: string; label: string }>;
  onChange: (items: Array<{ id: string; label: string }>) => void;
}) {
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const addItem = () => {
    if (newId && newLabel) {
      onChange([...items, { id: newId, label: newLabel }]);
      setNewId('');
      setNewLabel('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 bg-muted rounded-md"
          >
            <span className="text-sm font-mono">{item.id}</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm flex-1">{item.label}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeItem(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="ID (e.g., tech)"
          value={newId}
          onChange={e => setNewId(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Label (e.g., Technology)"
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          className="flex-1"
        />
        <Button type="button" onClick={addItem} disabled={!newId || !newLabel} size="sm">
          Add
        </Button>
      </div>
    </div>
  );
}

// Options Editor Component for select/radio
function OptionsEditor({
  options = [],
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption && !options.includes(newOption)) {
      onChange([...options, newOption]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Badge key={option} variant="secondary" className="gap-1 pr-1">
            {option}
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add option..."
          value={newOption}
          onChange={e => setNewOption(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOption())}
        />
        <Button type="button" onClick={addOption} disabled={!newOption} size="sm">
          Add
        </Button>
      </div>
    </div>
  );
}

// Sortable Field Card Component
function SortableFieldCard({
  field,
  onUpdate,
  onRemove,
}: {
  field: TypeFormField;
  onUpdate: (data: Partial<TypeFormField>) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = getFieldIcon(field.fieldType);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-grab touch-none p-1 hover:bg-muted rounded"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium capitalize">
              {FIELD_TYPES.find(t => t.value === field.fieldType)?.label ||
                field.fieldType}
            </span>
            {field.required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Internal Name</Label>
            <Input
              value={field.name}
              onChange={e => onUpdate({ name: e.target.value })}
              placeholder="e.g., fullName"
            />
          </div>
          <div className="space-y-2">
            <Label>Display Label</Label>
            <Input
              value={field.label}
              onChange={e => onUpdate({ label: e.target.value })}
              placeholder="e.g., Full Name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description (optional)</Label>
          <Input
            value={field.description || ''}
            onChange={e => onUpdate({ description: e.target.value })}
            placeholder="Help text for this field"
          />
        </div>

        {/* Field-type specific options */}
        {(field.fieldType === 'text' || field.fieldType === 'textarea') && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Min Length</Label>
              <Input
                type="number"
                value={field.validation?.minLength || ''}
                onChange={e =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      minLength: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max Length</Label>
              <Input
                type="number"
                value={field.validation?.maxLength || ''}
                onChange={e =>
                  onUpdate({
                    validation: {
                      ...field.validation,
                      maxLength: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {(field.fieldType === 'select' || field.fieldType === 'radio') && (
          <div className="space-y-2">
            <Label>Options</Label>
            <OptionsEditor
              options={field.options || []}
              onChange={options => onUpdate({ options })}
            />
          </div>
        )}

        {field.fieldType === 'checkbox' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Checkbox Type</Label>
              <Select
                value={field.checkboxType || 'single'}
                onValueChange={(value: 'single' | 'multiple') =>
                  onUpdate({ checkboxType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Checkbox</SelectItem>
                  <SelectItem value="multiple">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                      onChange={items => onUpdate({ items })}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )}

        {field.fieldType === 'slider' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Min Value</Label>
              <Input
                type="number"
                value={field.min || 0}
                onChange={e => onUpdate({ min: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Value</Label>
              <Input
                type="number"
                value={field.max || 100}
                onChange={e => onUpdate({ max: Number(e.target.value) })}
              />
            </div>
          </div>
        )}

        {field.fieldType === 'url' && (
          <div className="space-y-2">
            <Label>Placeholder URL</Label>
            <Input
              value={field.urlPlaceholder || ''}
              onChange={e => onUpdate({ urlPlaceholder: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}

        {field.fieldType === 'file' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Accepted File Types</Label>
              <Input
                value={field.acceptedFileTypes || ''}
                onChange={e => onUpdate({ acceptedFileTypes: e.target.value })}
                placeholder="image/*,application/pdf"
              />
            </div>
            <div className="space-y-2">
              <Label>Max File Size (MB)</Label>
              <Input
                type="number"
                value={field.maxFileSizeMB || 5}
                onChange={e => onUpdate({ maxFileSizeMB: Number(e.target.value) })}
              />
            </div>
          </div>
        )}

        {field.fieldType === 'redirect' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Redirect URL</Label>
              <Input
                value={field.redirectUrl || ''}
                onChange={e => onUpdate({ redirectUrl: e.target.value })}
                placeholder="https://example.com/resource"
              />
            </div>
            <div className="space-y-2">
              <Label>Button Label</Label>
              <Input
                value={field.redirectLabel || ''}
                onChange={e => onUpdate({ redirectLabel: e.target.value })}
                placeholder="Visit Link"
              />
            </div>
          </div>
        )}

        {field.fieldType === 'member_select' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Minimum Members</Label>
              <Input
                type="number"
                min={1}
                value={field.minMembers || 1}
                onChange={e => onUpdate({ minMembers: Number(e.target.value) })}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                Minimum number of team members required
              </p>
            </div>
            <div className="space-y-2">
              <Label>Maximum Members (optional)</Label>
              <Input
                type="number"
                min={1}
                value={field.maxMembers || ''}
                onChange={e => onUpdate({ maxMembers: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="No limit"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for no maximum limit
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Switch
            id={`required-${field.name}`}
            checked={field.required || false}
            onCheckedChange={checked => onUpdate({ required: checked })}
          />
          <Label htmlFor={`required-${field.name}`}>Required field</Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Live Preview Component
function FormPreview({ fields }: { fields: TypeFormField[] }) {
  if (fields.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Add fields to see preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {fields.map((field, index) => {
        const Icon = getFieldIcon(field.fieldType);
        return (
          <div key={field.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {index + 1}.
              </span>
              <Label className="flex items-center gap-2">
                <Icon className="h-3 w-3" />
                {field.label || 'Untitled Field'}
                {field.required && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
            )}
            {/* Preview based on field type */}
            {field.fieldType === 'text' && (
              <Input disabled placeholder="Short text answer..." />
            )}
            {field.fieldType === 'textarea' && (
              <textarea
                disabled
                className="w-full min-h-[80px] rounded-md border p-2 text-sm bg-muted"
                placeholder="Long text answer..."
              />
            )}
            {field.fieldType === 'select' && (
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
              </Select>
            )}
            {field.fieldType === 'radio' && (
              <div className="space-y-2">
                {(field.options || []).map(opt => (
                  <div key={opt} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border" />
                    <span className="text-sm">{opt}</span>
                  </div>
                ))}
              </div>
            )}
            {field.fieldType === 'checkbox' &&
              field.checkboxType === 'single' && (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border" />
                  <span className="text-sm">I agree</span>
                </div>
              )}
            {field.fieldType === 'checkbox' &&
              field.checkboxType === 'multiple' && (
                <div className="space-y-2">
                  {(field.items || []).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            {field.fieldType === 'date' && (
              <Input disabled type="date" />
            )}
            {field.fieldType === 'slider' && (
              <div className="flex items-center gap-4">
                <span className="text-sm">{field.min || 0}</span>
                <div className="flex-1 h-2 bg-muted rounded-full" />
                <span className="text-sm">{field.max || 100}</span>
              </div>
            )}
            {field.fieldType === 'url' && (
              <Input
                disabled
                placeholder={field.urlPlaceholder || 'https://...'}
              />
            )}
            {field.fieldType === 'file' && (
              <div className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground">
                <FileUp className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Drop files here or click to upload</p>
                <p className="text-xs">
                  Max {field.maxFileSizeMB || 5}MB •{' '}
                  {field.acceptedFileTypes || 'All files'}
                </p>
              </div>
            )}
            {field.fieldType === 'redirect' && (
              <Button variant="outline" disabled className="gap-2">
                <ExternalLink className="h-4 w-4" />
                {field.redirectLabel || 'Visit Link'}
              </Button>
            )}
            {field.fieldType === 'member_select' && (
              <div className="border-2 border-dashed rounded-lg p-4 text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Team member selection dropdown</p>
                <p className="text-xs">
                  Min: {field.minMembers || 1} member(s)
                  {field.maxMembers ? ` • Max: ${field.maxMembers} member(s)` : ' • No max limit'}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Main Form Builder Component
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addField = (type: FieldType) => {
    const newField = createCleanField(type);
    const newFields = [...fields, newField];
    onChange(newFields);
    onFieldsChange?.(newFields);
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
    onFieldsChange?.(newFields);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.name === active.id);
      const newIndex = fields.findIndex(f => f.name === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex);
      onChange(newFields);
      onFieldsChange?.(newFields);
    }
  };

  const activeField = activeId
    ? fields.find(f => f.name === activeId)
    : null;

  return (
    <div className="space-y-6">
      {/* Add Field Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Form Fields</h3>
            <div className="flex items-center gap-2">
              <Select
                value={selectedType}
                onValueChange={(value: FieldType) => setSelectedType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map(type => {
                    const TypeIcon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => selectedType && addField(selectedType)}
                disabled={!selectedType}
              >
                Add Field
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for Edit/Preview */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'edit' | 'preview')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit Fields</TabsTrigger>
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map(f => f.name)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {fields.length === 0 ? (
                  <Card className="p-8">
                    <div className="text-center text-muted-foreground">
                      <p className="mb-2">No fields added yet</p>
                      <p className="text-sm">
                        Select a field type above and click &quot;Add Field&quot; to get
                        started
                      </p>
                    </div>
                  </Card>
                ) : (
                  fields.map((field, index) => (
                    <SortableFieldCard
                      key={field.name}
                      field={field}
                      onUpdate={data => updateField(index, data)}
                      onRemove={() => removeField(index)}
                    />
                  ))
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeField ? (
                <Card className="opacity-80 shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        {activeField.label || 'Untitled Field'}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Form Preview</h3>
              <p className="text-sm text-muted-foreground">
                This is how your form will appear to registrants
              </p>
            </CardHeader>
            <CardContent>
              <FormPreview fields={fields} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
