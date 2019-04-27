import axios from 'axios';

export function getPokemonsObj(lang) {

    const backendURL = '/tools/vgform/pokemon.php?code='+lang

    const myHeaders = {
        Accept: 'application/json'
    };

    try {
        return axios.get(backendURL, myHeaders)
    } catch (error) {
        console.error('error:', error)
    }
}

export function  getPokemonForms(pokeNumber, lang) {

    const backendURL = '/tools/vgform/pokemon-to-forms.php?code='+lang+'&id='+pokeNumber

    const myHeaders = {
        Accept: 'application/json'
    };

    try {
        return axios.get(backendURL, myHeaders)
    } catch (error) {
        console.error('error:', error)
    }

}