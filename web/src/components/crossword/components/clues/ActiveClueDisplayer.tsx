function ActiveClueDisplayer({
  activeClue,
}: {
  activeClue: {
    oritation: "A" | "D";
    number: number;
    clue: string;
  };
}) {
  return (
    <div className="active-clue">
      <span className="clue-number">
        {activeClue.oritation + ". " + activeClue.number}.
      </span>{" "}
      {activeClue.clue}
    </div>
  );
}

export default ActiveClueDisplayer;
