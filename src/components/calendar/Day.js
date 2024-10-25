import "../../styles/time-styles.css";

export default function Day({ day, cname, onHandleChangeDay, eventList }) {
  const dayEvents = eventList
    .filter(
      (event) =>
        event.eventDay === day.day &&
        event.eventMonth === day.month &&
        event.eventYear === day.year
    )
    .sort((a, b) => a.timeSort - b.timeSort);
  return (
    <div
      onClick={() => onHandleChangeDay(day.day, day.month, day.year)}
      className={`${cname}`}
    >
      <span>{day.day}</span>
      {dayEvents.length > 0 && (
        <ul>
          {dayEvents.slice(0, 3).map((event) => (
            <li
              key={event.id}
              className={`${
                event.eventAmpm === "AM"
                  ? "morning"
                  : event.eventHour < 6
                  ? "afternoon"
                  : "evening"
              }`}
            >
              {event.eventName.length > 12
                ? event.eventName.slice(0, 12) + "..."
                : event.eventName}
              <span className="time">{event.eventTime}</span>
            </li>
          ))}
          {dayEvents.length > 3 && (
            <li>
              +{dayEvents.length - 3} more event
              {dayEvents.length - 3 > 1 ? "s" : ""}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
