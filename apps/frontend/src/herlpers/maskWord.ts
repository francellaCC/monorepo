export function maskWord(word: string): string {
  return word.split("").map(char => (char === " " ? " " : "_")).join(" ");
}
