
# Auto-SAML-KMUTT 🚀🔐

A Node.js/TypeScript project to automate SAML authentication and retrieve SAML cookies from the KMUTT Library system using Playwright and Express.js.


## Features ✨
- 🤖 Automates login to KMUTT Library via Microsoft SSO
- 🍪 Retrieves SAML authentication cookies programmatically
- 🛠️ Provides a REST API endpoint to get SAML cookies as JSON
- ⚙️ Easy configuration with environment variables


## How It Works 🧩
- 🎭 Uses Playwright to control a Chromium browser and perform the login steps
- 🍪 Extracts SAML cookies after successful authentication
- 🌐 Exposes an Express.js API endpoint (`/api/saml`) to trigger the login and return cookies


## Project Structure 🗂️
```
app/
  src/
    classes/
      App.ts           # Express app and API setup
      SAMLCookies.ts   # Playwright automation for SAML login
    config/
      config.ts        # Loads environment variables
    index.ts           # App entry point
  .env                 # Environment variables (not committed)
  package.json         # Project dependencies and scripts
```


## Getting Started 🏁

### 1. Clone the repository 📥
```bash
git clone https://github.com/ImJustNon/Auto-SAML-KMUTT.git
cd Auto-SAML-KMUTT/app
```

### 2. Install dependencies 📦
```bash
npm install
```

### 3. Set up environment variables 🔑
Create a `.env` file in the `app/` directory:
```
KMUTT_EMAIL=your_kmutt_email@kmutt.ac.th
KMUTT_PASSWORD=your_password
VERCEL=false
```

### 4. Run the server ▶️
```bash
npm run dev
```

The server will start on port 3000 by default.


## Usage 📡
- Send a GET request to `http://localhost:3000/api/saml`
- The API will perform the login and return SAML cookies in JSON format:

```json
{
  "message": "SAML Response retrieved successfully",
  "data": {
    "SimpleSAMLAuthToken": "...",
    "SimpleSAMLphp": "..."
  }
}
```


## Requirements 🧑‍💻
- Node.js 18+
- Playwright (installed via npm)


## Notes 📝
- 🔒 Your KMUTT credentials are required in the `.env` file.
- 🚫 The `.env` file is excluded from version control for security.
- 📚 This project is for educational and automation purposes only.

