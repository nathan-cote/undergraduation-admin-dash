

# Undergraduation.com Admin Dashboard

## What is this?
This is an internal dashboard for managing student records and communications for Undergraduation.com. It’s built with Next.js and React, and uses Firebase for authentication and database storage. The dashboard lets admins view, update, and interact with student data in a secure, user-friendly way.

## Features
- Secure admin login and sign up (with name and email)
- Student directory with search and filters
- Individual student profiles showing:
  - Name, email, phone, grade, country
  - Application progress bar
  - Communication log (manual entries, mock email triggers)
  - Internal notes
  - Reminders/tasks for the team
- Quick filters and summary stats for student engagement

## Getting Started

### 1. Clone the repository
Clone this repo to your local machine:

    git clone https://github.com/nathan-cote/undergraduation-admin-dash.git

### 2. Install dependencies
Navigate to the project folder and install dependencies:

    npm install

### 3. Configure Firebase
Create a `.env.local` file in the root directory and add your Firebase project credentials:

    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

You can find these values in your Firebase project settings.

### 4. Start the development server
Run the app locally:

    npm run dev

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## File Structure
- `src/app/dashboard/page.jsx` — Main dashboard page
- `src/app/auth/page.jsx` — Admin login and sign up
- `src/components/StudentDirectory.jsx` — Student table and filters
- `src/components/StudentProfile.jsx` — Student details, notes, comms, reminders
- `src/components/Header.jsx` — Top navigation bar
- `src/components/InsightsBar.jsx` — Quick stats and filters
- `src/lib/firebase.js` — Firebase setup
- `src/app/globals.css` — Global styles

## How authentication works
- Only logged-in admins can access the dashboard and student data
- Admins sign up with name, email, and password
- Admin names are stored in Firestore for personalized greetings

## Customization
- You can extend the dashboard by adding new fields, filters, or integrations
- To use real email sending, connect a service like SendGrid or Customer.io
- All student interactions and reminders are stored in Firestore for audit/history

## Troubleshooting
- If you see a Firebase configuration error, double-check your `.env.local` file
- Restart the dev server after changing environment variables
- For authentication issues, make sure your Firebase Auth settings allow email/password sign-in

## License
This project is for demonstration and assessment purposes only.
