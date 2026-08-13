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
    turns: number,
    log: TurnResult[]
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
    return Math.max(1, Math.round(power * (atk/def) / 8 * getEffectiveness(move.type, defender.types))); // changed to make the fight last longer.
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
    const log: TurnResult[] = [];

    while (fighterA.currentHp > 0 && fighterB.currentHp > 0 &&  turn < MAX_TURNS){
        log.push(takeTurn(fighterA, fighterB));
        turn++
        if (fighterB.currentHp <= 0) break;
        log.push(takeTurn(fighterB, fighterA));
        turn++
    }

    return {
        winner:fighterA.currentHp > 0 ? a.name : b.name,
        turns: turn,
        log: log
    }
}

export function runMultiBattle(a: Pokemon[], b: Pokemon[]): BattleResult{
    const fightersA = a.map(p => ({ pokemon: p, currentHp: p.stats.hp }));
    const fightersB = b.map(p => ({ pokemon: p, currentHp: p.stats.hp }));
    let turn = 0;
    const results: BattleResult[] = [];

    while (fightersA.some(f => f.currentHp > 0) && fightersB.some(f => f.currentHp > 0) && turn < MAX_TURNS){
        const fighterA = fightersA.find(f => f.currentHp > 0);
        takeTurn(fighterA!, fightersB.find(f => f.currentHp > 0)!);
        turn++;
        const fighterB = fightersB.find(f => f.currentHp > 0);
        takeTurn(fighterB!, fightersA.find(f => f.currentHp > 0)!);
        turn++;
        if (!fighterA || !fighterB) break;
    }

    return {
        winner: fightersA.some(f => f.currentHp > 0) ? "Team A" : "Team B",
        turns: turn,
        log: [] 
    }


}
