/*
  Javascript detail.js
  data 25.04.2024
  by Gianluca Chiaravalloti
  v.1.0
*/

// console.log("It's working...");

// La funzione viene eseguita nel momento in cui si apre la pagina del document html
document.addEventListener("DOMContentLoaded", function () {
  const url = "https://striveschool-api.herokuapp.com/books/";
  // Recupero la stringa (ID) relativa al book 
  const params = new URLSearchParams(window.location.search);
  // Estraggo il valore del parametro "idBook"
  const idBook = params.get("idBook");
  // Richiamo il valore del parametro "titleBook"
  const titleBook = params.get("titleBook");
  // console.log(idBook); // Log di verifica

  // Fetch!
  fetch(url + `${idBook}`)
    .then((response) => {
     // Verifico la risposta del server
     if (!response.ok) {
      throw new Error("Risposta networks non andata a buon fine.");
    }
    // Restituisce la risposta in formato json
    return response.json();
    })
    // Convertiamo in json la response
    .then((bookDetail) => {
      // Visualizzo nel title del document html il titolo del libro
      document.title = `EPICBook - ${titleBook}`;
      // Richiamo la funzione che andrà a visualizzare il libro selezionato con id nel mio document html
      detailBook(bookDetail);
    });

    /**
     * Funzione che visualizza il dettaglio del libro selezionato nel document
     */
    function detailBook(bookDetail) {
      // Inizializzo la variabile contentBook per creare al sul interno la card del contenuto del libro selezionato
      let contentBook = document.getElementById("book-detail");
      contentBook.innerHTML = `
        <div class="d-md-flex" id="${bookDetail.title}">
          <img src="${bookDetail.img}" class="card-img-top p-4" alt="${bookDetail.title}">
          <div class="card-body p-4">
            <h1 class="">${bookDetail.title}</h1>
            <p class="card-text fw-bold fs-5">${bookDetail.price} €</p>
            <p class="card-text">category: ${bookDetail.category}</p>
            <p class="card-text mb-5">ISBN: ${bookDetail.asin}</p>
            <a class="btn mb-2 w-lg-25 btn-success" href="./index.html">
              Back to Home
            </a>
          </div>
        </div>
      `
    }
});
