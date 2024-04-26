import banner from '@/ui/styles/Banner.module.css'
import React from 'react'

enum WarnerTypes {
  info,
  warning,
  error
}

interface Warner {
  type: WarnerTypes;
  text: string;
}

interface Banner {
  title: string;
  children: React.ReactNode;
  warner?: Warner | string
}

export function Banner({ title, children, warner }: Banner) {
  return (
    <div className={banner.background}>
      <div className={banner._}>
        <h4>{title}</h4>
        <div className={banner.content}>
          {children}
        </div>
        <div className={banner.footer}>
          {typeof warner === 'object'
            ? warner.text
            : warner
          }
        </div>
      </div>
    </div>
  )
}