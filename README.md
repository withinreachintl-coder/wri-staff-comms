# Staff Communication Tool

**WhatsApp replacement for restaurant teams**

## Product Overview
- **Domain:** staff.wireach.tools  
- **Price:** $29/month, 14-day free trial  
- **Target:** Independent restaurant owners & managers  

## MVP Features
1. **Admin Announcements** - Broadcast to all staff with read receipts
2. **Shift Swap Requests** - Staff post shifts, others claim, admin approves
3. **Staff Roster** - Magic link invites
4. **Mobile-First** - Built for phones in kitchens

## Tech Stack
- Next.js 15 + TypeScript  
- Supabase (auth + database)  
- Tailwind CSS  
- Vercel (deployment)  

## Database Schema

### Core Tables

**organizations**
- id (uuid, PK)
- name, owner_email, stripe_customer_id
- subscription_status (trial|active|past_due|canceled)
- trial_ends_at, plan (free|pro)

**users**
- id (uuid, PK, = auth.uid())
- org_id (FK), email, name
- role (admin|manager|staff)

**announcements**
- id, org_id, author_id
- title, body
- created_at

**announcement_reads**
- announcement_id, user_id
- read_at
- UNIQUE constraint per user/announcement

**shift_swaps**
- id, org_id, requester_id, claimer_id, approver_id
- shift_date, shift_time, notes
- status (open|claimed|approved|rejected|canceled)

## Development Status
🚧 **In Progress** - Schema approved, building MVP

## Related Products
- Daily Ops Checklist (ops.wireach.tools) - $19/mo
