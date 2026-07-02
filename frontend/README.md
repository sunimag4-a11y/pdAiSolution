# Frontend README

## Overview

The frontend is a static marketing and admin website for AI Solutions. It includes the public site pages, a contact form, article/event/gallery sections, and an admin dashboard for managing content and inquiries.

## Tech Stack

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Fetch API for backend calls

## Project Structure

```text
frontend/
  index.html
  article.html
  articles.html
  contact.html
  events.html
  feedback.html
  gallery.html
  solutions.html
  css/
    style.css
  js/
    main.js
  images/
  admin/
    dashboard.html
    articles.html
    events.html
    gallery.html
    login.html
```

## Features

- Responsive landing page and service pages
- Animated hero section and counters
- Contact form connected to the backend API
- Articles, events, and gallery sections
- Mock AI chat assistant on the home page
- Admin login and dashboard experience
- Content management pages for articles, events, and gallery items

## Requirements

- A modern web browser
- A local web server for the best experience (optional but recommended)
- Backend server running on port 4000 for API calls

## Running the Frontend

Since this is a static site, you can open the HTML files directly in a browser. For a more reliable setup, use a simple local server.

### Option 1: Open files directly

Open [frontend/index.html](index.html) in your browser.

### Option 2: Use a local static server

From the project root:

```bash
cd frontend
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use VS Code's Live Server extension.

## Backend Connection

The frontend calls the backend API from [frontend/js/main.js](js/main.js). By default:

- Local development uses `http://localhost:4000`
- Production uses the configured production API base

Make sure the backend is running before testing features such as:

- contact form submission
- admin login/password actions
- article/event/gallery management

## Main Pages

- Home page: [frontend/index.html](index.html)
- Contact page: [frontend/contact.html](contact.html)
- Articles: [frontend/articles.html](articles.html)
- Events: [frontend/events.html](events.html)
- Gallery: [frontend/gallery.html](gallery.html)
- Admin login: [frontend/admin/login.html](admin/login.html)
- Admin dashboard: [frontend/admin/dashboard.html](admin/dashboard.html)

## Configuration Notes

The frontend uses Firebase configuration and API base URLs in [frontend/js/main.js](js/main.js). If you deploy the frontend to a different domain, update the production API base URL accordingly.

## Deployment Notes

The frontend can be hosted as a static site on services such as:

- Netlify
- Vercel
- GitHub Pages
- Any static web hosting provider

For production, make sure the backend URL is updated and the API endpoints are reachable from the deployed frontend.
