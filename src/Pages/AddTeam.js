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
    RadioButton,
    CheckBox
} from "grommet";
import {getPokemonsObj, getPokemonForms, getNatures, getItems} from "../Functions/Backend";

export class AddTeam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            busy: false,
            debug: true,
            error: {},
            submitted: false,
            allPokemon: {},
            forms: [],
            allItemsObj: [],
            filterItems: [],
            itemsList: [],
            itemSelected: '',
            pokemonList: [],
            filterPokemonList: [],
            gendersDisabled: false,
            natures: [],
            allNaturesObj: null,
            natureSelected: '',
            formSelected: '',
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

        this.setState({
            gendersDisabled: pokemonSelected.gender === "3" ? false : true,
            createPokemonObj: {
                ...this.state.createPokemonObj,
                name: name,
                number: pokemonSelected.number,
                gender: pokemonSelected.gender,
            }
        })
        this._getNatures()
        this._getForms(pokemonSelected.number)
        this._getItems()

    }

    _onSelectItem(value){
        const itemSelected = this.state.allItemsObj.find(item => item['item'] === value)

        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                item: itemSelected.number
            },
            itemSelected: itemSelected.item
        }, () => console.log("Pokemon Item Updated: ", this.state.createPokemonObj))
    }

    _getForms(pokeNumber){
        let forms = []
        getPokemonForms(pokeNumber, 'es')
            .then(response => {
                //if (this.state.debug) console.log('Forms Response Data', response.data)
                forms = response.data.map(poke => poke['forms'])
                if (this.state.debug) console.log("Pokemon Forms: ", forms)
                this.setState({
                    forms: response.data
                }, () => console.log("Forms Available: ", this.state.forms))

            })
            .catch(error => {
                this.setState({ error, busy: false });
            });
        return forms
    }

    _getItems(){
        getItems('es')
            .then(response => {
                this.setState({
                    allItemsObj: response.data,
                    itemsList: response.data.map(item => item['item']),
                    filterItems: response.data.map(item => item['item']),
                }, () => console.log("Items Available: ", this.state.itemsList))

            })
            .catch(error => {
                this.setState({ error, busy: false });
            });
    }

    _getNatures(){


        getNatures('es')
            .then(response => {
                if (this.state.debug) console.log('Natures Response Data', response.data)

                this.setState({
                    allNaturesObj: response.data,
                    natures: response.data.map(nature => nature['nature']),
                    busy: false,
                });
            })
            .catch(error => {
                this.setState({ error, busy: false });
            });

    }


    _updateNature(nature){
        const natureSelected = this.state.allNaturesObj.find(n => n['nature'] === nature)
        console.log("NATURE SELECTED:", nature, natureSelected)

        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                nature: natureSelected.number
            },
            natureSelected: nature
        }, () => console.log("Nature Updated:", this.state.createPokemonObj.number))
    }

    _updateForm(value){
        const formSelected = this.state.forms.find(form => form['forms'] === value)

        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                form: formSelected.number
            },
            formSelected: value
        }, () => console.log("Pokemon FORM Updated:", this.state.createPokemonObj))
    }

    onMaleChange = event => this.setState({
        maleChecked: true,
        femaleChecked: false,
        createPokemonObj: {
            ...this.state.createPokemonObj,
            gender: "1"}
    }, () => console.log("Pokemon Gender Updated: ", this.state.createPokemonObj));


    onFemaleChange = event => this.setState({
        femaleChecked: true,
        maleChecked: false,
        createPokemonObj: {
            ...this.state.createPokemonObj,
            gender: "2"
        }
    }, () => console.log("Pokemon Gender Updated: ", this.state.createPokemonObj));




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
                                            {this.state.gendersDisabled === true
                                            ?
                                                (
                                                    <Box direction ="row">
                                                        <FormField label="Gender" error={errors.gender}>
                                                            <Box direction="row">
                                                                <Box pad={{ horizontal: "small", vertical: "xsmall" }} direction="row">
                                                                    <CheckBox id="1" label="Male" values={values.gender = this.state.maleChecked? "1" : null} checked={this.state.maleChecked} onChange={this.onMaleChange} />
                                                                </Box>
                                                                <Box  direction="row">
                                                                    <CheckBox id="2" label="Female" values={values.gender = this.state.femaleChecked? "2" : null} checked={this.state.femaleChecked} onChange={this.onFemaleChange} />
                                                                </Box>
                                                            </Box>
                                                        </FormField>
                                                    </Box>
                                                ):null
                                            }

                                        </Box>
                                    <FormField label="Nature" error={errors.nature}>
                                        <Select
                                            name="nature"
                                            size="medium"
                                            placeholder="Select"
                                            value={this.state.natureSelected}
                                            options={this.state.natures}
                                            onChange={({ option }) => this._updateNature(option)}

                                        />

                                    </FormField>
                                    <FormField label="Form" error={errors.form}>
                                        <Select
                                            name="form"
                                            size="medium"
                                            placeholder="Select"
                                            value={this.state.formSelected}
                                            options={this.state.forms ? this.state.forms.map(form => form['forms']): []}
                                            onChange={({ option }) => this._updateForm(option)}

                                        />

                                    </FormField>
                                    <FormField label="Item" error={errors.item}>
                                        <Select
                                            name="item"
                                            size="medium"
                                            placeholder="Select Item"
                                            value={this.state.itemSelected}
                                            options={this.state.filterItems}
                                            onChange={({ option }) => this._onSelectItem(option)}
                                            onClose={() => this.setState({ filterItems: this.state.itemsList })}
                                            onSearch={text => {
                                                const exp = new RegExp(text, "i");
                                                this.setState({
                                                    filterItems: this.state.itemsList.filter(o => exp.test(o))
                                                }, () => console.log("onSearch:", text));
                                            }}
                                        />
                                    </FormField>
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
