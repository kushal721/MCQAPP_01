export const initials = (name = "") => {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const [word] = words;
    // Keep short acronyms like "IOE" whole; otherwise use the first two letters.
    return (/^[A-Z]{2,4}$/.test(word) ? word : word.slice(0, 2)).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

export const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
