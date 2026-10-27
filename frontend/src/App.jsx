import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ code })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Reverse Engineering Platform</h1>
      <p>Analyze and understand your source code.</p>

      <h3>JavaScript Source Code</h3>

      <textarea
        rows="12"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your JavaScript code here..."
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !code.trim()}
      >
        {loading ? "Analyzing..." : "Analyze Code"}
      </button>

      {error && <p className="error">{error}</p>}

      {analysis && (
        <div className="results">
          <h2>Analysis Results</h2>

          <p>Language: {analysis.language}</p>
          <p>Total Lines: {analysis.totalLines}</p>

          <h3>Functions</h3>
          <ul>
            {analysis.functions.map((fn, index) => (
              <li key={index}>{fn}</li>
            ))}
          </ul>

          <h3>Classes</h3>
          <ul>
            {analysis.classes.map((cls, index) => (
              <li key={index}>{cls}</li>
            ))}
          </ul>

          <h3>Imports</h3>
          <ul>
            {analysis.imports.map((imp, index) => (
              <li key={index}>{imp}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;