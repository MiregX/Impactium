import React from 'react';
import './Terminal.css'
import TerminalPanelTemplate from './elements/TerminalPanelTemplate';

const Terminal = () => {
  return (
    <div className='terminal'>
      <div className='info'>
        {[...Array(5)].map((_, index) => (
          <TerminalPanelTemplate key={index} index={index.toString()} />
        ))}
      </div>
    </div>
  );
};

export default Terminal;
