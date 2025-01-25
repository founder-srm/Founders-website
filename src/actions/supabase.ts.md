# Supabase Authentication Service

## Table of Contents

* [1. Introduction](#1-introduction)
* [2. Data Types](#2-data-types)
  * [2.1. `ActionResponse`](#21-actionresponse)
  * [2.2. `OAuthResponse`](#22-oauthresponse)
* [3. Functions](#3-functions)
  * [3.1. `updateUserEmail`](#31-updateuseremail)
  * [3.2. `updateUserPassword`](#32-updateuserpassword)
  * [3.3. `signOutUser`](#33-signoutuser)
  * [3.4. `getUserIdentities`](#34-getuseridentities)
  * [3.5. `linkIdentity`](#35-linkidentity)
  * [3.6. `unlinkIdentity`](#36-unlinkidentity)
  * [3.7. `signInWithOAuth`](#37-signinwithoauth)


## 1. Introduction

This document details the functions within the Supabase authentication service.  These functions provide a consistent interface for managing user accounts and authentication through Supabase.  Each function utilizes the `createClient()` function (defined elsewhere) to establish a connection to the Supabase client.  Error handling is implemented consistently across all functions, returning a structured response object indicating success or failure.


## 2. Data Types

### 2.1. `ActionResponse`

| Field    | Type                  | Description                                          |
| -------- | --------------------- | ---------------------------------------------------- |
| `error`  | `null | AuthError`      | Contains an error object if an error occurred; `null` otherwise. |
| `data`   | Object or `null`      | Contains the response data if successful; `null` otherwise.  The structure varies depending on the function. |


### 2.2. `OAuthResponse`

| Field    | Type                  | Description                                          |
| -------- | --------------------- | ---------------------------------------------------- |
| `error`  | `null | AuthError`      | Contains an error object if an error occurred; `null` otherwise. |
| `data`   | Object or `null`      | Contains the OAuth response data if successful; `null` otherwise.  Structure includes `provider` and `url`. |


## 3. Functions

### 3.1. `updateUserEmail`

This function updates the user's email address.

* **Input:** `newEmail: string` - The new email address.
* **Output:** `Promise<ActionResponse>` - An object containing either the updated user data or an error.
* **Algorithm:** The function uses the Supabase client's `auth.updateUser` method to update the email address.  It handles potential errors returned by Supabase and returns an appropriate `ActionResponse`.


### 3.2. `updateUserPassword`

This function updates the user's password.

* **Input:** `newPassword: string` - The new password.
* **Output:** `Promise<ActionResponse>` - An object containing either the updated user data or an error.
* **Algorithm:** The function uses the Supabase client's `auth.updateUser` method to update the password.  It handles potential errors returned by Supabase and returns an appropriate `ActionResponse`.


### 3.3. `signOutUser`

This function signs out the current user.

* **Input:** None
* **Output:** `Promise<ActionResponse>` - An object indicating success or failure.
* **Algorithm:** The function uses the Supabase client's `auth.signOut` method to sign out the user.  It handles potential errors and returns an `ActionResponse`.


### 3.4. `getUserIdentities`

This function retrieves the user's linked identities.

* **Input:** None
* **Output:** `Promise<{ error: null | AuthError; data: UserIdentity[] | null; }>` - An object containing an array of `UserIdentity` objects or an error.
* **Algorithm:** The function uses the Supabase client's `auth.getUserIdentities` method. It safely handles the possibility of `data` or `data.identities` being null, returning null in those cases.


### 3.5. `linkIdentity`

This function links a new identity provider (GitHub or Google) to the user's account.

* **Input:** `provider: 'github' | 'google'` - The identity provider to link.
* **Output:** `Promise<OAuthResponse>` - An object containing the redirect URL or an error.
* **Algorithm:**  The function uses the Supabase client's `auth.linkIdentity` method.  It specifies a redirect URL (`/dashboard/account`) for the authentication flow.  The response includes the provider and a URL (which may be null if the provider handles the redirect differently).


### 3.6. `unlinkIdentity`

This function unlinks an identity provider from the user's account.

* **Input:** `provider: string` - The identity provider to unlink.
* **Output:** `Promise<ActionResponse>` - An object indicating success or failure.
* **Algorithm:** The function first retrieves the user's identities using `supabase.auth.getUserIdentities`. If there's an error during retrieval, it's returned.  It then searches for the specified identity. If not found, a "NotFound" error is returned.  Finally, it uses `supabase.auth.unlinkIdentity` to remove the identity and returns the result.


### 3.7. `signInWithOAuth`

This function initiates the OAuth sign-in flow for a specified provider.

* **Input:** `provider: 'github' | 'google'` - The identity provider to use for sign-in.
* **Output:** `Promise<OAuthResponse>` - An object containing the redirect URL or an error.
* **Algorithm:** The function uses `supabase.auth.signInWithOAuth`.  It includes options for `redirectTo`, `access_type` (offline for persistent access), and `prompt` (consent for explicit permission request).  The response includes the provider and the redirect URL.
