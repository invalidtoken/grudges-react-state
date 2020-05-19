import React, { useContext } from 'react';
import { GrudgeContext } from './GrudgeProvider';

const Grudge = ({ grudge }) => {
  const { toggleForgiveness } = useContext(GrudgeContext);
  const forgive = () => toggleForgiveness(grudge.id);
  console.log('Grudge - ', grudge);

  return (
    <article className="Grudge">
      <h3>{grudge.person}</h3>
      <p>{grudge.reason}</p>
      <div className="Grudge-controls">
        <label className="Grudge-forgiven">
          <input type="checkbox" checked={grudge.forgiven} onChange={forgive} />{' '}
          Forgiven
        </label>
      </div>
    </article>
  );
};

export default Grudge;
