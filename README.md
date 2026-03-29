# Briefcase 📊

**Secure Investment Reporting Platform for Portfolio Companies & Investors**

Briefcase is a permission-based document sharing platform that enables portfolio companies to securely share reports, financials, and updates with their investors—without exposing sensitive information to unauthorized parties.

> **Repository note:** The following sections describe the full product vision, data model, and target architecture. The codebase is an evolving MVP—some paths and features called out below (for example `supabase/schema.sql`, `scripts/setup.js`, or certain `app/api` routes) may land incrementally. Use the repo tree as the source of truth for what ships today.

## 🎯 Core Use Case

### The Problem
- Portfolio companies need to share monthly/quarterly reports with multiple investors
- Each investor should only see reports for companies they've invested in
- Email attachments are insecure and create version control chaos
- No audit trail of who accessed what and when

### The Solution
**Briefcase** provides:
- ✅ **Granular Permissions**: Control exactly who sees each report (firm-level or individual-level)
- ✅ **Automatic Access Control**: Investors automatically see reports from portfolio companies
- ✅ **Audit Trail**: Complete logs of every view, download, and share
- ✅ **Secure File Storage**: Encrypted storage with expiring download links
- ✅ **Real-time Notifications**: Instant alerts when new reports are published
- ✅ **Commenting System**: Discussion threads on reports (company-internal or investor-visible)

## 🏗️ Architecture

### Data Model

```
Investment Firms (VC/PE firms)
    ↓ has members (Partners, Analysts)
    ↓ invests in
Portfolio Companies
    ↓ has members (Admins, Finance team)
    ↓ publishes
Reports (Monthly updates, Board decks, Financials)
    ↓ contains
Report Files (PDFs, Excel, PowerPoint)
    ↓ controlled by
Report Permissions (Who can view/download)
```

### Key Entities

| Entity | Description | Examples |
|--------|-------------|----------|
| **Investment Firm** | VC or PE firm | Sequoia, a16z, Tiger Global |
| **Portfolio Company** | Company that received investment | Stripe, Notion, Figma |
| **Investment** | Link between firm and company | Sequoia → Stripe (Series A, $20M) |
| **Report** | Document shared by company | Q4 2024 Board Deck |
| **Report Permission** | Access control rule | "Sequoia can view Q4 2024 Board Deck" |

## 💡 Key Features

### For Portfolio Companies

1. **Easy Report Publishing**
   - Upload reports with drag-and-drop
   - Add structured metrics (Revenue, ARR, Growth %)
   - Tag reports by type (Monthly Update, Board Deck, etc.)
   - Set visibility (all investors, specific firms, or individual users)

2. **Investor Management**
   - See which firms invested in your company
   - Grant/revoke access to specific reports
   - Set expiration dates for sensitive documents

3. **Internal Collaboration**
   - Internal comments on draft reports
   - Review workflow before publishing
   - Version history tracking

### For Investors

1. **Portfolio Dashboard**
   - See all companies you've invested in
   - Latest reports from each company at a glance
   - Metrics trends over time
   - Download reports for offline review

2. **Advanced Search**
   - Search across all accessible reports
   - Filter by company, date, report type
   - Full-text search within report titles and summaries

3. **Notifications**
   - Real-time alerts when new reports are published
   - Email digests (daily/weekly)
   - Comment mentions and replies

4. **Commenting & Discussion**
   - Ask questions directly on reports
   - @ mention company team members
   - Get answers without email back-and-forth

## 🔒 Security & Compliance

### Permission System

**Three levels of access control:**

1. **Automatic Access** (based on investment)
   - If Firm A invested in Company B, Firm A members automatically see Company B's published reports

2. **Report-Level Visibility**
   - Companies can mark reports as "all investors" or "specific firms only"
   - Example: Board deck visible to all, but fundraising deck only to Series A lead

3. **Granular Permissions**
   - Override automatic access for specific reports
   - Grant time-limited access (e.g., "View for 30 days")
   - Individual user permissions (not just firm-wide)

### Encryption

- **At Rest**: AES-256-GCM encryption for sensitive file metadata
- **In Transit**: HTTPS/TLS 1.3 for all communications
- **Key Derivation**: PBKDF2 with 100,000 iterations

### Audit Logging

Every action is logged:
- Who viewed which report (with IP address and timestamp)
- Who downloaded which file
- Permission changes
- Comment activity

**Logs are append-only**: Cannot be modified or deleted, ensuring tamper-proof audit trail.

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| API calls | 100 | 1 minute |
| Authentication | 5 | 1 minute |
| File downloads | 20 | 1 minute |
| Report uploads | 10 | 1 hour |

## 📱 Platform Features

### Web Application (Next.js)
- Responsive design (desktop, tablet, mobile)
- Real-time updates (notifications, comments)
- Advanced filtering and search
- Drag-and-drop file uploads
- In-browser PDF preview

### Mobile API
- RESTful API with JWT authentication
- Native mobile app support (React Native/Swift/Kotlin)
- Offline viewing (download for later)

### Integrations (Future)
- Slack notifications for new reports
- Email digests (via Resend/SendGrid)
- Google Drive sync (export reports)
- Zapier webhooks for custom workflows

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Upstash Redis account (optional, for rate limiting)

### Installation

```bash
# Clone the repository
git clone <your-repo>
cd briefcase

# Install dependencies
npm install

# Environment (copy and edit)
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_* and NEXT_PUBLIC_APP_URL (e.g. http://localhost:3000)

# Optional: interactive setup when scripts/setup.js is available
# npm run setup

# Start development server
npm run dev
```

Visit http://localhost:3000

### First-Time Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - When `supabase/schema.sql` exists in this repo, run it in the SQL Editor; otherwise apply migrations from `supabase/migrations/` as they are added

2. **Set Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in Supabase credentials
   - If `npm run setup` exists, use it to generate additional secrets

3. **Create First Users**
   - Sign up via Supabase Auth
   - Manually create user records in database (see `scripts/create-admin.sql` when present)

4. **Create Demo Data** (Optional)
   - Run `scripts/seed-demo-data.sql` when present for sample firms, companies, and reports

## 📊 Use Case Examples

### Example 1: Monthly Investor Update

**Scenario**: Acme Inc (portfolio company) wants to share their January 2024 update with all investors.

**Steps**:
1. Acme CFO logs in
2. Creates new report: "January 2024 - Monthly Update"
3. Uploads PDF and adds metrics (Revenue: $500K, MoM Growth: 12%)
4. Sets visibility: "All investors"
5. Clicks "Publish"

**Result**:
- All investors (Sequoia, a16z, etc.) instantly see the report
- Email notification sent to all investor partners
- Audit log records: "Report published by Jane Doe at 2024-01-15 10:30 AM"

### Example 2: Confidential Board Deck

**Scenario**: Acme Inc wants to share Q4 board deck only with their Series A lead (Sequoia).

**Steps**:
1. Create report: "Q4 2024 Board Deck"
2. Upload PowerPoint file
3. Set visibility: "Specific firms only"
4. Grant permission: "Sequoia Capital" (can view + download)
5. Publish

**Result**:
- Only Sequoia partners can access this deck
- Other investors (a16z) cannot see it
- Audit log tracks every Sequoia partner who views/downloads

### Example 3: Time-Limited Data Room

**Scenario**: Acme Inc is fundraising and wants to share sensitive financials with prospective investors for 2 weeks.

**Steps**:
1. Create report: "Series B Data Room - Financials"
2. Upload financial models (Excel)
3. Manually grant permission to "Tiger Global" (prospective investor)
4. Set expiration: 14 days from today
5. Publish

**Result**:
- Tiger Global partners can access for 14 days
- After expiration, access is automatically revoked
- Acme can see exactly who from Tiger Global viewed the files

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | React framework with SSR |
| **UI** | TailwindCSS + Headless UI | Responsive, accessible components |
| **Animation** | Framer Motion | Smooth transitions and interactions |
| **Backend** | Next.js API Routes | RESTful API endpoints |
| **Database** | Supabase (PostgreSQL) | Relational data with RLS |
| **Auth** | Supabase Auth | Email/password, magic links, SSO |
| **Storage** | Supabase Storage | File uploads with CDN |
| **Rate Limiting** | Upstash Redis | Distributed rate limiting |
| **Deployment** | Vercel | Auto-scaling serverless platform |
| **Monitoring** | Sentry (optional) | Error tracking and performance |

## 📁 Project Structure

```
briefcase/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── (dashboard)/              # Main app pages
│   │   ├── dashboard/            # Home dashboard
│   │   ├── reports/              # Reports list and detail
│   │   ├── companies/            # Company management
│   │   ├── investors/            # Investor management
│   │   └── settings/             # User/firm settings
│   └── api/                      # API routes
│       ├── reports/              # Report CRUD
│       ├── files/                # File upload/download
│       ├── permissions/          # Permission management
│       ├── comments/             # Comments API
│       └── notifications/        # Notifications
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components
│   ├── reports/                  # Report-specific components
│   ├── permissions/              # Permission controls
│   └── layout/                   # Layout components
├── lib/                          # Utilities and helpers
│   ├── supabase/                 # Supabase client & queries
│   ├── auth/                     # Auth utilities
│   ├── encryption/               # Encryption functions
│   ├── audit/                    # Audit logging
│   ├── permissions/              # Permission checks
│   └── notifications/            # Notification helpers
├── supabase/                     # Database migrations
│   ├── schema.sql                # Main schema
│   └── migrations/               # Version-controlled changes
└── scripts/                      # Setup and utility scripts
    ├── setup.js                  # Interactive setup
    ├── seed-demo-data.sql        # Demo data
    └── create-admin.sql          # Create first admin user
```

## 🔄 Workflow Examples

### Company Workflow (Publishing Reports)

```
1. Draft Report
   ↓
2. Add Files (PDF, Excel, etc.)
   ↓
3. Add Metrics & Summary
   ↓
4. Set Visibility (All investors / Specific firms)
   ↓
5. Review (optional internal review)
   ↓
6. Publish
   ↓
7. Notifications Sent to Investors
```

### Investor Workflow (Accessing Reports)

```
1. Receive Email Notification
   ↓
2. Click Link → Go to Report Page
   ↓
3. View Summary & Metrics
   ↓
4. Download PDF/Files
   ↓
5. Leave Comment/Question (optional)
   ↓
6. Mark as Read
```

## 📈 Roadmap

### Phase 1 (Current - MVP)
- ✅ Core data model
- ✅ User authentication
- ✅ Report upload & download
- ✅ Basic permissions
- ✅ Audit logging
- ✅ Web dashboard

### Phase 2 (Q1 2025)
- 📱 Mobile app (iOS/Android)
- 🔍 Advanced search & filters
- 💬 Real-time commenting system
- 📊 Analytics dashboard for companies
- 📧 Email notification system
- 🔗 Slack integration

### Phase 3 (Q2 2025)
- 📄 In-app document viewer (PDF.js)
- 📈 Metrics visualization (charts, trends)
- 🤖 AI-powered insights (summarization, key findings)
- 🔐 SSO integration (Google, Okta)
- 📤 Bulk upload
- 🗂️ Report templates

### Phase 4 (Future)
- 🌐 Multi-language support
- 🔄 Zapier/API integrations
- 📊 Custom reporting dashboards
- 🎨 White-label for enterprise customers
- 📱 Desktop app (Electron)

## 🤝 Contributing

This is a private/commercial project. For questions or support, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

- **Documentation**: See `/docs` folder
- **Issues**: Internal issue tracker
- **Email**: support@yourdomain.com

---

**Built with ❤️ for better investment transparency**
