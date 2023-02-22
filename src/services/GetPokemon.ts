import axios from 'axios';

import { Constants } from '../utils/constants';

async function GetPokemon(i: number) {
    try {
        const response = await axios.get(`${Constants.GET_ALL_POKEMONS_URL}/${i}`);
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default GetPokemon;