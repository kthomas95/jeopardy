import { useEffect, useState } from "react";
import { Clue, useJeopardyStore } from "../api/useJeopardyGame";

interface GameClueProps extends Clue {
    active: boolean;
}
export const GameClue = ({
    amount,
    prompt,
    answer,
    position,
    found,
}: GameClueProps) => {
    const selectClue = useJeopardyStore((state) => state.selectClue);
    const currentClue = useJeopardyStore(
        (state) => state.status?.currentClue
    ) ?? [-1, -1];

    const [showAnswer, setShowAnswer] = useState(false);
    const finishClue = useJeopardyStore((state) => state.finishClue);

    const answering = !!useJeopardyStore((state) => state.status?.currentClue);
    const active =
        position[0] === currentClue[0] && position[1] === currentClue[1];

    const selectable = !found && currentClue[0] === -1;

    const Element = answering ? "div" : "button";

    const className = `bg-jep-blue/70 text-slate-200 flex flex-col relative items-center justify-center overflow-hidden min-h-0 leading-none  ${
        active ? "text-sm" : "font-bold"
    } ${!active && !selectClue ? "opacity-50" : ""}`;

    const [timer, setTimer] = useState(100);

    useEffect(() => {
        if (!active) return;
        console.log("Setting inverval");
        const interval = setInterval(() => {
            console.log("Dec timer");
            setTimer((prev) => {
                if (prev === 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [active]);

    if (found) return <div />;
    return (
        <Element
            className={className}
            onClick={selectable ? () => selectClue(position) : undefined}
        >
            {active ? (showAnswer ? answer : prompt) : amount}
            {active && (
                <div
                    onClick={() => setTimer(0)}
                    className="bg-red-400 absolute left-0 bottom-0 h-2"
                    style={{ width: `${timer}%` }}
                />
            )}
            {timer === 0 && (
                <button
                    onClick={
                        showAnswer
                            ? () => finishClue(position)
                            : () => setShowAnswer(true)
                    }
                    className="success-inter bottom-0 left-0 right-0 absolute w-full btn !rounded-none"
                >
                    {showAnswer ? "Finish Clue" : "Reveal Answer"}
                </button>
            )}
        </Element>
    );
};
