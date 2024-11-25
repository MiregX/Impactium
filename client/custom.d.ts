import 'react';

declare module 'react' {
  interface CSSProperties extends React.CSSProperties  {
    [`--${string}`]?: string | number | undefined | null;
  }
}
