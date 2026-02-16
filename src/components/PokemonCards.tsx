import type { Pokemon } from "../types";

interface CardProps {
  pokemonData: Pokemon;
  onClick: () => void;
}

const PokemonCards = ({ pokemonData, onClick }: CardProps) => {
  const imgSrc =
    pokemonData.sprites.other.dream_world.front_default ||
    pokemonData.sprites.front_default;

  return (
    <li
      onClick={onClick}
      className="w-full cursor-pointer rounded-lg border bg-white p-4 text-center transition hover:-translate-y-1 hover:shadow"
    >
      <img
        src={imgSrc ?? ""}
        alt={pokemonData.name}
        className="mx-auto h-24 w-24 object-contain"
      />
      <h2 className="mt-2 text-sm font-semibold capitalize text-gray-700">
        {pokemonData.name}
      </h2>
    </li>
  );
};

export default PokemonCards;
