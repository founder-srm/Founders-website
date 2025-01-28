# Supabase Event Registrations Data Access Functions

[Linked Table of Contents](#linked-table-of-contents)

## Linked Table of Contents

* [1. Introduction](#1-introduction)
* [2. Function Details](#2-function-details)
    * [2.1 `getAllRegistrations`](#21-getallregistrations)
    * [2.2 `getRegistrationsStats`](#22-getregistrationsstats)
    * [2.3 `getRegistrationsCount`](#23-getregistrationscount)
    * [2.4 `getRegistrationById`](#24-getregistrationbyid)
    * [2.5 `getRegistationsByEventId`](#25-getregistationsbyeventid)
    * [2.6 `getRegistrationsByDateRange`](#26-getregistrationsbydaterange)
* [3. Error Handling](#3-error-handling)


## 1. Introduction

This document details the functions used to interact with the `eventsregistrations` table in the Supabase database.  These functions provide various methods for retrieving registration data, offering flexibility in querying based on specific needs.  All functions utilize the Supabase client library and leverage its built-in error handling mechanisms.


## 2. Function Details

All functions take a `TypedSupabaseClient` object as the first argument, which provides the connection to the Supabase database.  This client object is assumed to be properly initialized elsewhere in the application.

### 2.1 `getAllRegistrations`

```typescript
export function getAllRegistrations(client: TypedSupabaseClient) {
  return client.from('eventsregistrations').select('*').throwOnError();
}
```

This function retrieves all records from the `eventsregistrations` table.  It uses the `select('*')` method to select all columns and `throwOnError()` to ensure that any database errors are explicitly thrown as exceptions.  The function directly returns the Supabase query object, which will resolve to the data once executed.  This allows for efficient data fetching without intermediate steps.

### 2.2 `getRegistrationsStats`

```typescript
export function getRegistrationsStats(client: TypedSupabaseClient) {
  return client
    .from('eventsregistrations')
    .select(`
            application_id,
            created_at,
            details,
            event_id,
            event_title,
            id,
            is_approved,
            ticket_id
        `)
    .throwOnError();
}
```

This function retrieves specific columns from the `eventsregistrations` table, providing a subset of the data for statistical analysis or reporting purposes. The selected columns are explicitly listed within a template literal for clarity and maintainability. Similar to `getAllRegistrations`, it uses `throwOnError()` for robust error handling and returns the Supabase query object.


### 2.3 `getRegistrationsCount`

```typescript
export function getRegistrationsCount(client: TypedSupabaseClient) {
  return client
    .from('eventsregistrations')
    .select(`
            id,
            event_title
        `)
    .throwOnError();
}
```

This function retrieves only the `id` and `event_title` columns.  The purpose is likely to obtain a count of registrations and associated event titles, although a direct count isn't performed in this function itself;  the caller would need to process the returned data to determine the count.


### 2.4 `getRegistrationById`

```typescript
export function getRegistrationById(
  client: TypedSupabaseClient,
  RegistrationId: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .eq('id', RegistrationId)
    .throwOnError()
    .single();
}
```

This function retrieves a single registration record based on its `id`.  It uses the `eq('id', RegistrationId)` method to filter the results and `single()` to ensure that only a single record is returned.  An error will be thrown if multiple records match or no record matches the provided `RegistrationId`.

### 2.5 `getRegistationsByEventId`

```typescript
export function getRegistationsByEventId(
  client: TypedSupabaseClient,
  EventId: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .eq('event_id', EventId)
    .throwOnError();
}
```

This function retrieves all registrations associated with a specific `EventId`.  It filters the results using `eq('event_id', EventId)`. The function returns all matching records.

### 2.6 `getRegistrationsByDateRange`

```typescript
export function getRegistrationsByDateRange(
  client: TypedSupabaseClient,
  Start_Date: string,
  End_Date: string
) {
  return client
    .from('eventsregistrations')
    .select('*')
    .gte('created_at', Start_Date)
    .lte('created_at', End_Date)
    .throwOnError();
}
```

This function retrieves registrations within a specified date range. It uses `gte('created_at', Start_Date)` and `lte('created_at', End_Date)` to filter the results based on the `created_at` column.  The `Start_Date` and `End_Date` parameters are assumed to be in a format compatible with Supabase's date/time handling.


## 3. Error Handling

All functions utilize the `throwOnError()` method provided by the Supabase client. This ensures that any database errors are propagated as exceptions, allowing for centralized error handling in the calling functions.  This enhances the robustness of the data access layer.
