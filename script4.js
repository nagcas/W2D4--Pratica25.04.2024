/**
 * Fetch
 */

// fetch(url)
//   .then((response) => response.json()) // trasformo la risposta in oggetto
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error))


// fake esempio con verifica di un eventuale errore
// fetch("https://api.esempio.com/data")
//   .then((response) => {
//     if(!response.ok) {
//       throw new Error("Errore del network");
//     }
//     return response.json;
//   .then((data) => console.log(data))
//   .then((error) => console.log(error))
//   })


// Esempio posts
const url = "https://jsonplaceholder.typicode.com/posts";
const url1 = "https://striveschool-api.herokuapp.com/books";

fetch(url1)
  .then((response) => {
    if(!response.ok) {
      throw new Error("Risposta networks non ok");
    }
    return response.json() // converto la risponsa in formato json
  })
  .then((data) => {
    console.log(data); // Stampo i dati ottenuti dalla console
    console.log("Titolo del primo libro: ", data[0].title);
    console.log("Costo: ", data[0].price);
  })
  .catch((error) => {
    console.error("Errore: ", error);
  })

  // https://docs.google.com/presentation/d/1t6s1_ihyzqbQx1Muccr6Kd0_zOHbkFZM5MIHIsP6mkg/embed
