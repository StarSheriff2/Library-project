let myLibrary = [];
const bookCollectionContainer = document.querySelector(".book-collection-container");
const addBookButton = document.querySelector(".add-book-btn");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const statusInput = document.querySelector("input[name='status']");

function bookCardBuilder(book){
  let bookCard = document.createElement("div");
  bookCard.classList.add("card", "m-2", "card-width", "bg-light");
  let bookTitle = document.createElement("h3");
  bookTitle.classList.add("text-center", "card-header");
  let cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  let bookAuthor = document.createElement("p");
  let bookPages = document.createElement("p");
  let bookStatus = document.createElement("p");
  bookStatus.classList.add("card-footer", "m-0")

  bookTitle.textContent = `Title: ${book.title}`;
  bookAuthor.textContent = `Author: ${book.author}`;
  bookPages.textContent = `Pages: ${book.pages}`;
  bookStatus.textContent = `Status: ${book.read? 'already read': 'not read yet'}`;

  bookCard.appendChild(bookTitle);
  cardBody.appendChild(bookAuthor);
  cardBody.appendChild(bookPages);
  bookCard.appendChild(cardBody);
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

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const greatGatsby = new Book('The Great Gatsby', 'Author 1', 400, true);
const mobyDick = new Book('Moby Dick', 'Author 2', 500, false);
const harryPotter = new Book('J. K. Rowling', 'Author 4', 600, true);
const harryPotterr = new Book('J. K. Rowling', 'Author 4', 600, true);

addBookToLibrary(theHobbit)
addBookToLibrary(greatGatsby)
addBookToLibrary(mobyDick)
addBookToLibrary(harryPotter)
addBookToLibrary(harryPotterr)

myLibrary.forEach(function(book) {
  bookCardBuilder(book);
});

// Add book button

function validateInput() {
  return titleInput.value && authorInput.value && pagesInput.value && statusInput.value
}

function addBookBtn() {
  if (validateInput()) {
    if (typeof feedbackMessage != "undefined" && feedbackMessage) {
      feedbackMessage.remove();
    }
    let newBook = new Book(titleInput.value, authorInput.value, pagesInput.value, statusInput.value);
    bookCardBuilder(newBook);
  } else {
    if (typeof feedbackMessage != "undefined" && feedbackMessage){ return}
    feedbackMessage = document.createElement('div');
    feedbackMessage.textContent = "Please check all the fields are complete.";
    feedbackMessage.style.width = "100%";
    feedbackMessage.classList.add("text-center", "bg-danger")
    modalHeader = document.querySelector(".modal-header");
    modalTitle = document.querySelector(".modal-title");
    modalHeader.insertBefore(feedbackMessage, modalTitle);
    
  }

}

addBookButton.addEventListener('click', addBookBtn)
