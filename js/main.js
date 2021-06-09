let myLibrary = [];
const bookCollectionContainer = document.querySelector(".book-collection-container");

function bookCardBuilder(book){
  let bookCard = document.createElement("div");
  bookCard.classList.add("card");
  let bookTitle = document.createElement("h3");
  let bookAuthor = document.createElement("p");
  let bookPages = document.createElement("p");
  let bookStatus = document.createElement("p");

  bookTitle.textContent = `Title: ${book.title}`;
  bookAuthor.textContent = `Author: ${book.author}`;
  bookPages.textContent = `Pages: ${book.pages}`;
  bookStatus.textContent = `Status: ${book.read? 'already read': 'not read yet'}`;

  bookCard.appendChild(bookTitle);
  bookCard.appendChild(bookAuthor);
  bookCard.appendChild(bookPages);
  bookCard.appendChild(bookStatus);
  bookCollectionContainer.appendChild(bookCard);
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

addBookToLibrary(theHobbit)
addBookToLibrary(greatGatsby)
addBookToLibrary(mobyDick)

myLibrary.forEach(function(book) {
  bookCardBuilder(book);
});

