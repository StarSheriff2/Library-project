let myLibrary = [];

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

addBookToLibrary(theHobbit)
addBookToLibrary(greatGatsby)
addBookToLibrary(mobyDick)

console.log(myLibrary) // hobbit book obj
