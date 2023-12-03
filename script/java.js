/*
[
    {
        * id: <int> || <string>,
        * title: <string>,
        * author: <string>,
        * year: <Int>,
        * isComplete: <boolean>,
    }
]
*/

const books = [];
const RENDER_EVENT = "books-render";
const SAVED_EVENT = "saved-book";
const SAVED_BOOK = "BOOK_DATA";

const uniqueID = () => {
  return Math.random().toString(36).substr(2, 9);
};

const newDispatchEvent = (event) => {
  document.dispatchEvent(new Event(event));
};

const isStorageBookEmpty = () => {
  if (typeof Storage === undefined) {
    return false;
  }
  return true;
};

const paluElement = document.querySelector('#palu');
const puluelement = document.querySelector('#pulu');

function showPopUp() {
  paluElement.classList.add('display');

  
  setTimeout(function() {
    paluElement.classList.remove('display')
  }, 2000)
};
function showPopUp1() {
  puluelement.classList.add('display');

 
  setTimeout(function() {
    puluelement.classList.remove('display')
  }, 1000)
};

const savedBook = () => {
  if (isStorageBookEmpty()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(SAVED_BOOK, parsed);
    newDispatchEvent(SAVED_BOOK);
  }
};

const loadDataFromStorage = () => {
  const serializedData = localStorage.getItem(SAVED_BOOK);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  newDispatchEvent(RENDER_EVENT);
};



const createBookElement = (bookObject) => {
  const { id, title, author, year, isComplete } = bookObject;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("data-id", `${id}`);

  const textTitle = document.createElement("h3");
  textTitle.textContent = `Judul : ${title}`;

  const textAuthor = document.createElement("p");
  textAuthor.textContent = ${author};

  const textYear = document.createElement("p");
  textYear.textContent = `Tahun : ${parseInt(year, 10) || 0}`;
  
  const actionButton = document.createElement("div");
  actionButton.classList.add("action");

  
  if (isComplete) {
    const doneReadButton = document.createElement("button");
    doneReadButton.classList.add("green");
    doneReadButton.textContent = "Selesai dibaca";
    doneReadButton.addEventListener("click", () => {
      doneReadBook(id);
    });

    actionButton.append(doneReadButton);

  } else {
    const unDoneReadButton = document.createElement("button");
    unDoneReadButton.classList.add("green");
    unDoneReadButton.textContent = "Belum selesai dibaca";
    unDoneReadButton.addEventListener("click", () => {
      unDoneReadBook(id);
    });

    actionButton.append(unDoneReadButton);
  }
  const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.textContent = "Hapus buku";
    deleteButton.addEventListener("click", () => {
      showPopUp1();
      removeBookFromTask(id);
      
    });
    actionButton.append(deleteButton);

  container.append(textTitle, textAuthor, textYear, actionButton);

  return container;
};


const addBook = () => {
  const titleInput = document.getElementById("inputBookTitle");
  const authorInput = document.getElementById("inputBookAuthor");
  const yearInput = document.getElementById("inputBookYear");
  const checkedInput = document.getElementById("inputBookIsComplete");

  
  const id = uniqueID();
  const title = titleInput.value;
  const author = authorInput.value;
  const year = yearInput.value;
  const isComplete = checkedInput.checked;


  if (year.length > 4) {
    alert(`Maksimal karakter 4`);
    return;
  }

  const newBook = {
    id: id,
    title: title,
    author: author,
    year: parseInt(year, 10) || 0,
    isComplete: isComplete,
  };
  books.push(newBook);

  newDispatchEvent(RENDER_EVENT);
  savedBook()
};


const doneReadBook = (id) => {
  books.map((book) => {
    if (book.id === id) {
      book.isComplete = false;
    }
  });
  newDispatchEvent(RENDER_EVENT);

  savedBook();
};


const unDoneReadBook = (id) => {
  books.map((book) => {
    if (book.id === id) {
      book.isComplete = true;
      return book;
    }
    return null;
  });

  newDispatchEvent(RENDER_EVENT);
  savedBook();
};



const removeBookFromTask = (id) => {
  books.splice(
    books.findIndex((book) => book.id === id),
    1
  );
  newDispatchEvent(RENDER_EVENT);
  savedBook();
};


const isSubmit = () => {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    showPopUp();
    

    submitForm.reset();
    
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageBookEmpty()) {
    loadDataFromStorage();
  }

  isSubmit();
});

document.addEventListener(RENDER_EVENT, () => {
  const completedListBook = document.getElementById("completeBookshelfList");
  const unCompletedListBook = document.getElementById(
    "incompleteBookshelfList"
  );

  completedListBook.innerHTML = "";
  unCompletedListBook.innerHTML = "";

  books.map((bookItem) => {
    const bookElement = createBookElement(bookItem);
    if (bookItem.isComplete) {
      completedListBook.append(bookElement);
    } else {
      unCompletedListBook.append(bookElement);
    }
  });
  function searchBook() {
      const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
      const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchInput));
    
      const completedListBook = document.getElementById("completeBookshelfList");
      const unCompletedListBook = document.getElementById("incompleteBookshelfList");
    
      completedListBook.innerHTML = "";
      unCompletedListBook.innerHTML = "";
    
      filteredBooks.map((bookItem) => {
        const bookElement = createBookElement(bookItem);
        if (bookItem.isComplete) {
          completedListBook.append(bookElement);
        } else {
          unCompletedListBook.append(bookElement);
        }
      });
    };
const searchForm  = document.getElementById('searchBook');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    searchBook();
});

});