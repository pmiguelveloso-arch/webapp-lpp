const KEY = "compare_ids";
let listeners = new Set();

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids) {
  const arr = Array.from(new Set(ids)).slice(0, 3);
  localStorage.setItem(KEY, JSON.stringify(arr));
  listeners.forEach((fn) => fn(arr));
  return arr;
}

export function getCompareIds() {
  return read();
}

export function toggleCompareId(id) {
  const ids = read();
  return ids.includes(id)
    ? write(ids.filter((x) => x !== id))
    : write([...ids, id]);
}

export function removeCompareId(id) {
  return write(read().filter((x) => x !== id));
}

export function clearCompare() {
  return write([]);
}

export function subscribeCompare(fn) {
  listeners.add(fn);
  fn(read());
  return () => listeners.delete(fn);
}
