package cmd

import (
	"log"
	"net/http"

	chi "github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
    r := chi.NewRouter()


    r.Use(middleware.Logger)   // logs HTTP requests
    r.Use(middleware.Recoverer) // recovers from panics


	r.Handle("/*", http.FileServer(http.Dir("./static"))) // if you serve static files

 
    // r.Get("/games", jsonutils.HandleFrontpage)

    // 5️⃣ Example of more complex route
    // r.Route("/puzzle", func(r chi.Router) {
    //     r.Get("/", func(w http.ResponseWriter, r *http.Request) {
    //         // handle /puzzle
    //     })
    //     r.Get("/test1", jsonutils.HandleCheckPuzzle)
    // })

    // 6️⃣ Start the server
    log.Println("Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}