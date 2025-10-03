
# Undergraduation.com Admin Dashboard

## Overview
This is a professional internal CRM dashboard for managing student interactions on undergraduation.com. Built with Next.js and React, it provides a centralized view of each student’s journey, engagement, communications, and application progress.

## Tech Stack
- **Frontend:** Next.js (React)
- **Backend/Database:** Firebase (integration-ready, currently using mock data)
- **Auth:** Firebase Auth (integration-ready)
- **Email:** Customer.io (mocked)

## Features
- **Student Directory:**
	- Table view of all students
	- Filters/search by name, email, status
	- Click to open individual student profile
- **Student Profile:**
	- Basic info (name, email, phone, grade, country)
	- Interaction timeline (login, AI questions, documents)
	- Communication log (emails, SMS)
	- Internal notes (add/edit/delete)
	- Application progress bar
	- AI summary (mocked)
- **Communication Tools:**
	- Log communications manually
	- Trigger follow-up email (mock)
	- Schedule reminders/tasks
- **Insights & Filters:**
	- Quick filters (not contacted, high intent, needs essay help)
	- Summary stats (active students, essay stage, etc.)

## Setup Instructions
1. Install dependencies:
	 ```bash
	 npm install
	 ```
2. Start the development server:
	 ```bash
	 npm run dev
	 ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## File Structure
- `src/app/dashboard/page.jsx` — Main dashboard page
- `src/components/StudentDirectory.jsx` — Student table view
- `src/components/StudentProfile.jsx` — Individual student profile
- `src/components/CommunicationTools.jsx` — Communication actions
- `src/components/InsightsBar.jsx` — Summary stats and quick filters
- `src/app/globals.css` — Global styles

## Customization & Extensibility
- Replace mock data with Firebase integration for real student data
- Connect Customer.io for real email sending
- Extend filters, notes, and timeline as needed

## Assessment Deliverables
- Loom video of working app (locally hosted)
- Link to GitHub repo with code
- README file (this file)

## License
This project is for technical assessment purposes only.
