'use client'
import banner from './styles/Banner.module.css';
import React, { useEffect, useRef } from 'react';
import { GeistButton } from './GeistButton';
import { useMessage } from '@/context/Message';

export enum WarnerTypes {
  note,
  tip,
  important,
  warning,
  caution,
}

export interface Warner {
  type: WarnerTypes;
  text: string;
}

interface BannerProps {
  title: string;
  children: React.ReactNode;
  footer?: Warner | {
    left?: GeistButton[],
    right: GeistButton[],
  };
  onClose?: () => void;
}

export function Banner({ title, children, footer, onClose }: BannerProps) {
  const self = useRef(null);
  const { destroyBanner } = useMessage();

  useEffect(() => {
    const closeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (onClose) onClose();
        destroyBanner();
      }
    };

    window.addEventListener('keydown', closeHandler);

    return () => {
      window.removeEventListener('keydown', closeHandler);
    };
  }, [onClose]);

  return (
    <div ref={self} className={banner.background}>
      <div className={banner._}>
        <h4>{title}</h4>
        <div className={banner.content}>{children}</div>
        <div className={banner.footer}>
          {footer ? (
            'text' in footer ? (
              <div className={`${banner.description} ${banner[WarnerTypes[footer.type]]}`}>
                {'type' in footer && (
                  <img
                    src={`https://cdn.impactium.fun/custom-ui/${WarnerTypes[footer.type]}.svg`}
                    alt={footer.text}
                  />
                )}
                <p>{footer.text}</p>
              </div>
            ) : (
              <React.Fragment>
                {footer.left && (
                  <div className={banner.left}>
                    {footer.left.map((action: GeistButton) =>
                      <GeistButton options={action} key={action.text} />
                    )}
                  </div>
                )}
                {footer.right && (
                  <div className={banner.right}>
                    {footer.right.map((action: GeistButton) =>
                      <GeistButton options={action} key={action.text} />
                    )}
                  </div>
                )}
              </React.Fragment>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
