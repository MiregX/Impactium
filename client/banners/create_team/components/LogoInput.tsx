'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language.context';
import { useState } from 'react';
import { Team } from '@/dto/Team';

interface LogoInputProps {
  team: Team,
  handle: any
}

export function LogoInput({ team, handle }: LogoInputProps) {
  const { lang } = useLanguage();
  const [bannerPreview, setBannerPreview] = useState<any>();

  const handleBannerChange = (e: any) => {
    const file = e.target.files[0];
    console.log(file)
    handle({banner: file});
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${s.group} ${s.banner_uploader}`}>
      <p>{lang.create_team.logo_title}</p>
      <div className={s.bottom}>
        <Input
          type="file"
          label='file'
          accept="image/*"
          onChange={handleBannerChange}
          placeholder={lang.create_team.logo}
          />
          {bannerPreview && <div className={s.banner_preview}>
          <img src={bannerPreview} />
        </div>}
      </div>
    </div>
  );
}
