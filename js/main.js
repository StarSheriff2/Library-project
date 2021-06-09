let myLibrary = [];
const bookCollectionContainer = document.querySelector(".book-collection-container");

let bookCard = document.createElement("div");
bookCard.classList.add(".card");

function bookCardBuilder(book){
  let bookTitle = document.createElement("h3");
  let bookAuthor = document.createElement("p");
  let bookPages = document.createElement("p");
  let bookStatus = document.createElement("p");
  
  bookTitle.textContent = `${book.title}`;
  bookAuthor.textContent = `${book.author}`;
  bookTitle.textContent = `${book.pages}`;
  bookTitle.textContent = `${book.read? 'already read': 'not read yet'}`;
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function() {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read? 'already read': 'not read yet'}.`
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false)
const greatGatsby = new Book('The Great Gatsby', 'Author 1', 400, true)
const mobyDick = new Book('Moby Dick', 'Author 2', 500, false)
console.log(theHobbit.info()) // "The Hobbit by J.R.R. Tolkien, 295 pages, not read yet"

bookCard.appendChild(bookCardBuilder(theHobbit))
bookCollectionContainer.appendChild(bookCard)


addBookToLibrary(theHobbit)
addBookToLibrary(greatGatsby)
addBookToLibrary(mobyDick)

console.log(myLibrary) // hobbit book obj
