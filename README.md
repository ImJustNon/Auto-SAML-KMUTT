

# Auto-SAML-KMUTT 🚀🔐

A Node.js/TypeScript project to automate SAML authentication and retrieve SAML cookies from the KMUTT Library system using Playwright, Express.js, and MongoDB (Mongoose).

## Features ✨
- 🤖 Automates login to KMUTT Library via Microsoft SSO
- 🍪 Retrieves SAML authentication cookies programmatically
- 🛠️ REST API endpoints for SAML cookies and token cache (MongoDB)
- 💾 Stores/retrieves SAML tokens in MongoDB using Mongoose
- ⚙️ Easy configuration with environment variables

## How It Works 🧩
- 🎭 Uses Playwright to control a Chromium browser and perform the login steps
- 🍪 Extracts SAML cookies after successful authentication
- 🌐 Exposes Express.js API endpoints:
  - `GET /api/saml/request` — get SAML cookies (with caching and async refresh)


## Project Structure 🗂️
```
src/
  index.ts                # App entry point
  classes/
    App.ts                # Express app and API setup
    AppRouter.ts          # (Optional) Centralized router for Express
    SAMLCookies.ts        # Playwright automation for SAML login
    Mongoose.ts           # Mongoose connection class
  config/
    config.ts             # Loads environment variables
    mongoose.ts           # Mongoose config helper (optional)
  controllers/
    SAML.controller.ts    # Controller logic for SAML endpoints
  models/
    SAMLTokenCache.ts     # Mongoose model for SAML token cache
  routes/
    SAML.route.ts         # Express routes for SAML endpoints
package.json              # Project dependencies and scripts
.env                      # Environment variables (not committed)
```

## Getting Started 🏁

### 1. Clone the repository 📥
```bash
git clone https://github.com/ImJustNon/Auto-SAML-KMUTT.git
cd Auto-SAML-KMUTT
```

### 2. Install dependencies 📦
```bash
npm install
```

### 3. Set up environment variables 🔑
Create a `.env` file in the root directory:
```
KMUTT_EMAIL=your_kmutt_email@kmutt.ac.th
KMUTT_PASSWORD=your_password
MONGODB_URI=mongodb://localhost:27017/auto-saml-app
VERCEL=false
```

### 4. Run the server ▶️
```bash
npm run dev
```

The server will start on port 3000 by default.


## Usage 📡

- `GET /api/saml/request` — Retrieve SAML cookies as JSON (with cache and async refresh)

Example response for `/api/saml/request` (when cache is valid):
```json
{
  "message": "SAML Response retrieved from cache",
  "data": {
    "simpleSAMLphp": "...",
    "simpleSAMLAuthToken": "..."
  }
}
```

Example response for `/api/saml/request` (when cache is being refreshed):
```json
{
  "message": "SAML Response retrieving. Please try again in a few moments."
}
```

Example response for `/api/saml/request` (if a request is already in progress):
```json
{
  "message": "SAML Request is already in progress. Please try again later."
}
```

## Requirements 🧑‍💻
- Node.js 18+
- Playwright (installed via npm)
- MongoDB (local or Atlas)

## Notes 📝
- 🔒 Your KMUTT credentials and MongoDB URI are required in the `.env` file.
- 🚫 The `.env` file is excluded from version control for security.
- 📚 This project is for educational and automation purposes only.

