import { useJeopardyStore } from "../api/useJeopardyGame";
import { CreateGame } from "./CreateGame";
import { GameBoard } from "./GameBoard";

export const GameScreen = () => {
    // const { gameStatus } = useJeopardyGame();
    const status = useJeopardyStore((state) => state.status);

    if (status === null) return <CreateGame />;

    return <GameBoard />;
};
