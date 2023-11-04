let categoriesArray = [];
let tasksArray = [];

// Getting reference to DOM elements
const inputBox = document.getElementById("input-box");
const listTasks = document.getElementById("list-tasks");
const listCategories = document.getElementById("list-categories");

// The currently active list
let currentList = "default";

// Switch to a different task list
function switchList(listName) {
  currentList = listName;
  showTask();
}

function addItem(type) {
  // Determine the elements and data based on type
  let inputElement =
    type === "task" ? inputBox : document.getElementById("category-input");
  let listElement =
    type === "task" ? listTasks : document.getElementById("list-categories");
  let value = inputElement.value.trim();

  if (value === "") {
    alert(`Please enter a ${type}.`);
    return;
  }

  // Create the item
  let item = document.createElement("li");
  item.textContent = value;

  // For tasks, add a delete button
  if (type === "task") {
    let span = document.createElement("span");
    span.textContent = "\u00D7";
    item.appendChild(span);
  }

  // Add the item to the list
  listElement.appendChild(item);

  // Special handling for categories
  if (type === "category") {
    const data = loadData();
    if (!data[value]) {
      data[value] = [];
      saveData(data);
    }
  } else {
    // Save tasks to local storage
    saveData();
  }

  // Clear the input element
  inputElement.value = "";

  // Close the modal, if necessary
  if (type === "category") {
    closeModal("categoryModal");
  } else {
    closeModal("taskModal");
  }
}

// Event listeners for marking tasks as done and deleting tasks
listTasks.addEventListener(
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

// Save tasks to local storage
function saveData(dataToUpdate) {
  const data = dataToUpdate || loadData();

  // If there's no data to update, save the current list's tasks
  if (!dataToUpdate) {
    data[currentList] = Array.from(listTasks.children).map(
      (li) => li.firstChild.textContent
    );
  }

  localStorage.setItem("data", JSON.stringify(data));
}

// Load tasks from local storage
function loadData() {
  const storedData = localStorage.getItem("data");
  return storedData ? JSON.parse(storedData) : {};
}

// Display tasks of the active list
function showTask() {
  listTasks.innerHTML = "";
  const data = loadData();
  const tasks = data[currentList] || [];

  tasks.forEach((taskName) => {
    let li = document.createElement("li");
    li.innerHTML = taskName;

    let span = document.createElement("span");
    span.innerHTML = "\u00D7";
    li.appendChild(span);

    listTasks.appendChild(li);
  });
}

// Initialization function to populate categories and tasks
(function init() {
  const data = loadData();

  for (let categoryName in data) {
    addCategoryToList(categoryName);
  }

  showTask();
})();

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
  } else {
    console.error(`Modal with ID ${modalId} not found.`);
  }
}

// Close the new category modal
function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  } else {
    console.error("Modal with ID" + modalId + "not found");
  }
}

function toggleModal(modalId, shouldOpen) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = shouldOpen ? "flex" : "none";
  } else {
    console.error("Modal with ID ${modalId} not found.");
  }
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

  // Switch to default list if deleted category was active
  if (currentList === selectedCategory) {
    currentList = "default";
    showTask();
  }

  /**
   * Populates a dropdown with options.
   *
   * @param {string} dropdownId - The ID of the dropdown element to populate.
   * @param {Array} options - An array of options. Each option can be a string or an object with 'value' and 'text' properties.
   */
  function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);

    if (!dropdown) {
      console.error(`Dropdown with ID ${dropdownId} not found.`);
      return;
    }

    // Clear existing options
    dropdown.innerHTML = "";

    // Populate the dropdown with new options
    options.forEach((option) => {
      const opt = document.createElement("option");

      if (typeof option === "string") {
        opt.value = option;
        opt.textContent = option;
      } else if (
        typeof option === "object" &&
        option.value !== undefined &&
        option.text !== undefined
      ) {
        opt.value = option.value;
        opt.textContent = option.text;
      } else {
        console.error(
          "Option format is incorrect. It should be a string or an object with value and text properties."
        );
        return;
      }

      dropdown.appendChild(opt);
    });
  }

  closeDeleteModal();
}
