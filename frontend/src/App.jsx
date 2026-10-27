import { useState } from "react";
import "./App.css";
import AnalysisHistory from "./components/AnalysisHistory";

function App() {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

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

    // Display the analysis results
    setAnalysis(data.analysis);

    // Refresh analysis history
    setHistoryRefreshKey((previous) => previous + 1);

  } catch (error) {
    console.error("Analysis error:", error);
    setError(error.message);
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
            {analysis.classes.length > 0 ? (
            analysis.classes.map((cls, index) => (
                <li key={index}>{cls}</li>
            ))
              ) : (
                  <li>None detected</li>
                  )}
            </ul>

                    <h3>Imports</h3>
          <ul>
            {analysis.imports.length > 0 ? (
              analysis.imports.map((imp, index) => (
                <li key={index}>{imp}</li>
              ))
            ) : (
              <li>None detected</li>
            )}
          </ul>
        </div>
      )}

      {/* Analysis History Section */}
      <AnalysisHistory refreshKey={historyRefreshKey} />

    </div>
  );
}

export default App;