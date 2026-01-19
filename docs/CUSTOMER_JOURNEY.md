# Patela Customer Journey Map

> **"Built for the Hustle"** - How vendors register and start using Patela, even before linking a bank account or pairing a device.

---

## 👥 User Personas

### 1. Admin Merchant (Business Owner)

| Attribute | Description |
|-----------|-------------|
| **Who they are** | The vendor who owns the business |
| **What they can do** | Everything — take payments, view all sales, add team members, link bank account, pair devices, request payouts |
| **Their goal** | Grow their business and get paid easily |
| **Challenges** | May have low literacy, limited tech experience, inconsistent internet |
| **Motivations** | Accept card payments, track earnings, build trust with customers |

### 2. Cashier (Team Member)

| Attribute | Description |
|-----------|-------------|
| **Who they are** | A helper or employee added by the Admin |
| **What they can do** | Take payments, view today's sales, add items |
| **What they can't do** | Change bank details, request payouts, add other team members |
| **Their goal** | Help process sales quickly and accurately |
| **Challenges** | Need simple interface, may share device with others |
| **Motivations** | Do their job well, avoid mistakes |

---

## 🗺️ Journey Stages

---

### Stage 1: Discover Patela

**User Goal:**  
Learn what Patela is and decide if it's right for their business.

**User Actions:**
- Sees Patela ad, hears from a friend, or meets a Patela agent
- Visits the Patela website or downloads the app
- Browses the landing page to understand features

**Patela System Response:**
- Shows a friendly, visual landing page with:
  - Clear benefits (accept card payments, get paid fast)
  - Device options and pricing (Patela Phanda R499, Patela Pro R899)
  - Simple "Get Started" button
  - Success stories from other vendors
  - "How It Works" step-by-step section

**Key Screens:**
- Landing page (Index)
- Device comparison cards
- Features grid
- Testimonials section

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I don't understand what this does" | Big icons, simple language, visual demos |
| "Is this for someone like me?" | Show relatable vendor testimonials |
| "What does it cost?" | Clear pricing, no hidden fees messaging |
| "I can't read well" | Icon-heavy design, minimal text |

---

### Stage 2: Sign Up

**User Goal:**  
Create an account quickly without confusion.

**User Actions:**
- Taps "Get Started" or "Create Account"
- Chooses to sign up with phone number OR email (toggle)
- Enters their phone/email and creates a password
- Confirms password

**Patela System Response:**
- Shows Phone/Email toggle for flexibility (phone is default)
- Validates input in real-time with friendly messages
- Shows clear error messages if something's wrong
- Moves to verification step after successful entry

**Key Screens:**
- Auth page (Sign Up mode)
- Phone/Email toggle selector
- Password creation fields
- Confirm password field

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I don't have email" | Phone number sign-up is the default option |
| "I forget passwords" | Simple 6+ character requirement, not complex rules |
| "Forms confuse me" | Large input fields, one focus at a time |
| "I typed wrong" | Clear validation, easy to correct |

---

### Stage 3: Verify Phone Number

**User Goal:**  
Prove they own the phone number they entered.

**User Actions:**
- Receives SMS with 6-digit code
- Enters the code in the app
- If code doesn't arrive, taps "Resend"

**Patela System Response:**
- Sends OTP via SMS immediately
- Auto-reads code where phone allows
- Shows countdown timer for resend (60 seconds)
- Clear error if wrong code entered
- Green success on correct code

**Key Screens:**
- OTP input screen (6 boxes)
- Resend code button with countdown
- Success confirmation animation

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I didn't get the SMS" | Resend button appears after countdown |
| "I typed the wrong code" | Friendly error: "That code didn't match. Try again." |
| "I can't find the code" | Auto-read feature (where phone supports it) |
| "The code expired" | Clear message with option to get new code |

---

### Stage 4: Choose Language

**User Goal:**  
Use the app in a language they understand.

**User Actions:**
- Sees language options displayed prominently
- Taps their preferred language
- Proceeds to next step

**Patela System Response:**
- Shows 4 language options with native names:
  - English
  - isiZulu
  - Sesotho
  - Xitsonga
- Immediately applies the selection
- All future screens use chosen language

**Key Screens:**
- Language selection screen
- Each language shown in its own script
- Progress indicator (Step 1 of 5)

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I can't read English well" | Each language label written in that language |
| "What if I choose wrong?" | Can change anytime in Account settings |
| "I don't see my language" | Future: add more SA languages |

---

### Stage 5: Create PIN

**User Goal:**  
Set up a secure way to access their account.

**User Actions:**
- Enters a 4-digit PIN using large keypad
- Confirms the PIN by entering it again
- Submits to save

**Patela System Response:**
- Shows large number keypad filling the screen
- Dots fill in as digits entered (secure, not visible)
- Checks PINs match on confirmation
- Saves securely (hashed, never stored in plain text)
- Shows success message

**Key Screens:**
- PIN creation screen with keypad
- 4 empty dots that fill as user types
- PIN confirmation screen (same layout)
- Success message with checkmark

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I might forget my PIN" | Simple 4 digits, same as phone/ATM |
| "I can't see what I'm typing" | Visual dots show progress without revealing numbers |
| "What if they don't match?" | Clear message: "PINs don't match. Try again." |
| "Someone might see my PIN" | Dots hide actual numbers |

---

### Stage 6: Provide Basic Details (KYC)

**User Goal:**  
Tell Patela who they are so they can use the service.

**User Actions:**
- **Step 1 - Personal:** Enters first name, last name, optional SA ID number
- **Step 2 - Business:** Enters business name, selects business type
- **Step 3 - Communication:** Chooses how they want to be contacted

**Patela System Response:**
- Shows one substep at a time (not overwhelming)
- Progress indicator shows 1/3, 2/3, 3/3
- Validates ID format if entered (optional field)
- Business types shown with icons:
  - 🍔 Food
  - 👕 Clothing
  - 📱 Electronics
  - 🔧 Services
  - 📦 Other
- Communication options: SMS, WhatsApp, Email (can select multiple)
- Saves all information to their profile

**Key Screens:**
- Personal details form (3 fields)
- Business details form (2 fields with icon selector)
- Communication preferences (3 checkboxes)
- Progress bar showing substeps

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "Forms are too long" | Split into 3 short substeps with progress |
| "I don't have formal business name" | Hint: "What do people call your business?" |
| "I don't know my business type" | Simple categories with familiar icons |
| "ID is scary to share" | Marked as optional, explain why it helps |

---

### Stage 7: Account Ready - Home Dashboard

**User Goal:**  
See their account is set up and understand what they can do.

**User Actions:**
- Lands on the Home screen after onboarding
- Sees today's sales summary (starts at R0.00)
- Notices the big "Take Payment" button
- May see gentle reminders to link bank/device (non-blocking)

**Patela System Response:**
- Shows welcoming home screen with greeting
- Displays TodayStats component:
  - Total sales: R0.00
  - Number of sales: 0
  - Queued offline: 0
- Shows SetupReminder cards as friendly suggestions:
  - "Pair a device for tap payments"
  - "Link bank to receive payouts"
- Both reminders have "Do this later" option
- "Take Payment" button is prominent and always available

**Key Screens:**
- Home dashboard
- TodayStats card at top
- Take Payment button (large, accent color)
- SetupReminder cards (skippable)
- Bottom navigation (Home, Sales, Items, Account)

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I can't use it without a device?" | WRONG! Take Payment works immediately |
| "Too many things to do" | One clear primary action: Take Payment |
| "Do I have to link bank now?" | No — reminders are skippable, appear later |
| "I'm confused where to go" | Simple bottom navigation with 4 options |

---

### Stage 8: Add Items to Sell

**User Goal:**  
Set up products/services they sell for faster checkout.

**User Actions:**
- Goes to Items tab in bottom navigation
- Taps "Add Item" button
- Enters item name and price
- Optionally selects category
- Saves the item
- Repeats for more items

**Patela System Response:**
- Shows simple item entry form:
  - Item name (text)
  - Price (number with R prefix)
  - Category (optional dropdown)
- Saves to their personal item list
- Items appear in a visual grid
- Items can be tapped during payment for quick entry
- Can edit or delete items anytime

**Key Screens:**
- Items page (grid of items)
- Add Item form (simple, 2-3 fields)
- Edit Item form
- Empty state with "Add your first item" prompt

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I sell many things" | Quick add form, easy repeat |
| "I don't know exact prices" | Can edit anytime, no commitment |
| "What's a catalog/inventory?" | Never use technical words — just "Your Items" |
| "I forgot to add something" | Add items anytime, even during payment |

---

### Stage 9: Make First Sale

**User Goal:**  
Accept their first payment from a customer.

**User Actions:**
- Taps "Take Payment" on Home screen
- Either:
  - Types amount using big keypad, OR
  - Taps items from their list to auto-add prices
  - Uses quick amount buttons (R20, R50, R100)
- Optionally adds a note
- Taps "Charge" button
- Customer pays (tap card, insert card, or enter details)
- Sees success or failed screen

**Patela System Response:**
- Shows large, finger-friendly keypad
- Displays running total prominently
- Quick amount buttons for common values
- Item selector shows their saved items
- Processing animation during payment
- Success: Big green screen with amount and checkmark
- Failed: Red screen with clear error and retry options
- Automatically records the sale in history

**Key Screens:**
- Payment amount entry (keypad + display)
- Item selector overlay (optional)
- Quick amount buttons
- Processing animation
- Success result screen (green, celebration)
- Failed result screen (red, simple retry)

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I pressed wrong number" | Clear/backspace button is large and visible |
| "Did it work?" | Big green checkmark, celebration animation |
| "What if payment fails?" | Red screen with simple message and retry button |
| "I don't remember the price" | Use saved items to auto-fill |
| "Customer is waiting" | Quick amount buttons for speed |

---

### Stage 10: View Sales History

**User Goal:**  
See how much they've made and track their sales.

**User Actions:**
- Taps "Sales" in bottom navigation
- Sees list of today's transactions
- Can tap date filter to see other days
- Can tap individual sale to see details
- Can download statement (PDF/CSV)

**Patela System Response:**
- Shows sales list with key info:
  - Amount (R120.00)
  - Time (14:32)
  - Status icon (✓ green, ⏳ yellow, ✗ red)
  - Last 4 digits of card (if applicable)
- Date filter at top
- Summary totals:
  - Today's total
  - This week
  - This month
- Export button for statements

**Key Screens:**
- Sales history list
- Date filter picker
- Individual sale detail
- Summary statistics card
- Export options (PDF, CSV)

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "Too many numbers" | Clean cards with large, clear amounts |
| "I want to see last week" | Easy date picker at top |
| "What's this payment for?" | Shows item names if items were used |
| "I need proof for records" | Export to PDF for printing/sharing |

---

### Stage 11: Prompted to Link Device or Bank (Optional)

**User Goal:**  
Understand why linking is helpful, but not feel forced.

**User Actions:**
- Sees gentle reminder cards on Home dashboard
- Can tap to start linking, OR
- Can tap "Do this later" to dismiss
- Reminders may reappear periodically

**Patela System Response:**
- Shows friendly, non-blocking reminder cards:
  - 📱 "Pair a device to accept tap payments anywhere"
  - 🏦 "Link your bank to get your money"
- Each card has:
  - Clear benefit explanation
  - "Set up now" button
  - "Do this later" link
- Dismissing stores preference temporarily
- Reminders don't block any functionality

**Key Screens:**
- SetupReminder components on Home
- Bank linking start page (with "Do this later" skip)
- Device pairing start page (with "Skip for now")

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "I'm not ready for this" | Skip options on every setup step |
| "Will I lose my sales?" | No — sales are tracked regardless |
| "I don't have a bank account" | Can still use Patela, link later when ready |
| "This is annoying" | Reminders are gentle, not popups or blockers |

---

### Stage 12: Request Payout (Requires Bank Link)

**User Goal:**  
Get their money sent to their bank account.

**User Actions:**
- Goes to Account → Payout Preferences
- If bank not linked: sees prompt to link first
- If bank linked: sees available balance
- Chooses payout speed:
  - Standard (free, next business day)
  - Same Day (small fee, arrives today)
- Confirms request

**Patela System Response:**
- If no bank linked:
  - Shows friendly explanation why bank is needed
  - "Link Bank Now" button
  - "Your sales are safe — link when ready"
- If bank linked:
  - Shows available balance
  - Shows fee calculation for Same Day
  - Payout speed toggle
  - Confirmation button
- After request: Shows estimated arrival time

**Key Screens:**
- Payout Preferences page
- Bank linking flow (if needed)
- Payout speed selector
- Fee breakdown
- Confirmation screen
- Success message with arrival estimate

**Pain Points & How UX Addresses Them:**

| Pain Point | UX Solution |
|------------|-------------|
| "Why can't I get my money?" | Clear explanation: need bank account for payout |
| "Fees confuse me" | Shows exact fee amount before confirming |
| "When will I get paid?" | Clear timeline: "Tomorrow by 5pm" or "Today by 6pm" |
| "I don't trust giving bank details" | Explain security, show trust badges |

---

## 📊 Can I Use Patela Without Device/Bank?

| Feature | Without Device | Without Bank |
|---------|----------------|--------------|
| Sign Up | ✅ Yes | ✅ Yes |
| Verify Phone | ✅ Yes | ✅ Yes |
| Choose Language | ✅ Yes | ✅ Yes |
| Create PIN | ✅ Yes | ✅ Yes |
| Provide Details | ✅ Yes | ✅ Yes |
| View Dashboard | ✅ Yes | ✅ Yes |
| Add Items | ✅ Yes | ✅ Yes |
| Make Sale | ✅ Yes (manual card entry) | ✅ Yes |
| View Sales History | ✅ Yes | ✅ Yes |
| Export Statements | ✅ Yes | ✅ Yes |
| Request Payout | ✅ Yes | ❌ Need bank linked |

**Bottom Line:** Vendors can start selling on Day 1. Device and bank are only needed for tap payments and withdrawals.

---

## 🎯 Key Design Principles

| Principle | How We Apply It |
|-----------|-----------------|
| **No Blocking Gates** | Users can start selling immediately without device or bank |
| **One Thing at a Time** | Each screen has one clear purpose and action |
| **Friendly Language** | No jargon, no technical terms, conversational tone |
| **Gentle Nudges** | Remind users about setup, never force them |
| **Visual Feedback** | Big icons, meaningful colors (green = good, red = problem) |
| **Progress Visibility** | Always show how far along they are in multi-step flows |
| **Error Recovery** | When things go wrong, explain simply and offer clear next step |
| **Offline First** | App works without internet, syncs when connected |

---

## 🌍 Multi-Language Support

All journey stages fully support these languages:

| Language | Native Name | Status |
|----------|-------------|--------|
| English | English | ✅ Complete |
| isiZulu | isiZulu | ✅ Complete |
| Sesotho | Sesotho | ✅ Complete |
| Xitsonga | Xitsonga | ✅ Complete |

Users can change language anytime in Account settings.

---

## 🔄 Complete Journey Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     DISCOVER PATELA                         │
│   See ad → Visit website → Browse features → Get Started    │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                        SIGN UP                              │
│   Choose phone/email → Enter details → Create password      │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    VERIFY & SETUP                           │
│   OTP → Language → PIN → Personal Details → Business Info   │
└────────────────────────────┬────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   ACCOUNT READY! 🎉                         │
│   Home Dashboard → See R0 balance → Ready to sell           │
└────────────────────────────┬────────────────────────────────┘
                             ▼
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────┐                   ┌─────────────────────┐
│   ADD ITEMS     │                   │   TAKE PAYMENT      │
│   (Optional)    │                   │   (Start selling!)  │
└────────┬────────┘                   └──────────┬──────────┘
         │                                       │
         └───────────────────┬───────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     VIEW SALES                              │
│   See history → Filter by date → Export statements          │
└────────────────────────────┬────────────────────────────────┘
                             ▼
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│   LINK DEVICE       │               │   LINK BANK         │
│   (When ready)      │               │   (For payouts)     │
│   "Do this later" ✓ │               │   "Do this later" ✓ │
└─────────────────────┘               └──────────┬──────────┘
                                                 ▼
                                      ┌─────────────────────┐
                                      │   REQUEST PAYOUT    │
                                      │   Get your money!   │
                                      └─────────────────────┘
```

---

## 📋 Screen Inventory

### Onboarding Screens (8)
1. Landing Page
2. Auth (Sign Up / Sign In)
3. OTP Verification
4. Language Selection
5. PIN Creation
6. PIN Confirmation
7. Personal Details (3 substeps)
8. Onboarding Success

### Core App Screens (8)
1. Home Dashboard
2. Take Payment (Amount Entry)
3. Payment Processing
4. Payment Success
5. Payment Failed
6. Sales History
7. Items List
8. Account Settings

### Setup Screens (6)
1. Bank Linking Start
2. Bank Details Entry
3. Bank Verification
4. Device Pairing Start
5. Device Bluetooth Scan
6. Device Success

### Settings Screens (4)
1. Users & Access
2. Payout Preferences
3. Help & Support
4. Language Change

---

*Document Version: 2.0*  
*Last Updated: January 2026*  
*Patela - "Built for the Hustle"*
