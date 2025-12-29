import "./Clue.css";
function Clue({
  number,
  text,
  isHighlighted,
  isOtherDirectionHighlighted,
}: {
  number: number;
  text: string;
  isHighlighted: boolean;
  isOtherDirectionHighlighted: boolean;
}) {
  return (
    <div
      className={`clue
    ${isHighlighted ? "highlighted" : ""}
    ${isOtherDirectionHighlighted ? "other-direction-highlighted" : ""}`}
    >
      <span className="clue-number">{number}.</span> {text}
    </div>
  );
}

export default Clue;
