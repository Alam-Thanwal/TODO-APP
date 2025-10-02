// Select elements
const todoInput = document.getElementById("todo-input");
const columns = document.querySelectorAll(".column");

// Show popup
function openframe() {
  document.querySelector(".userinput").style.display = "flex";
}

// Hide popup
function closeframe() {
  document.querySelector(".userinput").style.display = "none";
}

// Add new To-Do
function addTodo() {
  const task = todoInput.value.trim();

  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  // Get existing todos or empty array
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Add new task to default "todo-list" column
  todos.push({ text: task, column: "todo-list" });

  // Save to localStorage
  localStorage.setItem("todos", JSON.stringify(todos));

  // Update UI
  displayTodos();

  // Reset input & close popup
  todoInput.value = "";
  closeframe();
}

// Display all tasks
function displayTodos() {
  // Clear all lists first
  document.querySelectorAll(".todo-list").forEach(list => list.innerHTML = "");

  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.draggable = true;
    div.textContent = task.text;
    div.dataset.index = index;

    // Add delete icon
    const delBtn = document.createElement("i");
    delBtn.className = "fa-solid fa-trash";
    delBtn.style.float = "right";
    delBtn.style.cursor = "pointer";
    delBtn.style.color = "red";

    delBtn.addEventListener("click", () => deleteTodo(index));


    // Add drag events
    div.addEventListener("dragstart", () => {
      div.classList.add("dragging");
    });

    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
      updateLocalStorage();
    });

    // Append to correct column
    const targetColumn = document.getElementById(task.column);
    if (targetColumn) {
      targetColumn.appendChild(div);
    div.appendChild(delBtn);

    }
  });
}
// Delete a specific task
function deleteTodo(index) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  displayTodos();
}

// Allow dropping into columns
columns.forEach(column => {
  column.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const todoList = column.querySelector(".todo-list");
    if (dragging && todoList) {
      todoList.appendChild(dragging);
    }
  });
});

// Update localStorage after drag-drop
function updateLocalStorage() {
  const todos = [];
  document.querySelectorAll(".task-item").forEach(item => {
    const columnId = item.parentElement.id;
    todos.push({ text: item.textContent, column: columnId });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Load tasks on page load
window.onload = displayTodos;
