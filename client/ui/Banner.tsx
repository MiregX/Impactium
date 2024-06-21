'use client'
import banner from './styles/Banner.module.css';
import React, { useEffect } from 'react';
import { useApplication } from '@/context/Application';

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

interface Options {
  center: boolean
}

interface BannerProps {
  title: string;
  children: React.ReactNode;
  footer?: Warner | {
    left?: React.ReactElement[],
    right: React.ReactElement[],
  };
  onClose?: () => void,
  options?: Partial<Options>
}

export function Banner({ title, children, footer, onClose, options }: BannerProps) {
  const { destroyBanner } = useApplication();

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
    <div className={banner.background}>
      <div className={`${banner._}  ${Object.keys(options || {}).filter(key => !!options[key]).map(key => banner[key]).join(' ')}`}>
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
