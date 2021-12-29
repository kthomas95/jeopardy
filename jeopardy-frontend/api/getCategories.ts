import { Category, GameClues } from "./useJeopardyGame";

const EMPTY_CAT = (column: number): Category => ({
    title: "Category",
    clues: Array(5)
        .fill(undefined)
        .map((_, index) => ({
            answer: "Who is buddy?",
            dailyDouble: false,
            prompt: "This dog is the greatest dog ever.",
            amount: (index + 1) * 100,
            found: false,
            position: [column, index],
            active: false,
        })),
});

export const getCategories = async (): Promise<GameClues> => {
    return Array(6)
        .fill(undefined)
        .map((_, index) => EMPTY_CAT(index)) as GameClues;
};
