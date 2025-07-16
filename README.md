# BlogWeb

A modern, full-stack blog platform with rich text editing, image uploads (AWS S3), authentication, search, and a beautiful UI.

## Features
- User registration, login, and profile management (JWT, secure cookies)
- **Manual admin approval for new registrations** (admin must approve users before they can log in)
- **Email notifications**: Admin notified on new registration, users notified on approval/rejection (SMTP setup required)
- **Animated loaders** for blog and "My Blog" sections for better UX
- Create, edit, and delete blog posts with rich text and image uploads (S3)
- Responsive, professional UI with Tailwind CSS
- Search posts by title, summary, or content
- Commenting, user context, and robust error handling
- Secure authentication, session expiration, and best practices

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Image Storage:** AWS S3 (via multer-s3)
- **Authentication:** JWT, httpOnly cookies
- **Email:** Nodemailer (SMTP)

## AI Features & Models Used
- **AI-Powered Title & Summary Suggestions:**
  - When creating a post, users can get AI-generated suggestions for both the post title and summary based on their content.
  - These features are available via the "Suggest Title" and "Suggest Summary" buttons in the post creation form.
- **LLM & Provider:**
  - Uses the [Hugging Face Inference API](https://huggingface.co/inference-api) via the `@huggingface/inference` npm package.
  - Model: `meta-llama/Llama-3.1-8B-Instruct` (accessed through the Fireworks AI provider).
  - The backend securely calls the LLM to generate concise, relevant titles and summaries for blog content.
- **Security & Rate Limiting:**
  - API endpoints for AI features are rate-limited per IP to prevent abuse.
  - Requires a valid Hugging Face API token (set in backend `.env`).

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd blog-creating-website
```

### 2. Setup Environment Variables

#### Backend (`api/.env`):
```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_S3_BUCKET_NAME=your-s3-bucket
Base_URL=http://localhost:3000 # or your deployed frontend URL
# Email/SMTP setup for notifications
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_smtp_password_or_app_password
SMTP_FROM=your@email.com
ADMIN_EMAIL=chandanthakur.k123@gmail.com
```

#### Frontend (`client/.env`):
```
REACT_APP_API_URL=http://localhost:4000 # or your deployed backend URL
REACT_APP_ADMIN_EMAIL=chandanthakur.k123@gmail.com
```

### 3. Install Dependencies

#### Backend
```bash
cd api
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 4. Start the App

#### Backend
```bash
cd api
npm start
```

#### Frontend
```bash
cd ../client
npm start
```

- The frontend will run on [http://localhost:3000](http://localhost:3000)
- The backend will run on [http://localhost:4000](http://localhost:4000)

## Project Structure
```
BlogWeb/
  blog-creating-website/
    api/        # Backend (Express, MongoDB, S3)
    client/     # Frontend (React, Tailwind)
```

## Admin Panel & User Approval
- Visit `/admin` after logging in as the admin (email must match `ADMIN_EMAIL` in your backend `.env`).
- Only the admin can approve or reject new user registrations.
- Admin receives an email when a new user registers.
- Users receive an email when their account is approved or rejected.

## Customization & Deployment
- Update `.env` files for production URLs and secrets.
- Deploy backend (e.g., Heroku, AWS, Render) and frontend (e.g., Vercel, Netlify).
- Make sure CORS and environment variables are set correctly for production.

## Summary
BlogWeb is a full-featured, modern blog platform with secure authentication, admin approval, email notifications, rich content editing, image uploads, and search. Easily extensible for AI features, comments, and more. 
