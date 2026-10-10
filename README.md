# CivicPulse — Improving Transparency in Public Works

A civic infrastructure monitoring platform designed to improve transparency in public works projects, highlight potential infrastructure conflicts, and help citizens report and track civic issues.

🚀 **Live Demo:** https://civic-pulse-two-puce.vercel.app/

🔐 **Official Login:** https://civic-pulse-two-puce.vercel.app/login

📽️ **Demo Video:** https://drive.google.com/file/d/1-bHJ8AYZ9BUtmtMt7l46W2JQnDui17NI/view?usp=sharing

📦 **GitHub Repository:** https://github.com/TEJA-IIITDM/CivicPulse

---

## 📌 Problem Statement

### Improving Transparency and Coordination in Public Works Projects

Public infrastructure projects such as road construction, drainage repairs, and pipeline installation are often managed by different municipal departments and contractors.

Information about these projects can be scattered across offices, notice boards, and informal sources. Residents may struggle to understand the purpose of a project, its expected completion date, its responsible authority, or the reasons for delays.

Poor coordination can result in repeated construction on the same roads, unnecessary disruptions, and inefficient use of public resources. When work is delayed or performed poorly, citizens need a convenient way to report concerns and follow up.

### Key Problems

- Limited visibility into ongoing public infrastructure projects.
- Difficulty understanding project timelines, statuses, and deadlines.
- Potential conflicts between infrastructure works.
- Inconvenience caused by construction and repeated road disruptions.
- Limited channels for citizens to report and track civic complaints.
- Need for greater transparency and accountability in public works.

## 💡 Proposed Solution

CivicPulse provides a centralized web platform for exploring infrastructure project information, monitoring project statuses and deadlines, viewing potential conflict areas, and reporting civic complaints.

The platform combines a project dashboard, project discovery tools, an interactive map, complaint tracking, and official authentication in one application.

By bringing these functions together, CivicPulse aims to make public works information easier to explore and civic issues easier to communicate.

## ✨ Features

### 🏙️ Infrastructure Dashboard

- Dashboard displaying key project statistics.
- Project status and deadline visibility.
- Conflict alerts and attention sections.
- Overview of infrastructure projects and activity.

### 🏗️ Project Exploration and Management

- View infrastructure project cards and details.
- Search for projects.
- Filter and sort project listings.
- Review project statuses and deadlines.
- Project creation through the available functionality.

### 🗺️ Interactive Infrastructure Map

- Explore infrastructure-related project information geographically.
- Filter map information using **ALL**, **CONFLICTS**, and **WORKS**.
- View work locations and potential conflict areas represented by the application.

### 📝 Citizen Complaint Reporting

- Submit civic complaints through the reporting interface.
- View submitted complaints.
- Track complaint statuses.
- Upvote complaints where supported.
- Persist complaint information through the backend.

### 🔐 Official Authentication

- Official login using Supabase Authentication.
- Role checks for official access.
- Dashboard redirection after successful official login.
- Separation of authentication from authorization for protected operations.

## 🔑 Login and Access Policy

CivicPulse currently provides an official login workflow rather than public self-registration.

- **No public signup:** Users cannot create official accounts through a public signup page.
- **Controlled official access:** Official accounts should be provisioned or approved through a trusted verification process.
- **Protected operations:** Sensitive actions should be restricted to authenticated users with the appropriate permissions.
- **Backend authorization:** Role checks and database access policies should enforce permissions rather than relying only on the user interface.

**For evaluators:** Visit the live demo and use an authorized demo account to test login-protected functionality. Credentials should be shared separately through an approved channel, not published in this repository.

## 🛠️ Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend and Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Database policies and functions, where configured

### Deployment and Version Control

- Vercel
- Git
- GitHub

## 🏛️ How CivicPulse Works

1. Users open the deployed CivicPulse application.
2. The application loads project and complaint information through its configured backend.
3. The dashboard presents project statistics, statuses, deadlines, and conflict-related information.
4. Users explore projects through search, filtering, sorting, and the interactive map.
5. Citizens can report civic issues and follow their statuses through the available complaint workflow.
6. Authorized officials sign in to access official functionality.
7. Protected operations should be validated through application and database authorization controls.

## 🗂️ Project Structure

CivicPulse follows a Next.js application structure. This is a high-level overview; the repository contains the authoritative list of files.

```text
CivicPulse/
├── app/                  # Application routes and pages
├── components/           # Reusable UI components
├── lib/                  # Supabase client and utilities
├── public/               # Static assets
├── .gitignore            # Git exclusions
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Dependency lockfile
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- Git
- A Supabase project configured with the database schema and access policies required by the application

### 1. Clone the Repository

```bash
git clone https://github.com/TEJA-IIITDM/CivicPulse.git
cd CivicPulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env.local` in the project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with the corresponding values from your Supabase project.

**Security notes:**

- Never commit `.env.local`, passwords, service-role keys, or other private credentials.
- A Supabase publishable key is intended for client-side use; it is not a replacement for database security.
- Configure and test Supabase access policies and authorization rules before allowing real users to modify data.
- Official accounts must be provisioned or approved through a trusted process.

### 4. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Create a Production Build

```bash
npm run build
```

## 🌐 Deployment

CivicPulse is deployed using Vercel and uses Supabase for backend services.

**Production URL:** https://civic-pulse-two-puce.vercel.app/

To deploy your own instance:

1. Clone the GitHub repository.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Configure the Supabase database and authentication.
5. Deploy and verify the application.

## 🔒 Security Considerations

- Use Supabase Authentication for the official login workflow.
- Enforce role-based permissions for sensitive actions.
- Configure appropriate database access policies.
- Validate permissions on the backend, not only in the frontend.
- Keep private credentials out of GitHub.
- Test unauthorized access attempts before production use.

Authentication confirms a user's identity; authorization determines what that user is permitted to do. Both are important for protecting official operations.

## 🚀 Future Improvements

- More advanced infrastructure conflict detection.
- Improved project progress tracking and reporting.
- Clearer explanations for project delays.
- Enhanced map-based infrastructure exploration.
- Notifications for project changes and complaint updates.
- Stronger authorization and abuse-prevention measures.
- Expanded project analytics and reporting.
- Public citizen accounts, if required, while keeping official privileges restricted.

## 🎓 Project Objective

CivicPulse addresses the CivicTech challenge of improving transparency and coordination in public works projects.

The project aims to make infrastructure information easier to explore, highlight potential conflicts, and provide a channel for civic feedback through a centralized, database-backed web application.

## 👨‍💻 Author

**Tejas**  
B.Tech student

**GitHub:** https://github.com/TEJA-IIITDM

---

⭐ Explore the repository, try the live demo, and share feedback on improving civic infrastructure transparency.
