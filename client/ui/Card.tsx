import React from 'react';
import card from './styles/Card.module.css'

interface DescriptionOptions {
  text: string;
  button: JSX.Element
}

export interface Card {
  description: string | DescriptionOptions;
  children: any;
  className: string | string[];
  id: string;
}

export function Card({ description, id, children, className }: Card) {
  return (
    <div className={`${card._} ${typeof className === 'string' ? className : className.join(' ')}`} id={id}>
      <div className={card.content}>
        {children}
      </div>
      <div className={card.description}>
        {typeof description === 'string'
          ? <p>{description}</p>
          : (
            <React.Fragment>
              <p>{description.text}</p>
              {description.button}
            </React.Fragment>
          )}
      </div>
    </div>
  )
}
