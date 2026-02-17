import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Pokemon } from "../types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchPokemonDetail = async (id: string): Promise<Pokemon> => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error("Failed to fetch Pokémon details");
  return res.json();
};
const InfoBox = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-xl border-black bg-red-400 p-3">
    <p className="text-xs text-white">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);

export const PokemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useQuery({
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
    return <div className="p-8 text-center text-lg">Pokémon not found</div>;

  const imgSrc =
    pokemon.sprites.other.dream_world.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <Card className="mx-auto w-full max-w-2xl md:max-w-3xl lg:max-w-5xl transition hover:shadow-lg bg-yellow-50">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-2xl font-bold capitalize md:text-3xl text-red-900">
              {pokemon.name}
            </h1>
          </div>

          <img
            src={imgSrc ?? ""}
            alt={pokemon.name}
            className="mx-auto mb-6 h-40 w-40 object-contain md:h-48 md:w-48"
          />

          
          <div className="mb-6 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <InfoBox
              label="Height"
              value={`${(pokemon.height / 10).toFixed(1)} m`}
            />
            <InfoBox
              label="Weight"
              value={`${(pokemon.weight / 10).toFixed(1)} kg`}
            />
            <InfoBox label="Base Exp" value={pokemon.base_experience} />
            <InfoBox label="Pokédex ID" value={pokemon.id} />
          </div>

          
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-red-900">Type</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="rounded-full bg-red-500 px-4 py-1 text-sm font-semibold capitalize text-white"
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          
          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-red-900">Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((s) => (
                <div key={s.stat.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="capitalize text-red-900">
                      {s.stat.name}
                    </span>
                    <span className="font-semibold">{s.base_stat}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-600"
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
            <h3 className="mb-3 font-semibold text-red-900">Abilities</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {pokemon.abilities.map((a) => (
                <div
                  key={a.ability.name}
                  className="rounded bg-red-400 px-3 py-2 capitalize text-white"
                >
                  {a.ability.name}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center p-6 pt-0 text-center text-white">
          <Button onClick={() => navigate("/")}>Back to List</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
