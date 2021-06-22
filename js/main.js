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

// Library Module

const libraryModule = (() => {
  const getBook = (title) => myLibrary.find((book) => book.title === `${title}`);

  const addBook = (book, loadingStorage) => {
    myLibrary.push(book);
    //if (!loadingStorage) storageModule.updateStorage();
  };

  const removeBook = (bookTitle) => {
    const book = getBook(bookTitle);
    const bookLibraryIndex = myLibrary.indexOf(book);
    myLibrary.splice(bookLibraryIndex, 1);
    //storageModule.updateStorage();
  };

  return {
    getBook,
    addBook,
    removeBook,
  };
})();

// LibraryDOM Module

const libraryDOMModule = (() => {
  const _validateInput = () => titleInput.value && authorInput.value
    && pagesInput.value && parseInt(pagesInput.value, 10)
    && pagesInput.value.length === String(parseInt(pagesInput.value, 10)).length;

  const _checkStatusInput = () => {
    let status;
    if (trueRadioBtn.checked) {
      status = true;
    }
    if (falseRadioBtn.checked) {
      status = false;
    }
    return status;
  };

  const _getBookCard = (title) => document.querySelector(`.card[data-bookTitle='${title}']`);

  const _bookStatusText = (status) => `${status ? 'Already Read' : 'Not Read'}`;

  const _toggleBtnStyle = (btn) => btn.classList.toggle('active');

  const _changeBookStatusEvent = (switchBtn) => {
    switchBtn.addEventListener('click', (e) => {
      const book = libraryModule.getBook(e.srcElement.offsetParent.dataset.booktitle);
      book.toggleStatus();
      //storageModule.updateStorage();
      const bookCard = _getBookCard(book.title);
      const statusSwitch = bookCard.lastChild.firstChild.lastChild;
      statusSwitch.textContent = _bookStatusText(book.read);
      _toggleBtnStyle(statusSwitch);
    });
  };

  const _removeBtnClickEvent = (button) => {
    button.addEventListener('click', (e) => {
      const bookTitle = e.srcElement.offsetParent.dataset.booktitle;
      libraryModule.removeBook(bookTitle);
      const bookCard = _getBookCard(bookTitle);
      bookCard.remove();
    });
  };

  const buildBookCard = (book) => {
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
    statusSwitch.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'inactive', 'switch-btn');
    statusSwitch.setAttribute('type', 'button');
    _changeBookStatusEvent(statusSwitch);
    const bookRemoveBtn = document.createElement('button');
    bookRemoveBtn.classList.add('btn', 'btn-primary');
    bookRemoveBtn.setAttribute('type', 'button');
    _removeBtnClickEvent(bookRemoveBtn);

    bookTitle.textContent = `Title: ${book.title}`;
    bookAuthor.textContent = `Author: ${book.author}`;
    bookPages.textContent = `Pages: ${book.pages}`;
    bookStatus.textContent = 'Status:';
    statusSwitch.textContent = _bookStatusText(book.read);
    if (book.read) _toggleBtnStyle(statusSwitch);
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

  const _clearInputs = () => {
    titleInput.value = '';
    authorInput.value = '';
    pagesInput.value = '';
    falseRadioBtn.checked = true;
  };

  const _toggleModal = (toggleModalLink, evName) => {
    toggleModalLink.dispatchEvent(new CustomEvent(evName, {}));
  };

  const addBook = () => {
    if (_validateInput()) {
      if (feedbackMessage.parentNode === modalHeader) {
        feedbackMessage.remove();
      }
      const newBook = bookModule.newBook(titleInput.value, authorInput.value,
        pagesInput.value, _checkStatusInput());
      libraryModule.addBook(newBook, false);
      buildBookCard(newBook);
      _clearInputs();
      _toggleModal(toggleModalLink, 'click');
    } else {
      if (feedbackMessage.parentNode === modalHeader) {
        return;
      }
      modalHeader.insertBefore(feedbackMessage, modalTitle);
    }
  };

  return {
    buildBookCard,
    addBook,
  };
})();

// Storage Module

const storageModule = (() => {
  // Check Browser for LocalStorage Support and Availability
  // Code source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
  const _storageAvailable = (type) => {
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
  };

  const _loadStorageLibrary = (storedLibrary) => {
    storedLibrary.forEach((book) => {
      const newBook = bookModule.newBook(book.title, book.author,
        book.pages, book.read);
      libraryModule.addBook(newBook, true);
      libraryDOMModule.buildBookCard(newBook);
    });
  };

  const updateStorage = () => localStorage.setObj('myLibrary', myLibrary);

  const _setStorageAccessMethods = () => {
    Storage.prototype.setObj = function setObj(key, obj) {
      return this.setItem(key, JSON.stringify(obj));
    };

    Storage.prototype.getObj = function getObj(key) {
      return JSON.parse(this.getItem(key));
    };

    const callback = (mutationsList) => {
      for(const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          updateStorage();
        }
        else if (mutation.type === 'childList') {
          if (mutation.addedNodes[0]) {
            _listenForChanges(mutation.addedNodes[0].lastChild.firstChild.lastChild);
          }
          updateStorage();
        }
      }
    };

    Storage.prototype.observer = new MutationObserver(callback);
  };

  const _listenForChanges = (element) => {
    let config;
    if (element.constructor == HTMLButtonElement) {
      config = { attributes: true };
    } else {
      config = { childList: true };
    }
    localStorage.observer.observe(element, config);
  };

  const load = () => {
    if (_storageAvailable('localStorage')) {
      _setStorageAccessMethods();
      if (localStorage.length === 0) {
        if (myLibrary.length === 0) {
          seedLibrary();
        }
        updateStorage();
      } else {
        _loadStorageLibrary(localStorage.getObj('myLibrary'));
      }
    } else {
      seedLibrary();
    }

    let bookStatusBtns = document.querySelectorAll('.switch-btn');
    bookStatusBtns.forEach(btn => _listenForChanges(btn));
    _listenForChanges(bookCollectionContainer);
    addBookButton.addEventListener('click', libraryDOMModule.addBook);
  };

  return {
    updateStorage,
    load,
  };
})();

const seedLibrary = () => {
  // Initial Library
  const seedBookLibrary = [bookModule.newBook('The Hobbit', 'J.R.R. Tolkien', 295, false),
    bookModule.newBook('The Great Gatsby', 'Author 1', 400, true),
    bookModule.newBook('Moby Dick', 'Author 2', 500, false),
    bookModule.newBook('Harry Potter', 'J. K. Rowling', 600, true),
    bookModule.newBook('Great Expectations', 'Charles Dickens', 600, true)];

  seedBookLibrary.forEach((book) => {
    libraryModule.addBook(book, false);
    libraryDOMModule.buildBookCard(book);
  });
};

// Load Page

storageModule.load();
