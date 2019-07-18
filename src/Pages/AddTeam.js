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
import {getPokemonsObj, getPokemonForms, getNatures, getItems, getStats, getPokemonMoves} from "../Functions/Backend";

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
            availableMoves: [],
            filterMoves: [],
            moveSelected: '',
            allItemsObj: [],
            filterItems: [],
            itemsList: [],
            itemSelected: '',
            pokemonList: [],
            hpLimits: {
                min: 0,
                max: 0
            },
            attackLimits: {
                min: 0,
                max: 0
            },
            defenseLimits: {
                min: 0,
                max: 0
            },
            specialAttackLimits: {
                min: 0,
                max: 0
            },
            specialDefenseLimits: {
                min: 0,
                max: 0
            },
            speedLimits: {
                min: 0,
                max: 0
            },
            filterPokemonList: [],
            stats: {
                HP: [],
                Attack: [],
                Defense: [],
                SpecialAttack: [],
                SpecialDefense: [],
                Speed: []
            },
            gendersDisabled: false,
            natures: [],
            allNaturesObj: null,
            natureSelected: '',
            formSelected: '',
            selectedPokemonForms: [],
            createPokemonObj: {
                number: '',
                name: '',
                nickName: '',
                form: '',
                gender: '',
                lv: '',
                nature: '',
                moves: [],
                item: '',
                stats: {
                    hp: '',
                    attack: '',
                    defense: '',
                    specialAttack: '',
                    specialDef: '',
                    speed: ''
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

        this._getItems()
        this._getNatures()


        this.setState({ busy: true, response: {}, error: {}})
    }

    _onSelectPokemon(name){
        const pokemonSelected = this.state.allPokemon.find(pokemon => pokemon['pokemon'] === name)
        console.log("Pokemon Selected: ", pokemonSelected)

        this.setState({
            gendersDisabled: pokemonSelected.gender === "3" ? false : true,
            createPokemonObj: {
                ...this.state.createPokemonObj,
                name: name,
                number: pokemonSelected.number,
                gender: pokemonSelected.gender,
            }
        })
        this._getForms(pokemonSelected.number);
        this._getStats();
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

    _getMoves(pokeNumber, form){
        let moves = []
        getPokemonMoves(pokeNumber, form, 'es')
            .then(response => {
                //if (this.state.debug) console.log('Forms Response Data', response.data)
                moves = response.data.map(poke => poke['moves'])
                this.setState({
                    movesList: moves,
                    filterMovesList: moves,
                    allMoves: response.data
                }, () => console.log("Moves Available: ", this.state.filterMovesList))

            })
            .catch(error => {
                this.setState({ error, busy: false });
            });
        return moves
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
                console.error("Error getting Items: ", error)
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

    range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

    _getStats(){

        if (this.state.createPokemonObj.number !== '' && this.state.createPokemonObj.form !== '' && this.state.createPokemonObj.nature !== '' && this.state.createPokemonObj.lv !== ''){
            const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
            getStats(this.state.createPokemonObj.number, this.state.createPokemonObj.form, this.state.createPokemonObj.nature, this.state.createPokemonObj.lv)
                .then(response => {
                    if (this.state.debug) console.log('STATS Response Data', response.data)

                    this.setState({
                        hpLimits: {
                            min: response.data.min[0],
                            max: response.data.max[0]
                        },
                        attackLimits: {
                            min: response.data.min[1],
                            max: response.data.max[1]
                        },
                        defenseLimits: {
                            min: response.data.min[2],
                            max: response.data.max[2]
                        },
                        specialAttackLimits: {
                            min: response.data.min[3],
                            max: response.data.max[3]
                        },
                        specialDefenseLimits: {
                            min: response.data.min[4],
                            max: response.data.max[4]
                        },
                        speedLimits: {
                            min: response.data.min[5],
                            max: response.data.max[5]
                        },
                        stats: {
                            hp: range(response.data.min[0], response.data.max[0], 1),
                            attack: range(response.data.min[1], response.data.max[1], 1),
                            defense: range(response.data.min[2], response.data.max[2], 1),
                            specialAttack: range(response.data.min[3], response.data.max[3], 1),
                            specialDef: range(response.data.min[4], response.data.max[4], 1),
                            speed: range(response.data.min[5], response.data.max[5], 1),
                        },
                        busy: false,
                    }, () => console.log("MIN/MAX STATS Updated: ", this.state.stats));
                })
                .catch(error => {
                    this.setState({ error, busy: false });
                });
        }
    }




    _updateNature(nature){
        const natureSelected = this.state.allNaturesObj.find(n => n['nature'] === nature)

        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                nature: natureSelected.number
            },
            natureSelected: nature
        }, () => {console.log("Pokemon NATURE Updated:", this.state.createPokemonObj); this._getStats();})

    }

    _updateForm(value){
        const formSelected = this.state.forms.find(form => form['forms'] === value)

        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                form: formSelected.number
            },
            formSelected: value
        }, () => {this._getStats(); this._getMoves(this.state.createPokemonObj.number, formSelected.number); console.log("Pokemon FORM Updated: ", this.state.createPokemonObj)})

    }

    _updateMoves(value){
        const moveSelected = this.state.allMoves.find(move => move['moves'] === value)
        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                moves: this.state.moves.push(moveSelected.number)
            }
        }, () => {console.log("Pokemon MOVES Updated:", this.state.createPokemonObj);})

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



    _updateNickname = event => this.setState({ createPokemonObj: {...this.state.createPokemonObj, nickName: event.target.value }}, () => console.log("Pokemon NICKNAME Updated: ", this.state.createPokemonObj));

    _updateLevel = event => {
        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                lv: event.target.value
            }
        }, () => {console.log("Pokemon LEVEL Updated: ", this.state.createPokemonObj); this._getStats();});

    }

    _updateStats(stat, value){
        console.log("Will try to update: ", this.state.createPokemonObj.stats[stat])
        this.setState({
            createPokemonObj: {
                ...this.state.createPokemonObj,
                stats: {
                    ...this.state.createPokemonObj.stats,
                    [stat]:value
                }
            }
        }, () => console.log("Pokemon STATS Updated: ", this.state.createPokemonObj))

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
                                                    }, () => console.log("On Pokemon Search:", text));
                                                }}
                                            />
                                        </FormField>
                                        <Box pad={{left: 'small' ,top:'xxsmall'}} direction ="row">
                                        <FormField label="Nickname" error={errors.nickName}>
                                            <TextInput
                                                name="nickName"
                                                value={this.state.createPokemonObj.nickName}
                                                onChange={this._updateNickname}
                                            />
                                        </FormField>

                                        </Box>
                                    </Box>
                                    <Box width="small" >
                                        <FormField label="Level" error={errors.level}>
                                            <TextInput
                                                name="level"
                                                value={this.state.createPokemonObj.lv}
                                                onChange={this._updateLevel}
                                            />
                                         </FormField>
                                    </Box>
                                    <Box width="small">
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
                                    <Box direction="row">
                                    <FormField label="HP" error={errors.hp}>
                                        <Select
                                            name="hp"
                                            size="medium"
                                            placeholder="Select"
                                            value={this.state.createPokemonObj.stats.hp}
                                            options={this.state.stats.hp ? this.state.stats.hp : []}
                                            onChange={({ option }) => this._updateStats('hp', option)}

                                        />
                                    </FormField>
                                    <FormField label="Attack" error={errors.attack}>
                                        <Select
                                            name="attack"
                                            size="medium"
                                            placeholder="Select"
                                            value={this.state.createPokemonObj.stats.attack}
                                            options={this.state.stats.attack ? this.state.stats.attack : []}
                                            onChange={({ option }) => this._updateStats('attack', option)}

                                        />
                                    </FormField>
                                    </Box>
                                    <Box direction="row">
                                        <FormField label="Defense" error={errors.defense}>
                                            <Select
                                                name="defense"
                                                size="medium"
                                                placeholder="Select"
                                                value={this.state.createPokemonObj.stats.defense}
                                                options={this.state.stats.defense ? this.state.stats.defense : []}
                                                onChange={({ option }) => this._updateStats('defense', option)}

                                            />
                                        </FormField>
                                        <FormField label="Special Attack" error={errors.specialAttack}>
                                            <Select
                                                name="specialAttack"
                                                size="medium"
                                                placeholder="Select"
                                                value={this.state.createPokemonObj.stats.specialAttack}
                                                options={this.state.stats.specialAttack ? this.state.stats.specialAttack : []}
                                                onChange={({ option }) => this._updateStats('specialAttack', option)}

                                            />
                                        </FormField>
                                    </Box>
                                    <Box direction="row">
                                        <FormField label="Special Defense" error={errors.specialDef}>
                                            <Select
                                                name="specialDef"
                                                size="medium"
                                                placeholder="Select"
                                                value={this.state.createPokemonObj.stats.specialDef}
                                                options={this.state.stats.specialDef ? this.state.stats.specialDef : []}
                                                onChange={({ option }) => this._updateStats('specialDef', option)}

                                            />
                                        </FormField>
                                        <FormField label="Speed" error={errors.speed}>
                                            <Select
                                                name="speed"
                                                size="medium"
                                                placeholder="Select"
                                                value={this.state.createPokemonObj.stats.speed}
                                                options={this.state.stats.speed ? this.state.stats.speed : []}
                                                onChange={({ option }) => this._updateStats('speed', option)}

                                            />
                                        </FormField>
                                    </Box>
                                    <FormField label="Moves" error={errors.moves}>
                                        <Select
                                            name="moves"
                                            size="medium"
                                            multiple
                                            placeholder="Select"
                                            value={this.state.moveSelected}
                                            options={this.state.filterMovesList ? this.state.filterMovesList: []}
                                            onChange={({ value: nextValue }) =>
                                                this.setState({ moveSelected: nextValue }, () => console.log("moveSelected: ", this.state.moveSelected))

                                            }
                                            onClose={() => this.setState({ filterMovesList: this.state.movesList })}
                                            onSearch={text => {
                                                const exp = new RegExp(text, "i");
                                                this.setState({
                                                    filterMovesList: this.state.movesList.filter(o => exp.test(o))
                                                }, () => console.log("On Moves Search:", text));
                                            }}

                                        />

                                    </FormField>
                                    <Box
                                        tag="footer"
                                        margin={{ top: "medium", bottom: "large"}}
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
