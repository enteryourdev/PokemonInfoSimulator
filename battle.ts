import { Pokemon, Move} from "./pokemon"
import { getEffectiveness } from "./type-chart";

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