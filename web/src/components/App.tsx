import "./App.css";
import Overview from "./Overview";
import UploadPuzzle from "./UploadPuzzle";
import { Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>Lav Krydsord</h1>

      <nav>
        <Link to="/">Overview</Link> | <Link to="/upload">Upload Puzzle</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/upload" element={<UploadPuzzle />} />
      </Routes>
    </div>
  );
}

export default App;
