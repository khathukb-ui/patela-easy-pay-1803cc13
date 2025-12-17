# Patela Customer Journey

> **"Built for the Hustle"** - A payment solution designed for street vendors with low literacy, supporting multiple languages and offline-first operation.

---

## 📱 Overview

Patela guides vendors through three core journeys:

1. **Onboarding** - Getting started with the app
2. **Taking Payments** - Processing customer transactions
3. **Viewing Sales** - Tracking business performance

---

## 🚀 Journey 1: Onboarding

### Flow Diagram

```mermaid
flowchart TD
    A[🌍 Language Selection] --> B{Returning User?}
    B -->|Yes| C[👋 Welcome Back Prompt]
    B -->|No| D[📱 Phone Number Entry]
    C -->|Continue| E[Resume from Last Step]
    C -->|Start Fresh| D
    D --> F[🔐 OTP Verification]
    F -->|Correct Code| G[👤 Personal Details]
    F -->|Wrong Code| F
    G --> H[🏪 Business Details]
    H --> I[📧 Communication Preferences]
    I --> J[🔑 Create PIN]
    J --> K[🔑 Confirm PIN]
    K -->|Match| L[✅ Success!]
    K -->|No Match| J
    L --> M{Next Steps}
    M --> N[🏦 Link Bank Account]
    M --> O[🏠 Go to Home]
```

### Step-by-Step Process

| Step | Screen | User Action | Design Principle |
|------|--------|-------------|------------------|
| 1 | **Language Selection** | Tap preferred language (English, isiZulu, Sesotho, Xitsonga) | Large buttons, flag icons |
| 2 | **Phone Entry** | Enter 10-digit SA mobile number | Big keypad, clear format hint |
| 3 | **OTP Verification** | Enter 6-digit code from SMS | Auto-focus, resend option |
| 4 | **Personal Details** | Enter name, optional ID number | One field at a time |
| 5 | **Business Details** | Select business type, enter name | Icon-based categories |
| 6 | **Communication Prefs** | Choose SMS, WhatsApp, or Email | Multiple selection allowed |
| 7 | **Create PIN** | Enter 4-digit PIN | Secure dots, keypad only |
| 8 | **Confirm PIN** | Re-enter same PIN | Error if mismatch |
| 9 | **Success** | View completion message | Green checkmark, celebration |

### Resume Onboarding Feature

```mermaid
flowchart LR
    A[User Returns] --> B{Has Saved Progress?}
    B -->|Yes| C[Show Welcome Back Card]
    B -->|No| D[Start Fresh]
    C --> E[Continue Button]
    C --> F[Start Fresh Button]
    E --> G[Navigate to Last Step]
    F --> H[Clear Data & Restart]
```

**Key Features:**
- Progress saved to local storage automatically
- Resume prompt shows on Language Selection page
- Option to continue or start fresh
- Data cleared on successful completion

---

## 💳 Journey 2: Taking a Payment

### Flow Diagram

```mermaid
flowchart TD
    A[🏠 Home Screen] --> B[💳 Take Payment Button]
    B --> C[🔢 Enter Amount]
    C --> D{Quick Amount?}
    D -->|Yes| E[Tap R20/R50/R100]
    D -->|No| F[Use Keypad]
    E --> G[📝 Add Note - Optional]
    F --> G
    G --> H[Charge Customer Button]
    H --> I[⏳ Processing...]
    I --> J{Payment Result}
    J -->|Success| K[✅ Green Success Screen]
    J -->|Failed| L[❌ Red Failed Screen]
    K --> M{Send Receipt?}
    M -->|SMS| N[Send via SMS]
    M -->|WhatsApp| O[Send via WhatsApp]
    M -->|Email| P[Send via Email]
    M -->|No Receipt| Q[Skip]
    N --> R[Done - Return Home]
    O --> R
    P --> R
    Q --> R
    L --> S{Retry Options}
    S -->|Try Again| I
    S -->|Another Card| C
    S -->|Cancel| A
```

### Payment Screen States

| State | Visual | User Action |
|-------|--------|-------------|
| **Amount Entry** | Large display showing R0.00 | Tap keypad or quick amounts |
| **Processing** | Spinning loader, amount shown | Wait for card tap/insert |
| **Success** | Big green screen, checkmark | Choose receipt option |
| **Failed** | Big red screen, X icon | Retry, try another card, or cancel |

### Quick Amount Buttons

```mermaid
flowchart LR
    A[R20] --> D[Amount Display]
    B[R50] --> D
    C[R100] --> D
    E[Custom via Keypad] --> D
```

### Offline Payment Handling

```mermaid
flowchart TD
    A[Payment Created] --> B{Online?}
    B -->|Yes| C[Process Immediately]
    B -->|No| D[Queue Transaction]
    D --> E[Show Offline Banner]
    E --> F[Store Encrypted Locally]
    F --> G{Connection Restored?}
    G -->|Yes| H[Auto-Sync Queue]
    G -->|No| I[Keep in Queue]
    H --> J[Update Status]
```

---

## 📊 Journey 3: Viewing Payment History

### Flow Diagram

```mermaid
flowchart TD
    A[🏠 Home Screen] --> B[📊 Today's Stats Card]
    B --> C[View Sales History]
    A --> D[📋 Sales Tab in Navigation]
    D --> E[Sales List Screen]
    E --> F[Filter by Date]
    E --> G[Download Statement]
    E --> H[View Individual Sale]
    H --> I{Sale Status}
    I -->|Success| J[Green Check Icon]
    I -->|Pending| K[Spinning Icon]
    I -->|Failed| L[Warning Icon]
    I -->|Refunded| M[Strikethrough Amount]
    H --> N[Sale Details]
    N --> O[Issue Refund - Requires PIN]
```

### Sales Dashboard Components

```mermaid
flowchart LR
    subgraph "Today's Stats"
        A[Total Amount]
        B[Number of Sales]
        C[Queued Offline]
    end
    subgraph "Sale Item"
        D[Amount]
        E[Time]
        F[Card Last 4]
        G[Status Badge]
    end
```

### Sale Status Types

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| **Success** | ✓ Checkmark | Green | Payment completed |
| **Pending** | ↻ Spinning | Yellow | Processing |
| **Failed** | ⚠ Warning | Red | Declined/Error |
| **Queued** | 🕐 Clock | Gray | Waiting for sync |
| **Refunded** | ↻ Arrow | Gray | Money returned |

---

## 🎨 Design Principles Applied

### Visual Hierarchy

```mermaid
flowchart TD
    A[One Primary Action per Screen] --> B[Large Touch Targets]
    B --> C[High Contrast Colors]
    C --> D[Minimal Text]
    D --> E[Icon-First Design]
    E --> F[Progress Indicators]
```

### Color Coding System

| Context | Color | Meaning |
|---------|-------|---------|
| **Success** | 🟢 Green | Money received, action complete |
| **Error** | 🔴 Red | Declined, failed, needs attention |
| **Warning** | 🟡 Yellow | Processing, pending |
| **Neutral** | ⚪ Gray | Inactive, historical |
| **Primary** | 🟣 Purple | Brand, main actions |
| **Accent** | 🔵 Cyan | Highlights, secondary actions |

### Accessibility Features

- **Large Buttons**: Minimum 48px touch targets
- **High Contrast**: WCAG AA compliant
- **Multi-Language**: 4 SA languages supported
- **Voice Prompts**: Optional audio guidance
- **Offline First**: Works without internet

---

## 🔄 Complete User Flow

```mermaid
flowchart TD
    subgraph "First Time"
        A1[Download App] --> A2[Complete Onboarding]
        A2 --> A3[Link Bank Account]
        A3 --> A4[Pair Device]
    end
    
    subgraph "Daily Use"
        B1[Open App] --> B2[View Dashboard]
        B2 --> B3[Take Payments]
        B3 --> B4[Check Sales]
        B4 --> B5[Review Settlements]
    end
    
    subgraph "End of Day"
        C1[View Total Sales]
        C2[Export Statement]
        C3[Check Pending Payouts]
    end
    
    A4 --> B1
    B5 --> C1
```

---

## 📱 Screen Inventory

### Onboarding Screens
1. Splash Screen
2. Language Selection
3. Phone Number Entry
4. OTP Verification
5. Personal Details (3 substeps)
6. PIN Creation
7. PIN Confirmation
8. Success Screen

### Payment Screens
1. Home Dashboard
2. Payment Amount Entry
3. Payment Processing
4. Payment Success
5. Payment Failed
6. Receipt Options

### Sales Screens
1. Sales List
2. Sale Detail
3. Refund Confirmation
4. Export Options

### Account Screens
1. Account Settings
2. Bank Account Management
3. Device Management
4. Help & Support

---

## 📋 Summary

Patela's customer journey is designed around three core principles:

1. **Simplicity** - One action per screen, minimal text
2. **Accessibility** - Large buttons, multiple languages, offline support
3. **Trust** - Clear feedback, secure PIN protection, transparent status

The flow prioritizes getting vendors up and running quickly while providing the tools they need to manage their business effectively.

---

*Document generated for Patela - "Built for the Hustle"*
