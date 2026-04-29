const Input = document.getElementById("taskInput");
const addBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearAllBtn = document.getElementById("clearAllBtn");
const fetchDataBtn = document.getElementById("fetchDataBtn");

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("Tasks saved:", tasks);
}

// Update counter and empty state
function updateUI() {
    const total = tasks.length;
    taskCount.innerText = `You have ${total} task${total !== 1 ? "s" : ""}`;
    emptyMessage.style.display = total === 0 ? "block" : "none";
}

// Add a new task
function addTask() {
    const taskText = Input.value.trim();
    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }
    const newTask = {
        id: Date.now(),
        text: taskText
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    Input.value = "";
}

// Render tasks from localStorage
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        
        // Create task text span (clickable to edit)
        const taskSpan = document.createElement("span");
        taskSpan.className = "task-text";
        taskSpan.textContent = task.text;
        taskSpan.style.cursor = "pointer";
        taskSpan.title = "Click to edit";
        
        // Click on task to edit
        taskSpan.addEventListener("click", function() {
            const updatedTask = prompt("Edit your task:", task.text);
            if (updatedTask !== null && updatedTask.trim() !== "") {
                task.text = updatedTask.trim();
                saveTasks();
                renderTasks();
            }
        });
        
        // Create edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "editBtn";
        editBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            const updatedTask = prompt("Edit your task:", task.text);
            if (updatedTask !== null && updatedTask.trim() !== "") {
                task.text = updatedTask.trim();
                saveTasks();
                renderTasks();
            }
        });
        
        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "deleteBtn";
        deleteBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });
        
        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);
        
        li.appendChild(taskSpan);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    });
    updateUI();
}

// Add task on button click
addBtn.addEventListener("click", addTask);

// Add task on Enter key press
Input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Clear all tasks
clearAllBtn.addEventListener("click", function() {
    if (confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
});

// Initial render
renderTasks();

// Fetch external todos
fetchDataBtn.addEventListener("click", () => {
    fetchDataBtn.disabled = true;
    fetchDataBtn.textContent = "⏳ Loading...";
    
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=4')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
          }
          return response.json();
      })
      .then(todos => {
          todos.forEach(todo => {
              tasks.push({
                  id: todo.id,
                  text: todo.title,
                  done: todo.completed
              });
          });
          saveTasks();
          renderTasks();
          alert(`✅ Successfully added ${todos.length} todos!`);
          fetchDataBtn.textContent = "📥 Fetch Todos";
      })
      .catch(error => {
          console.error("Fetch error:", error);
          alert(`❌ Failed to fetch todos: ${error.message}`);
          fetchDataBtn.textContent = "📥 Fetch Todos";
      })
      .finally(() => {
          fetchDataBtn.disabled = false;
      });
});
