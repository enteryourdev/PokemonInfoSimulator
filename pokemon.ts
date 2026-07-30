


interface PokeApiResponse {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

export interface Pokemon {
  name: string;
  id: number;
  types: string[],
  stats: Stats;
}

export interface Stats {
    hp: number,
    attack: number,
    defense: number,
    specialAttack: number,
    specialDefense: number,
    speed: number,
    //moves: Move[]
}

export interface Move {
    name: string,
    power: number,
    type: string,
    category: "physical" | "special"
}

function getStat(stats: PokeApiResponse["stats"], name: string): number{
    return stats.find(s => s.stat.name === name)?.base_stat ?? 0;// this finds the api response
}
//deeper

export async function fetchPokemon(name: string | number): Promise<Pokemon | null> {
    let raw: PokeApiResponse;
    try {
        const response = (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`))

        if (!response.ok) return null;
        raw = await response.json() as PokeApiResponse;
    }catch (err){
        console.error(err);
        throw err;
    }
    return {
        name: raw.name,
        id: raw.id,
        types: raw.types.map(t => t.type.name),
        stats: {
            hp: getStat(raw.stats, "hp"),
            attack: getStat(raw.stats, "attack"),
            defense: getStat(raw.stats, "defense"),
            specialAttack: getStat(raw.stats, "special-Attack"),
            specialDefense: getStat(raw.stats, "special-Defense"),
            speed: getStat(raw.stats, "speed")
        }
    }
}