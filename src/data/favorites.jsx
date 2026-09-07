import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);
const KEY = "lp-favorites";

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const value = useMemo(
    () => ({
      ids,
      open,
      setOpen,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle: (id) =>
        setIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id])),
    }),
    [ids, open],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
