# Admin Dashboard Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Data Fetching](#2-data-fetching)
* [3. Data Transformation (`registrationStats`)](#3-data-transformation-registrationstats)
* [4. Error and Loading Handling](#4-error-and-loading-handling)
* [5. UI Rendering](#5-ui-rendering)


## 1. Overview

The `AdminDashboard` component is the main dashboard for administrative users. It displays an overview of event registrations and events using charts and lists.  It fetches data from a Supabase database using `useQuery` from `@supabase-cache-helpers/postgrest-react-query`. The component utilizes several custom components for UI rendering, including charts and alerts.


## 2. Data Fetching

The component fetches data for events and registrations using the following:

| Data Source        | Function Call             | Hook                   | Data Type          |
|---------------------|--------------------------|------------------------|----------------------|
| Events              | `getAllEvents(supabase)` | `useQuery<Event[]>`    | `Event[]`            |
| Registrations       | `getAllRegistrations(supabase)` | `useQuery<Registration[]>` | `Registration[]`    |

`supabase` is a Supabase client instance created using `createClient()`.  `getAllEvents` and `getAllRegistrations` are custom functions (presumably located in `/actions/admin/`) responsible for making API calls to retrieve data from the Supabase database. The `useQuery` hook handles asynchronous data fetching, providing `data`, `isLoading`, and `isError` states.


## 3. Data Transformation (`registrationStats`)

The `registrationStats` variable uses `useMemo` to transform the raw `registrations` data. This transformation adds a new field `event_type` based on the `is_approved` property, categorizing registrations as either 'Approved' or 'Pending', and sets `registrations_count` to 1 for each registration.  This transformed data is then used by the `PieChartComponent` to display registration statistics.

The algorithm is straightforward:

1. **Check for null data:** If `registrations` is null, return an empty array to prevent errors.
2. **Map registrations:** Iterate through each registration in the `registrations` array.
3. **Create new object:** For each registration, create a new object that includes all original properties (`...r`) and adds the `event_type` and `registrations_count` properties.
4. **Return transformed array:** Return the array of transformed registration objects.


## 4. Error and Loading Handling

The component gracefully handles loading and error states:

* **Loading:** If either `eventsLoading` or `registrationsLoading` is true, it displays skeleton loaders to represent the loading UI elements.
* **Error:** If either `eventsError` or `registrationsError` is true, it displays an error alert informing the user that data loading failed.


## 5. UI Rendering

The component renders the following elements based on the data and loading/error states:

* **Registrations Overview:** A pie chart displaying the distribution of approved and pending registrations using `PieChartComponent` and `registrationStats` data.
* **All Registrations:** A list displaying all registrations with their event title, ID, and approval status.
* **Events Distribution:** A bar chart displaying the distribution of events using `BarChartComponent` and `events` data.
* **All Events:** A list displaying all events with their title and description.

The layout uses a responsive grid (`grid gap-4 md:grid-cols-2 lg:grid-cols-3`) to adjust the arrangement of cards based on the screen size.  Each data section is encapsulated within a `Card` component for visual consistency.
