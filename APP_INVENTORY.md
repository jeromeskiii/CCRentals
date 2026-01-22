# App Inventory

This document provides a brutal inventory of the current screens in the CC Rentals application, as of the last review.

## Core Application (New Architecture)
| Screen Name | Core Purpose | State Shown | Actions | Notes |
|-------------|--------------|-------------|---------|-------|
| **Dashboard** | Operational overview & high-level metrics | Fleet Utilization, Pending Returns, Compliance Alerts | Navigate to details, View Operation Feed | "Reference Implementation" for Dashboard layout |
| **Asset Detail** | Single source of truth for specific equipment | Asset Specs, Deployment Status, Audit Log | View Contract, Log Return, Return to Manifest | **REFERENCE IMPLEMENTATION** - Touches documents & compliance |

## Legacy Components (To Be Purged/Refactored)
| Component Name | Original Purpose | Disposition |
|----------------|------------------|-------------|
| `components/template/*` | Marketing landing page sections (Hero, Navbar, etc.) | **PURGE** - Replaced by new internal tool aesthetic |
| `components/Services.tsx` | Marketing service listing | **PURGE** - Data now lives in Dashboard manifest |
| `components/ServiceRequestModal.tsx` | Public lead generation form | **ARCHIVE** - Logic might be reused for internal "New Order" form |
| `components/QuoteCalculator.tsx` | Public estimation tool | **ARCHIVE** - Logic useful for internal quoting |
| `components/SiteMapPlanner/*` | Event planning map tool | **KEEP/REFACTOR** - valuable logistics tool, needs UI update to new Constitution |
| `components/UnitCalculator.tsx` | Event capacity planning | **KEEP/REFACTOR** - utility for internal ops |

## UI Primitive Inventory (New System)
*   **Theme**: `lib/theme.ts` (Carbon/Isotope/Orange)
*   **Card**: Sharp borders, industrial corner accents
*   **Badge**: Bordered, text-based status indicators (Active, Pending, Verified)
*   **DataPoint**: Vertical key-value pairs with left-border indicators
