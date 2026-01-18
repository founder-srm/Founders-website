import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Schema for event details generation
const eventDetailsSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Event title' },
    description: { type: 'string', description: 'Short event description (2-3 sentences)' },
    venue: { type: 'string', description: 'Event venue/location' },
    event_type: { type: 'string', enum: ['online', 'offline', 'hybrid'] },
    tags: { type: 'array', items: { type: 'string' }, description: 'Relevant tags for the event' },
    rules: { type: 'string', description: 'Event rules in HTML format' },
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
    is_gated: { type: 'boolean', description: 'Whether event should be for club members only' },
    always_approve: { type: 'boolean', description: 'Whether to auto-approve registrations' },
  },
  required: ['title', 'description', 'venue', 'event_type', 'tags', 'suggested_dates'],
  additionalProperties: false,
};

// Schema for form fields generation
const formFieldsSchema = {
  type: 'object',
  properties: {
    fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          fieldType: {
            type: 'string',
            enum: ['text', 'textarea', 'radio', 'select', 'checkbox', 'date', 'slider', 'url', 'file'],
          },
          label: { type: 'string' },
          name: { type: 'string', description: 'Unique field identifier (snake_case)' },
          description: { type: 'string' },
          required: { type: 'boolean' },
          options: { type: 'array', items: { type: 'string' }, description: 'Options for radio/select fields' },
          checkboxType: { type: 'string', enum: ['single', 'multiple'] },
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
            description: 'Items for multiple checkbox fields',
          },
          min: { type: 'number' },
          max: { type: 'number' },
          validation: {
            type: 'object',
            properties: {
              minLength: { type: 'number' },
              maxLength: { type: 'number' },
            },
            additionalProperties: false,
          },
        },
        required: ['fieldType', 'label', 'name', 'required'],
        additionalProperties: false,
      },
    },
  },
  required: ['fields'],
  additionalProperties: false,
};

// Combined response schema
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
  required: ['message', 'action'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are an AI assistant helping create events for Founders Club at SRMIST. You help users create event registration forms by generating event details and form fields.

When the user describes an event, you should:
1. Generate appropriate event details (title, description, venue, dates, tags)
2. Generate registration form fields that would be relevant for that type of event

Available field types:
- text: Short text input (name, email, phone, etc.)
- textarea: Long text input (descriptions, answers)
- radio: Single choice from options
- select: Dropdown selection
- checkbox: Single checkbox (agreements) or multiple checkboxes (select multiple)
- date: Date picker
- slider: Numeric slider with min/max
- url: URL input (portfolio, GitHub, LinkedIn)
- file: File upload

Common fields to include for most events:
- Full Name (required)
- Email (required, but might be auto-filled)
- Phone Number (required)
- Year of Study (select: 1st, 2nd, 3rd, 4th)
- Department/Branch (text or select)

For hackathons/competitions, also include:
- Team Name
- Team Size
- GitHub/Portfolio URL
- Skills/Tech Stack (checkbox multiple)
- Project idea/description

For workshops, include:
- Experience level (radio)
- What do you hope to learn? (textarea)

Always respond with a helpful message and set the appropriate action. If user is just chatting, set action to 'none'.

The current date is ${new Date().toISOString().split('T')[0]}. When suggesting dates, make them realistic (upcoming dates).`;

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
