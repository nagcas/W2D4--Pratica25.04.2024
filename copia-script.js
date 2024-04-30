/*
  Javascript
  data 25.04.2024
  by Gianluca Chiaravalloti
  v.1.0
*/

// console.log("It's working...");

/**
 * Inizializzo le costanti globali
 */

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
// Inzizializzo
const searchSectionBooks = document.querySelector(".searchSectionBooks");
// Inizializzo la variabile removeAllBooks per rimuovere tutti i libri dal carrello
const removeAllBooks = document.getElementById("removeAllBooks");


// Inzializzo l'array vuoto della quantità dei libri acquistati
let quantityBooks = [];
// Inizializzo la variabile a 0 del valore della quantità dei libri
let quantityBooksBuy = 0;
// Inizializzo a 0 il prezzo totale del carrello
let totalPrice = 0;

// Inizializzo la variabile cart al puntatore del carrello
const shopping = document.getElementById("shopping");
// Izializzo la variabile closeModel al button close del modal
const closeModal = document.getElementById("close");
// Inizializzo la variabile modalCart per inserire il contenuto dei libri acquistati
let modalCart = document.querySelector(".modal-body");
// Inizializzo la variabile totalPriceHtml per variare il contenuto del prezzo totale
const totalPriceHtml = document.querySelector(".totalPrice");


/**
 * Funzione visualizza elenco dei books in formato card
 * nel document html
 */
function viewBooks(books , inputSearch = "") {
  // Visualizza su console in tabella il contenuto dell'API
  // console.table(books);
  let contentBooks = document.querySelector(".content-books");
    books.forEach(book => {
      let content = document.createElement("div");
      content.classList.add("card", "p-0", "card-home");
      content.innerHTML = 
        `
          <a name="${book.title}"></a>
          <div id="${book.title}">
            <img src="${book.img}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text fw-bold">${book.price} €</p>
              <p class="card-text">category: ${book.category}</p>
              <p class="card-text mb-5">ISBN: ${book.asin}</p>
              <button class="addBook btn position-absolute bottom-0 mb-2 start-50 translate-middle-x w-75 btn-success" id="${book.asin}">
                <i class="bi bi-cart-plus"></i> 
                Add to Cart
              </button>
            </div>
          </div>
        `
      contentBooks.append(content);
    });
};

/**
 * Funzione aggiungi libro nel carrello
 * in funzione del codice asin
 */
function addCart(books) {
  let amount = document.getElementById("amount");
  books.forEach(book => {
    //console.log(codice.asin);
    let codeAsin = document.getElementById(`${book.asin}`);
    codeAsin.addEventListener("click", () => {
      if (codeAsin.classList[codeAsin.classList.length - 1] === "btn-success") {
        quantityBooksBuy += 1;
        // Aggiungo al catalogo i miei acquisti
        quantityBooks.push(book.asin);
        codeAsin.innerHTML = `<i class="bi bi-cart-dash"></i> Remove to Cart`;
        codeAsin.classList.remove("btn-success");
        codeAsin.classList.add("btn-danger");
      } else {
        // Trova l'indice dell'elemento da rimuovere
        let indexToRemove = quantityBooks.indexOf(book.asin);
        if (indexToRemove !== -1) {
          // Rimuovi l'elemento dall'array
          quantityBooks.splice(indexToRemove, 1);
        } 
        // filtra/rimuovi libro dall'array libri acquistati
        //quantityBooks = quantityBooks.filter(book => book == book.asin);
        quantityBooksBuy -= 1;
        codeAsin.innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        codeAsin.classList.remove("btn-danger");
        codeAsin.classList.add("btn-success");
      }
      amount.innerHTML = quantityBooksBuy;
    })
  })

  shopping.addEventListener("click", () => {
    if (quantityBooks.length > 0) {
      quantityBooks.forEach(book => {
        // console.table(books);
        books.forEach(book_ => {
          if (book_.asin === book) {
            // console.log("trovato");
            totalPrice += book_.price;
            let bookSection = document.createElement("div");
            bookSection.classList.add("card", "mt-4", "card-cart");
            bookSection.innerHTML = 
              `
                <div class="row g-1 d-flex align-items-center">
                  <div class="col-4 col-md-4">
                    <img src="${book_.img}" class="img-fluid" alt="${book_.title}">
                  </div>
                  <div class="col-8 col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">${book_.title}</h5>
                      <p class="card-text fw-bold">${book_.asin}</p>
                      <p class="card-text fw-bold">${book_.price} €</p>
                      <button class="btn btn-danger btn-sm remove-book" id="${book_.title}"><i class="bi bi-cart-dash"></i> Remove</button>
                    </div>
                  </div>
                </div>
              `
            modalCart.append(bookSection);
          }
          totalPriceHtml.innerHTML = `<span class="totalPrice">Total Price ${totalPrice.toFixed(2)} €</span>`;
        })
      })
    } else {
      // Visualizza il testo nel modal di articoli non presenti.
      modalCart.innerHTML = `<p id="empty">Empty cart...</p>`;
    }
    totalPrice = 0;

    // Al click del button close del modal viene eseguito un reset del contenuto
    closeModal.addEventListener("click", () => {
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      });
    })

    // Inzizializzo la variabile remove to cart per rimuovere il singolo libro dal carrello
    let removeBook = document.querySelectorAll(".remove-book");
    removeBook.forEach(valore => {
      let rimuoviBook = document.getElementById(`${valore.id}`);
      // console.log(rimuoviBook);
      rimuoviBook.addEventListener("click", () => {
        console.log("vuoi rimuovere il libro");
        if (valore.id === rimuoviBook.id) {
          console.log("hai eliminato il libro");
        }
      })
    })

    // Rimuove tutti i libri dal carrello
    removeAllBooks.addEventListener("click", () => {
      console.log("Rimuovi tutti i libri dal carrello");
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      });
    })
  })
};

/**
 * Funzione di ricerca libri
 */
function searchBook(books) {
  inputSearchBtn.addEventListener("click", () => {
    // console.log("pulsante di ricerca");
    // console.log(inputSearch.value);
    if (inputSearch.value.length > 3) {
      // console.log("ok");
      //viewBooks(books, inputSearch.value);
      let titoli = document.querySelectorAll(".card-title");
      titoli.forEach(titolo => {
        // console.log(titolo.innerText.toLowerCase());
        if (titolo.innerText.toLowerCase().includes(inputSearch.value.toLowerCase())) {
          inputSearch.classList.remove("border-danger");
          // console.log("trovato");
          document.location.href = "#" + titolo.innerText;
          document.getElementById(`${titolo.innerText}`).style.backgroundColor = "#AE8E71";      
        }
      })
    } else {
      // console.log(invalid);
      // console.log("ko");
      document.getElementById("inputSearch").value = "";
      inputSearch.classList.add("border-danger");
      document.getElementsByName("search")[0].placeholder = 'enter text longer than 3 characters';
    }
  })
};


/**
  * Funzione reset card
*/
function resetDocument(books) {
  inputResetBtn.addEventListener("click", () => {
    // console.log("pulisci ricerca");
    let titoli = document.querySelectorAll(".card-title");
    titoli.forEach(titolo => {
      document.getElementById(`${titolo.innerText}`).style.backgroundColor = "transparent"; 
    })
    document.getElementById("inputSearch").value = "";
  });
};

/**
  * Funzione clear document html
*/
function clearDocument(books) {
    // console.log("pulisci ricerca");
    viewBooks(books);
    // Pulisce il document html dalla card presenti
    let bookSection = document.querySelectorAll(".card");
    bookSection.forEach(card => {
      card.remove();
    });
    document.getElementById("titleSearch").innerText = "";
};

/**
 * Si attiva nel momento in cui si apre il document html
 */
document.addEventListener("DOMContentLoaded", () => {
  amount.innerText = quantityBooksBuy;

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
    // Stampo in console i dati ottenuti dall'API
    // console.log(data);
    viewBooks(books);
    addCart(books);
    searchBook(books);
    resetDocument(books);  
  })
  .catch((error) => {
    console.error("Errore: ", error);
  })
});