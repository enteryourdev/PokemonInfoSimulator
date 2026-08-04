import { Pokemon, Move} from "./pokemon"
import { getEffectiveness } from "./type-chart";

interface Fighter {
    pokemon: Pokemon;
    currentHp: number;
}

const MAX_TURNS = 100;

export function calculateDamage(attacker: Pokemon, defender: Pokemon, move: Move): number{
    const power = move.power ?? 0;
    let atk = 0;
    let def = 0;
    switch (move.category) {
        case "physical":
            atk = attacker.stats.attack;
            def = defender.stats.defense;
            break;
        case "special":
            atk = attacker.stats.specialAttack;
            def = defender.stats.specialDefense;
            break;
        case "status":
            return 0;
    }
    return Math.round(power * (atk/def) * getEffectiveness(move.type, defender.types));
}

export function takeTurn(attacker: Fighter, defender: Fighter): void {
    const rdm = Math.floor(Math.random() * attacker.pokemon.moves.length);
    const randomMove = attacker.pokemon.moves[rdm];
    const damage = calculateDamage(attacker.pokemon, defender.pokemon, randomMove)
    defender.currentHp = Math.max(0, defender.currentHp - damage);
}