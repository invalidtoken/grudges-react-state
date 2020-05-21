import React, { useReducer, useCallback } from 'react';
import id from 'uuid/v4';
import initialState from './initialState';

export const GrudgeContext = React.createContext();

let GRUDGE_ADD = 'GRUDGE_ADD';
let GRUDGE_FORGIVE = 'GRUDGE_FORGIVE';

const useUndoReducer = (reducer, initialState) => {
  let defaultState = {
    past: [],
    present: initialState,
    future: []
  };

  const undoRedoReducer = (state, action) => {
    let newPresent = reducer(state.present, action);

    if (action.type === 'UNDO') {
      if (state.past.length > 0) {
        let newPresent = state.past.shift();
        console.log(newPresent);
        return {
          past: [...state.past],
          present: newPresent,
          future: [...state.future, state.present]
        };
      } else {
        return state;
      }
    }

    if (action.type === 'REDO') {
      if (state.future.length > 0) {
        let newPresent = state.future.pop();
        return {
          past: [state.present, ...state.past],
          present: newPresent,
          future: [...state.future]
        };
      } else {
        return state;
      }
    }

    return {
      past: [state.present, ...state.past],
      present: newPresent,
      future: []
    };
  };

  return useReducer(undoRedoReducer, defaultState);
};

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
      return state;
  }
};

const GrudgeProvider = (props) => {
  const [state, dispatch] = useUndoReducer(reducer, initialState);
  const grudges = state.present;
  const hasPast = !!state.past.length > 0;
  const hasFuture = !!state.future.length > 0;

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

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  console.log('state - ', state);

  let value = {
    grudges,
    addGrudge,
    toggleForgiveness,
    undo,
    redo,
    hasPast,
    hasFuture
  };

  return (
    <GrudgeContext.Provider value={value}>
      {props.children}
    </GrudgeContext.Provider>
  );
};

export default GrudgeProvider;
