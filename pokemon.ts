


export interface Pokemon {
  name: string;
  id: number;
}

export async function fetchPokemon(name: string): Promise<Pokemon | null> {
    let data: Pokemon;
    try {
        const response = (await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`))
        data = await response.json() as Pokemon;
    }catch (err){
        console.error(err);
        throw err;
    }
    return data as Pokemon;
}