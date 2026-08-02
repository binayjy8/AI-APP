import { useState } from 'react';
import './App.css';

function App() {
  const [document, setDocument] = useState('');
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
      const res = await fetch('https://ai-app-ten-dusky.vercel.app/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document, question }),
      });

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
        <p className="subtitle">Paste any text, ask a question, get an answer grounded in that document only.</p>

        <form onSubmit={handleSubmit}>
          <label>Document</label>
          <textarea
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            rows={8}
            placeholder="Paste your document text here..."
          />

          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something about the document..."
          />

          <button type="submit" disabled={loading || !document || !question}>
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