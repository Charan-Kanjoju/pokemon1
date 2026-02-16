import { useState } from "react";
import type { UIEvent } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Cards from "./PokemonCards";
import type {
  Pokemon,
  PokemonListResponse,
  PokemonListItem,
} from "./types";

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

export const Poke = () => {
  const [selectedPokemon, setSelectedPokemon] =
    useState<Pokemon | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<{ pokemon: Pokemon[]; next: string | null }, Error>({
    queryKey: ["pokemon"],
    queryFn: fetchPokemonPage,
    getNextPageParam: (lastPage) => lastPage.next,
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

 

  if (selectedPokemon) {
    const imgSrc =
      selectedPokemon.sprites.other.dream_world.front_default ||
      selectedPokemon.sprites.front_default;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <button
          onClick={() => setSelectedPokemon(null)}
          className="mb-6 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          ← Back
        </button>

        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 text-center">
          <h1 className="mb-4 text-2xl font-bold capitalize">
            {selectedPokemon.name}
          </h1>

          <img
            src={imgSrc ?? ""}
            alt={selectedPokemon.name}
            className="mx-auto mb-4 h-40 w-40 object-contain"
          />

          <p className="text-gray-600">
            Height: {selectedPokemon.height}
          </p>
          <p className="text-gray-600">
            Weight: {selectedPokemon.weight}
          </p>

          <div className="mt-3 flex justify-center gap-2">
            {selectedPokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="rounded bg-gray-200 px-2 py-1 text-xs capitalize"
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold">
              Abilities
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedPokemon.abilities.map((a) => (
                <li key={a.ability.name} className="capitalize">
                  {a.ability.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }



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
          <Cards
            key={p.id}
            pokemonData={p}
            onClick={() => setSelectedPokemon(p)}
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
