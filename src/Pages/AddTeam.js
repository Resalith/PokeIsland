import React, { Component } from "react";
import { Formik } from "formik";
import {
    Box,
    Button,
    FormField,
    Heading,
    Select,
    TextInput,
    RadioButtonGroup,
    RadioButton
} from "grommet";
import {getPokemonsObj, getPokemonForms, getNatures} from "../Functions/Backend";

export class AddTeam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            debug: true,
            error: {},
            submitted: false,
            allPokemon: {},
            pokemonList: [],
            filterPokemonList: [],
            genderSelected: '' ,
            gendersDisabled: true,
            natures: '',
            natureSelected: '',
            selectedPokemonForms: [],
            createPokemonObj: {
                number: null,
                name: '',
                nickName: '',
                form: '',
                gender: '',
                lv: 0,
                nature: '',
                item: '',
                stats: {
                    hp: 0,
                    attack: 0,
                    defense: 0,
                    specialAttack: 0,
                    specialDef: 0,
                    speed: 0
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
                });
            })
            .catch(error => {
                this.setState({ error, busy: false });
            });

        this.setState({ busy: true, response: {}, error: {}})
    }

    _onSelectPokemon(name){
        const pokemonSelected = this.state.allPokemon.find(pokemon => pokemon['pokemon'] === name)
        if (this.state.debug) console.log('Pokemon Selected', pokemonSelected.number)

        this.setState({
            createPokemonObj: {
                name: name,
                number: pokemonSelected.number,
                gender: pokemonSelected.gender,
                gendersDisabled: pokemonSelected.gender === 3 ? false : true
            }
        }, () => console.log("Pokemon Object Updated:", this.state.createPokemonObj) )
        this._getForms(pokemonSelected.number)
        this._getNatures()

    }

    _getForms(pokeNumber){
        let forms = []
        getPokemonForms(pokeNumber, 'es')
            .then(response => {
                //if (this.state.debug) console.log('Forms Response Data', response.data)
                forms = response.data.map(poke => poke['forms'])
                if (this.state.debug) console.log("Pokemon Forms: ", forms)

            })
            .catch(error => {
                this.setState({ error, busy: false });
            });
        return forms
    }

    _getNatures(){


        getNatures('es')
            .then(response => {
                if (this.state.debug) console.log('Natures Response Data', response.data)

                this.setState({
                    natures: response.data,
                    busy: false,
                });
            })
            .catch(error => {
                this.setState({ error, busy: false });
            });

    }

    _updatePokemonGender(gender){

        if (gender === 'Male'){
            this.setState({
                createPokemonObj: {gender: 1},
                genderSelected: gender
            })
        }else{
            this.setState({
                createPokemonObj: {gender: 2},
                genderSelected: gender
            })
        }

    }

    _updateNature(nature){
        const natureSelected = this.state.natures.find(n => n['nature'] === nature)
        console.log("NATURE SELECTED:", nature, natureSelected)

        this.setState({
            createPokemonObj: {nature: natureSelected.number},
            natureSelected: nature
        }, () => console.log("Nature Updated:", this.state.createPokemonObj.nature))
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
                                                onChange={({ option }) => this._onSelectPokemon(option)}
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

                                        <Box direction ="row">
                                            {this.state.createPokemonObj.gender === '3'
                                            ?
                                                (
                                                    <FormField label="Gender" error={errors.gender}>
                                                        <Select
                                                            name="gender"
                                                            disabled = {this.state.gendersDisabled}
                                                            size="medium"
                                                            placeholder="Select"
                                                            value={this.state.genderSelected}
                                                            options={['Male', 'Female']}
                                                            onChange={({ option }) => this._updatePokemonGender(option)}

                                                        />

                                                    </FormField>
                                                ):null
                                            }
                                            <FormField label="Nature" error={errors.nature}>
                                                <Select
                                                    name="nature"
                                                    size="medium"
                                                    placeholder="Select"
                                                    value={this.state.natureSelected}
                                                    options={this.state.natures? this.state.natures.map(nature => nature['nature']):[]}
                                                    onChange={({ option }) => this._updateNature(option)}

                                                />

                                            </FormField>
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
