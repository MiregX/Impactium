import React, { useEffect } from 'react';
import './Terminal.css'
import TerminalPanelTemplate from './elements/TerminalPanelTemplate';
import TerminalProvider, { useTerminal } from '../../class/TerminalProvider';

const Terminal = () => {
  const { terminal, getTerminal } = useTerminal();

  useEffect(() => {
    if (!terminal) {
      getTerminal();
    }
  }, [terminal])

  return (
    <TerminalProvider>
      <div className='terminal'>
        <div className='info'>
          {[...Array(5)].map((_, index) => (
            <TerminalPanelTemplate key={index} index={index.toString()} />
          ))}
        </div>
      </div>
    </TerminalProvider>
  );
};

export default Terminal;
