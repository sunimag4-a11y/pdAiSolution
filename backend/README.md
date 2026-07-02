# Backend README

## Overview

The backend for AI Solutions is a Node.js + Express API that powers the website's contact form, admin features, content management, and Firebase integrations. It handles inquiry submissions, email notifications, temporary admin passwords, and CRUD operations for articles, events, gallery items, and users.

## Tech Stack

- Node.js
- Express.js
- Firebase Admin SDK
- Nodemailer
- dotenv
- CORS

## Project Structure

```text
backend/
  index.js            # Main Express server and API routes
  package.json        # Backend dependencies and scripts
  serviceAccountKey.json  # Local Firebase credentials (optional)
  data/               # Optional backend data folder
```

## Features

- Contact form submission and validation
- Inquiry storage in Firestore
- Email confirmation and admin response emails
- Admin password generation and Firebase auth integration
- CRUD routes for articles, events, and gallery items
- AI chat mock endpoint for simple website assistance
- Image upload endpoint for Imgbb integration

## Requirements

- Node.js 18 or newer
- npm
- Firebase project
- SMTP credentials for email sending

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file inside the backend folder with the following values:

```env
PORT=4000

# Firebase Admin
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
# OR use one of these alternatives:
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
# OR provide serviceAccountKey.json locally

# Firebase Web API Key for admin login/password flows
FIREBASE_WEB_API_KEY=your_firebase_web_api_key

# SMTP settings
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
FROM_NAME=AI Solutions
FROM_EMAIL=your_sender_email

# Optional
IMGBB_API_KEY=your_imgbb_key
ADMIN_LOGIN_URL=http://localhost:3000/admin/login.html
```

If Firebase credentials are not provided through environment variables, the server will attempt to use the local file [backend/serviceAccountKey.json](serviceAccountKey.json).

## Running the Backend

### Development mode

```bash
cd backend
npm run dev
```

### Production mode

```bash
cd backend
npm start
```

The server will run on:

```text
http://localhost:4000
```

## Main API Endpoints

### Public endpoints

- `POST /api/contact` - Submit a contact inquiry
- `GET /api/inquiries` - Retrieve inquiries
- `POST /api/upload-image` - Upload an image to Imgbb
- `POST /api/ai/chat` - Simple chat assistant mock endpoint

### Admin endpoints

- `POST /api/admin/send-temp-password` - Create and email a temporary admin password
- `POST /api/admin/verify-password` - Verify admin login password through Firebase
- `POST /api/admin/change-password` - Change an admin password

### Content endpoints

- `GET /api/articles` - List articles
- `POST /api/articles` - Create an article
- `GET /api/articles/:id` - Get one article
- `PATCH /api/articles/:id` - Update an article
- `DELETE /api/articles/:id` - Delete an article

- `GET /api/events` - List events
- `POST /api/events` - Create an event
- `PATCH /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

- `GET /api/gallery` - List gallery items
- `POST /api/gallery` - Create a gallery item
- `PATCH /api/gallery/:id` - Update a gallery item
- `DELETE /api/gallery/:id` - Delete a gallery item

## Deployment Notes

This backend can be deployed to services like Render, Railway, or any Node.js hosting platform. Make sure the environment variables are configured in the hosting dashboard.

## Troubleshooting

- If Firebase initialization fails, verify the credentials file or environment variables.
- If email sending fails, confirm SMTP credentials and host/port settings.
- If admin login fails, check that `FIREBASE_WEB_API_KEY` is set correctly.
