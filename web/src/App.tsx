import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  type pingResponse = string
  
  async function ping() {
    try {
      const response: Response = await fetch('/api/ping')
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      const result: pingResponse = await response.json()
      console.log("Parsed result: ", result)
      return result;
    } catch (error) {
      console.error(error)
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  async function handleFileUpload(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
    if (selectedFile.size > 1000000) { 
      alert("File is too large for this method.");
      return;
    }



    const formData = new FormData();  
    formData.append('textfile', selectedFile); 

    try {
      const response = await fetch('/api/uploadpuzzle', {
          method: 'POST', 
          body: formData, 
      });
      if (!response.ok) {
          throw new Error(response.statusText);
      } else {
          console.log('File uploaded successfully');
      }
    } catch (error) {
    }
};
  

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => ping()}>
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <form onSubmit={handleFileUpload}>
        <h3>Upload Puzzle File (.txt)</h3>
        <input 
            type="file"
            accept=".txt,.text, .xd"
            onChange={handleFileChange}
            style={{ marginBottom: '10px' }}
        />
        <button type="submit" disabled={!selectedFile}>
            Post to DB
        </button>
        </form>
    </>
  )
}


export default App
