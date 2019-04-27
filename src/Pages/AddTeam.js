import React, { Component } from "react";
import { Formik } from "formik";
import {
    Box,
    Button,
    FormField,
    Heading,
    Select,
    TextInput,
} from "grommet";
import {getPokemonsObj, getPokemonForms} from "../Functions/Backend";

export class AddTeam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            debug: true,
            error: {},
            submitted: false,
            allPokemon: {},
            name: '',
            pokemonList: [],
            filterPokemonList: [],
            pokemonsObj: [],
            selectedPokemonForms: [],
            createPokemonObj: {
                number: 0,
                name: '',
                nickName: '',
                form: '',
                gender: undefined,
                lv: 0,
                nature: undefined,
                item: undefined,
                stats: {
                    hp: undefined,
                    attack: undefined,
                    defense: undefined,
                    specialAttack: undefined,
                    specialDef: undefined,
                    speed: undefined
                },

            }
        };
    }

    componentDidMount() {
        getPokemonsObj('es')
            .then(response => {
                if (this.state.debug) console.log('All Pokemon Response Data', response.data)

                this.setState({
                    allPokemon: response.data,
                    busy: false,
                    pokemonList: response.data.map(poke => poke['pokemon']),
                    filterPokemonList: response.data.map(poke => poke['pokemon']),
                }, () => console.log("ALL POKEMON: ", this.state.allPokemon));
            })
            .catch(error => {
                this.setState({ error, busy: false });
            });
        this.setState({ busy: true, response: {}, error: {}})
    }

    _updatePokeBasicOptions(name){
        console.log("Updating Basic Options")
        const pokemonSelected = this.state.allPokemon.find(pokemon => pokemon.pokemon === name)

        this.setState({
            createPokemonObj: {
                name: name,
                number: pokemonSelected.number,
                gender: (pokemonSelected.gender === '3' ? null : pokemonSelected.gender)
            }
        }, () => this._getForms(pokemonSelected.number))
    }

    _getForms(pokeNumber){
        getPokemonForms(pokeNumber, 'es')
            .then(response => {
                if (this.state.debug) console.log('Forms Response Data', response.data)

                this.setState({
                    selectedPokemonForms: response.data.map(poke => poke['forms']),
                    busy: false,
                }, () => console.log("Pokemon Forms: ", this.state.selectedPokemonForms));
            })
            .catch(error => {
                this.setState({ error, busy: false });
            });
    }




    render() {
        const { submitted } = this.state;
        return (
                <Box align="start">
                    <Box width="medium" margin="large">
                        <Heading>Add a Pokemon</Heading>
                        <Formik
                            validate={values => {
                                const errors = {};
                                if (!values.name) {
                                    errors.name = "required";
                                }
                                return errors;
                            }}
                            validateOnBlur={submitted}
                            validateOnChange={submitted}
                            onSubmit={(values, { setSubmitting }) => {
                                // whatever submitting the form should entail
                                alert("Submitting\n" + JSON.stringify(values, null, 2));
                                setSubmitting();
                            }}
                        >
                            {({
                                  values,
                                  errors,
                                  handleChange,
                                  handleSubmit,
                                  setFieldValue
                              }) => (
                                <form
                                    onSubmit={event => {
                                        event.preventDefault();
                                        this.setState({ submitted: true });
                                        handleSubmit();
                                    }}
                                >
                                    <Box direction="row">
                                        <FormField label="Name" error={errors.name}>
                                            <Select
                                                name="name"
                                                size="medium"
                                                placeholder="Select"
                                                value={this.state.createPokemonObj.name}
                                                options={this.state.filterPokemonList}
                                                onChange={({ option }) => this._updatePokeBasicOptions(option)}
                                                onClose={() => this.setState({ filterPokemonList: this.state.pokemonList })}
                                                onSearch={text => {
                                                    const exp = new RegExp(text, "i");
                                                    this.setState({
                                                        filterPokemonList: this.state.pokemonList.filter(o => exp.test(o))
                                                    }, () => console.log("onSearch:", text));
                                                }}
                                            />
                                        </FormField>
                                        <Box pad={{left: 'small' ,top:'xxsmall'}} direction ="row">
                                        <FormField label="Nickname" error={errors.nickName}>
                                            <TextInput
                                                name="nickName"
                                                value={this.state.createPokemonObj.nickName || ""}
                                                onChange={({ option }) => this.setState({ createPokemonObj: {nickname: option} })}
                                            />
                                        </FormField>
                                        </Box>
                                    </Box>
                                    <Box
                                        tag="footer"
                                        margin={{ top: "medium" }}
                                        direction="row"
                                        justify="between"
                                    >
                                        <Button label="Cancel" color="neutral-1" />
                                        <Button type="submit" primary label="Add Pokemon" color="neutral-1"/>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    </Box>
                </Box>
        );
    }

}
