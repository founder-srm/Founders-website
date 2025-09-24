# Purple Theme Implementation

This document describes the purple theme implementation for the Founders Club website.

## Overview

The purple theme provides a dark, elegant color scheme with vibrant purple accents while maintaining excellent readability and accessibility.

## Implementation Details

### Color Palette

The purple theme uses the following HSL color values:

- **Background**: `hsl(295, 20%, 8%)` - Dark purple base
- **Foreground**: `hsl(295, 5%, 95%)` - Light text for high contrast
- **Primary**: `hsl(290, 76%, 60%)` - Vibrant purple for buttons and accents
- **Card**: `hsl(295, 15%, 12%)` - Subtle purple for card backgrounds
- **Secondary**: `hsl(295, 12%, 20%)` - Medium purple for secondary elements
- **Muted**: `hsl(295, 12%, 25%)` - Muted purple for subtle backgrounds
- **Accent**: `hsl(295, 12%, 25%)` - Accent purple for highlighting
- **Border**: `hsl(295, 20%, 25%)` - Purple-tinted borders

### Files Modified

1. **`src/components/theme/theme-provider.tsx`**
   - Added 'purple' to the themes array
   - Maintains compatibility with existing themes

2. **`src/components/theme/theme-toggle.tsx`**
   - Added Purple option to the theme dropdown menu
   - Positioned between Fun and Light themes

3. **`src/app/globals.css`**
   - Added complete `.purple` CSS class with all necessary custom properties
   - Follows the same pattern as existing `.dark` theme

4. **`src/app/layout.tsx`**
   - Updated themes array to include 'purple'
   - Ensures consistent theme configuration across the application

## Usage

Users can select the purple theme by:

1. Clicking the theme toggle button in the navbar
2. Selecting "Purple" from the dropdown menu

The theme will be automatically applied site-wide and persisted across browser sessions.

## Accessibility

The purple theme maintains high contrast ratios:
- Background to foreground contrast exceeds WCAG AA standards
- Primary button colors provide sufficient contrast
- All text remains readable on background colors

## Technical Notes

- Uses CSS custom properties for theming
- Compatible with Tailwind CSS variable system  
- Follows shadcn/ui theming patterns
- No breaking changes to existing functionality
- Theme switching is handled by next-themes library

## Testing

The implementation has been tested with:
- Theme switching functionality
- Visual consistency across UI components
- Color contrast and readability
- Integration with existing theme system