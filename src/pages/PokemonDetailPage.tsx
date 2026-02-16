import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Pokemon } from "../types";

const fetchPokemonDetail = async (id: string): Promise<Pokemon> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon details");
  return res.json();
};

export const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: pokemon, isLoading, isError, error } = useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => fetchPokemonDetail(id!),
    enabled: !!id,
  });

  if (isLoading)
    return <div className="p-8 text-center text-lg">Loading...</div>;

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );

  if (!pokemon)
    return (
      <div className="p-8 text-center text-lg">Pokémon not found</div>
    );

  const imgSrc =
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate("/")}
        className="mb-6 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
      >
        ← Back
      </button>

      <div className="mx-auto max-w-3xl rounded-lg border bg-white p-8">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold capitalize">
            {pokemon.name}
          </h1>
          
        </div>

        <img
          src={imgSrc ?? ""}
          alt={pokemon.name}
          className="mx-auto mb-6 h-48 w-48 object-contain"
        />

        <div className="mb-6 grid grid-cols-2 gap-4 text-center">
          <div className="rounded bg-gray-50 p-3">
            <p className="text-xs text-gray-600">Height</p>
            <p className="text-lg font-semibold">{(pokemon.height / 10).toFixed(1)} m</p>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <p className="text-xs text-gray-600">Weight</p>
            <p className="text-lg font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</p>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <p className="text-xs text-gray-600">Base Exp</p>
            <p className="text-lg font-semibold">{pokemon.base_experience}</p>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <p className="text-xs text-gray-600">Pokédex ID</p>
            <p className="text-lg font-semibold">{pokemon.id}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Type</h3>
          <div className="flex justify-center gap-2">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold capitalize text-blue-700"
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Stats</h3>
          <div className="space-y-3">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="capitalize text-gray-700">{s.stat.name}</span>
                  <span className="font-semibold">{s.base_stat}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{
                      width: `${Math.min((s.base_stat / 150) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">
            Abilities
          </h3>
          <div className="space-y-2">
            {pokemon.abilities.map((a) => (
              <div
                key={a.ability.name}
                className="rounded bg-gray-50 px-3 py-2 capitalize text-gray-700"
              >
                {a.ability.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
