import { useState } from 'react';
import './App.css';

function App() {
  const [document, setDocument] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');

    try {
      let res;

      if (pdfFile) {
        // PDF upload path
        const formData = new FormData();
        formData.append('pdfFile', pdfFile);
        formData.append('question', question);

        res = await fetch('https://ai-app-ten-dusky.vercel.app/api/ask-pdf', {
          method: 'POST',
          body: formData,
        });
      } else {
        // Plain text path
        res = await fetch('https://ai-app-ten-dusky.vercel.app/api/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document, question }),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1>📄 Document Q&A</h1>
        <p className="subtitle">Paste text or upload a PDF, ask a question, get a grounded answer.</p>

        <form onSubmit={handleSubmit}>
          <label>Upload PDF (optional)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0] || null)}
          />

          {!pdfFile && (
            <>
              <label>Or paste document text</label>
              <textarea
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                rows={8}
                placeholder="Paste your document text here..."
              />
            </>
          )}

          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about the document..."
          />

          <button type="submit" disabled={loading || (!document && !pdfFile) || !question}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {error && <div className="error-box">⚠ {error}</div>}
        {answer && (
          <div className="answer-box">
            <strong>Answer</strong>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;