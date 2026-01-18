import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

// Schema for event details generation - ALL properties must be required for strict mode
const eventDetailsSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Event title' },
    description: { type: 'string', description: 'Short event description (2-3 sentences)' },
    venue: { type: 'string', description: 'Event venue/location' },
    event_type: { type: 'string', enum: ['online', 'offline', 'hybrid'] },
    tags: { type: 'array', items: { type: 'string' }, description: 'Relevant tags for the event' },
    rules: { type: 'string', description: 'Event rules in HTML format (can be empty string)' },
    suggested_dates: {
      type: 'object',
      properties: {
        start_date: { type: 'string', description: 'Suggested start date in ISO format' },
        end_date: { type: 'string', description: 'Suggested end date in ISO format' },
        publish_date: { type: 'string', description: 'Suggested publish date in ISO format' },
      },
      required: ['start_date', 'end_date', 'publish_date'],
      additionalProperties: false,
    },
    is_gated: { type: 'boolean', description: 'Whether event should be for club members only (default false)' },
    always_approve: { type: 'boolean', description: 'Whether to auto-approve registrations (default false)' },
  },
  required: ['title', 'description', 'venue', 'event_type', 'tags', 'rules', 'suggested_dates', 'is_gated', 'always_approve'],
  additionalProperties: false,
};

// Schema for form fields generation - ALL properties must be required for strict mode
const formFieldSchema = {
  type: 'object',
  properties: {
    fieldType: {
      type: 'string',
      enum: ['text', 'textarea', 'radio', 'select', 'checkbox', 'date', 'slider', 'url', 'file'],
    },
    label: { type: 'string' },
    name: { type: 'string', description: 'Unique field identifier (snake_case)' },
    description: { type: 'string', description: 'Field description or help text' },
    required: { type: 'boolean' },
    options: { type: 'array', items: { type: 'string' }, description: 'Options for radio/select fields (empty array if not applicable)' },
    checkboxType: { type: 'string', enum: ['single', 'multiple'], description: 'Type for checkbox fields (use single as default)' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
        },
        required: ['id', 'label'],
        additionalProperties: false,
      },
      description: 'Items for multiple checkbox fields (empty array if not applicable)',
    },
    min: { type: 'number', description: 'Minimum value for slider (use 0 as default)' },
    max: { type: 'number', description: 'Maximum value for slider (use 100 as default)' },
    minLength: { type: 'number', description: 'Minimum length for text validation (use 0 as default)' },
    maxLength: { type: 'number', description: 'Maximum length for text validation (use 500 as default)' },
  },
  required: ['fieldType', 'label', 'name', 'description', 'required', 'options', 'checkboxType', 'items', 'min', 'max', 'minLength', 'maxLength'],
  additionalProperties: false,
};

const formFieldsSchema = {
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      items: formFieldSchema,
    },
  },
  required: ['fields'],
  additionalProperties: false,
};

// Combined response schema - ALL properties must be required for strict mode
const agentResponseSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', description: 'Assistant response message to the user' },
    action: {
      type: 'string',
      enum: ['none', 'generate_event', 'generate_fields', 'update_event', 'update_fields'],
      description: 'What action to take based on user request',
    },
    event_data: eventDetailsSchema,
    form_fields: formFieldsSchema,
  },
  required: ['message', 'action', 'event_data', 'form_fields'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are an AI assistant helping create events for Founders Club at SRMIST. You help users create event registration forms by generating event details and form fields.

IMPORTANT: You MUST always provide ALL fields in the response schema. Use sensible defaults for optional values.

When the user describes an event, you should:
1. Generate appropriate event details (title, description, venue, dates, tags)
2. Generate registration form fields that would be relevant for that type of event
3. Always set action to "generate_event" when creating/updating events

Available field types for form fields:
- text: Short text input (name, email, phone, etc.)
- textarea: Long text input (descriptions, answers)
- radio: Single choice from options
- select: Dropdown selection
- checkbox: Single checkbox (agreements) or multiple checkboxes (select multiple)
- date: Date picker
- slider: Numeric slider with min/max
- url: URL input (portfolio, GitHub, LinkedIn)
- file: File upload

For EACH form field, you MUST provide ALL these properties:
- fieldType: one of the types above
- label: Display label
- name: Unique snake_case identifier
- description: Help text (use empty string "" if none)
- required: true or false
- options: Array of strings (use [] if not radio/select)
- checkboxType: "single" or "multiple" (use "single" as default)
- items: Array of {id, label} objects (use [] if not multiple checkbox)
- min: number (use 0 as default)
- max: number (use 100 as default)
- minLength: number (use 0 as default)
- maxLength: number (use 500 as default)

Common fields to include for most events:
- Full Name (text, required)
- Phone Number (text, required)
- Year of Study (select with options: ["1st Year", "2nd Year", "3rd Year", "4th Year"])
- Department/Branch (text)

For hackathons/competitions, also include:
- Team Name (text)
- Team Size (slider, min: 1, max: 5)
- GitHub/Portfolio URL (url)
- Skills/Tech Stack (checkbox multiple)
- Project idea (textarea)

For workshops, include:
- Experience level (radio with options: ["Beginner", "Intermediate", "Advanced"])
- What do you hope to learn? (textarea)

For event_data, always provide:
- title, description, venue, event_type, tags, rules (use "" for rules if none)
- suggested_dates with start_date, end_date, publish_date in ISO format
- is_gated: false (unless specifically for club members)
- always_approve: false (unless specified)

If user is just chatting without asking to create an event, still provide the full schema but with:
- action: "none"
- event_data with placeholder values
- form_fields with empty fields array

The current date is ${new Date().toISOString().split('T')[0]}. When suggesting dates, make them realistic (1-4 weeks in the future).`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, generateSchema = true } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_completion_tokens: 2048,
      ...(generateSchema && {
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'event_agent_response',
            strict: true,
            schema: agentResponseSchema,
          },
        },
      }),
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      // If JSON parsing fails, return as plain message
      return NextResponse.json({
        message: content,
        action: 'none',
      });
    }
  } catch (error) {
    console.error('Agent chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
