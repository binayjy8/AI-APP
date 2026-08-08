# Document Q&A Assistant

A full-stack AI app that answers questions from a document you provide. You can paste plain text or upload a PDF, ask a question, and get a grounded answer generated from the document content.

## Features

- Ask questions about pasted document text
- Upload a PDF and ask questions about its extracted text
- Server-side Gemini API calls so the API key is not exposed in the browser
- Basic validation and error responses for missing documents, missing questions, and unreadable PDFs
- Vercel-ready API route configuration

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- File upload: Multer
- PDF parsing: pdf-parse
- AI provider: Google Gemini API
- Deployment: Vercel

## Project Structure

```text
.
+-- api/
|   +-- index.js          # Vercel serverless Express API
+-- client/
|   +-- src/App.js        # React UI
+-- server.js             # Local Express server for text Q&A
+-- test.http             # Example API request
+-- vercel.json           # Vercel API rewrite config
+-- package.json          # Backend dependencies
```

## Requirements

- Node.js
- npm
- A Gemini API key from Google AI Studio

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

For Vercel deployment, add the same `GEMINI_API_KEY` value in the Vercel project environment variables.

## Running Locally

Install backend dependencies:

```bash
npm install
```

Start the local backend:

```bash
node server.js
```

The local backend runs at:

```text
http://localhost:5000
```

Install frontend dependencies:

```bash
cd client
npm install
```

Start the React app:

```bash
npm start
```

The React app runs at:

```text
http://localhost:3000
```

Note: `client/src/App.js` currently sends requests to the deployed Vercel API URL. To use your local backend during development, update the fetch URLs to `http://localhost:5000/api/ask`. The local `server.js` currently supports plain text Q&A; PDF upload support is implemented in `api/index.js` for the Vercel API route.

## API Endpoints

### Ask From Text

```http
POST /api/ask
Content-Type: application/json
```

Request body:

```json
{
  "document": "Paste document text here.",
  "question": "What is this document about?"
}
```

Response:

```json
{
  "answer": "The generated answer."
}
```

### Ask From PDF

```http
POST /api/ask-pdf
Content-Type: multipart/form-data
```

Form fields:

- `pdfFile`: the uploaded PDF file
- `question`: the question to ask about the PDF

Response:

```json
{
  "answer": "The generated answer."
}
```

## Deployment

This project includes `vercel.json`, which rewrites `/api/*` requests to the Express app exported from `api/index.js`.

Before deploying:

1. Push the project to a Git repository.
2. Import the project into Vercel.
3. Add `GEMINI_API_KEY` in Vercel environment variables.
4. Deploy.

## Development Notes

- The prompt instructs Gemini to answer only from the provided document.
- If the answer is not present in the document, the model is instructed to say it does not know based on the document.
- Very large documents may exceed model limits. A future improvement would be chunking plus retrieval.

## Roadmap

- Use local API URLs automatically in development
- Add PDF upload support to `server.js` for local development
- Add citations or highlighted source snippets
- Add document chunking for longer files
- Add automated tests for API validation and frontend flows
