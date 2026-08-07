import * as types from './type-chart';
import * as pokemon from './pokemon';

/*export interface Pokemon {
  name: string;
  id: number;
  types: PokemonType[],
  stats: Stats;
  moves: Move[];
}

    name: string,
    power: number | null, // null is for the buff type moves later on. Ship A first
    type: PokemonType,
    category: "physical" | "special" | "status";
  */

export const CUSTOM_POKEMON: pokemon.Pokemon = {
    name: "Justin",
    id: 1337,
    types: ["normal"],
    stats: {
        hp: 100000,
        attack: 50,
        defense: 100,
        specialAttack: 10,
        specialDefense: 100,
        speed: 1,
    },
    moves: [{
        name: "bleh",
        power: 10,
        type: "normal",
        category: "physical"
    }]
};