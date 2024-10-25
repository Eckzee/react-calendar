import Button from "./Button.js";
import "../styles/delete-pop-styles.css";

export default function DeletePopup({
  curEvent,
  onHandleToggleDelete,
  onCompleteDeleteEvent,
}) {
  return (
    <div className="delete-pop">
      <h2>Are you sure you want to delete this event?</h2>
      <p>By clicking yes "{curEvent.eventName}" will be deleted</p>
      <div className="btn-box">
        <Button
          onClickHandler={() => onCompleteDeleteEvent(curEvent)}
          cName="btn"
        >
          Yes, delete it
        </Button>
        <Button onClickHandler={() => onHandleToggleDelete()} cName="btn">
          No, keep it
        </Button>
      </div>
    </div>
  );
}
