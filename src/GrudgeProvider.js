import React, { useReducer, useCallback } from 'react';
import id from 'uuid/v4';
import initialState from './initialState';

export const GrudgeContext = React.createContext();

let GRUDGE_ADD = 'GRUDGE_ADD';
let GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const reducer = (state, action) => {
  switch (action.type) {
    case GRUDGE_ADD:
      const {
        payload: { grudge }
      } = action;

      // SEE: Adding id and forgiven to the grudge object
      grudge.id = id();
      grudge.forgiven = false;
      return [grudge, ...state];

    case GRUDGE_FORGIVE:
      return state.map((grudge) => {
        if (grudge.id !== action.payload.id) return grudge;
        return { ...grudge, forgiven: !grudge.forgiven };
      });

    default:
      return new Error('No Action Given');
  }
};

const GrudgeProvider = (props) => {
  const [grudges, dispatch] = useReducer(reducer, initialState);

  const addGrudge = useCallback(
    (grudge) => {
      dispatch({
        type: GRUDGE_ADD,
        payload: {
          grudge
        }
      });
    },
    [dispatch]
  );

  const toggleForgiveness = useCallback(
    (id) => {
      dispatch({
        type: GRUDGE_FORGIVE,
        payload: {
          id
        }
      });
    },
    [dispatch]
  );

  let value = { grudges, addGrudge, toggleForgiveness };

  return (
    <GrudgeContext.Provider value={value}>
      {props.children}
    </GrudgeContext.Provider>
  );
};

export default GrudgeProvider;
