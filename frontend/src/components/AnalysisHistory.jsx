import { useEffect, useState } from "react";

function AnalysisHistory({ refreshKey = 0 }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHistory() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/analyses",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();
        setAnalyses(data.analyses || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchHistory();

    return () => controller.abort();
  }, [refreshKey]);

  if (loading) return <p>Loading analysis history...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="history">
      <h2>Analysis History</h2>

      {analyses.length === 0 ? (
        <p>No previous analyses found.</p>
      ) : (
        analyses.map((item) => (
          <div className="history-card" key={item._id}>
            <h3>{item.language} Analysis</h3>

            <p>
              Date: {new Date(item.createdAt).toLocaleString()}
            </p>

            <p>Lines of Code: {item.totalLines}</p>

            <p>
              Functions: {item.functions?.join(", ") || "None"}
            </p>

            <p>
              Classes: {item.classes?.join(", ") || "None"}
            </p>

            <p>
              Imports: {item.imports?.join(", ") || "None"}
            </p>
          </div>
        ))
      )}
    </section>
  );
}

export default AnalysisHistory;