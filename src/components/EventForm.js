import { useState, useEffect, useMemo } from "react";
import Button from "./Button.js";

const shortDays = ["S", "M", "T", "W", "T", "F", "S"];

export default function EventForm({
  onHandleAddEvent,
  onHandleFormToggle,
  months,
  date,
  onGenerateCalender,
  selectedEvent,
  onHandleSelectEvent,
  onHandleUpdateEvent,
}) {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDay, setEventDay] = useState(date.getDate());
  const [eventMonth, setEventMonth] = useState(date.getMonth());
  const [eventYear, setEventYear] = useState(date.getFullYear());
  const [selectMonth, setSelectMonth] = useState([]);
  const [showCal, setShowCal] = useState(false);
  const [eventMinute, setEventMinute] = useState(0);
  const [eventHour, setEventHour] = useState(1);
  const [eventAmpm, setEventAmpm] = useState("AM");
  const edit = selectedEvent && Object.keys(selectedEvent).length > 0;

  useEffect(() => {
    if (edit) {
      setEventName(selectedEvent.eventName);
      setEventHour(selectedEvent.eventHour);
      setEventMinute(selectedEvent.eventMinute);
      setEventAmpm(selectedEvent.eventAmpm);
      setEventLocation(selectedEvent.eventLocation);
      setEventDetails(selectedEvent.eventDetails || "");
      setEventDay(selectedEvent.eventDay);
      setEventMonth(selectedEvent.eventMonth);
      setEventYear(selectedEvent.eventYear);
    }
  }, [selectedEvent, edit]);

  function resetFormData() {
    setEventName((name) => "");
    setEventHour(1);
    setEventMinute(0);
    setEventAmpm("AM");
    setEventLocation("");
    setEventDetails("");
    setEventDay(date.getDate());
    setEventMonth(date.getMonth());
    setEventYear(date.getYear());
    setDayControl(date.getDate() + date.getMonth() + 1);
  }

  function handleShowCal() {
    setShowCal((show) => !show);
  }

  const [dayControl, setDayControl] = useState(
    date.getDay() + date.getMonth() + 1
  );

  function handleSetDay(dObj) {
    setEventDay(dObj.day);
    setEventMonth(dObj.month);
    setEventYear(dObj.year);
    handleShowCal();
  }

  function handleEnterSelect(e, day) {
    if (e.key === "Enter") {
      handleSetDay(day);
    }
  }

  function handleDayControl(value) {
    setDayControl(value === dayControl ? null : value);
  }

  const dropDownDate = useMemo(() => {
    const newDate = new Date();
    newDate.setMonth(eventMonth);
    newDate.setFullYear(eventYear);
    return newDate;
  }, [eventMonth, eventYear]);

  useEffect(() => {
    onGenerateCalender(dropDownDate, setSelectMonth);
  }, [onGenerateCalender, dropDownDate]);

  function convertTwentyFour(str) {
    let workingStr = str.repeat(1);
    const [time, mod] = workingStr.split(/(AM|PM)/);
    let [hour, minut] = time.split(":").map(Number);
    if (mod === "PM" && hour < 12) hour += 12;
    else if (mod === "AM" && hour === 12) hour = 0;
    return hour * 60 + minut;
  }

  function submitEvent(e) {
    e.preventDefault();

    if (!eventName || !eventLocation || !eventDetails) return;
    const id = edit ? selectedEvent.id : crypto.randomUUID();
    const newEvent = {
      id,
      eventName,
      eventTime: `${eventHour}${
        eventMinute < 10 ? ":0" : ":"
      }${eventMinute}${eventAmpm}`,
      eventLocation,
      eventDetails,
      eventDay,
      eventMonth,
      eventYear,
      eventHour,
      eventMinute,
      eventAmpm,
      timeSort: convertTwentyFour(
        `${eventHour}${eventMinute < 10 ? ":0" : ":"}${eventMinute}${eventAmpm}`
      ),
    };
    if (edit) {
      onHandleUpdateEvent(newEvent);
      onHandleSelectEvent({});
    } else {
      onHandleAddEvent(newEvent);
      resetFormData();
      onHandleFormToggle();
    }
  }

  function handleNextMonth() {
    if (eventMonth < months.length - 1) {
      setEventMonth((month) => month + 1);
    } else if (eventMonth === months.length - 1) {
      setEventMonth((month) => 0);
      setEventYear((year) => year + 1);
    }
  }
  function handlePrevMonth() {
    if (eventMonth > 0) {
      setEventMonth((month) => month - 1);
    } else if (eventMonth === 0) {
      setEventMonth((month) => months.length - 1);
      setEventYear((year) => year - 1);
    }
  }

  return (
    <form className="add-event-form" onSubmit={submitEvent}>
      <span onClick={() => onHandleSelectEvent({})} className="close"></span>
      <h2>Add an Event!</h2>
      <div>
        <label>Event Name: </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          onFocus={() => setShowCal(false)}
        />
      </div>
      <div className="date-input">
        <label>Date: </label>
        <div className="date-display" tabIndex="0" onFocus={handleShowCal}>
          <input
            disabled
            value={`${eventDay} ${months[eventMonth]} ${eventYear}`}
          />
        </div>
        {showCal && (
          <div className="little-calendar">
            <div className="arrow-prev" onClick={handlePrevMonth}></div>

            <select
              className="month"
              value={eventMonth}
              onChange={(e) => setEventMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => i).map((num) => (
                <option value={num} key={num}>
                  {months[num]}
                </option>
              ))}
            </select>
            <select
              className="year"
              onChange={(e) => setEventYear(e.target.value)}
              value={eventYear}
            >
              {Array.from({ length: 30 }, (_, i) => i + 2022).map((num) => (
                <option value={num} key={num}>
                  {num}
                </option>
              ))}
            </select>
            <div className="arrow-next" onClick={handleNextMonth}></div>
            <ul>
              {shortDays.map((day, i) => (
                <li className="day" key={i}>
                  {day}
                </li>
              ))}
            </ul>

            {selectMonth.map((day) => (
              <label
                className={`day radio ${
                  Number(dayControl) === day.id ? "selected" : ""
                }`}
                key={day.id}
                tabIndex="0"
                htmlFor={`day-${day.id}`}
                onKeyDown={(e) => handleEnterSelect(e, day)}
              >
                {day.day}
                <input
                  id={`day-${day.id}`}
                  type="radio"
                  name="day"
                  value={day.day}
                  onChange={(e) => handleSetDay(day)}
                  onClick={() => handleDayControl(day.id)}
                  checked={Number(dayControl) === day.id}
                />
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        <label>Event Time: </label>
        <select
          value={eventHour}
          onChange={(e) => setEventHour(e.target.value)}
          onFocus={() => setShowCal(false)}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <option value={num} key={num}>
              {num}
            </option>
          ))}
        </select>
        <select
          value={eventMinute}
          onChange={(e) => setEventMinute(e.target.value)}
          onFocus={() => setShowCal(false)}
        >
          {Array.from({ length: 12 }, (_, i) => i * 5).map((num) => (
            <option value={num} key={num}>{`${
              num < 10 ? ":0" : ":"
            }${num}`}</option>
          ))}
        </select>
        <select
          value={eventAmpm}
          onChange={(e) => setEventAmpm(e.target.value)}
          onFocus={() => setShowCal(false)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <div>
        <label>Event Location: </label>
        <input
          type="text"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
          onFocus={() => setShowCal(false)}
        />
      </div>
      <div className="text-area">
        <label>Event Description</label>
        <textarea
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
          onFocus={() => setShowCal(false)}
        />
      </div>
      <Button cName="btn">{edit ? "Update Event" : "Add Event"}</Button>
    </form>
  );
}
