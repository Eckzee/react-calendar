import { useEffect, useState } from "react";
import Day from "./Day.js";

export default function Calendar({
  days,
  date,
  onHandleFormToggle,
  onGenerateCalender,
  eventList,
  onHandleChangeDay,
  onHandlePopToggle,
  months,
}) {
  const [month, setMonth] = useState([]);

  useEffect(() => {
    onGenerateCalender(date, setMonth);
  }, [onGenerateCalender, date]);

  return (
    <div>
      <h1>{months[date.getMonth()]}</h1>
      <div className="calendar">
        {days.map((day, i) => (
          <div className="heading" key={i}>
            {day}
          </div>
        ))}
        {month.map((day, i) => (
          <Day
            key={i}
            day={day}
            onHandleFormToggle={onHandleFormToggle}
            eventList={eventList}
            onHandleChangeDay={onHandleChangeDay}
            onClick={onHandlePopToggle}
            cname={`${day.month !== date.getMonth() ? "off-month" : ""} ${
              day.day === date.getDate() ? "selected" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
