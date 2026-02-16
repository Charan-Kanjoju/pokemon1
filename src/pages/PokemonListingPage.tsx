import type { UIEvent } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PokemonCards from "../components/PokemonCards";
import type {
  Pokemon,
  PokemonListResponse,
  PokemonListItem,
} from "../types";

const API = "https://pokeapi.co/api/v2/pokemon?limit=50";

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
    })
  );

  return { pokemon: detailedData, next: data.next };
};

export const PokemonListingPage = () => {
  const navigate = useNavigate();

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
  });

  const allPokemon =
    data?.pages.flatMap((page) => page.pokemon) || [];

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading)
    return <div className="p-8 text-center text-lg">Loading...</div>;

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        {error.message}
      </div>
    );

  return (
    <div
      className="h-screen overflow-y-auto bg-gray-50 p-6"
      onScroll={handleScroll}
    >
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Pokémon
      </h1>

      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {allPokemon.map((p) => (
          <PokemonCards
            key={p.id}
            pokemonData={p}
            onClick={() => navigate(`/pokemon/${p.id}`)}
          />
        ))}
      </ul>

      {isFetchingNextPage && (
        <div className="py-6 text-center text-gray-500">
          Loading more...
        </div>
      )}
    </div>
  );
};
