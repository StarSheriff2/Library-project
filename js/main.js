const myLibrary = [];
const bookCollectionContainer = document.querySelector('.book-collection-container');
const modalTitle = document.querySelector('.modal-title');
const feedbackMessage = document.createElement('div');
const modalHeader = document.querySelector('.modal-header');
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const pagesInput = document.querySelector('#pages');
const trueRadioBtn = document.querySelector("input[id='true']");
const falseRadioBtn = document.querySelector("input[id='false']");
const addBookButton = document.querySelector('.add-book-btn');
const toggleModalLink = document.querySelector('#toggleModalLink');
feedbackMessage.textContent = 'Please check all fields have been completed.';
feedbackMessage.style.width = '100%';
feedbackMessage.classList.add('text-center', 'bg-danger');

const bookStatusText = (status) => `${status ? 'Already Read' : 'Not Read'}`;

const toggleBtnStyle = (btn) => btn.classList.toggle('active');

// Book Constructor and Prototype Property
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.info = function info() {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'already read' : 'not read yet'}.`;
};

Book.prototype.toggleStatus = function toggleStatus() {
  if (this.read) {
    this.read = false;
  } else {
    this.read = true;
  }
};

// Remove Book Button Event

const getBookObj = (title) => myLibrary.find((book) => book.title === `${title}`);

const getBookCard = (title) => document.querySelector(`.card[data-bookTitle='${title}']`);

const removeBook = (bookTitle) => {
  const bookCard = getBookCard(bookTitle);
  bookCard.remove();
  const book = getBookObj(bookTitle);
  const bookLibraryIndex = myLibrary.indexOf(book);
  myLibrary.splice(bookLibraryIndex, 1);
};

const removeBtnClickEvent = (button) => {
  button.addEventListener('click', (e) => removeBook(e.srcElement.offsetParent.dataset.booktitle));
};

// Status Switch Event

const changeBookStatusEvent = (statusSwitch) => {
  statusSwitch.addEventListener('click', (e) => {
    const book = getBookObj(e.srcElement.offsetParent.dataset.booktitle);
    book.toggleStatus();
    const bookCard = getBookCard(book.title);
    const statusSwitch = bookCard.lastChild.firstChild.lastChild;
    statusSwitch.textContent = bookStatusText(book.read);
    toggleBtnStyle(statusSwitch);
  });
};

// Book Card Builder

const bookCardBuilder = (book) => {
  const bookCard = document.createElement('div');
  bookCard.classList.add('card', 'm-2', 'card-width', 'bg-light');
  bookCard.setAttribute('data-bookTitle', `${book.title}`);
  const bookTitle = document.createElement('h3');
  bookTitle.classList.add('text-center', 'card-header');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const bookAuthor = document.createElement('p');
  const bookPages = document.createElement('p');
  const cardFooter = document.createElement('div');
  cardFooter.classList.add('card-footer');
  const statusDiv = document.createElement('div');
  statusDiv.classList.add('d-flex', 'justify-content-start', 'align-items-center', 'mb-3');
  const bookStatus = document.createElement('p');
  bookStatus.classList.add('m-0', 'me-4');
  const statusSwitch = document.createElement('button');
  statusSwitch.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'inactive');
  statusSwitch.setAttribute('type', 'button');
  changeBookStatusEvent(statusSwitch);
  const bookRemoveBtn = document.createElement('button');
  bookRemoveBtn.classList.add('btn', 'btn-primary');
  bookRemoveBtn.setAttribute('type', 'button');
  removeBtnClickEvent(bookRemoveBtn);

  bookTitle.textContent = `Title: ${book.title}`;
  bookAuthor.textContent = `Author: ${book.author}`;
  bookPages.textContent = `Pages: ${book.pages}`;
  bookStatus.textContent = 'Status:';
  statusSwitch.textContent = bookStatusText(book.read);
  if (book.read) toggleBtnStyle(statusSwitch);
  bookRemoveBtn.textContent = 'Remove';

  bookCard.appendChild(bookTitle);
  cardBody.appendChild(bookAuthor);
  cardBody.appendChild(bookPages);
  bookCard.appendChild(cardBody);
  bookCard.appendChild(cardFooter);
  cardFooter.appendChild(statusDiv);
  statusDiv.appendChild(bookStatus);
  statusDiv.appendChild(statusSwitch);
  cardFooter.appendChild(bookRemoveBtn);
  bookCollectionContainer.appendChild(bookCard);
};

// Add book button

const addBookToLibrary = (book) => {
  myLibrary.push(book);
  bookCardBuilder(book);
};

const validateInput = () => titleInput.value
  && authorInput.value && pagesInput.value && parseInt(pagesInput.value, 10)
  && pagesInput.value.length === String(parseInt(pagesInput.value, 10)).length;

const checkStatusInput = () => {
  let status;
  if (trueRadioBtn.checked) {
    status = true;
  }
  if (falseRadioBtn.checked) {
    status = false;
  }
  return status;
};

const toggleModal = (toggleModalLink, evName) => {
  toggleModalLink.dispatchEvent(new CustomEvent(evName, {}));
};

const clearInputs = () => {
  titleInput.value = '';
  authorInput.value = '';
  pagesInput.value = '';
  falseRadioBtn.checked = true;
};

const addBookBtn = () => {
  if (validateInput()) {
    if (feedbackMessage.parentNode === modalHeader) {
      feedbackMessage.remove();
    }
    const newBook = new Book(titleInput.value, authorInput.value,
      pagesInput.value, checkStatusInput());
    addBookToLibrary(newBook);
    clearInputs();
    toggleModal(toggleModalLink, 'click');
  } else {
    if (feedbackMessage.parentNode === modalHeader) {
      return;
    }
    modalHeader.insertBefore(feedbackMessage, modalTitle);
  }
};

// Initial Library

const theHobbit = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const greatGatsby = new Book('The Great Gatsby', 'Author 1', 400, true);
const mobyDick = new Book('Moby Dick', 'Author 2', 500, false);
const harryPotter = new Book('Harry Potter', 'J. K. Rowling', 600, true);
const greatExpectations = new Book('Great Expectations', 'Charles Dickens', 600, true);

addBookToLibrary(theHobbit);
addBookToLibrary(greatGatsby);
addBookToLibrary(mobyDick);
addBookToLibrary(harryPotter);
addBookToLibrary(greatExpectations);

addBookButton.addEventListener('click', addBookBtn);
