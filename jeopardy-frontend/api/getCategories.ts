import { Category, Clue, GameClues } from "./useJeopardyGame";

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

interface ServerClue {
    title: string;
    hint: string | null;
    clues: { prompt: string; answer: string }[];
}

const verifyClues = (data: any): ServerClue[] => {
    if (Array.isArray(data)) return data as ServerClue[];
    else throw new Error("Response from server is invalid.");
};

export const getCategories = async (): Promise<GameClues> => {
    const response = await fetch("https://jeopardy-api.kthomas.me/6");
    const data = await response.json();
    const categories = verifyClues(data);

    const finalCategories: Category[] = categories.map(
        ({ clues, hint, title }, catIndex) => ({
            title,
            clues: clues.map(
                ({ answer, prompt }, clueIndex) =>
                    ({
                        prompt,
                        answer,
                        amount: (clueIndex + 1) * 100,
                        found: false,
                        active: false,
                        dailyDouble: false,
                        position: [catIndex, clueIndex],
                    } as Clue)
            ),
        })
    );
    return finalCategories as GameClues;
};
