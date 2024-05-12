'use client'
import { Input } from '@/ui/Input';
import s from '../CreateTeam.module.css'
import { useLanguage } from '@/context/Language';
import { useState } from 'react';

export function LogoInput({ team, handle }) {
  const { lang } = useLanguage();
  const [bannerPreview, setBannerPreview] = useState<any>();

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
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
