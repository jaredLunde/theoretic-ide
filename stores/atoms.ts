import { atom } from "jotai";

export function persistAtom<Value>(
  key: string,
  initialValue: Value,
  {
    version = 1,
    storage = typeof window !== "undefined" ? localStorage : null,
  }: { version?: number; storage?: StateStorage | null } = {}
) {
  const lsValue: PersistAtomStorageValue<Value> = JSON.parse(
    storage?.getItem(key) ?? "null"
  );

  if (lsValue === null && storage) {
    storage.setItem(
      key,
      JSON.stringify({ value: initialValue, version: version })
    );
  } else if (lsValue && storage) {
    if (lsValue.version !== version) {
      storage.setItem(key, JSON.stringify({ value: initialValue, version }));
    }
  }

  const persistentAtom = atom<Value>(lsValue ? lsValue.value : initialValue);

  return atom<Value, Value>(
    (get) => {
      return get(persistentAtom);
    },
    (get, set, value) => {
      const storedState: PersistAtomStorageValue<Value> = { value, version };
      storage?.setItem(key, JSON.stringify(storedState));
      set(persistentAtom, value);
    }
  );
}

export type PersistAtomStorageValue<Value> = { version: number; value: Value };
export type StateStorage = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
};
