// @ts-ignore
import words from "word-list-json";

const SECRET_WORDS = words
  .filter((word: string) => word.length === 5)
  .slice(0, 5000)
  .map((word: string) => word.toUpperCase());

export default SECRET_WORDS;
