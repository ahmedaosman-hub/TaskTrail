let categories = [];
let tasks = [];

// References to DOM elements
const listTasks = document.getElementById("list-tasks");
const listCategories = document.getElementById("list-categories");

let currentList = "default"; // The name of the currently active task list

// Switches to a specified task list and refreshes the view
function switchList(listName) {
  currentList = listName;
  showTask(); // Assumes this function displays tasks for the current list
}

// Adds an item to the respective list and updates the UI accordingly
function addItem(type, value) {
  if (type === "category") {
    categories.push(value);
    updateCategoriesDisplay(); // Update the category display after adding a new category
  } else if (type === "task") {
    tasks.push(value);
    updateTaskDisplay(); // Update the task display after adding a new task
  }
}

// Updates the display by refreshing the list UI of the specified type
function updateDisplay(type) {
  let listElement = type === "category" ? listCategories : listTasks;
  let items = type === "category" ? categories : tasks;

  // Clear and repopulate the list to reflect current state
  listElement.innerHTML = "";
  items.forEach((item) => {
    let listItem = document.createElement("li");
    listItem.textContent = item;
    listElement.appendChild(listItem);
  });
}

// Handles UI interactions for tasks, such as marking as done or deleting
listTasks.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    // Toggle the completed state of the task
    e.target.classList.toggle("checked");
  } else if (e.target.tagName === "SPAN") {
    // Remove the task from the list
    e.target.parentElement.remove();
  }
  saveData(); // Persist changes to local storage
});

// Persists the current state of tasks or categories to local storage
function saveData(dataToUpdate) {
  const data = dataToUpdate || loadData();
  if (!dataToUpdate) {
    data[currentList] = tasks; // Save the current tasks if no data to update
  }
  localStorage.setItem("data", JSON.stringify(data));
}

// Retrieves stored tasks or categories from local storage
function loadData() {
  const storedData = localStorage.getItem("data");
  return storedData ? JSON.parse(storedData) : {};
}

function updateCategoriesDisplay() {
  updateDisplay("category");
}

// Updates the tasks display
function updateTaskDisplay() {
  updateDisplay("task");
}

// Initialization to populate the UI with stored categories and tasks
(function init() {
  const data = loadData();
  // Populate categories and tasks from stored data
  categories = Object.keys(data); // Assumes keys in data are category names
  if (data[currentList]) {
    tasks = data[currentList];
  }
  updateCategoriesDisplay();
  updateTaskDisplay();
})();

// Opens a modal dialog
function toggleModal(modalId, shouldOpen) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = shouldOpen ? "flex" : "none";
  } else {
    console.error(`Modal with ID ${modalId} not found.`);
  }
}

// Deletes the selected item from either categories or tasks and updates the display
function deleteSelectedItem(type) {
  let dropdownId =
    type === "category" ? "delete-category-dropdown" : "delete-task-dropdown";
  let dropdown = document.getElementById(dropdownId);
  let value = dropdown.value; // Get the selected value to delete

  if (type === "category") {
    categories = categories.filter((category) => category !== value);
    updateCategoriesDisplay(); // Reflect changes in the category UI
  } else if (type === "task") {
    tasks = tasks.filter((task) => task !== value);
    updateTaskDisplay(); // Reflect changes in the task UI
  }

  saveData(); // Persist the deletion to local storage
}

// Further functions related to modals, category management, etc. can be added below.
