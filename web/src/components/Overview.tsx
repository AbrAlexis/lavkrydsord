import { useEffect, useState } from "react";

interface PuzzleMetaData {
  id: number;
  title: string;
  author: string;
  date: string;
}

function Overview() {
  const [metaData, setMetaData] = useState<PuzzleMetaData[]>([]);
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
    } catch (error) {}
  }

  return (
    <>
      <button onClick={() => fetchMetadata()}>refresh</button>
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
            <tr key={puzzle.id}>
              <td>{puzzle.id}</td>
              <td>{puzzle.title}</td>
              <td>{puzzle.author}</td>
              <td>{puzzle.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default Overview;
