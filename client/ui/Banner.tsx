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
    left?: React.ReactElement[],
    right: React.ReactElement[],
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
        <h4>{title}
          <button onClick={destroyBanner}>
            <img src='https://cdn.impactium.fun/ui/close/md.svg'/>
          </button></h4>
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
                <div className={banner.left}>{footer.left}</div>
                <div className={banner.right}>{footer.right}</div>
              </React.Fragment>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
