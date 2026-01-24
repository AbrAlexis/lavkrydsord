import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Overview.css";
import type { PuzzleMetaData } from "./crossword/types.ts";

function Overview() {
  const [metaData, setMetaData] = useState<PuzzleMetaData[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMetadata();
  }, []);

  async function fetchMetadata() {
    try {
      const response = await fetch("/api/metadata", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      } else {
        const result = await response.json();
        const mappedResult: PuzzleMetaData[] = result.map((p: any) => ({
          id: p.ID,
          title: p.Title,
          author: p.Author,
          date: p.Date,
        }));
        setMetaData(mappedResult);
        console.log("Fetched metadata successfully");
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  }

  function handleRowClick(
    puzzleId: number,
    puzzleTitle: string,
    puzzleAuthor: string,
    puzzleDate: string
  ) {
    navigate(`/puzzle/${puzzleId}`, {
      state: {
        puzzleId: puzzleId,
        puzzleTitle: puzzleTitle,
        puzzleAuthor: puzzleAuthor,
        puzzleDate: puzzleDate,
      },
    });
  }

  return (
    <div className="overview">
      <div className="puzzle-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {metaData.map((puzzle) => (
              <tr
                key={puzzle.id}
                onClick={() =>
                  handleRowClick(
                    puzzle.id,
                    puzzle.title,
                    puzzle.author,
                    puzzle.date
                  )
                }
                className="clickable-row"
              >
                <td>{puzzle.id}</td>
                <td>{puzzle.title}</td>
                <td>{puzzle.author}</td>
                <td>{puzzle.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons">
        <button onClick={() => fetchMetadata()}>refresh</button>
        <button onClick={() => navigate("/upload")}>upload</button>
      </div>
    </div>
  );
}
export default Overview;
