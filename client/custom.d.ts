import 'react';

declare module 'react' {
  interface CSSProperties extends React.CSSProperties  {
    '--font-mono'?: string;
    '--font-sans'?: string;
  }
}
