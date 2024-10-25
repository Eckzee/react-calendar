export default function Button({ children, onClickHandler, cName }) {
  return (
    <button className={cName} onClick={onClickHandler}>
      {children}
    </button>
  );
}
