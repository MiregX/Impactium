import banner from '@/ui/styles/Banner.module.css';
import React from 'react';
import { BaseButton, BaseButtonTypes, BaseButtonOptions } from './BaseButton';

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
  footer?: any;
}

export function Banner({ title, children, footer }: BannerProps) {
  return (
    <div className={banner.background}>
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
                    {footer.left.map((action: BaseButtonOptions) =>
                      action.type === BaseButtonTypes.link ? (
                        <BaseButton key={action.text} type={action.type} href={action.href} text={action.text} />
                      ) : (
                        <BaseButton key={action.text} type={action.type} action={action.action} text={action.text} />
                      )
                    )}
                  </div>
                )}
                {footer.right && (
                  <div className={banner.right}>
                    {footer.right.map((action: BaseButtonOptions) =>
                      action.type === BaseButtonTypes.link ? (
                        <BaseButton
                          key={action.text}
                          type={action.type}
                          href={action.href}
                          outline={action.outline}
                          text={action.text} />
                      ) : (
                        <BaseButton
                          key={action.text}
                          type={action.type}
                          action={action.action}
                          text={action.text}
                          focused={action.focused} />
                      )
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
