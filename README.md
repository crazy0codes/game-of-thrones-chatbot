# Game of Thrones Chatbot

This project is now set up as a simple character chatbot for **Grand Maester Pycelle** from Game of Thrones.

The app has:

- a React frontend in `client`
- an Express backend in `backend`
- a Pycelle character prompt in `client/prompt.md`
- Gemini API support in the backend

## What has been done

The old demo frontend was replaced with a working chat app.

Now the project has:

- a landing page
- a chat screen
- message sending from frontend to backend
- a backend API at `/api/chat`
- Gemini integration using your Pycelle prompt

How it works in simple terms:

1. The user types a message in the frontend.
2. The frontend sends the full conversation to the backend.
3. The backend reads `client/prompt.md`.
4. The backend sends the prompt and chat history to Gemini.
5. Gemini replies as Pycelle.
6. The frontend shows the reply.

## Important files

- `client/prompt.md`
  This is the Pycelle character prompt.

- `client/src/App.jsx`
  Main frontend app logic.

- `client/src/pages/Home.jsx`
  Landing page.

- `client/src/pages/chat.jsx`
  Chat UI.

- `client/src/App.css`
- `client/src/index.css`
  Frontend styling.

- `backend/server.js`
  Backend server and Gemini API call.

## What you need to do next

You still need to add your Gemini API key before the chat can work.

### Step 1: Get a Gemini API key

Go to:

`https://ai.google.dev/aistudio`

Create an API key there.

## Step 2: Add the API key to `backend/.env`

This project now supports a local `.env` file.

Open:

`backend/.env`

Replace this:

```env
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

with your real Gemini API key.

You can also change:

```env
GEMINI_MODEL=gemini-2.5-flash
PORT=3001
```

## Step 3: Start the backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

## Step 4: Start the frontend

Open another terminal and run:

```bash
cd client
npm run dev
```

## Step 5: Open the app

Open the local Vite URL shown in the terminal.

Usually it is:

`http://localhost:5173`

## What is still missing or optional

The app is working, but these would be good next improvements:

- add `.env` support so you do not need to export the API key every time
- add better error messages in the UI
- save chat history
- add loading and scrolling improvements
- deploy frontend and backend
- improve prompt tuning if Pycelle does not sound right enough

## Quick start

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Notes

- The backend expects `GEMINI_API_KEY`
- The backend now loads values from `backend/.env`
- The prompt is read from `client/prompt.md`
- The backend currently limits replies to short outputs to match the character style

## Render deployment

This repo now includes a `render.yaml` for the backend service.

Important settings:

- root directory: `backend`
- build command: `npm install && npm run build`
- start command: `npm start`

In Render, add:

- `GEMINI_API_KEY`
- `GEMINI_MODEL` optional

If you already created the service manually, redeploy after syncing the latest `main` branch and confirm the service is using the `backend` root directory.
