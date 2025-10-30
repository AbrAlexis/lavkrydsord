window.onload = async function () {
    try {
        const response = await fetch("/games");
        if (!response.ok) throw new Error("Failed to fetch games");
        const frontpageData = await response.json();
        console.log("Games received:", frontpageData);
    } catch (error) {
        console.error("Error loading games:", error);
    }
  }