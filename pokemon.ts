import { PokemonType } from "./type-chart";


interface PokeApiResponse {
  name: string;
  id: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

interface MoveApiResponse {
    name: string;
    id: number;
    type: { name: PokemonType };
    damage_class: { name: "physical" | "special" | "status" };
    power: number | null;
    priority: number;
    accuracy: number | null;
    moves: { move: { name: string } }[];
    //effect_chance: number;

}

export interface Pokemon {
  name: string;
  id: number;
  types: string[],
  stats: Stats;
  moves: Move[];
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
    power: number | null, // null is for the buff type moves later on. Ship A first
    type: PokemonType,
    category: "physical" | "special" | "status";
}
const TACKLE: Move = { name: "tackle", type: "normal", power: 40, category: "physical" }; // default attack for fallback

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
            specialAttack: getStat(raw.stats, "special-attack"),
            specialDefense: getStat(raw.stats, "special-defense"),
            speed: getStat(raw.stats, "speed")
        }
    }
}

export async function fetchMove(name: string): Promise<Move | null>{
    let raw: MoveApiResponse;

    try{
        const response = await fetch(`https://pokeapi.co/api/v2/move/${name}`)
        if (!response.ok) return null;
        raw = await response.json() as MoveApiResponse;
    }catch (err){
        console.error(err);
        throw err;
    }
    return {
        name: raw.name,
        power: raw.power,
        type: raw.type.name,
        category: raw.damage_class.name
    }
}