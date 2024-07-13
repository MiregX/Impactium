import React from 'react';
import card from './styles/Card.module.css'
import { cn } from '@/lib/utils';

interface DescriptionOptions {
  text: string;
  button: JSX.Element
}

export interface Card {
  description?: string | DescriptionOptions;
  children: any;
  className?: string | string[];
  id: string | number;
}

export function Card({ description, id, children, className }: Card) {
  return (
    <div className={cn(className, card._)} id={id.toString()}>
      <div className={card.content}>
        {children}
      </div>
      {description && (
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
      )}
    </div>
  )
}
