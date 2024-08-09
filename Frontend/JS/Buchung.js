function checkAvailability(date = null) {
  if (date) {
    const urlParams = new URLSearchParams(window.location.search);
    const activityParams = urlParams.get('activity');
    const activity = JSON.parse(decodeURIComponent(activityParams));

    const dateRangeString = activity.date;

    // Funktion zur Konvertierung des Datums von dd.mm.yyyy in Date-Objekte
    function parseDate1(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
        return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    }

    // Split des Strings anhand des Trennzeichens (' - ')
    const [startDateString1, endDateString1] = dateRangeString.split(' - ');

    // Konvertierung der Start- und Enddaten in das gewünschte Format (dd.mm.yyyy)
    const formattedStartDate = parseDate1(startDateString1);
    const formattedEndDate = parseDate1(endDateString1);

    //console.log(formattedStartDate); // Startdatum im Format dd.mm.yyyy
    //console.log(formattedEndDate); // Enddatum im Format dd.mm.yyyy
    
    // Funktion, um das Datum in das gewünschte Format umzuwandeln (dd.mm.yyyy)
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    
    function parseDate(dateString) {
      const [day, month, year] = dateString.split('.').map(Number);
      return new Date(year, month - 1, day);
    }

    const startDateString = formattedStartDate; // Dein Startdatum im Format dd.mm.yyyy
    const endDateString = formattedEndDate;
    // Umwandlung des Startdatums in das Date-Objekt
    const startDate = parseDate(startDateString);
    const endDate = parseDate(endDateString);
    // Array zur Speicherung der Daten im gewünschten Format
    const dateList = [];

    // Schleife für jeden Tag im Zeitraum und Umwandlung in das gewünschte Format
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        dateList.push(formatDate(new Date(date)));
    }
    //console.log(dateList);
    return dateList.includes(date);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const activityParams = urlParams.get('activity');
    const activity = JSON.parse(decodeURIComponent(activityParams));

    const dateRangeString = activity.date;

    // Funktion zur Konvertierung des Datums von dd.mm.yyyy in Date-Objekte
    function parseDate1(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
        return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
    }

    // Split des Strings anhand des Trennzeichens (' - ')
    const [startDateString1, endDateString1] = dateRangeString.split(' - ');

    // Konvertierung der Start- und Enddaten in das gewünschte Format (dd.mm.yyyy)
    const formattedStartDate = parseDate1(startDateString1);
    const formattedEndDate = parseDate1(endDateString1);

    //console.log(formattedStartDate); // Startdatum im Format dd.mm.yyyy
    //console.log(formattedEndDate); // Enddatum im Format dd.mm.yyyy
    
    // Funktion, um das Datum in das gewünschte Format umzuwandeln (dd.mm.yyyy)
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    
    function parseDate(dateString) {
      const [day, month, year] = dateString.split('.').map(Number);
      return new Date(year, month - 1, day);
    }

    const startDateString = formattedStartDate; // Dein Startdatum im Format dd.mm.yyyy
    const endDateString = formattedEndDate;
    // Umwandlung des Startdatums in das Date-Objekt
    const startDate = parseDate(startDateString);
    const endDate = parseDate(endDateString);
    // Array zur Speicherung der Daten im gewünschten Format
    const dateList = [];

    // Schleife für jeden Tag im Zeitraum und Umwandlung in das gewünschte Format
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        dateList.push(formatDate(new Date(date)));
    }
    //console.log(dateList);
    return dateList;
  }
};
function getTODAY() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
}

function getNextAvailableDate() {
  const availableDates = checkAvailability()

  // Wenn verfügbare Daten vorhanden sind
  if (availableDates.length > 0) {
    const firstAvailableDate = availableDates[0];
    const [day, month, year] = firstAvailableDate.split('.');
    renderCalendar(parseInt(year), parseInt(month) - 1, parseInt(day)); // Rendere den Kalender mit dem ersten verfügbaren Datum
  }
}
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
function renderCalendar(year, month, day) {
  const daysTag = document.querySelector(".days");
  const currentDate = document.querySelector(".current-date");
  const prevNextIcon = document.querySelectorAll(".icons span");
  const selectedDateElement = document.getElementById('selectedDate'); // Textfeld-Element

  const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    let firstDayofMonth = new Date(year, month, 1).getDay();
    let lastDateofMonth = new Date(year, month + 1, 0).getDate();
    let lastDayofMonth = new Date(year, month, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(year, month, 0).getDate();
    let liTag = "";
    
    // inaktive Tage des vorherigen Monats
    for (let i = firstDayofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    // aktive Tage des aktuellen Monats 
    for (let i = 1; i <= lastDateofMonth; i++) {
      const currentDate = new Date(year, month, i);
      const available = checkAvailability(formatDate(currentDate));
      if (available) {
        //if (i === day) {
          //liTag += `<li class="active NEXTavailable">${i}</li>`;
        //} else {
          //liTag += `<li class="active available">${i}</li>`;
        //}
        liTag += `<li class="active available">${i}</li>`;
      } else {
        if (formatDate(currentDate) === getTODAY()) {
          liTag += `<li class="active today">${i}</li>`;
        } 
        else {
          liTag += `<li class="active">${i}</li>`;
        }
      }
    }
    // inaktive Tage des nächsten Monats
    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[month]} ${year}`;
    daysTag.innerHTML = liTag;
  };

  renderCalendar();
  
  // Event-Listener zu den Pfeil-Icons
  prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
      month = icon.id === "prev" ? month - 1 : month + 1;

      if (month < 0) {
          month = 11;
          year--;
      } else if (month > 11) {
          month = 0;
          year++;
      }

      
      renderCalendar();
    });
  });
    // Event-Listener für Klicks auf Kalender-Tage
  daysTag.addEventListener("click", (event) => {
      if (event.target.classList.contains("active")) {
        const activeDays = daysTag.querySelectorAll(".active");
        activeDays.forEach(day => {
          day.classList.remove("selected");
        });
    
        const selectedDay = event.target;
        selectedDay.classList.add("selected");
    
        const selectedDate = `${selectedDay.textContent} ${months[month]} ${year}`;
        selectedDateElement.value = selectedDate;
      }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const daysTag = document.querySelector(".days");
  const currentDate = document.querySelector(".current-date");
  const prevNextIcon = document.querySelectorAll(".icons span");
  const selectedDateElement = document.getElementById('selectedDate'); // Textfeld-Element

  let date = new Date();
  let currYear = date.getFullYear();
  let currMonth = date.getMonth();

  const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";
    
    // inaktive Tage des vorherigen Monats
    for (let i = firstDayofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    // aktive Tage des aktuellen Monats 
    //for (let i = 1; i <= lastDateofMonth; i++) {
      //liTag += `<li class="active">${i}</li>`;
    //}
     // Aktive Tage des aktuellen Monats
    for (let i = 1; i <= lastDateofMonth; i++) {
      const date = `${i < 10 ? '0' : ''}${i}.${currMonth + 1 < 10 ? '0' : ''}${currMonth + 1}.${currYear}`;
      const isAvailable = checkAvailability(date);

      if (isAvailable) {
        liTag += `<li class="active available">${i}</li>`;
      } else {
        if (date === getTODAY()) {
          liTag += `<li class="active today">${i}</li>`;
        } else {
          liTag += `<li class="active">${i}</li>`;
        }
      }
    }
    // inaktive Tage des nächsten Monats
    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
  };

  renderCalendar();
  
  // Event-Listener zu den Pfeil-Icons
  prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0) {
            currMonth = 11;
            currYear--;
        } else if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        }

        date = new Date(currYear, currMonth, 1);
        renderCalendar();
    });
  });
    // Event-Listener für Klicks auf Kalender-Tage
  daysTag.addEventListener("click", (event) => {
      if (event.target.classList.contains("active")) {
        const activeDays = daysTag.querySelectorAll(".active");
        activeDays.forEach(day => {
          day.classList.remove("selected");
        });
    
        const selectedDay = event.target;
        selectedDay.classList.add("selected");
    
        const selectedDate = `${selectedDay.textContent} ${months[currMonth]} ${currYear}`;
        selectedDateElement.value = selectedDate;
      }
  });
});
/*
document.addEventListener('DOMContentLoaded', function() {
  const daysTag = document.querySelector(".days");
  const currentDate = document.querySelector(".current-date");
  const prevNextIcon = document.querySelectorAll(".icons span");
  const selectedDateElement = document.getElementById('selectedDate'); // Textfeld-Element

  let date = new Date();
  let currYear = date.getFullYear();
  let currMonth = date.getMonth();
  let currDay = date.getDate(); // Hinzugefügt: aktueller Tag

  const months = ["January", "February", "March", "April", "May", "June", "July",
            "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay();
    let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
    let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";
    
    // inaktive Tage des vorherigen Monats
    for (let i = firstDayofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    // aktive Tage des aktuellen Monats 
    for (let i = 1; i <= lastDateofMonth; i++) {
      if (i === currDay && currMonth === date.getMonth() && currYear === date.getFullYear()) {
        liTag += `<li class="active today">${i}</li>`; // Hervorhebung des aktuellen Tages
      } else {
        liTag += `<li class="active">${i}</li>`;
      }
    }
    // inaktive Tage des nächsten Monats
    for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
  };

  renderCalendar();
  
  // Event-Listener zu den Pfeil-Icons
  prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0) {
            currMonth = 11;
            currYear--;
        } else if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        }

        date = new Date(currYear, currMonth, 1);
        renderCalendar();
    });
  });

  // Event-Listener für Klicks auf Kalender-Tage
  daysTag.addEventListener("click", (event) => {
      if (event.target.classList.contains("active")) {
        const activeDays = daysTag.querySelectorAll(".active");
        activeDays.forEach(day => {
          day.classList.remove("selected");
        });
    
        const selectedDay = event.target;
        selectedDay.classList.add("selected");
    
        const selectedDate = `${selectedDay.textContent} ${months[currMonth]} ${currYear}`;
        selectedDateElement.value = selectedDate;
      }
  });
});
*/