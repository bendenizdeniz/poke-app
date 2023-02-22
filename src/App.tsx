import React from 'react';

import { atom } from 'jotai';
import { useAtom } from 'jotai';

import { PokeDashboard } from './components/PokeDashboard';
import { IPokemon } from './utils/interfaces';
import './App.css';

export const pokeAtom = atom([] as IPokemon[]);


function App() {

  return (
    <>
      <PokeDashboard />
    </>
  );
}

export default App;
