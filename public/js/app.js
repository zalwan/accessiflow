$(document).ready(function () {
  // ======================
  // DOM Elements
  // ======================
  const $taskForm = $("#task-form");
  const $taskList = $("#task-list");
  const $editModal = $("#edit-modal");
  const $editForm = $("#edit-task-form");
  const $errorMessage = $("#error-message");
  const $srAnnouncement = $("#sr-announcement");

  // ======================
  // State Management
  // ======================
  let lastFocusedElement = null;

  // ======================
  // Initialize App
  // ======================
  loadTasks();

  // ======================
  // Event Listeners
  // ======================
  $taskForm.on("submit", handleTaskSubmit);
  $taskList.on("click", ".edit-btn", handleEditClick);
  $taskList.on("click", ".delete-btn", handleDeleteClick);
  $editForm.on("submit", handleEditSubmit);
  $("#close-modal, .modal").on("click", handleModalClose);

  // Keyboard navigation for modal
  $(document).on("keydown", function (e) {
    // Close modal on ESC
    if (e.key === "Escape" && $editModal.attr("aria-hidden") === "false") {
      closeModal();
    }

    // Trap focus in modal
    if (e.key === "Tab" && $editModal.attr("aria-hidden") === "false") {
      trapFocus(e);
    }
  });

  // ======================
  // Core Functions
  // ======================
  async function loadTasks() {
    try {
      $taskList.attr("aria-busy", "true");
      const tasks = await $.get("/tasks");
      renderTasks(tasks);
      announceToScreenReader(`${tasks.length} tasks loaded`);
    } catch (error) {
      showError("Failed to load tasks. Please try again.");
      console.error("Load tasks error:", error);
    } finally {
      $taskList.attr("aria-busy", "false");
    }
  }

  function renderTasks(tasks) {
    $taskList.empty();

    if (tasks.length === 0) {
      $taskList.append(
        '<li class="no-tasks" tabindex="0">No tasks found. Add a task to get started!</li>'
      );
      return;
    }

    tasks.forEach((task) => {
      const dueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString()
        : "";
      const isCompleted = task.completed ? "completed" : "";
      const completedBadge = task.completed
        ? '<span class="completed-badge">Completed</span>'
        : "";

      const $taskItem = $(`
        <li class="task-item ${isCompleted}" 
            data-id="${task.id}" 
            role="listitem"
            tabindex="0">
          <div class="task-info">
            <h3 class="task-title">${task.title}${completedBadge}</h3>
            ${
              task.description
                ? `<p class="task-description">${task.description}</p>`
                : ""
            }
            ${
              dueDate
                ? `<time class="task-due-date" datetime="${task.dueDate}">Due: ${dueDate}</time>`
                : ""
            }
          </div>
          <div class="task-actions">
            <button class="edit-btn" aria-label="Edit task ${task.title}">
              Edit
            </button>
            <button class="delete-btn" aria-label="Delete task ${task.title}">
              Delete
            </button>
          </div>
        </li>
      `);

      $taskList.append($taskItem);
    });
  }

  // ======================
  // Form Handlers
  // ======================
  async function handleTaskSubmit(e) {
    e.preventDefault();

    const taskData = {
      title: $("#task-title").val().trim(),
      description: $("#task-description").val().trim(),
      dueDate: $("#task-due-date").val(),
      completed: $("#edit-task-completed").is(":checked"), // This captures checkbox state
    };

    if (!taskData.title) {
      showError("Task title is required");
      $("#task-title").focus();
      return;
    }

    try {
      $("#add-task-btn").attr("aria-busy", "true");
      await $.ajax({
        url: "/tasks",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(taskData),
      });

      $taskForm.trigger("reset");
      loadTasks();
      announceToScreenReader("Task added successfully");
    } catch (error) {
      showError("Failed to add task. Please try again.");
      console.error("Add task error:", error);
    } finally {
      $("#add-task-btn").attr("aria-busy", "false");
    }
  }

  // ======================
  // Edit Functionality
  // ======================
  async function handleEditClick() {
    const taskId = $(this).closest(".task-item").data("id");
    lastFocusedElement = this;

    try {
      $(this).attr("aria-busy", "true");
      const task = await $.get(`/tasks/${taskId}`);

      $("#edit-task-id").val(task.id);
      $("#edit-task-title").val(task.title);
      $("#edit-task-description").val(task.description || "");
      $("#edit-task-due-date").val(task.dueDate?.split("T")[0] || "");
      $("#edit-task-completed").prop("checked", task.completed || false);

      openModal();
      announceToScreenReader("Edit task dialog opened");
    } catch (error) {
      showError("Failed to load task for editing.");
      console.error("Edit task error:", error);
    } finally {
      $(this).attr("aria-busy", "false");
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();

    const taskData = {
      id: $("#edit-task-id").val(),
      title: $("#edit-task-title").val().trim(),
      description: $("#edit-task-description").val().trim(),
      dueDate: $("#edit-task-due-date").val(),
      completed: $("#edit-task-completed").is(":checked"),
    };

    if (!taskData.title) {
      showError("Task title is required", "#edit-task-title");
      return;
    }

    try {
      $('[type="submit"]', e.target).attr("aria-busy", "true");
      await $.ajax({
        url: `/tasks/${taskData.id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(taskData),
      });

      closeModal();
      loadTasks();
      announceToScreenReader("Task updated successfully");
    } catch (error) {
      showError("Failed to update task.");
      console.error("Update task error:", error);
    } finally {
      $('[type="submit"]', e.target).attr("aria-busy", "false");
    }
  }

  // ======================
  // Delete Functionality
  // ======================
  async function handleDeleteClick() {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const taskId = $(this).closest(".task-item").data("id");

    try {
      $(this).attr("aria-busy", "true");
      await $.ajax({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      });

      loadTasks();
      announceToScreenReader("Task deleted successfully");
    } catch (error) {
      showError("Failed to delete task.");
      console.error("Delete task error:", error);
    } finally {
      $(this).attr("aria-busy", "false");
    }
  }

  // ======================
  // Modal Management
  // ======================
  function openModal() {
    $editModal.attr("aria-hidden", "false").show();
    $("#edit-task-title").focus();
    $("body").css("overflow", "hidden");
  }

  function closeModal() {
    $editModal.attr("aria-hidden", "true").hide();
    $("body").css("overflow", "auto");
    if (lastFocusedElement) {
      $(lastFocusedElement).focus();
    }
  }

  function handleModalClose(e) {
    if (e.target === e.currentTarget || e.target.id === "close-modal") {
      closeModal();
    }
  }

  function trapFocus(e) {
    const focusable = $(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      $editModal
    );
    if (focusable.length === 0) return;

    const first = focusable.first();
    const last = focusable.last();

    if (e.shiftKey && document.activeElement === first[0]) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last[0]) {
      first.focus();
      e.preventDefault();
    }
  }

  // ======================
  // Accessibility Helpers
  // ======================
  function showError(message, focusElement = null) {
    $errorMessage.text(message).attr("aria-hidden", "false");
    if (focusElement) $(focusElement).focus();
  }

  function announceToScreenReader(message) {
    $srAnnouncement.text(message);
    setTimeout(() => $srAnnouncement.empty(), 1000);
  }
});
