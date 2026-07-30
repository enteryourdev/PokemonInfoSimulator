

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
    return stats.find(s => s.stat.name === name)?.base_stat ?? 0;
}
//deeper

export async function fetchPokemon(name: string | number): Promise<Pokemon | null> {
    let data: Pokemon;
    try {
        const response = (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`))

        if (!response.ok) return null;
        data = await response.json() as Pokemon;
    }catch (err){
        console.error(err);
        throw err;
    }
    return {
        name: data.name,
        id: data.id,
        types: data.types,
        stats: {
            hp: data.stats.hp,
            attack: data.stats.attack,
            defense: data.stats.defense,
            specialAttack: data.stats.specialAttack,
            specialDefense: data.stats.specialDefense,
            speed: data.stats.speed
        }
    }
}