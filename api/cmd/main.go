package main

import (
	"log"
	"net/http"

	"lavkrydsord/internal/db"

	"lavkrydsord/internal/routes"
)

func main() {
	db.Init()
	db.Migrate()
	defer db.DB().Close()

	r := routes.NewRouter()

	r.Handle("/*", http.FileServer(http.Dir("./static")))

	log.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
