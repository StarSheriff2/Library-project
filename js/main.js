const myLibrary = [];
const bookCollectionContainer = document.querySelector('.book-collection-container');
const addBookButton = document.querySelector('.add-book-btn');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages');
const trueRadioBtn = document.querySelector("input[id='true']");
const falseRadioBtn = document.querySelector("input[id='false']");
const feedbackMessage = document.createElement('div');
const modalHeader = document.querySelector('.modal-header');
const modalTitle = document.querySelector('.modal-title');
feedbackMessage.textContent = 'Please check all the fields are complete.';
feedbackMessage.style.width = '100%';
feedbackMessage.classList.add('text-center', 'bg-danger');

function bookCardBuilder(book) {
  const bookCard = document.createElement('div');
  bookCard.classList.add('card', 'm-2', 'card-width', 'bg-light');
  const bookTitle = document.createElement('h3');
  bookTitle.classList.add('text-center', 'card-header');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const bookAuthor = document.createElement('p');
  const bookPages = document.createElement('p');
  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card-footer')
  const bookStatus = document.createElement('p');
  bookStatus.classList.add('m-0');
  const bookRemoveBtn = document.createElement('button');
  bookRemoveBtn.classList.add('btn', 'btn-primary');

  bookTitle.textContent = `Title: ${book.title}`;
  bookAuthor.textContent = `Author: ${book.author}`;
  bookPages.textContent = `Pages: ${book.pages}`;
  bookStatus.textContent = `Status: ${book.read ? 'already read' : 'not read yet'}`;
  bookRemoveBtn.textContent = 'Remove';

  bookCard.appendChild(bookTitle);
  cardBody.appendChild(bookAuthor);
  cardBody.appendChild(bookPages);
  bookCard.appendChild(cardBody);
  bookCard.appendChild(cardFooter);
  cardFooter.appendChild(bookStatus);
  cardFooter.appendChild(bookRemoveBtn);
  bookCollectionContainer.appendChild(bookCard);
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function info() {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'already read' : 'not read yet'}.`;
};

function addBookToLibrary(book) {
  myLibrary.push(book);
}

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const greatGatsby = new Book('The Great Gatsby', 'Author 1', 400, true);
const mobyDick = new Book('Moby Dick', 'Author 2', 500, false);
const harryPotter = new Book('J. K. Rowling', 'Author 4', 600, true);
const harryPotterr = new Book('J. K. Rowling', 'Author 4', 600, true);

addBookToLibrary(theHobbit);
addBookToLibrary(greatGatsby);
addBookToLibrary(mobyDick);
addBookToLibrary(harryPotter);
addBookToLibrary(harryPotterr);

myLibrary.forEach((book) => {
  bookCardBuilder(book);
});

// Add book button

function validateInput() {
  return titleInput.value && authorInput.value && pagesInput.value;
}

function checkStatusInput() {
  if (trueRadioBtn.checked){
    return true;
  }else if(falseRadioBtn.checked){
    return false;
  }
}


function addBookBtn() {
  if (validateInput()) {
    if (feedbackMessage.parentNode === modalHeader) {
      feedbackMessage.remove();
    }
    const newBook = new Book(titleInput.value, authorInput.value,
      pagesInput.value, checkStatusInput());
    bookCardBuilder(newBook);
  } else {
    if (feedbackMessage.parentNode === modalHeader) {
      return;
    }
    modalHeader.insertBefore(feedbackMessage, modalTitle);
  }
}

addBookButton.addEventListener('click', addBookBtn);
