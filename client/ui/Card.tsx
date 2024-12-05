import React, { HTMLAttributes } from 'react';
import card from './styles/Card.module.css'
import { cn } from '@impactium/utils';

interface DescriptionOptions {
  text: string;
  button: JSX.Element
}

export interface Card extends HTMLAttributes<HTMLDivElement> {
  description?: string | DescriptionOptions;
}

export function Card({ description, children, className, ...props }: Card) {
  return (
    <div className={cn(className, card._)} {...props}>
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
