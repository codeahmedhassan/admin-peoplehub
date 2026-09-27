# PeopleHub --- HR Dashboard Design Specification

## 1. Design Objective

Build a high-fidelity desktop HR management dashboard based on the
provided reference design.

The interface must feel like one cohesive, premium SaaS HR product.

**Core rule:** preserve the existing reference design and layout. Do not
redesign sections that are not explicitly mentioned in this document.

------------------------------------------------------------------------

## 2. Visual Direction

### Overall Style

-   Modern SaaS HR dashboard
-   Minimal and professional
-   Light theme
-   Clean white/off-white surfaces
-   Generous whitespace
-   Soft, subtle shadows
-   Large rounded cards
-   Thin, low-contrast borders
-   Strong visual hierarchy
-   Calm and polished rather than overly decorative

### Visual Character

The UI should feel:

-   Professional
-   Premium
-   Clean
-   Approachable
-   Modern
-   Enterprise-ready

Avoid:

-   Excessive gradients
-   Heavy shadows
-   Glassmorphism
-   Dense information layouts
-   Oversized typography
-   Excessive decorative illustrations
-   Bright/neon UI elements except for the existing lime accent

------------------------------------------------------------------------

# 3. Color System

Use the reference image as the primary visual source.

### Primary Blue

`#1557D6`

Used for:

-   Active navigation
-   Primary indicators
-   Selected dates
-   Attendance chart
-   Important interactive elements

### Accent Lime

`#B8ED00`

Used for:

-   Attendance chart highlights
-   Small positive/status indicators
-   Existing visual accents

### Main Background

Very light neutral/off-white.

### Card Background

White.

### Primary Text

Near-black / very dark charcoal.

### Secondary Text

Muted gray.

### Borders

Very light gray.

### Status Colors

Use soft pastel backgrounds with darker matching icons/text.

Examples:

-   Blue → Interview
-   Green → Onboarding
-   Orange → HR meeting
-   Red/Pink → Performance review

Do not use saturated status backgrounds.

------------------------------------------------------------------------

# 4. Typography

Use a clean modern sans-serif font.

Typography should closely match the reference.

### Page Greeting

"Good Morning,"

Small, muted text.

### Company Name

"Orbix Studio"

Large, bold heading.

### Card Titles

Medium/large semibold.

### Card Descriptions

Small muted gray text.

### Metrics

Large, bold numerical typography.

### Navigation

Medium-weight text with compact spacing.

Typography should prioritize readability and hierarchy over decoration.

------------------------------------------------------------------------

# 5. Overall Layout

Desktop dashboard layout:

``` text
┌──────────────────────────────────────────────────────────────────────┐
│ Sidebar │ Top Header / Search / Controls / User                     │
│         ├────────────────────────────────────────────────────────────┤
│         │ Greeting + Actions                                         │
│         ├───────────────────────────────┬────────────────────────────┤
│         │ Attendance Rate               │ Upcoming HR Tasks           │
│         │                               │                            │
│         ├───────────────────────────────┤                            │
│         │ Recent Payroll                │                            │
│         │                               ├────────────────────────────┤
│         │                               │ PeopleHub Onboarding       │
│         └───────────────────────────────┴────────────────────────────┘
└──────────────────────────────────────────────────────────────────────┘
```

Maintain the same proportions as the reference.

The right column should remain narrower than the main content column.

------------------------------------------------------------------------

# 6. Sidebar

The sidebar must remain visually consistent with the reference.

### Brand

`WorkNest.`

Use the same logo treatment and placement.

### Menu

Label:

`MENU`

Navigation:

-   Dashboard
-   Profile
-   Payroll
-   Attendance
-   Performance
-   Time-off
-   Projects
-   Teams
-   Schedule
-   Analytics

The Profile group is expanded in the reference.

The active/expanded group uses the primary blue background.

### Bottom Profile

Display:

`Miquella`

`miquella@gmail.com`

Keep the avatar and arrow placement consistent with the reference.

------------------------------------------------------------------------

# 7. Top Navigation

Preserve the reference header.

Components:

-   Search field
-   Microphone button
-   Theme/light button
-   Dark-mode button
-   Notification button
-   User avatar
-   User name
-   Email
-   Navigation arrow

The header should remain visually lightweight.

Do not add additional navigation elements.

------------------------------------------------------------------------

# 8. Page Header

Display:

### Greeting

`Good Morning,`

### Workspace / Company

`Orbix Studio`

Right-side actions:

-   `Export`
-   `+ Add new entry`

The Add New Entry button is the primary dark/black button.

The Export button is a white outlined button.

------------------------------------------------------------------------

# 9. Attendance Rate Card

This section must remain unchanged from the reference.

### Title

`Attendance rate`

### Description

`Total attendance rate of employee in this company`

### Period Selector

`Monthly`

### Main Metric

`8.35%`

Show the circular/upward arrow indicator next to the metric.

### Supporting Text

``` text
Total employees
attendance are increasing
every week
```

### Legend

-   On-time
-   Late attend
-   Absent

### Chart

Use the same visual structure:

-   Vertical rounded bars
-   Blue primary portions
-   Lime secondary portions
-   Soft gray background
-   Subtle diagonal/vertical decorative pattern

Month labels:

-   JAN
-   FEB
-   MAR
-   APR
-   MAY
-   JUN
-   JUL
-   AUG

Do not redesign this card.

------------------------------------------------------------------------

# 10. Recent Payroll Card

Keep this card consistent with the reference.

### Title

`Recent payroll`

### Columns

-   NO
-   FULL NAME
-   POSITION
-   DATE
-   STATUS

Use three visible rows.

Each row includes:

-   Number
-   Small employee avatar
-   Employee name
-   Job position
-   Date
-   Status pill

Example statuses:

`Completed`

`Delayed`

Use subtle pill backgrounds.

Keep the overall card size and spacing consistent with the reference.

------------------------------------------------------------------------

# 11. Upcoming HR Tasks Card

## Purpose

Replace the original Schedule card with an HR-focused activity/task
panel.

### Card Position

Same position as the original Schedule card.

### Card Size

Approximately the same width and height as the original Schedule card.

### Header

Title:

`Upcoming HR Tasks`

Description:

`Here’s your HR activities for today`

Top-right:

Three-dot circular menu button.

------------------------------------------------------------------------

## Date Selector

Keep the same date-selector concept as the reference.

Dates:

``` text
14    15    16    17    18    19    20
Sat   Sun   Mon   Tue   Wed   Thu   Fri
```

`16 / Mon` is selected.

Selected date:

-   Blue circular background
-   White number
-   Blue underline below the selected day

------------------------------------------------------------------------

## HR Task List

Replace the original colorful vertical schedule columns with a clean
task list.

### Task 1

Time:

`09:00 - 10:00 AM`

Title:

`Interview`

Subtitle:

`Product Designer`

Icon:

People/interview icon.

Icon background:

Soft blue.

------------------------------------------------------------------------

### Task 2

Time:

`11:00 - 12:00 PM`

Title:

`New Employee`

Subtitle:

`Onboarding`

Icon:

Document/onboarding icon.

Icon background:

Soft green.

------------------------------------------------------------------------

### Task 3

Time:

`02:00 - 03:00 PM`

Title:

`Team Meeting`

Subtitle:

`HR & Management`

Icon:

Calendar/meeting icon.

Icon background:

Soft orange.

------------------------------------------------------------------------

### Task 4

Time:

`04:00 - 05:00 PM`

Title:

`Review Employee`

Subtitle:

`Performance`

Icon:

Document/review icon.

Icon background:

Soft red/pink.

------------------------------------------------------------------------

## Task Row Structure

Each row should contain:

``` text
TIME       ICON       TITLE
                      SUBTITLE                         CHEVRON
```

Use thin separators between rows.

Keep rows compact enough to fit inside the original card dimensions.

The chevron should indicate that the task can be expanded.

------------------------------------------------------------------------

# 12. PeopleHub Onboarding Tutorial Card

## Purpose

Replace the original:

`Total videos updated weekly`

section.

This card is specifically for onboarding users to PeopleHub.

### Position

Same position as the original bottom-right statistics card.

### Dimensions

Keep the same approximate width, height, border radius, and visual
weight.

------------------------------------------------------------------------

## Background

Use a very subtle soft gradient.

Suggested direction:

Light blue → pale green.

The gradient must be subtle and premium.

Do not make it look like a colorful marketing banner.

------------------------------------------------------------------------

## Heading

Primary text:

`Learn how to use PeopleHub`

Secondary line:

`with onboarding tutorial`

The heading should be positioned on the left.

------------------------------------------------------------------------

## Action Button

Place a small white rounded button in the upper-right.

Text:

`Watch Tutorial`

Include a small play/open/external icon.

Button should have:

-   White background
-   Subtle border
-   Small shadow
-   Rounded corners

------------------------------------------------------------------------

## Illustration

Add a subtle onboarding/tutorial illustration in the lower area.

Possible visual elements:

-   Small dashboard cards
-   UI documentation panels
-   Tutorial/play symbol
-   Small interface elements
-   Abstract onboarding graphics

The illustration must remain low contrast.

It should support the card without overpowering the text.

------------------------------------------------------------------------

# 13. Card System

All dashboard cards should follow the same visual system.

### Border Radius

Large rounded corners.

### Shadow

Very subtle:

-   Low opacity
-   Large blur
-   Minimal elevation

### Border

Very light gray.

### Padding

Generous but consistent.

### Internal Spacing

Use consistent spacing between:

-   Heading
-   Description
-   Controls
-   Content
-   Footer/action areas

------------------------------------------------------------------------

# 14. Iconography

Use a consistent modern line-icon style.

Icons should be:

-   Simple
-   Thin/medium stroke
-   Rounded
-   Minimal
-   Consistent in visual weight

Avoid mixing multiple icon styles.

------------------------------------------------------------------------

# 15. Responsive Behavior

Primary target:

**Desktop**

The reference is a desktop dashboard.

For smaller screens:

-   Collapse sidebar
-   Stack dashboard cards
-   Preserve card hierarchy
-   Keep task information readable
-   Do not allow horizontal overflow

Desktop fidelity has priority over mobile optimization.

------------------------------------------------------------------------

# 16. Strict Preservation Rules

The following must NOT be redesigned:

1.  Sidebar
2.  WorkNest branding
3.  Header/search area
4.  Greeting section
5.  Export button
6.  Add New Entry button
7.  Attendance Rate card
8.  Attendance chart
9.  Recent Payroll card
10. User profile area
11. Overall page spacing
12. Overall color language
13. Overall typography
14. Card proportions

Only these two areas are replaced:

### Replacement A

`Schedule`

→

`Upcoming HR Tasks`

### Replacement B

`Total videos updated weekly`

→

`Learn how to use PeopleHub with onboarding tutorial`

------------------------------------------------------------------------

# 17. Content Rules

Do not invent unnecessary dashboard statistics.

Do not add:

-   Extra charts
-   Extra cards
-   Extra KPIs
-   Extra navigation
-   Additional filters
-   Additional dashboards
-   Marketing banners

The dashboard should remain visually close to the reference.

------------------------------------------------------------------------

# 18. Final Quality Requirement

The finished design should look like the original reference was
professionally modified rather than completely redesigned.

A viewer familiar with the reference should immediately recognize:

-   The same dashboard
-   The same layout
-   The same visual system
-   The same sidebar
-   The same attendance section
-   The same payroll section
-   The same header

Only the Schedule and bottom-right video/statistics areas should appear
different.

**Priority order:**

1.  Reference-image fidelity
2.  Layout consistency
3.  Typography consistency
4.  Spacing consistency
5.  Color consistency
6.  HR-specific replacement content
7.  Responsive behavior
