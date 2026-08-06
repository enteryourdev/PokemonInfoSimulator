import { Pokemon, Move} from "./pokemon"
import { getEffectiveness } from "./type-chart";

interface Fighter {
    pokemon: Pokemon;
    currentHp: number;
}
export interface TurnResult {
    attacker: string;
    move: string;
    damage: number;
    effectiveness: number;
    defenderHpAfter: number;
}
export interface BattleResult {
    winner: string,
    turns: number
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

export function takeTurn(attacker: Fighter, defender: Fighter): TurnResult {
    const rdm = Math.floor(Math.random() * attacker.pokemon.moves.length);
    const randomMove = attacker.pokemon.moves[rdm];
    const damage = calculateDamage(attacker.pokemon, defender.pokemon, randomMove)
    defender.currentHp = Math.max(0, defender.currentHp - damage);

    return {
        attacker: attacker.pokemon.name,
        move: randomMove.name,
        damage: damage,
        effectiveness: getEffectiveness(randomMove.type, defender.pokemon.types),
        defenderHpAfter: defender.currentHp
    };
}

export function runBattle(a: Pokemon, b: Pokemon): BattleResult{
    const fighterA =  { pokemon: a, currentHp: a.stats.hp };
    const fighterB = { pokemon: b, currentHp: b.stats.hp };
    let turn = 0;

    while (fighterA.currentHp > 0 && fighterB.currentHp > 0 &&  turn < MAX_TURNS){
        takeTurn(fighterA, fighterB);
        turn++
        if (fighterB.currentHp <= 0) break;
        takeTurn(fighterB, fighterA);
        turn++
    }

    return {
        winner:fighterA.currentHp > 0 ? a.name : b.name,
        turns: turn
    }
}