export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: {
    ability: {
      name: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      dream_world: {
        front_default: string | null;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
    };
  }[];
}
