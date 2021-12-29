import { useState } from "react";
import { useJeopardyStore } from "../api/useJeopardyGame";

export const CreateGame = () => {
    const createGame = useJeopardyStore((state) => state.createGame);
    const [players, setPlayers] = useState(["Kyle"] as string[]);

    const [newPlayer, setNewPlayer] = useState("");
    const addPlayer = () => {
        if (newPlayer === "") return;
        setPlayers((prev) => [...prev, newPlayer]);
        setNewPlayer("");
    };

    const removePlayer = (index: number) =>
        setPlayers((prev) => [
            ...prev.slice(0, index),
            ...prev.slice(index + 1),
        ]);

    return (
        <div className="flex p-2 flex-col gap-2 bg-gray-300 text-gray-700 m-2 md:m-8 rounded-md shadow-xl">
            <h1 className="text-4xl  font-bold m-3 text-center">
                Play Jeopardy!
            </h1>
            <ul className="list-disc list-inside flex flex-col gap-2">
                {players.map((player, index) => (
                    <li key={player} className="list-disc list-item">
                        {player}
                        <button
                            className="btn float-right error-inter !bg-opacity-60"
                            onClick={() => removePlayer(index)}
                        >
                            Remove Player
                        </button>
                    </li>
                ))}
            </ul>
            <form
                className="group"
                onSubmit={(e) => {
                    e.preventDefault();
                    addPlayer();
                }}
            >
                <input
                    type="text"
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.currentTarget.value)}
                    className="rounded-l-md px-2 bg-gray-100 peer ring-2 ring-gray-100 focus:ring-blue-400"
                    placeholder="Player Name"
                />
                <button className="btn primary-inter !rounded-l-none ring-2">
                    Add Player
                </button>
            </form>
            <button
                className="btn success-inter"
                onClick={() => createGame(players)}
            >
                Create Game
            </button>
        </div>
    );
};
