// context/SearchContext.tsx
import { createContext, useContext, useState, type ReactNode,  } from "react";

interface SearchContextProps {
  query: string;
  setQuery: (q: string) => void;
}

const SearchContext = createContext<SearchContextProps>({
  query: "",
  setQuery: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState("");

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
