/*
  Javascript
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
// Inzizializzo
const searchSectionBooks = document.querySelector(".searchSectionBooks");

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

// Inizializzo la variabile cart al puntatore del carrello
const shopping = document.getElementById("shopping");
// Izializzo la variabile closeModel al button close del modal
// const continueShopping = document.getElementById("continueShopping");
// Inizializzo la variabile modalCart per inserire il contenuto dei libri acquistati
let modalCart = document.querySelector(".modal-body");
// Inizializzo la variabile removeAllBooks per rimuovere tutti i libri dal carrello
const removeAllBooks = document.getElementById("removeAllBooks");

// Inizializzo la variabile totalPriceHtml per variare il contenuto del prezzo totale
const totalPriceHtml = document.querySelector(".totalPrice");



/**
 * Si attiva nel momento in cui si apre il document html
 * -----------------------------------------------------
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
    viewBooks(books);
    addCart(books);
    searchBook();
    resetDocument(books);  
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

  // Visualizza su console in tabella il contenuto dell'API
  let contentBooks = document.querySelector(".content-books");
    books.forEach(book => {
      let content = document.createElement("div");
      content.className = "card p-0 card-home";
      content.innerHTML = `
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
        `;
      contentBooks.appendChild(content);
    });
};


/**
 * Funzione aggiungi libro nel carrello in funzione del codice asin
 * ----------------------------------------------------------------
 */
function addCart(books) {

  let amount = document.getElementById("amount");
  books.forEach(book => {
    let codeAsin = document.getElementById(`${book.asin}`);
    codeAsin.addEventListener("click", () => {
      if (codeAsin.classList[codeAsin.classList.length - 1] === "btn-success") {
        quantityBooksBuy += 1;
        // Aggiungo al catalogo i miei acquisti
        quantityBooks.push(book.asin);
        codeAsin.innerHTML = `<i class="bi bi-cart-dash"></i> Remove to Cart`;
        codeAsin.classList.remove("btn-success");
        codeAsin.classList.add("btn-danger");
        this.document.getElementById(`${book.title}`).style.color = "#000";
      } else {
        // Trova l'indice dell'elemento da rimuovere
        let indexToRemove = quantityBooks.indexOf(book.asin);
        if (indexToRemove !== -1) {
          // Rimuovi l'elemento dall'array
          quantityBooks.splice(indexToRemove, 1);
        } 
        // filtra/rimuovi libro dall'array libri acquistati
        quantityBooksBuy -= 1;
        codeAsin.innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        codeAsin.classList.remove("btn-danger");
        codeAsin.classList.add("btn-success");
      }
      amount.innerHTML = quantityBooksBuy;
    })
  });

  shopping.addEventListener("click", () => {
    modalCart.innerHTML = "";
    if (quantityBooks.length > 0) {
      quantityBooks.forEach(book => {
        books.forEach(book_ => {
          let bookSection = document.createElement("div");
            if (book_.asin === book) {
              totalPrice += book_.price;
              bookSection.className = "card mt-4 card-cart";
              bookSection.innerHTML = `
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
    

    // Al click del button continue shopping del modal viene eseguito un reset del contenuto
    removeAllBooks.addEventListener("click", () => {
      modalCart.innerHTML = "";
      totalPriceHtml.innerHTML = "";
      let content = document.querySelectorAll(".card-cart");
      content.forEach(card => {
        card.remove();
      });
      amount.innerHTML = 0;
      totalPrice = 0;
      quantityBooks = [];
      books.forEach(book => {
        document.getElementById(`${book.asin}`).innerHTML = `<i class="bi bi-cart-plus"></i> Add to Cart`;
        document.getElementById(`${book.asin}`).classList.remove("btn-danger");
        document.getElementById(`${book.asin}`).classList.add("btn-success");
      });
    });

    // Inzizializzo la variabile remove to cart per rimuovere il singolo libro dal carrello
    let removeBook = document.querySelectorAll(".remove-book");
    removeBook.forEach(valore => {
      let rimuoviBook = document.getElementById(`${valore.id}`);
      rimuoviBook.addEventListener("click", () => {
        if (valore.id === rimuoviBook.id) {
        }
      });
    });

    // Rimuove tutti i libri dal carrello
    removeAllBooks.addEventListener("click", () => {
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
 * -------------------------
 */
function searchBook() {

  inputSearchBtn.addEventListener("click", () => {
    if (inputSearch.value.length > 3) {
      // console.log("ok");
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
function resetDocument(books) {

  inputResetBtn.addEventListener("click", () => {
    let titoli = document.querySelectorAll(".card-title");
    titoli.forEach(titolo => {
      document.getElementById(`${titolo.innerText}`).style.color = "#000";
    })
    document.getElementById("inputSearch").value = "";
  });
};