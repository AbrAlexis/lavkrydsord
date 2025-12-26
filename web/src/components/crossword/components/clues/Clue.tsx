function Clue({ number, text }: { number: number; text: string }) {
  return (
    <div className="clue">
      <span className="clue-number">{number}.</span> {text}
    </div>
  );
}

export default Clue;
