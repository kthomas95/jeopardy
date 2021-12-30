import { Category, useJeopardyStore } from "../api/useJeopardyGame";
import { GameClue } from "./GameClue";
import { GamePlayer } from "./GamePlayer";

interface GameCategoryProps extends Category {
    selectable: boolean;
    column: number;
}

const GameCategory = ({
    title,
    clues,
    selectable,
    column,
}: GameCategoryProps) => {
    const currentClue = useJeopardyStore(
        (state) => state.status?.currentClue
    ) ?? [-1, -1];

    return (
        <div className="text-center grid grid-rows-[4rem] auto-rows-fr gap-2">
            <h3 className="font-bold p-2 text-sm self-center">{title}</h3>
            {clues.map((clue, index) => (
                <GameClue key={clue.amount} {...clue} />
            ))}
        </div>
    );
};

export const GameBoard = () => {
    const status = useJeopardyStore((state) => state.status);
    console.log({ status });
    const cancelGame = useJeopardyStore((state) => state.cancelGame);
    if (!status) return null;
    return (
        <div className="grid h-screen bg-slate-800 text-slate-200 overflow-hidden grid-rows-[repeat(1,1fr),8rem,max-content] gap-2">
            <button
                className="fixed btn error-inter right-2 top-2"
                onClick={cancelGame}
            >
                X
            </button>
            <div className="grid grid-cols-6 gap-2 p-2">
                {status.clues.map((category, index) => (
                    <GameCategory
                        key={`${category.title}${index}`}
                        column={index}
                        selectable={!status.currentClue}
                        {...category}
                    />
                ))}
            </div>
            <div className="flex justify-evenly p-2 ">
                {status.players.map((player) => (
                    <GamePlayer key={player.name} {...player} />
                ))}
            </div>
            <div className="bg-slate-900 py-2 px-4">
                <b>{status.currentPlayer}</b> has control of the board.
            </div>
        </div>
    );
};
