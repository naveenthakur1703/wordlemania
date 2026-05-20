// @ts-ignore
import words from "word-list-json";

const VALID_WORDS = words
  .filter((word: string) => word.length === 5)
  .map((word: string) => word.toUpperCase());

export default VALID_WORDS;
