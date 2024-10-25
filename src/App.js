import { useState, useCallback } from "react";
import Calendar from "./components/calendar/Calendar";
import Button from "./components/Button.js";
import "./App.css";
import { days, months } from "./components/arrays.js";
import EventForm from "./components/EventForm.js";
import EventsPopup from "./components/EventsPopup.js";
import DeletePopup from "./components/DeletePopup.js";

function App() {
  const [date, setDate] = useState(new Date());
  const [formToggle, setFormToggle] = useState(false);
  const [eventList, setEventList] = useState([{}]);
  const [popToggle, setPopToggle] = useState(false);
  const [deletePop, setDeletePop] = useState(false);

  const [selEvent, setSelEvent] = useState({});

  function handleAddEvent(event) {
    setEventList((list) => [...list, { ...event }]);
  }

  function handleDeleteEvent(event) {
    setEventList((list) => list.filter((item) => item.id !== event.id));
  }

  function completeDeleteEvent(event) {
    handleDeleteEvent(event);
    setSelEvent((event) => {});
    setDeletePop((pop) => false);
  }

  function handleUpdateEvent(event) {
    handleDeleteEvent(event);
    handleAddEvent(event);
  }

  function handleFormToggle() {
    setFormToggle((toggle) => !toggle);
  }

  function handleSelectEvent(event) {
    setSelEvent((selEvent) => event);
    handleFormToggle();
  }

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };
  function handleChangeDay(dayValue, monthValue, yearValue) {
    setDate((date) => new Date(yearValue, monthValue, dayValue));
    setPopToggle((toggle) => !toggle);
  }

  function handleToggleDelete() {
    setDeletePop((pop) => !pop);
  }

  function handleDeletePopup(event) {
    handleToggleDelete();
    setSelEvent((oldEvent) => event);
  }

  const daysOfWeek = [...days];
  const monthsOfYear = [...months];
  const generateCalendar = useCallback((dateObj, setterFunction) => {
    const firstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const lastDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
    const lastMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 0);
    const nextMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      1
    );
    const daysInMonth = lastDay.getDate();
    const offSet = firstDay.getDay();
    const totalDays = 42;
    const calendarDays = [];
    let counter = 0;
    let lastCounter = firstDay.getDay();
    let firstLoop = false;

    for (let i = 0; i <= totalDays; ++i) {
      if (i < offSet) {
        calendarDays[i] = {
          id: crypto.randomUUID(),
          status: "inactive",
          day: lastMonth.getDate() - lastCounter,
          month: lastMonth.getMonth(),
          year: lastMonth.getFullYear(),
        };
        --lastCounter;
      } else if (i >= offSet && i <= daysInMonth + offSet - 1) {
        calendarDays[i] = {
          id: crypto.randomUUID(),
          status: "active",
          day: firstDay.getDate() + counter,
          month: firstDay.getMonth(),
          year: firstDay.getFullYear(),
        };
        ++counter;
      } else if (i > daysInMonth - 1 && i < totalDays) {
        if (!firstLoop) {
          counter = 0;
          firstLoop = true;
        }
        calendarDays[i] = {
          id: crypto.randomUUID(),
          status: "inactive",
          day: nextMonth.getDate() + counter,
          month: nextMonth.getMonth(),
          year: nextMonth.getFullYear(),
        };
        ++counter;
      }
    }
    counter = 0;
    setterFunction(calendarDays);
  }, []);
  return (
    <div className="App">
      <div className="container">
        <Calendar
          days={daysOfWeek}
          date={date}
          onHandleFormToggle={handleFormToggle}
          onGenerateCalender={generateCalendar}
          onHandleChangeDay={handleChangeDay}
          eventList={eventList}
          months={monthsOfYear}
        />
        <Button cName="arr-btn prev" onClickHandler={handlePrevMonth}>
          ⬅️
        </Button>
        <Button cName="arr-btn next" onClickHandler={handleNextMonth}>
          ➡️
        </Button>
        {formToggle && (
          <EventForm
            onHandleFormToggle={handleFormToggle}
            date={date}
            months={months}
            onGenerateCalender={generateCalendar}
            onHandleAddEvent={handleAddEvent}
            selectedEvent={selEvent}
            onHandleSelectEvent={handleSelectEvent}
            onHandleUpdateEvent={handleUpdateEvent}
          />
        )}
        {popToggle && (
          <EventsPopup
            date={date}
            months={monthsOfYear}
            onSetPopToggle={setPopToggle}
            popToggle={popToggle}
            onHandleFormToggle={handleFormToggle}
            formToggle={formToggle}
            eventList={eventList}
            onHandleSelEvent={handleSelectEvent}
            onHandleDeletePopup={handleDeletePopup}
          />
        )}
        <Button cName="btn" onClickHandler={handleFormToggle}>
          Add an event
        </Button>
        {deletePop && (
          <DeletePopup
            className="delete-pop"
            curEvent={selEvent}
            onCompleteDeleteEvent={completeDeleteEvent}
            onHandleToggleDelete={handleToggleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default App;
