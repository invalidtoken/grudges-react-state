import React, { useContext } from 'react';

import Grudges from './Grudges';
import NewGrudge from './NewGrudge';
import { GrudgeContext } from './GrudgeProvider';

const Application = () => {
  let { undo, hasPast, redo, hasFuture } = useContext(GrudgeContext);
  return (
    <div className="Application">
      <NewGrudge />
      <section>
        <button
          onClick={() => {
            if (hasPast) {
              undo();
            } else {
              alert('No Past');
            }
          }}
        >
          undo
        </button>
        <button
          onClick={() => {
            if (hasFuture) {
              redo();
            } else {
              alert('No Future');
            }
          }}
        >
          redo
        </button>
      </section>
      <Grudges />
    </div>
  );
};

export default Application;
