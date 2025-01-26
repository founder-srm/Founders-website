# AdminLayout Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Component Structure](#2-component-structure)
* [3. `useAdminCheck` Hook](#3-useadmincheck-hook)
* [4. Loading State Handling](#4-loading-state-handling)
* [5. Main Layout Structure](#5-main-layout-structure)
* [6. Header Component](#6-header-component)
* [7.  Sidebar Components](#7-sidebar-components)


## 1. Overview

The `AdminLayout` component is a higher-order component responsible for rendering the main layout for administrative sections of the application. It incorporates several UI components to provide a consistent and functional user experience.  This includes sidebars, breadcrumb navigation, and a theme toggle.  Access is controlled by verifying administrator permissions.

## 2. Component Structure

The `AdminLayout` component is a functional React component that accepts a `children` prop containing the main content to be rendered within the layout.  The core functionality involves checking admin permissions, rendering a loading indicator, and constructing the layout structure once permissions are confirmed.

```javascript
export default function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  // ... (Component Body)
}
```

## 3. `useAdminCheck` Hook

The component utilizes the custom hook `useAdminCheck` to verify administrator permissions.  The details of this hook's implementation are not provided here but it's assumed to handle authentication and authorization logic. The hook returns an object with an `isLoading` property, indicating the status of the permission check.

```javascript
const { isLoading } = useAdminCheck();
```

## 4. Loading State Handling

While the `useAdminCheck` hook is performing the permission check, a loading indicator is displayed to the user.  This prevents rendering the main layout before permissions have been verified.

```javascript
if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
      <p className="ml-4">Checking permissions...</p>
    </div>
  );
}
```

## 5. Main Layout Structure

Once the permission check is complete (`isLoading` is false), the main layout is rendered. This layout uses several provider components for context management and includes left and right sidebars, a header, and a main content area.

```javascript
return (
  <ReactQueryClientProvider>
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        {/* Header and Main Content */}
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  </ReactQueryClientProvider>
);

```

This structure leverages React Context through `SidebarProvider` and `ReactQueryClientProvider` for efficient data management and state sharing across child components.


## 6. Header Component

The header is a fixed element at the top of the layout, containing the sidebar trigger, breadcrumb navigation, and a theme toggle.  The `Breadcrumb` component renders a hierarchical path, allowing users to easily understand their current location within the application.

```javascript
<header className="sticky top-0 z-[60] flex h-14 shrink-0 items-center gap-2 bg-background">
  <div className="flex flex-1 items-center gap-2 px-3">
    <SidebarTrigger />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="line-clamp-1">
            Project Management & Task Tracking
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <Separator orientation="vertical" className="ml-2 h-4" />
    <ModeToggle />
  </div>
</header>
```

The header utilizes Tailwind CSS classes for styling and layout.


## 7. Sidebar Components

The layout includes both `SidebarLeft` and `SidebarRight` components.  These components are likely responsible for rendering navigation menus and other relevant information, providing a user-friendly interface for accessing different sections of the application. The specific contents and functionality of these sidebars are outside the scope of this documentation.  The `SidebarInset` component is used to wrap the main content area, ensuring correct positioning relative to the sidebars.

The use of multiple components promotes modularity and maintainability, allowing for independent development and updates of each sidebar.
