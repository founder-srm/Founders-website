# FormBuilder Component Documentation

## Table of Contents

* [1. Introduction](#1-introduction)
* [2. `TypeFormField` Interface](#2-typeformfield-interface)
* [3. `FIELD_TYPES` Constant](#3-fieldtypes-constant)
* [4. `createCleanField` Function](#4-createcleanfield-function)
* [5. `CheckboxItemsEditor` Component](#5-checkboxitemseditor-component)
* [6. `FormBuilder` Component](#6-formbuilder-component)
    * [6.1 `addField` Function](#61-addfield-function)
    * [6.2 `updateField` Function](#62-updatefield-function)
    * [6.3 `removeField` Function](#63-removefield-function)
* [7. Drag and Drop Functionality](#7-drag-and-drop-functionality)


## 1. Introduction

This document details the implementation of the `FormBuilder` component, a React component used to create and manage form fields.  The component utilizes drag-and-drop functionality for rearranging fields and provides a user-friendly interface for configuring various field types and their properties.


## 2. `TypeFormField` Interface

This interface defines the structure of a form field object:

| Property Name     | Type                               | Description                                                                    | Required |
|-----------------|------------------------------------|--------------------------------------------------------------------------------|----------|
| `fieldType`      | `'text' | 'radio' | 'select' | 'slider' | 'checkbox' | 'date' | 'textarea'` | The type of form field.                                                     | Yes      |
| `label`          | `string`                           | The label displayed for the field.                                            | Yes      |
| `name`           | `string`                           | The internal name of the field.                                               | Yes      |
| `description`    | `string` (optional)                | A description of the field.                                                    | No       |
| `required`       | `boolean` (optional)               | Indicates if the field is required. Defaults to `false`.                     | No       |
| `options`        | `string[]` (optional)              | Array of options for select and radio fields.                               | No       |
| `min`            | `number` (optional)                | Minimum value for slider and number fields.                                   | No       |
| `max`            | `number` (optional)                | Maximum value for slider and number fields.                                   | No       |
| `validation`     | `object` (optional)                | Object containing validation rules (minLength, maxLength, pattern).            | No       |
| `checkboxType`   | `'single' | 'multiple'` (optional)       | Type of checkbox field ('single' or 'multiple'). Defaults to 'single'.     | No       |
| `items`          | `Array<{ id: string; label: string }>` (optional) | Array of items for multiple checkbox fields.                                | No       |


## 3. `FIELD_TYPES` Constant

This constant array defines the available field types and their corresponding labels for the field type selector:

| Value      | Label       |
|------------|-------------|
| `text`     | `Text`       |
| `textarea` | `Long Text` |
| `select`   | `Dropdown`   |
| `radio`    | `Radio`      |
| `checkbox` | `Checkbox`   |
| `date`     | `Date`       |
| `slider`   | `Slider`     |


## 4. `createCleanField` Function

This function creates a new form field object with default values based on the specified field type. The algorithm uses a `switch` statement to handle different field types, assigning default properties based on the type.  For example, `text` and `textarea` fields receive default `minLength` and `maxLength` validation rules, while `select` and `radio` fields receive an empty `options` array.  `slider` fields receive default `min` and `max` values.


## 5. `CheckboxItemsEditor` Component

This component provides an interface for managing items within a multiple-choice checkbox field. It allows adding new items with an ID and label, and removing existing items.  The `addItem` function adds a new item to the array only if both `newId` and `newLabel` are provided. The `removeItem` function uses the `filter` method to create a new array excluding the item at the specified index.


## 6. `FormBuilder` Component

This is the main component responsible for rendering and managing the form builder interface.

### 6.1 `addField` Function

This function adds a new field to the form. It calls `createCleanField` to generate a new field object with default values based on the selected field type and uses the spread operator to add it to the current `fields` array.

### 6.2 `updateField` Function

This function updates an existing field in the form.  It takes the field index and a partial `TypeFormField` object containing the updated data. It creates a copy of the `fields` array using the spread operator, updates the field at the specified index with the new data using the spread operator, and then updates the state using `onChange`. The `onFieldsChange` callback (if provided) is also called to allow for additional handling of field changes.

### 6.3 `removeField` Function

This function removes a field from the form. It uses the `filter` method to create a new array containing all fields except the one at the specified index.


## 7. Drag and Drop Functionality

The `FormBuilder` component uses the `@hello-pangea/dnd` library to enable drag-and-drop reordering of form fields. The `DragDropContext` component wraps the droppable area, and the `Droppable` and `Draggable` components manage the drag-and-drop functionality.  Currently, the `onDragEnd` callback is a placeholder and does not perform any actions; it is likely intended for future expansion. The `draggableId` is dynamically generated using the field's `name` or a default value if the `name` is empty, ensuring unique identifiers for each draggable field.
