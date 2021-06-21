const myLibrary = [];

// Check Browser for LocalStorage Support and Availability
// Code source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22
      // Firefox
      || e.code === 1014
      // test name field too, because code might not be present
      // everything except Firefox
      || e.name === 'QuotaExceededError'
      // Firefox
      || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    // acknowledge QuotaExceededError only if there's something already stored
    && (storage && storage.length !== 0);
  }
}

Storage.prototype.setObj = function setObj(key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObj = function getObj(key) {
  return JSON.parse(this.getItem(key));
};

const updateStorage = () => localStorage.setObj('myLibrary', myLibrary);

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

// Book Module

const bookModule = (() => {
  const newBook = (title, author, pages, read) => {
    const obj = Object.create(newBook.proto);
    obj.title = title;
    obj.author = author;
    obj.pages = pages;
    obj.read = read;
    return obj;
  };

  newBook.proto = {
    toggleStatus: function toggleStatus() { this.read = !this.read; },
    info: function info() {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'already read' : 'not read yet'}.`;
    },
  };

  return {
    newBook,
  };
})();

// Remove Book Button Event

const getBookObj = (title) => myLibrary.find((book) => book.title === `${title}`);

const getBookCard = (title) => document.querySelector(`.card[data-bookTitle='${title}']`);

const removeBook = (bookTitle) => {
  const bookCard = getBookCard(bookTitle);
  bookCard.remove();
  const book = getBookObj(bookTitle);
  const bookLibraryIndex = myLibrary.indexOf(book);
  myLibrary.splice(bookLibraryIndex, 1);
  updateStorage();
};

const removeBtnClickEvent = (button) => {
  button.addEventListener('click', (e) => removeBook(e.srcElement.offsetParent.dataset.booktitle));
};

// Status Switch Event

const changeBookStatusEvent = (statusSwitch) => {
  statusSwitch.addEventListener('click', (e) => {
    const book = getBookObj(e.srcElement.offsetParent.dataset.booktitle);
    book.toggleStatus();
    updateStorage();
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

// Library Module

const libraryModule = (() => {
  const addBook = (book, loadingStorage) => {
    myLibrary.push(book);
    if (!loadingStorage) updateStorage();
    bookCardBuilder(book);
  };

  return {
    addBook,
  };
})();

const validateInput = () => titleInput.value && authorInput.value
  && pagesInput.value && parseInt(pagesInput.value, 10)
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
    const newBook = bookModule.newBook(titleInput.value, authorInput.value,
      pagesInput.value, checkStatusInput());
    libraryModule.addBook(newBook, false);
    clearInputs();
    toggleModal(toggleModalLink, 'click');
  } else {
    if (feedbackMessage.parentNode === modalHeader) {
      return;
    }
    modalHeader.insertBefore(feedbackMessage, modalTitle);
  }
};

// Load Content

const loadStorageLibrary = (storedLibrary) => {
  storedLibrary.forEach((book) => {
    const newBook = bookModule.newBook(book.title, book.author,
      book.pages, book.read);
    libraryModule.addBook(newBook, true);
  });
};

const seedLibrary = () => {
  // Initial Library
  const theHobbit = bookModule.newBook('The Hobbit', 'J.R.R. Tolkien', 295, false);
  const greatGatsby = bookModule.newBook('The Great Gatsby', 'Author 1', 400, true);
  const mobyDick = bookModule.newBook('Moby Dick', 'Author 2', 500, false);
  const harryPotter = bookModule.newBook('Harry Potter', 'J. K. Rowling', 600, true);
  const greatExpectations = bookModule.newBook('Great Expectations', 'Charles Dickens', 600, true);

  libraryModule.addBook(theHobbit, false);
  libraryModule.addBook(greatGatsby, false);
  libraryModule.addBook(mobyDick, false);
  libraryModule.addBook(harryPotter, false);
  libraryModule.addBook(greatExpectations, false);
};

if (storageAvailable('localStorage')) {
  if (localStorage.length === 0) {
    if (myLibrary.length === 0) {
      seedLibrary();
    }
    updateStorage();
  } else {
    loadStorageLibrary(localStorage.getObj('myLibrary'));
  }
} else {
  seedLibrary();
}

addBookButton.addEventListener('click', addBookBtn);
