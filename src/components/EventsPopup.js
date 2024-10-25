import Button from "./Button.js";
import "../styles/pop-up-styles.css";
import "../styles/time-styles.css";
export default function EventsPopup({
  date,
  months,
  onSetPopToggle,
  onHandleFormToggle,
  formToggle,
  eventList,
  onHandleSelEvent,
  onHandleDeletePopup,
}) {
  const dayEvents = eventList
    .filter(
      (event) =>
        event.eventDay === date.getDate() &&
        event.eventMonth === date.getMonth() &&
        event.eventYear === date.getFullYear()
    )
    .sort((a, b) => a.timeSort - b.timeSort);

  return (
    <div className="pop-up">
      <h2>
        {months[date.getMonth()]} {date.getDate()} {date.getFullYear()}
      </h2>
      <span
        onClick={() => onSetPopToggle((toggle) => !toggle)}
        className="close"
      ></span>
      {dayEvents.length > 0 && (
        <ul>
          {dayEvents.map((event) => (
            <li className="event" key={event.id}>
              <div
                className={`top-bar ${
                  event.eventAmpm === "AM"
                    ? "morning"
                    : event.eventHour < 6
                    ? "afternoon"
                    : "evening"
                }`}
                onClick={() => onHandleSelEvent(event)}
              >
                <span className="name">{event.eventName}</span>
                <span className="loc">{event.eventLocation}</span>
                <span className="time">{event.eventTime}</span>
              </div>
              <span className="details">{event.eventDetails}</span>
              <Button
                onClickHandler={() => onHandleDeletePopup(event)}
                cName="btn"
              >
                Delete Event
              </Button>
            </li>
          ))}
        </ul>
      )}

      <Button cName="btn" onClickHandler={onHandleFormToggle}>
        {!formToggle ? "Add an Event" : "Close Form"}
      </Button>
    </div>
  );
}
