


export interface Pokemon {
  name: string | number;
  id: number;
}

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
        id: data.id
    }
}