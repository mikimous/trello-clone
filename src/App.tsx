import React from 'react';
import './App.css';
import { AppContainer } from './styles';
import { Column } from './Column';
import { AddNewItem } from './AddNewItem';
import { useAppState } from './AppStateContext';


function App() {
  const { state, dispatch } = useAppState();

  return (
    <AppContainer>
      {state.lists.map((list, i) => (
        <Column id={list.id} text={list.text} key={list.id} index={i} />
      ))}
      <AddNewItem
        toggleButtonText="+ Add another list"
        onAdd={text => dispatch({ type: "ADD_LIST", payload: text })} />
    </AppContainer>
  );
}

export default App;
