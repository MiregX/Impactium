'use client'
import '@/decorator/api';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { λError } from '@impactium/pattern';
import { Parent } from '@/types';

export function ApplicationProvider({ children }: Application.Provider.Props) {
  const [banner, setBanner] = useState<React.ReactNode>(null);

  const spawnBanner = (element: React.ReactNode) => {
    setBanner(element);
  }

  const destroyBanner = () => {
    setBanner(null);
  }

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === λError.data_scroll_locked) {
          document.body.removeAttribute(λError.data_scroll_locked);
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [λError.data_scroll_locked],
    });

    document.body.removeAttribute(λError.data_scroll_locked);

    return () => {
      observer.disconnect();
    };
  }, []);

  const props: Application.Export = {
    spawnBanner,
    destroyBanner
  }

  return (
    <Application.Context.Provider value={props}>
      {children}
      {banner}
    </Application.Context.Provider>
  );
};

export namespace Application {
  export const Context = createContext<Application.Export | undefined>(undefined);

  export interface Export {
    spawnBanner: (banner: React.ReactNode) => void;
    destroyBanner: () => void;
  }

  export const use = (): Application.Export => useContext(Application.Context)!;

  export namespace Provider {
    export interface Props extends Parent {}
  }
}
