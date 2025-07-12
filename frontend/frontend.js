
window.onload = async function () {
    try {
        const response = await fetch("/puzzle");
        if (!response.ok) throw new Error("Failed to fetch puzzle");
        const puzzleData = await response.json();
            
        const workingPuzzle = puzzleData.WorkingPuzzle
        console.log("Puzzle received:", puzzleData);
    
        const grid = document.getElementById("working-puzzle-grid");

        const rows = workingPuzzle.length;
        const cols = workingPuzzle[0].length;
      
        grid.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
      
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const div = document.createElement("div");
                div.classList.add("puzzle-cell");
        
                if (workingPuzzle[row][col] === "#") {
                div.classList.add("blank");
                } else {
                div.textContent = workingPuzzle[row][col];
                }
        
                grid.appendChild(div);
          }
        }
      
      

    } catch (err) {
        console.error(err);
        document.getElementById("working-puzzle-grid").textContent = "Error loading puzzle.";
    }
  };