import type { UIEvent } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PokemonCards from "../components/PokemonCards";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import type { Pokemon, PokemonListResponse, PokemonListItem } from "../types";

const API = "https://pokeapi.co/api/v2/pokemon?limit=20";


const fetchPokemonPage = async ({
  pageParam = API,
}): Promise<{ pokemon: Pokemon[]; next: string | null }> => {
  const res = await fetch(pageParam);
  if (!res.ok) throw new Error("Failed to fetch Pokémon list");

  const data: PokemonListResponse = await res.json();

  const detailedData = await Promise.all(
    data.results.map(async (p: PokemonListItem) => {
      const res = await fetch(p.url);
      if (!res.ok) throw new Error("Failed to fetch Pokémon details");
      return res.json();
    }),
  );

  return { pokemon: detailedData, next: data.next };
};


const fetchPokemonByName = async (name: string): Promise<Pokemon> => {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`,
  );
  if (!res.ok) throw new Error("Pokémon not found");
  return res.json();
};

export const PokemonListingPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => clearTimeout(handler);
  }, [search]);

  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: fetchPokemonPage,
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: API,
    staleTime: 1000 * 60 * 5,
  });

  
  const {
    data: searchedPokemon,
    isLoading: isSearching,
    isError: isSearchError,
  } = useQuery({
    queryKey: ["pokemon-search", debouncedSearch],
    queryFn: () => fetchPokemonByName(debouncedSearch),
    enabled: !!debouncedSearch,
  });

  const allPokemon = data?.pages.flatMap((page) => page.pokemon) || [];

  const displayPokemon = debouncedSearch
    ? searchedPokemon
      ? [searchedPokemon]
      : []
    : allPokemon;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (debouncedSearch) return; 

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading)
    return <div className="p-8 text-center text-lg">Loading...</div>;

  if (isError)
    return <div className="p-8 text-center text-red-500">{error.message}</div>;

  return (
    <div
      className="h-screen overflow-y-auto bg-gray-50 p-6"
      onScroll={handleScroll}
    >
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Pokémon
      </h1>

      <div className="mb-6 flex justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-200 text-gray-700 focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-lime-100"
          />
        </div>
      </div>

      {isSearching && (
        <div className="py-4 text-center text-gray-500">Searching...</div>
      )}

      {debouncedSearch && isSearchError && (
        <div className="py-4 text-center text-red-500">
          Pokémon not found
        </div>
      )}

      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {displayPokemon.map((p) => (
          <PokemonCards
            key={p.id}
            pokemonData={p}
            onClick={() => navigate(`/pokemon/${p.id}`)}
          />
        ))}
      </ul>

      {!debouncedSearch && isFetchingNextPage && (
        <div className="py-6 text-center text-gray-500">
          Loading more...
        </div>
      )}
    </div>
  );
};
