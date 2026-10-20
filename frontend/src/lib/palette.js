// Deterministic accent colours for course / subject cards.
const palettes = [
  { bg: "bg-brand-50", text: "text-brand-600", ring: "group-hover:ring-brand-200", grad: "from-brand-500 to-violet-500" },
  { bg: "bg-emerald-50", text: "text-emerald-600", ring: "group-hover:ring-emerald-200", grad: "from-emerald-500 to-teal-500" },
  { bg: "bg-amber-50", text: "text-amber-600", ring: "group-hover:ring-amber-200", grad: "from-amber-500 to-orange-500" },
  { bg: "bg-rose-50", text: "text-rose-600", ring: "group-hover:ring-rose-200", grad: "from-rose-500 to-pink-500" },
  { bg: "bg-sky-50", text: "text-sky-600", ring: "group-hover:ring-sky-200", grad: "from-sky-500 to-cyan-500" },
  { bg: "bg-violet-50", text: "text-violet-600", ring: "group-hover:ring-violet-200", grad: "from-violet-500 to-fuchsia-500" },
];

export const paletteFor = (index) => palettes[index % palettes.length];

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
