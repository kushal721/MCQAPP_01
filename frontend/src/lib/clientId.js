// There are no user accounts yet, so each browser gets a stable random ID
// (shaped like a MongoDB ObjectId) that progress is tracked against.
const KEY = "mcq-client-id";

const randomObjectId = () => {
  const bytes = new Uint8Array(12);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

let memoryId;

export const getClientId = () => {
  try {
    let id = window.localStorage.getItem(KEY);
    if (!/^[0-9a-f]{24}$/.test(id || "")) {
      id = randomObjectId();
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (e.g. private mode): keep an ID for this tab only.
    memoryId = memoryId || randomObjectId();
    return memoryId;
  }
};
