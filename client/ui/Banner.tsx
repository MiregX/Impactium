'use client'
import banner from './styles/Banner.module.css';
import React, { useEffect } from 'react';
import { useApplication } from '@/context/Application.context';
import { Button } from '@impactium/components';
import { cn } from '@impactium/utils';

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

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  footer?: Warner | {
    left?: React.ReactElement[],
    right: React.ReactElement[],
  };
  onClose?: () => void,
  options?: Partial<Options>
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ title, children, footer, onClose, options, className, ...props }, ref) => {
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
    <div className={banner.background} {...props}>
      <div className={cn(banner._, useOptionStyling(options, banner), className)}>
        <h4>{title}</h4>
        <div className={banner.content}>{children}</div>
        {footer ? (
          <div className={banner.footer}>
            {'text' in footer ? (
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
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
});
