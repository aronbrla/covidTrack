/* Referencia: https://github.com/todo-list-app/todo-list-app.github.io/blob/e35d8a23a934f74b7e47cf07b3e8814930970b37/todo.js#L522*/

let citasList = JSON.parse(document.getElementById("citasList").innerText);
// console.log(citasList);

let pacientes = JSON.parse(document.getElementById("pacientes").innerText);
// console.log(pacientes);

let pacienteSelect = document.getElementById("pacienteSelect");
for (obj of pacientes) {
    pacienteSelect.innerHTML += `<option value=${obj.dni}>${obj.nombre}</option>`;
}
dniDValue = document.getElementById("dnid").value;

main();


function main() {
    let titleInput,
        dateTimeInput,
        todoList = [];
    var calendar;
    getElement();
    initCalendar();
    load();

    function getElement() {
        titleInput = document.getElementById("titleInput");
        dateTimeInput = document.getElementById("dateTimeInput");
        addButton = document.getElementById("addBtn");
    }

    function load() {
        let retrieved = localStorage.getItem("todoList");
        todoList = JSON.parse(retrieved);
        //console.log(typeof todoList)
        if (todoList == null)
            todoList = [];

        if (citasList.length > 0) {
            todoList.push.apply(todoList, citasList);
        }
        // console.log(todoList);
        todoList.map(obj => {
            addEvent({
                title: 'Cita Medica - ' + obj.todo,
                start: obj.date,
                paciente: obj.todo,
                dateTime: obj.date,
            });
        });
    }

    function save() {
        let stringified = JSON.stringify(todoList);
        localStorage.setItem("todoList", stringified);
    }
    function initCalendar() {
        var calendarE1 = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarE1, {
            timeZone: 'local',
            themeSystem: 'bootstrap',
            dayMaxEvents: true, // allow "more" link when too many events
            locales: ['idLocale'],
            editable: true,
            selectable: true,
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,listMonth'
            },
            eventClick: function (info) {
                toDeleteItem(info.event);
                //alert('Event: ' + info.event.title);
            },
            events: [], // [{},{}], Agregar Json de eventos
        });
        calendar.render();
    }
    function addEvent(event) {
        calendar.addEvent(event);
    }
    function toDeleteItem(event) {
        let nomPaciente = event._def.extendedProps.paciente;
        const dateTime = (new Date((event.start).getTime() - ((event.start).getTimezoneOffset() * 60000))).toISOString().slice(0, 19);
        let pacienteDNI;
        citasList.map(obj => {
            if (obj.todo == nomPaciente)
                pacienteDNI = obj.pacDNI;
        });
        var div = document.createElement("div");
        div.innerHTML = `<form id="eliminarcita"  action="./deleteCita" method="POST">
        <input type="hidden" name="pacienteDni" value=${pacienteDNI}>
        <input type="hidden" name="dateTime" value=${dateTime}>
        <button type="submit" class="btn btn-primary my-4">OK!</button>
        </form>`;
        Swal.fire({
            title: "¿Deseas eliminar la cita?",
            text: `Se eliminara la cita del paciente ${nomPaciente} programada para la fecha ${dateTime}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Sí, Eliminar cita!",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                console.log(`Dni del paciente a eliminar: ${pacienteDNI}. Fecha a eliminar: ${dateTime}`);
                Swal.fire({
                    title: "Cita eliminada!",
                    icon: 'success',
                    html: div,
                    showConfirmButton: false,
                });
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
        });
    }
}