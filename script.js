const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const listCategories = document.getElementById("list-categories");
let currentList = "default";

function switchList(listName) {
  currentList = listName;
  showTask();
}

function addTask() {
  if (inputBox.value.trim() === "") {
    alert("Please enter a task.");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);
  let span = document.createElement("span");
  span.innerHTML = "\u00D7";
  li.appendChild(span);

  inputBox.value = "";
  saveData();
}

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

function saveData(dataToUpdate) {
  const data = dataToUpdate || loadData();

  if (!dataToUpdate) {
    data[currentList] = Array.from(listContainer.children).map(
      (li) => li.firstChild.textContent
    );
  }

  localStorage.setItem("data", JSON.stringify(data));
}

function loadData() {
  const storedData = localStorage.getItem("data");
  return storedData ? JSON.parse(storedData) : {};
}

function showTask() {
  listContainer.innerHTML = "";
  const data = loadData();
  const tasks = data[currentList] || [];

  tasks.forEach((taskName) => {
    let li = document.createElement("li");
    li.innerHTML = taskName;

    let span = document.createElement("span");
    span.innerHTML = "\u00D7";
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}

(function init() {
  const data = loadData();

  for (let listName in data) {
    const li = document.createElement("li");
    li.textContent = listName.charAt(0).toUpperCase() + listName.slice(1);
    li.onclick = function () {
      switchList(listName);
    };
    listCategories.appendChild(li);
  }

  showTask();
})();
