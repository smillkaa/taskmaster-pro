var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

// saved when refreshed
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Task editing

// Click description -> editable field
$(".list-group").on("click", "p", function() { // $("from ul.with that class").on("click", "the p element", this is what will happen()
  var text = $(this).text().trim(); // var that will get text of the content that is written by user = $(element that received the (click) event).that element's text().get it without any spaces()
  var textInput = $("<textarea>")
  .addClass("form-control").val(text); // var that is the text input box with which user can edit the thing they wrote = $(creating the text area box element itself as html element).add styling(i think from CDN css).i think it returns what user wrote in the box
  $(this).replaceWith(textInput); // $(element that received click (p)).will be replaced with(var new text user just wrote)
  textInput.trigger("focus"); // when the box has mouse on it, highlight
});

// blurs out when clicked off
$(".list-group").on("blur", "textarea", function(){
  // get the textarea's current value/text
  var text = $(this).val().trim();
  // get the parent ul's id attribute and replace it with nothing
  var status = $(this).closest(".list-group").attr("id").replace("list-", ""); // we dont know what the id will be, to do, completed etc
  // get the task's position in the list of other li elements
  var index = $(this).closest(".list-group-item").index();

  tasks[status][index].text = text; // object[returns array eg todo][returns the object at the given index, place in the array?].returns text property at that given index
  saveTasks();

  // recreate p element
  var taskP = $("<p>").addClass("m-1").text(text);
  // replace textarea with p element
  $(this).replaceWith(taskP);

});

// due date was clicked
$(".list-group").on("click", "span", function() {
  // get current text
  var date = $(this)
    .text()
    .trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);

  // swap out elements
  $(this).replaceWith(dateInput);

  // automatically focus on new element
  dateInput.trigger("focus");
});

// value of due date was changed
$(".list-group").on("blur", "input[type='text']", function(){
  // get current text
  var date = $(this)
  .val()
  .trim();

  // get the parent ul's id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");

  // get the task's position in the list of other li elements
  var index = $(this)
  .closest(".list-group-item")
  .index();

  // update task in array and re-save to localstorage
  tasks[status][index].date = date;
  saveTasks();

  
  // recreate span element with bootstrap classes
  var taskSpan = $("<span>")
  .addClass("badge badge-primary badge-pill")
  .text(date);

  // replace input with span element
  $(this).replaceWith(taskSpan);
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


