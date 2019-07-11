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

export function  getPokemonMoves(pokeNumber, form, lang) {


    const backendURL = `/tools/vgform/pokemon-to-moves.php?code=${lang}&id=${pokeNumber}&forme=${form}`


    const myHeaders = {
        Accept: 'application/json'
    };

    try {
        return axios.get(backendURL, myHeaders)
    } catch (error) {
        console.error('error:', error)
    }

}

export function  getNatures(lang) {

    const backendURL = '/tools/vgform/nature.php?code='+lang

    const myHeaders = {
        Accept: 'application/json'
    };

    try {
        return axios.get(backendURL, myHeaders)
    } catch (error) {
        console.error('error:', error)
    }

}

export function  getStats(p, f, n, l) {

    const backendURL = `/tools/vgform/pokemon-stat-max-min.php?p=${p}&f=${f}&n=${n}&l=${l}`

    const myHeaders = {
        Accept: 'application/json'
    };

    try {
        return axios.get(backendURL, myHeaders)
    } catch (error) {
        console.error('error:', error)
    }

}


export function  getItems(lang) {

    const backendURL = '/tools/vgform/items.php?code='+lang

    const myHeaders = {
        Accept: 'application/json'
    };

    try {
        return axios.get(backendURL, myHeaders)
    } catch (error) {
        console.error('error:', error)
    }

}