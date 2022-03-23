/* Referencia: https://github.com/todo-list-app/todo-list-app.github.io/blob/e35d8a23a934f74b7e47cf07b3e8814930970b37/todo.js#L522*/
function main() {
  var citasList = JSON.parse(document.getElementById("citasList").innerText);
  console.log(citasList);
  var calendar;
  initCalendar();
  load();
  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    //console.log(typeof todoList)
    if (todoList == null) todoList = [];
    if (citasList.length > 0) {
      todoList.push.apply(todoList, citasList);
    }
    console.log(todoList);
    todoList.map((obj) => {
      addEvent({
        daysOfWeek: obj.daysOfWeek,
        title: obj.todo,
        start: obj.date,
      });
    });
    if (citasList != []) {
      citasList = [];
    }
  }

  function initCalendar() {
    var calendarE1 = document.getElementById("calendar");
    calendar = new FullCalendar.Calendar(calendarE1, {
      timeZone: "local",
      themeSystem: "bootstrap",
      dayMaxEvents: true, // allow "more" link when too many events
      locales: ["idLocale"],
      editable: false,
      selectable: false,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,listMonth",
      },
      events: [], // [{},{}], Agregar Json de eventos
    });
    calendar.render();
  }
  function addEvent(event) {
    calendar.addEvent(event);
  }
}

main();