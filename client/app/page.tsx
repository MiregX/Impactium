'use server'
import React from 'react';
import { Button, Stack } from '@impactium/components';
import s from './App.module.css';
import { cn } from '@impactium/utils';
import { Icon } from '@impactium/icons';
import Image from 'next/image';
import dashed_arrow from '@/public/dashed_arrow.png';
import Link from 'next/link';

export default async function () {
  return (
    <main className={s.main}>
      <Stack pos='relative' className={s.wrapper}>
        <Stack dir='column' gap={32} style={{ height: '100%', width: '100%' }} ai='center' jc='center' pos='absolute' className={cn(s.init)}>
          <h1>Build a CV That Breaks the Rules (and the Algorithm)</h1>
          <h2>Our resumes fool ATS bots and charm hiring managers. Top 10% of candidates use us — for a reason.</h2>
          <Stack gap={16}>
            <Button variant='glass' rounded size='lg' asChild>
              <Link href='/template'>
                <Icon size={20} name='PlusCircle' />
                Create Template
              </Link>
            </Button>
            <Button rounded size='lg' asChild className={s.next}>
              <Link href='/cv'>
                Let’s F*cking Go
                <Icon size={20} name='ArrowRight' />
              </Link>
            </Button>
          </Stack>
          <Stack pos='relative' className={s.admin_panel}>
            <Button rounded size='lg' asChild variant='secondary'>
              <Link href='/templates'>
                <Icon size={24} name='LayoutDashed' />
                See templates
              </Link>
            </Button>
            <Stack pos='absolute' className={s.arrow}>
              <Image src={dashed_arrow} alt='' height={128} width={128} />
              <p>Made by community</p>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </main>
  );
};
