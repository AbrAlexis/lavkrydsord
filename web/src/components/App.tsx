import "./App.css";
import Overview from "./Overview";
import UploadPuzzle from "./UploadPuzzle";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import CrosswordPage from "./crossword/CrosswordPage";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/upload" element={<UploadPuzzle />} />
          <Route path="/puzzle/:puzzleId" element={<CrosswordPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
