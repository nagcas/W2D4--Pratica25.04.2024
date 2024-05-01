/*
  Javascript index.js
  data 25.04.2024
  by Gianluca Chiaravalloti
  v.1.0
*/

// console.log("It's working...");

/**
 * Inizializzo le costanti e variabili globali
 * -------------------------------------------
 */

// COSTANTI

// Inizializzo la variabile url dell'api della lista dei libri presenti nel server
const url = "https://striveschool-api.herokuapp.com/books";
// Inizializzo la variabile del button search
const inputSearchBtn = document.getElementById("inputSearchBtn");
// Inzizializzo la variabile della casella input di ricerca
const inputSearch = document.getElementById("inputSearch");
// Inizializzo la variabile reset per eliminare le card presenti nel document html
const inputResetBtn = document.getElementById("inputResetBtn");
// Inzizializzo la variabile della casella input di ricerca
const amount = document.getElementById("amount");
// Inizializzo la variabile invalid per verificare l'inserimento corretto nella ricerca
const invalid = document.getElementById("invalid-feedback");
// Inizializzo la variabile searchSectionBooks per selezionare il puntatore della ricerca
const searchSectionBooks = document.querySelector(".searchSectionBooks");
// Inizializzo la costante per richiamare lo spinner
const loader = document.getElementById("loader");

// ARIABILI GLOBALI

// Inzializzo l'array vuoto della quantità dei libri acquistati
let quantityBooks = [];
// Inizializzo la variabile a 0 del valore della quantità dei libri
let quantityBooksBuy = 0;
// Inizializzo a 0 il prezzo totale del carrello
let totalPrice = 0;



/**
 * COSTANTI E VARIABILI DELLA FUNZIONE MODAL
 * -----------------------------------------
 */

// Inizializzo la variabile shopping al puntatore del carrello
const shopping = document.getElementById("shopping");
// Inizializzo la variabile modalCart per inserire il contenuto dei libri acquistati
let modalCart = document.querySelector(".modal-body");
// Inizializzo la variabile removeAllBooks per rimuovere tutti i libri dal carrello
const removeAllBooks = document.getElementById("removeAllBooks");
// Inizializzo la variabile buy del button buy "paga"
const buy = document.getElementById("buy");
// Inizializzo la variabile totalPriceHtml per variare il contenuto del prezzo totale
const totalPriceHtml = document.querySelector(".totalPrice");



/**
 * Si attiva nel momento in cui si apre il document html
 * -----------------------------------------------------
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inserisco nel document il valore della variabile badge del carrello
  amount.innerText = quantityBooksBuy;

  // Eseguo la chiamata fetch dell'url API
  fetch(url)
  .then((response) => {
    // Verifico la risposta del server
    if (!response.ok) {
      throw new Error("Risposta networks non andata a buon fine.");
    }
    // Restituisce la risposta in formato json
    return response.json();
  })
  .then((books) => {
    // Richiamo la funzione visualizza tutti i libri nel document html
    viewBooks(books);
    // Richiamo la funzione per aggiungere i libri al carrello
    addCart(books);
    // Richiamo la funzione di ricerca di un libro in funzione del titolo
    searchBook();
    // Richiamo la funzione per resettare la ricerca 
    resetDocument();  
  })
  .catch((error) => {
    console.error("Errore: ", error);
  })
});


/**
 * Funzione visualizza elenco dei books in formato card nel document html
 * ----------------------------------------------------------------------
 */
function viewBooks(books) {
  // Visualizza lo spinner durante il caricamento
  loader.classList.remove("hidden");
  // Inizializzo la variabile per inserire il contenuto dei libri
  let contentBooks = document.querySelector(".content-books");
  // Eseguo un ciclo su tutto il contenuto del mio array di oggetti
  books.forEach(book => {
    // Inizializzo un div con classe card
    let content = document.createElement("div");
    content.className = "card p-0 g-4 card-home";
    // Inserisco il contenuto del libro in una card
    content.innerHTML = `
        <a name="${book.title}"></a>
        <div id="${book.title}">
          <img src="${book.img}" class="card-img-top" alt="${book.title}">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text fw-bold fs-5">${book.price} €</p>
            <p class="card-text">category: ${book.category}</p>
            <p class="card-text mb-5">ISBN: ${book.asin}</p>
            <button class="addBook btn mb-2 w-100 btn-success" id="${book.asin}">
              <i class="bi bi-cart-plus"></i> 
              Add to Cart
            </button>
            <a class="detailBook btn mb-2 w-100 btn-primary" href="./detail.html?idBook=${book.asin}&titleBook=${book.title}">
              Detail Book
            </a>
          </div>
        </div>
      `
    // Aggiungo il contenuto della card del libro creata nel document html
    contentBooks.appendChild(content);
  })
  // Aggiungo "hidden" allo spinner
  loader.classList.add("hidden");
};


/**
 * Funzione aggiungi libro nel carrello in funzione del codice asin
 * ----------------------------------------------------------------
 */
function addCart(books) {
  // Eseguo un ciclo su tutto il contenuto dell'oggetto
  books.forEach(book => {
    // Inizializzo la variabile con il codice asin del singolo lobro
    let codeAsin = document.getElementById(`${book.asin}`);
    // Se si clicca sul pulsante aggiungi il libro viene aggiunto al carrello
    codeAsin.addEventListener("click", () => {
      // Se si verifica la condizione in cui il button è verde
      if (codeAsin.classList[codeAsin.classList.length - 1] === "btn-success") {
        // Aggiungo una quantità +1 al conteggio dei libri acquistati
        quantityBooksBuy += 1;
        // Aggiungo al totale del prezzo la somma del prezzo del singolo libro acquistato
        totalPrice += book.price;
        // Aggiungo al catalogo i miei acquisti il codice del libro acquistato
        quantityBooks.push(book.asin);
        // Modifico il testo del pulsante "aggiungi al carrello" con "rimuovi dal carrello"
        codeAsin.innerHTML = `<i class="bi bi-cart-dash"></i> Remove to Cart`;
        // Rimuovo al button il colore verde
        codeAsin.classList.remove("btn-success");
        // Aggiungo al button il colore rosso
        codeAsin.classList.add("btn-danger");
      } else {
        // Trova l'indice dell'elemento da rimuovere
        let indexToRemove = quantityBooks.indexOf(book.asin);
        if (indexToRemove !== -1) {
          // Rimuovi l'elemento dall'array
          quantityBooks.splice(indexToRemove, 1);
        } 
        // Rimuovi libro dall'array libri acquistati
        quantityBooksBuy -= 1;
        // Riduce dal prezzo totale il prezzo del singolo libro rimosso
        totalPrice -= book.price;
        // Modifico il testo del pulsante "rimuovi dal carrello" con "aggiungi al carrello" 
        codeAsin.innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        // Rimuovo al button il colore rosso
        codeAsin.classList.remove("btn-danger");
        // Aggiungo al button il colore verde
        codeAsin.classList.add("btn-success");
      }
      // Aggiorno il contenuto al badge dei libri acquistati
      amount.innerHTML = quantityBooksBuy;
    })
  });

  // Visualizzo nel modal il contenuto del mio carrello degli acquisti al click dell'icona cart nel menù
  shopping.addEventListener("click", () => {
    // Eseguo una pulizia del suo contenuto
    modalCart.innerHTML = "";
    // Verifico se la quantità dei libri acquistati è maggiore di 0
    if (quantityBooks.length > 0) {
      // Eseguo un ciclo sul contenuto dell'arrey che contiene i codici dei libri inseriti con l'acquisto
      quantityBooks.forEach(book => {
        // eseguo un ciclo su tutti i libri dell'oggetto 
        books.forEach(book_ => {
          // Creo il contenuto da visualizzare all'interno del modal in modo da visualizzare i libri acquistati
          let bookSection = document.createElement("div");
          if (book_.asin === book) {
            bookSection.className = "card mt-4 card-cart";
            bookSection.innerHTML = `
                <div class="border-line" id="${book_.title}+${book_.asin}">
                  <div class="row g-1 d-flex align-items-center">
                    <div class="col-4 col-md-4">
                      <img src="${book_.img}" class="img-fluid" alt="${book_.title}">
                    </div>
                    <div class="col-8 col-md-8">
                      <div class="card-body">
                        <h5 class="card-title card-shopping">${book_.title}</h5>
                        <p class="card-text fw-bold">ISBN: ${book_.asin}</p>
                        <p class="card-text fw-bold">${book_.price} €</p>
                        <button class="btn btn-danger btn-sm remove" id="${book_.asin}"><i class="bi bi-cart-dash"></i> Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              `
              // Aggiungo il contenuto della card del libro creata nel modal
            modalCart.append(bookSection);
          }
          // Inserisco il valore del prezzo totale da visualizzare nel modal del carrello
          totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
          // verifico se il prezzo totale è maggiore di 0 visualizzo nel modal il pulsante elimina tutti i libri e il pulsante acquista
          if (totalPrice > 0) {
            removeAllBooks.classList.remove("d-none");
            removeAllBooks.classList.add("d-block");
            buy.classList.remove("d-none");
            buy.classList.add("d-block");
          } 
        })
      })
    } else {
      // Visualizza il testo nel modal di articoli non presenti.
      totalPrice = 0;
      modalCart.innerHTML = `<p id="empty">Empty cart...</p>`;
      totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
      // Se il carrello non contiene libri selezionati per essere acquistati i pulsanti di elimina tutti i libri e di acquista non vengono visualizzati
      removeAllBooks.classList.remove("d-block");
      removeAllBooks.classList.add("d-none");
      buy.classList.remove("d-block");
      buy.classList.add("d-none");
    }
    
    // Al click del button "rimuovi tutti i libri" dal modal viene eseguito un reset del contenuto
    removeAllBooks.addEventListener("click", () => {
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      })
      // Vengono inizializzate a 0 tutte le variabili principali quando vengono rimossi tutti i libri
      amount.innerText = 0;
      quantityBooksBuy = 0;
      totalPrice = 0;
      quantityBooks = [];
      books.forEach(book => {
        document.getElementById(`${book.asin}`).innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        document.getElementById(`${book.asin}`).classList.remove("btn-danger");
        document.getElementById(`${book.asin}`).classList.add("btn-success");
      })
      totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
      removeAllBooks.classList.remove("d-block");
      removeAllBooks.classList.add("d-none");
      buy.classList.remove("d-block");
      buy.classList.add("d-none");
    });

    // Inzizializzo la variabile remove to cart per rimuovere il singolo libro dal carrello
    let remove = document.querySelectorAll(".remove");
    // Rimuove singolo libro dal carrello degli acquisti e aggiorna il contenuto
    remove.forEach((elimina) => {
      // Al click eseguo la funzione di rimozione del libro
      elimina.addEventListener("click", () => {
        books.forEach(libro => {
          // Eseguo una verifica se il codice asin corrisponde al codice da eliminare
          if (libro.asin === elimina.id) {
            document.getElementById(`${libro.title}+${libro.asin}`).remove();
            // Trova l'indice dell'elemento da rimuovere
            let indexToRemove = quantityBooks.indexOf(elimina.id);
            if (indexToRemove !== -1) {
              // Rimuovi l'elemento dall'array
              quantityBooks.splice(indexToRemove, 1);
            }
            // La quantità dei libri viene diminuita
            quantityBooksBuy -= 1;
            // Il prezzo totale viene diminuito del valore corrispondente al libro
            totalPrice -= libro.price;
            if (totalPrice > 0) {
              totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
              removeAllBooks.classList.remove("d-none");
              removeAllBooks.classList.add("d-block");
              buy.classList.remove("d-none");
              buy.classList.add("d-block");
            } else {
              totalPrice = 0;
              modalCart.innerHTML = `<p id="empty">Empty cart...</p>`;
              totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
              removeAllBooks.classList.remove("d-block");
              removeAllBooks.classList.add("d-none");
              buy.classList.remove("d-block");
              buy.classList.add("d-none");
            }
            document.getElementById(`${libro.asin}`).innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
            document.getElementById(`${libro.asin}`).classList.remove("btn-danger");
            document.getElementById(`${libro.asin}`).classList.add("btn-success");
          }
        })
        amount.innerText = quantityBooksBuy;
      })
    });
    
    // Rimuove tutti i libri dal carrello
    removeAllBooks.addEventListener("click", () => {
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      })
    })
  })
};


/**
 * Funzione di ricerca libri
 * -------------------------
 * La ricerca non andrà a visualizzare il risultato su una nuova pagina ma andrà a evidenziare di
 * rosso la card ricercata nella stessa index.html e tramite anchor verrà evidenziata la sua posizione
 */
function searchBook() {
  // Richiamo la funzione ricerca del libro al click del pulsante di ricerca
  inputSearchBtn.addEventListener("click", () => {
    // Verifico se il testo inserito nell'input di ricerca ha una lunghezza maggiore di 3 caratteri
    if (inputSearch.value.length > 3) {
      let titoli = document.querySelectorAll(".card-title");
      titoli.forEach(titolo => {
        if (titolo.innerText.toLowerCase().includes(inputSearch.value.toLowerCase())) {
          inputSearch.classList.remove("border-danger");
          document.location.href = "#" + titolo.innerText;
          document.getElementById(`${titolo.innerText}`).style.color = "#c72121";
        }
      })
    } else {
      document.getElementById("inputSearch").value = "";
      inputSearch.classList.add("border-danger");
      document.getElementsByName("search")[0].placeholder = 'enter text longer than 3 characters';
    }
  })
};


/**
  * Funzione reset card search
  * --------------------------
*/
function resetDocument() {
  // Al click del reset verrà ripulita la ricerca effettuata
  inputResetBtn.addEventListener("click", () => {
    let titoli = document.querySelectorAll(".card-title");
    titoli.forEach(titolo => {
      document.getElementById(`${titolo.innerText}`).style.color = "#000";
    })
    document.getElementById("inputSearch").value = "";
  })
};