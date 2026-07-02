# Project User Manual

## Overview

This project is an AI Solutions website with a public-facing frontend and a backend API for managing content, contact inquiries, and admin access.

## Who This Manual Is For

This manual is for:
- website visitors
- content managers
- administrators
- developers setting up the project locally

## 1. Public Website Usage

### Home Page
- Open the website from the main landing page.
- Browse the services, solutions, and information sections.
- Use the AI assistant chat for basic guidance.

### Contact Page
- Go to the contact page.
- Fill in your full name, email, phone, company, country, job title, and message.
- Submit the form to send an inquiry to the system.

### Articles, Events, and Gallery
- Visit the Articles page to read published content.
- Open the Events page to view upcoming events.
- Browse the Gallery page to view portfolio and visual content.

## 2. Admin Usage

### Admin Login
- Open the admin login page.
- Enter your admin email and password.
- If you do not have access, request a temporary password from the admin system.

### Admin Dashboard
After logging in, the dashboard allows you to:
- view inquiries from visitors
- manage articles
- manage events
- manage gallery content
- review admin-related actions

### Managing Articles
- Create new articles with a title, summary, body, and optional images.
- Publish or keep articles in draft status.
- Edit or delete existing articles.

### Managing Events
- Add new events with title, date, location, and description.
- Update or remove event entries.

### Managing Gallery Items
- Upload or link gallery images.
- Add titles, categories, descriptions, and status.
- Edit or delete gallery items.

## 3. Backend Functions

The backend provides:
- contact form processing
- inquiry storage
- email sending for confirmations and admin notices
- article, event, and gallery management
- admin authentication support

## 4. Local Setup

### Prerequisites
- Node.js installed
- npm installed
- a browser
- optional: Firebase and SMTP credentials for full functionality

### Frontend Setup
1. Open the frontend folder.
2. Start a local web server if needed.
3. Open the main page in the browser.

### Backend Setup
1. Open the backend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
4. The backend will run at:
   ```text
   http://localhost:4000
   ```

## 5. Troubleshooting

### Frontend Issues
- Page does not load properly: refresh the browser and confirm the files are being served correctly.
- Form does not submit: verify that the backend is running.

### Backend Issues
- Server does not start: verify Node.js is installed and dependencies are installed.
- Email not sending: check SMTP credentials and configuration.
- Firebase errors: confirm Firebase credentials are configured correctly.

## 6. Support

For help with the project, contact the project maintainer or system administrator.
