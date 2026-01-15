import type { CluesProps } from "../../types.ts";
import ClueComponent from "./Clue.tsx";
import "./Clues.css";
import "./Clue.css";
import { useRef, useLayoutEffect } from "react";

const SECTIONS = [
  { label: "Across", orientation: "A", direction: "across" },
  { label: "Down", orientation: "D", direction: "down" },
] as const;

function Clues({ clues, onClick, crosswordState }: CluesProps) {
  const { activeClue, otherDirectionClueNumber } = crosswordState;

  const activeClueRef = useRef<HTMLDivElement | null>(null);
  const otherClueRef = useRef<HTMLDivElement | null>(null);
  const acrossSectionRef = useRef<HTMLDivElement | null>(null);
  const downSectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!activeClue) return;
    if (activeClue?.direction && activeClueRef.current) {
      scrollIntoSection(activeClueRef.current, activeClue.direction);
    }

    if (otherClueRef.current) {
      scrollIntoSection(
        otherClueRef.current,
        activeClue.direction === "across" ? "down" : "across"
      );
    }
  }, [activeClue, otherDirectionClueNumber]);

  function scrollIntoSection(
    clueEl: HTMLDivElement,
    direction: "across" | "down"
  ) {
    const section =
      direction === "across"
        ? acrossSectionRef.current
        : downSectionRef.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const targetRect = clueEl.getBoundingClientRect();


    if (
      targetRect.top >= sectionRect.top &&
      targetRect.bottom <= sectionRect.bottom
    ) {
      return;
    } else {
      section.scrollTo({
        top: section.scrollTop + targetRect.top - sectionRect.top,
        behavior: "smooth",
      });
    }
  }
  return (
    <div className="clues-container">
      {SECTIONS.map(({ label, orientation, direction }) => (
        <div
          key={label}
          ref={direction === "across" ? acrossSectionRef : downSectionRef}
          className="clues-section"
        >
          <h3>{label}</h3>
          {clues
            .filter((clue) => clue.Orientation === orientation)
            .map((clue) => {
              const isHighlighted =
                activeClue?.number === clue.Number &&
                activeClue.direction === direction;

              // check if the clue is the selected cells other direction
              const isOtherDirectionHighlighted =
                activeClue?.direction !== direction &&
                otherDirectionClueNumber === clue.Number;

              return (
                <ClueComponent
                  key={`${direction}-${clue.Number}`} // use unique key
                  direction={direction}
                  number={clue.Number}
                  text={clue.Clue}
                  isHighlighted={isHighlighted}
                  isOtherDirectionHighlighted={isOtherDirectionHighlighted}
                  onClick={() => onClick(clue.Number, direction)}
                  ref={
                    isHighlighted
                      ? activeClueRef
                      : isOtherDirectionHighlighted
                      ? otherClueRef
                      : null
                  }
                />
              );
            })}
        </div>
      ))}
    </div>
  );
}

export default Clues;
