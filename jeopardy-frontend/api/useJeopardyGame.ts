import create from "zustand";
import { getCategories } from "./getCategories";

/** Represents a clue square on the board. */
export interface Clue {
    prompt: string;
    answer: string;
    amount: number;
    found: boolean;
    dailyDouble: boolean;
    position: [number, number];
    active: boolean;
}

/** A category contains a title and 5 clues with increasing cash values. */
export interface Category {
    title: string;
    clues: Clue[];
}

/** A jeopardy board consists of 6 category columns. */
export type GameClues = [
    Category,
    Category,
    Category,
    Category,
    Category,
    Category
];

/** A player has a name and their current cash value. */
export interface Player {
    name: string;
    money: number;
}

export interface ActiveGame {
    players: Player[];
    round: "single" | "double" | "final";
    clues: GameClues;
    currentPlayer: string;
    currentClue?: [number, number];
}

export type GameStatus = null | ActiveGame;

interface JeopardyStore {
    status: GameStatus;
    createGame: (players: string[]) => Promise<void>;
    cancelGame: () => void;
    selectClue: (position: [number, number]) => void;
    modifyMoney: (playerName: string, amount: (prev: number) => number) => void;
    finishClue: (position: [number, number]) => void;
}

export const getClue = (
    clues: GameClues,
    position?: [number, number]
): Clue | undefined =>
    position ? clues[position[0]].clues[position[1]] : undefined;

export const useJeopardyStore = create<JeopardyStore>((set) => ({
    status: null,
    createGame: async (players) => {
        const clues = await getCategories();

        set((state) => ({
            status: {
                players: players.map((name) => ({ name, money: 0 })),
                round: "single",
                clues,
                currentPlayer: players[0],
            },
        }));
    },
    cancelGame: () => set((state) => ({ status: null })),
    selectClue: (position: [number, number]) =>
        set((state) => ({
            status: {
                ...state.status,
                currentClue: position,
            } as GameStatus,
        })),
    modifyMoney: (playerName, amount) =>
        set((state) => ({
            status: {
                ...state.status,
                currentPlayer:
                    amount(0) > 0 ? playerName : state.status!!.currentPlayer,
                players: state.status!!.players.map((player) =>
                    player.name === playerName
                        ? { ...player, money: amount(player.money) }
                        : player
                ),
            } as GameStatus,
        })),
    finishClue: (position) =>
        set((state) => {
            console.log("finishClue");
            state.status!!.clues[position[0]].clues[position[1]].found = true;
            state.status!!.currentClue = undefined;
            return {
                status: {
                    ...state.status,
                    currentClue: undefined,
                } as GameStatus,
            };
        }),
}));
