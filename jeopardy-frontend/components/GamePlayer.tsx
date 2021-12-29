import { useCallback } from "react";
import { getClue, Player, useJeopardyStore } from "../api/useJeopardyGame";

export const GamePlayer = ({ name, money }: Player) => {
    const currentClue = useJeopardyStore(
        useCallback((state) => state.status?.currentClue, [])
    );

    const amount = useJeopardyStore(
        useCallback(
            (state) => getClue(state.status!!.clues, currentClue),
            [currentClue]
        )
    )?.amount;

    const modifyMoney = useJeopardyStore((state) => state.modifyMoney);

    return (
        <div className="bg-jep-blue w-64 text-center flex flex-col p-2 rounded-sm shadow-lg">
            <h2 className="font-bold text-2xl mb-auto">{name}</h2>
            <span className={`font-bold ${money < 0 ? "text-red-600" : ""}`}>
                {money >= 0 ? `$${money}` : `-$${Math.abs(money)}`}
            </span>
            {amount && (
                <div className="flex justify-around">
                    <button
                        className="btn error-inter"
                        onClick={() =>
                            modifyMoney(name, (prev) => prev - amount)
                        }
                    >
                        -{amount}
                    </button>
                    <button
                        className="btn success-inter"
                        onClick={() =>
                            modifyMoney(name, (prev) => prev + amount)
                        }
                    >
                        +{amount}
                    </button>
                </div>
            )}
        </div>
    );
};
