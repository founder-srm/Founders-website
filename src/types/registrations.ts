import type { Json } from "../../database.types"

export type Registration ={
    application_id: string
    created_at: string
    details: Json
    event_id: string
    event_title: string
    id: string
    is_approved: boolean
    ticket_id: number
}

export type RegistrationCount ={
    id: string
    event_title: string
}