'use client'
import s from './Login.module.css';
import { useLanguage } from "@/context/Language";
import { useEffect, useState } from "react";
import { useUser } from '@/context/User';
import { redirect } from 'next/navigation';
import { PanelTemplate } from '@/components/main/PanelTempate';
import { _server } from '@/dto/master';

export default function LoginPage() {
  const { user } = useUser();
  const { lang } = useLanguage();

  useEffect(() => {
    return redirect(_server() + '/api/oauth2/login/discord');
  }, [user]);
};