# Karno Backend

A production-ready Node.js backend for the Karno resume management platform. This backend provides authentication, role-based authorization, CV management, notifications, OTP workflows, AI-powered text summaries, contact form handling, and email support.

## Key Features

- JWT-based authentication with access token + cookie refresh token workflow
- User registration, login, logout
- OTP verification and password recovery
- Role-based authorization for admin and moderator endpoints
- Resume/CV creation, update, delete, duplication, and retrieval
- Cloudinary-powered profile image uploads for resumes
- Notification creation and retrieval
- AI text summary endpoint using Grok/OpenAI integration
- Contact form email delivery with HTML templating
- Global and endpoint-specific rate limiting
- Security hardening with Helmet, HPP, and custom sanitization
- CORS allowlist configuration
- Request validation using `express-validator`
- Winston-based logging to `logs/error.log` and `logs/combined.log`

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- JWT
- bcrypt
- Cloudinary
- Nodemailer
- OpenAI / Grok
- Helmet, HPP, cors
- express-rate-limit
- express-validator
- winston

## Project Structure

- `server.js` - application entry point
- `config/` - database, CORS, email, Cloudinary, roles, logger and environment configuration
- `routes/` - Express route definitions
- `controllers/` - request handlers and business logic
- `model/` - Mongoose schemas for users, CVs, notifications
- `middleware/` - authentication, authorization, sanitization, rate limiting, upload handling
- `repositories/` - database query logic
- `services/` - reusable service layer logic
- `public/` - static assets directory
- `logs/` - application log output

## Setup

### Requirements

- Node.js 18+ or newer
- npm
- MongoDB instance

### Installation

1. Clone the repo:

```bash
npm install
```

2. Create a `.env` file in the project root.

3. Add the required environment variables.

4. Start the server:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file and configure the following values:

```env
PORT=3500
DATABASE_URI=mongodb://....
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
GROK_API_KEY=your_grok_api_key
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
NODE_ENV=development
```

> Note: `config/nodemailer.js` currently uses hardcoded Gmail credentials. For production, update this file or replace it with environment-driven SMTP configuration.

## Running

- `npm start` — start production server with `node server`
- `npm run dev` — start development server with `nodemon`

## API Endpoints

### Authentication

- `POST /Register`
  - Body: `{ Fullname, email, password }`
- `POST /Login`
  - Body: `{ email, password }`
- `POST /logout`
  - Requires `Authorization: Bearer <accessToken>`
- `GET /Refresh`
  - Uses refresh token cookie `jwt`

### OTP and Password Recovery

- `POST /otp/send-otp`
  - Body: `{ id }`
- `POST /otp/verify-account`
  - Body: `{ id, OTP }`
- `POST /otp/reset-otp`
  - Body: `{ email }`
- `POST /otp/verify-reset-otp`
  - Body: `{ email, OTP }`
- `POST /otp/reset-password`
  - Body: `{ email, newPassword }`

### User Management

- `GET /users/single-user`
  - Requires auth
  - Body: `{ id }`
- `GET /users/all`
  - Requires auth + Admin or Moderator
- `DELETE /users/delete`
  - Requires auth + Admin
  - Body: `{ _id, username }`
- `PUT /users/update`
  - Requires auth + Admin or Moderator
  - Body: update payload
- `PATCH /users/edit-profile`
  - Requires auth
  - Body: `{ Fullname?, email? }`

### CV Management

- `POST /cv/create`
  - Requires auth
  - Accepts multipart form-data with `photo` and CV payload
- `GET /cv/userCv`
  - Requires auth
- `PUT /cv/:id`
  - Requires auth
  - Updates a resume by its ID
- `GET /cv/all`
  - Requires auth
- `GET /cv/:id`
  - Requires auth
- `DELETE /cv/:id`
  - Requires auth
- `POST /cv/copy/:id`
  - Requires auth

### Notifications

- `POST /notifications/sendNotification`
  - Requires auth
  - Body: `{ userId, title, message, type? }`
- `GET /notifications/get-notifications`
  - Requires auth
- `GET /notifications/get-notifications/:userId`
  - Requires auth

### AI

- `POST /ai/text-summary`
  - Requires auth
  - Body: `{ description }`
  - Uses Grok/OpenAI chat completion for Persian resume text improvement

### Admin

- `GET /admin/user-search`
  - Requires auth + Admin or Moderator
  - Supports query parameters: `search`, `role`, `page`, `limit`, `sort`

### Contact

- `POST /contact-us`
  - Rate limited
  - Body: `{ Fullname, email, subject, message }`

## Middleware and Security

- `helmet()` for secure HTTP headers
- `hpp()` to prevent HTTP parameter pollution
- custom sanitization in `middleware/sanitizeObject.js`
- global rate limiter plus endpoint-specific limiters in `middleware/rateLimit.js`
- JWT verification in `middleware/verifyJWT.js`
- role enforcement in `middleware/AuthRoles.js`
- image upload handling with `multer` in `middleware/upload.js`
- CORS controlled by `config/corsOptions.js`

## Models

- `model/Users.js`
  - Stores user credentials, roles, refresh token, OTPs, AI usage counters, verification state
- `model/CV.js`
  - Stores resume content, sections, template, and profile image URL
- `model/Notifications.js`
  - Stores notification records for users

## Logging

Application logs are written by Winston to:

- `logs/error.log`
- `logs/combined.log`

## Notes

- The server is started from `server.js`, even though `package.json` declares `main: index.js`.
- Cloudinary image uploads are handled in `controllers/CvController/uploadPhoto.js`.
- The AI endpoint enforces a rolling usage limit inside the user record.
- The refresh token flow expects cookie name `jwt` set on login.

## Recommended Improvements

- Replace hardcoded SMTP credentials with environment-based configuration
- Add validation for CV payload structure and schema enforcement
- Add request logging middleware for audit trails
- Add integration tests for auth, refresh, and role-based routes

---

For support, inspect the controllers under `controllers/`, the route definitions under `routes/`, and the database schemas under `model/`.
