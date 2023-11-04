// Getting reference to DOM elements
const inputBox = document.getElementById("task-input");
const listContainer = document.getElementById("list-tasks");
const listCategories = document.getElementById("list-categories");

let currentCategory = "default"; // The name of the currently active category

// Switches to a specified category and refreshes the view
function switchCategory(categoryName) {
  currentCategory = categoryName;
  showTasks();
}

// Add a new task to the active category
function addTask() {
  if (inputBox.value.trim() === "") {
    alert("Please enter a task.");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);

  // Add a delete button to the task
  let span = document.createElement("span");
  span.innerHTML = "\u00D7";
  li.appendChild(span);

  // Clear the input box
  inputBox.value = "";

  // Save tasks to local storage
  saveData();
}

// Event listeners for marking tasks as done and deleting tasks
listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

// Persists the current state of tasks or categories to local storage
function saveData(dataToUpdate) {
  const data = dataToUpdate || loadData();
  if (!dataToUpdate) {
    data[currentCategory] = Array.from(listContainer.children).map(
      (li) => li.firstChild.textContent
    );
  }
  localStorage.setItem("data", JSON.stringify(data));
}

// Retrieves stored tasks or categories from local storage
function loadData() {
  const storedData = localStorage.getItem("data");
  return storedData ? JSON.parse(storedData) : {};
}

// Display tasks of the active category
function showTasks() {
  listContainer.innerHTML = "";
  const data = loadData();
  const tasks = data[currentCategory] || [];

  tasks.forEach((taskName) => {
    let li = document.createElement("li");
    li.innerHTML = taskName;

    let span = document.createElement("span");
    span.innerHTML = "\u00D7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}

// Initialization function to populate categories and tasks
(function init() {
  const data = loadData();
  // Populate categories and tasks from stored data
  categories = Object.keys(data); // Assumes keys in data are category names
  if (data[currentCategory]) {
    tasks = data[currentCategory];
  }
  updateCategoriesDisplay();
  showTasks();
})();

// Open the new category modal
function addNewCategory() {
  document.getElementById("categoryModal").style.display = "flex";
}

// Close the new category modal
function closeModal() {
  document.getElementById("categoryModal").style.display = "none";
}

// Add a new category
function addCategory() {
  var categoryName = document.getElementById("category-input").value;
  if (categoryName) {
    addCategoryToList(categoryName);

    const data = loadData();
    if (!data[categoryName]) {
      data[categoryName] = [];
      saveData(data);
    }

    document.getElementById("category-input").value = "";
    closeModal();
  } else {
    alert("Please enter a category name.");
  }
}

// Add a category to the category list
function addCategoryToList(categoryName) {
  var ul = document.getElementById("list-categories");
  var li = document.createElement("li");
  li.textContent = categoryName;
  li.onclick = function () {
    switchCategory(categoryName);
  };
  ul.appendChild(li);
}

// Open the delete category modal and populate dropdown with categories
function openDeleteModal() {
  populateDropdown();
  document.getElementById("deleteCategoryModal").style.display = "flex";
}

// Close the delete category modal
function closeDeleteModal() {
  document.getElementById("deleteCategoryModal").style.display = "none";
}

// Populate dropdown with existing categories
function populateDropdown() {
  const dropdown = document.getElementById("delete-category-dropdown");
  const data = loadData();

  dropdown.innerHTML = "";
  for (let categoryName in data) {
    let option = document.createElement("option");
    option.value = categoryName;
    option.textContent = categoryName;
    dropdown.appendChild(option);
  }
}

// Delete the selected category
function deleteSelectedCategory() {
  const dropdown = document.getElementById("delete-category-dropdown");
  const selectedCategory = dropdown.value;

  // Remove category from local storage
  const data = loadData();
  delete data[selectedCategory];
  saveData(data);

  // Remove category from the category list
  const categoriesList = document.getElementById("list-categories");
  Array.from(categoriesList.children).forEach((li) => {
    if (li.textContent === selectedCategory) {
      li.remove();
    }
  });

  // Switch to default category if deleted category was active
  if (currentCategory === selectedCategory) {
    currentCategory = "default";
    showTasks();
  }

  closeDeleteModal();
}

// Function to update the display of categories
function updateCategoriesDisplay() {
  const data = loadData();
  const categoriesList = document.getElementById("list-categories");

  // Clear existing categories in the display
  categoriesList.innerHTML = "";

  // Iterate through the categories in local storage and add them to the display
  for (let categoryName in data) {
    addCategoryToList(categoryName);
  }
}

// Function to update the display of tasks for the selected category
function updateTaskDisplay() {
  const data = loadData();
  const tasksList = document.getElementById("list-tasks");
  tasksList.innerHTML = "";

  // Get tasks for the currently selected category (currentList)
  const tasks = data[currentList] || [];

  // Iterate through tasks and add them to the display
  tasks.forEach((taskName) => {
    let li = document.createElement("li");
    li.innerHTML = taskName;

    let span = document.createElement("span");
    span.innerHTML = "\u00D7";
    li.appendChild(span);

    tasksList.appendChild(li);
  });
}
