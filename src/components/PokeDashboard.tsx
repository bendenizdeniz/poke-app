import React, { useEffect, useState } from 'react';
import { TextInput, Button, Grid, Table, Center, Container, Space, Text, Modal } from '@mantine/core';
import axios from 'axios';
import { IPokemon } from '../utils/interfaces';
import { useAtom } from 'jotai';
import { pokeAtom } from '../App';
import './styles.css';
import GetPokemon from '../services/GetPokemon';
import { Constants } from '../utils/constants';

export const PokeDashboard = () => {
    const [opened, setOpened] = useState(false);
    const [pokemonTypes, setPokemonTypes] = useState<string[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<IPokemon[]>([]);
    const [pokemonQuery, setPokemonQuery] = useState<string>('');
    const [selectedPoke, setSelectedPoke] = useState<string>('');
    const [pokemonsState, setPokemonsState] = useAtom(pokeAtom);

    useEffect(() => {
        getPokemons();
    }, []);

    const getPokemons = () => {
        var _pokemons: IPokemon[] = [];

        for (var i = 1; i < Constants.POKEMON_LENGTH; i++) {
            GetPokemon(i).then((response: any) => {
                const poke: IPokemon = {
                    id: response.data.id,
                    name: response.data.name,
                    height: response.data.height,
                    weight: response.data.weight,
                    types: response.data.types.map((typeItem: any) => { return typeItem.type.name }),
                    image: response.data.sprites.front_default
                }
                _pokemons.push(poke);
                _pokemons.length === Constants.POKEMON_LENGTH - 1 && setPokemonsState(_pokemons);
            })
        }
    }

    useEffect(() => {
        if (pokemonsState) {
            let typesClone = [...pokemonTypes];

            pokemonsState.map((poke: IPokemon) => {
                poke.types.map((type: string) => {
                    typesClone.indexOf(type) === -1 &&
                        typesClone.push(type);
                })
                setPokemonTypes(typesClone);
            });
        }
    }, [pokemonsState]);

    const filterPokemons = (query: string) => {
        let nameRes: IPokemon[] = filterPokemonsAccordingToName(query);
        let typeRes: IPokemon[] = filterPokemonsAccordingToType(query);
        return nameRes.concat(typeRes);
    }

    const filterPokemonsAccordingToType = (query: string) => {
        let result = pokemonsState.filter(poke => {
            let filteredPokemons = poke.types.filter((type: string) => type.includes(query));
            return filteredPokemons.length > 0;
        });

        return result;
    }

    const filterPokemonsAccordingToName = (query: string) => {
        let result = pokemonsState.filter(poke => poke.name.includes(query));
        return result;
    }

    const ths = (
        <tr>
            <td className='text'>Name</td>
            <td className='text'>Height</td>
            <td className='text'>Weight</td>
            <td className='text'>Types</td>
        </tr>
    );

    const rows = (filteredPokemons.length > 0 ? filteredPokemons : pokemonsState)?.map((poke: IPokemon, index) => (
        <tr key={index} className="table-row" onClick={() => { setOpened(true); setSelectedPoke(poke.image) }}>
            <td>{poke.name}</td>
            <td>{poke.height}</td>
            <td>{poke.weight}</td>
            <td>{poke.types?.map((type: string, index) => { return index !== poke.types.length - 1 ? `${type}, ` : type })}</td>
        </tr>
    ));

    return (
        <div>
            <Container size={700} >
                <Center style={{ marginTop: '20px' }}>
                    <Text c='white'>Search Your Pokemon</Text>
                </Center>
                <Grid style={{ marginBlock: '20px' }} justify={'center'} >
                    <Grid.Col style={{ padding: '0' }} span={5}>
                        <TextInput radius={0} name="pokemonQuery" size="xl" value={pokemonQuery} onChange={(e: any) => { setPokemonQuery(e.target.value) }} />
                    </Grid.Col >
                    <Grid.Col style={{ padding: '0' }} span={2}>
                        <Button
                            size="xl"
                            color="yellow"
                            radius={0}
                            style={{ color: 'black' }}
                            onClick={(e: any) => {
                                setFilteredPokemons([] as IPokemon[]);
                                const _filteredPokemons = filterPokemons(pokemonQuery);

                                setFilteredPokemons(_filteredPokemons);
                            }}
                        >
                            Search
                        </Button>
                    </Grid.Col>
                </Grid>
                {
                    pokemonsState && pokemonsState.length > 0 &&
                    <>
                        <Grid columns={12} style={{ backgroundColor: '#fff' }}>
                            <Table style={{ textAlign: 'center' }} verticalSpacing="xl" withColumnBorders highlightOnHover >
                                <thead>{ths}</thead>
                                <tbody>{rows}</tbody>
                            </Table>
                            <Modal
                                opened={opened}
                                onClose={() => setOpened(false)}
                            >
                                <Center>
                                    <img src={selectedPoke} />
                                </Center>
                            </Modal>
                        </Grid>
                    </>
                }
                <Grid style={{ marginBlock: '20px' }} justify='center' columns={12} grow>
                    <Button.Group>
                        {
                            pokemonTypes &&
                            pokemonTypes?.map((type: string, index) => {
                                return (
                                    <Button
                                        key={index}
                                        color="yellow"
                                        radius="xs"
                                        size='lg'
                                        style={{ color: 'black' }}
                                        onClick={(e: any) => { setFilteredPokemons(pokemonsState.filter(poke => poke.types.includes(type))) }}
                                    >
                                        {type}
                                    </Button>
                                );
                            })
                        }
                    </Button.Group>
                </Grid>
            </Container>
        </div>
    );
}