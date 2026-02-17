import type { Pokemon } from "../types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CardProps {
  pokemonData: Pokemon;
  onClick: () => void;
}

const PokemonCards = ({ pokemonData, onClick }: CardProps) => {
  const imgSrc =
    pokemonData.sprites.other.dream_world.front_default ||
    pokemonData.sprites.front_default;

  return (
    <Card className="w-full transition hover:-translate-y-1 hover:shadow-lg bg-yellow-50">
      <CardContent className="flex flex-col items-center p-4">
        <img
          src={imgSrc ?? ""}
          alt={pokemonData.name}
          className="h-24 w-24 object-contain"
        />
        <h2 className="mt-2 text-sm font-semibold capitalize text-muted-foreground">
          {pokemonData.name}
        </h2>
      </CardContent>

      <CardFooter className="flex justify-center p-4 pt-0">
        <Button onClick={onClick} className="w-min">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PokemonCards;
