import sqlite3
import re
from dataclasses import dataclass
from pathlib import Path
import json
from typing import Tuple

con = sqlite3.connect("jarchive.db")


def convert_clue_prompt(val: str) -> Tuple[str, str | None]:
    result = re.search(r"(\(.*\))", val)
    if result is None:
        return val, None

    for r in result.groups():
        val = val.replace(r, "")
        return val.strip(), r

    return val, None


@dataclass()
class Category:
    def __init__(self, val: str, season: str, url: str):
        self.title, self.hint = convert_clue_prompt(val)
        self.season = season
        self.url = url
        self.clues: list[Clue] = list()

    def __str__(self):
        return f"{self.title}: {self.hint} (Season {self.season})"

    def __hash__(self) -> int:
        return hash((self.title, self.hint, self.season, self.url))

    def __toJson__(self) -> dict[str, str | list[dict[str, str]]]:
        clues = list(
            map(lambda x: {"prompt": x.prompt, "answer": x.answer}, self.clues)
        )

        output = {"clues": clues, "title": self.title}
        if self.hint is not None:
            output["hint"] = self.hint
        return output


class Clue:
    def __init__(self, prompt: str, answer: str, value: int):
        self.prompt = prompt
        self.answer = answer
        self.value = value

    def __str__(self) -> str:
        return f"{self.prompt}: [{self.value}] (Answer: {self.answer})"

    def __repr__(self) -> str:
        return self.__str__()

    def __tojson__(self) -> dict[str, str]:
        return {"prompt": self.prompt, "answer": self.answer}


Categories = dict[Category, list[Clue]]


def load_clues() -> Categories:
    categories: Categories = dict()

    for value, category, clue, answer, url, season, round in con.execute(
        "select value,category,clue,answer,game.url,season,round from question, game where game.url = question.url"
    ):
        if round == 3:
            pass
        else:
            cat = Category(category, season, url)
            categories[cat] = categories.get(cat, list()) + [Clue(clue, answer, value)]

    return categories


Seasons = dict[str, list[Category]]


def sort_clues(clues: list[Clue]):
    for index, clue in enumerate(clues):
        if clue.value is None:
            if index == 0:
                clue.value = 0
            elif index == 4:
                clue.value = 3000
            else:
                clue.value = int((clues[index - 1].value + clues[index + 1].value) / 2)

    clues.sort(key=lambda x: x.value)
    return clues


def get_seasons(categories: Categories) -> Seasons:
    valid: Seasons = dict()
    dups = 0
    invalid = 0
    for cat, clues in categories.items():
        if len(clues) % 5 != 0:
            invalid += 1
        elif len(clues) > 5:
            dups += 1
        else:
            cat.clues = sort_clues(clues)
            valid[cat.season] = valid.get(cat.season, list()) + [cat]

    print("Invalid: ", invalid)
    print("Dups: ", dups)
    return valid


def save_items(valid: Seasons):
    Path("questions").mkdir(parents=True, exist_ok=True)
    for season, cats in valid.items():
        for cat in cats:
            if len(cat.clues) != 5:
                print("Error!!!")
        print(f"{season}: {len(cats)}")
        output = list(map(lambda x: x.__toJson__(), cats))

        json.dump(output, open(f"questions/{season}.json", "w"), separators=(",", ":"))


def create_files():
    categories = load_clues()
    seasons = get_seasons(categories)
    save_items(seasons)
