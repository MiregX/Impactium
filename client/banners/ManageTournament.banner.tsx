'use client'
import { ChangeEvent, useCallback, useState } from 'react';
import { Banner } from '@/ui/Banner';
import { useApplication } from '@/context/Application.context';
import { useLanguage } from '@/context/Language.context';
import { authGuard } from '@/decorator/authGuard';
import { LoginBanner } from './login/Login.banner';
import s from './Manager.module.css';
import { Input } from '@/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select';
import { Chooser } from '@/components/Chooser';
import { Tournament } from '@/dto/Tournament';
import { Combination } from '@/ui/Combitation';
import { Separator } from '@/ui/Separator';
import { PowerOfTwo, λIteration, λIterations } from '@impactium/pattern';

export function ManageTournamentBanner() {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();
  const [tournament, setTournament] = useState<Partial<Tournament>>({});
  const [rawBanner, setRawBanner] = useState<File>();
  const [iterations, setIterations] = useState<λIteration>(32);
  const [settings, setSettings] = useState<Partial<Record<λIteration, 1 | 2 | 3>>>({});

  !authGuard({
    useRedirect: false
  }) && spawnBanner(<LoginBanner />);

  const bannerInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setRawBanner(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setTournament(t => ({ ...t, banner: reader.result as string}));
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsValueChange = (iteration: λIteration, event: ChangeEvent<HTMLInputElement>) => {
    setSettings(s => ({
      ...s,
      [iteration]: parseInt(event.target.value) || 1,
    }));

    console.log(iteration, event.target.value);
  }

  const Settings = useCallback(() => {
    const units = [];
    const lower_bracket = [];

    for (let iteration = iterations; iteration >= 1; iteration = PowerOfTwo.prev(iteration)) {
      units.push(
        <div className={s.node}>
          <p>{iteration}</p>
          <Input type='number' value={settings[iteration] || 1} onChange={ev => handleSettingsValueChange(iteration, ev)} />
        </div>
      );

      if (tournament.has_lower_bracket && iteration !== iterations && iteration !== 1) {
        units.push(
          <div className={s.node}>
            <p>{iteration}</p>
            <Input type='number' value={settings[iteration] || 1} onChange={ev => handleSettingsValueChange(iteration, ev)} />
          </div>
        )
      }
    }

    return (
      <div className={s.settings}>
        {units}
      </div>
    );
  }, [iterations, settings, tournament.has_lower_bracket]);

  return (
    <Banner title={lang.create.tournament}>
      <Combination size='heading' id={tournament.code || 'identifier'} src={tournament.banner} name={tournament.title || 'Название турнира'} />
      <Separator />
      <div className={s.node}>
        <p>Название*</p>
        <Input img='Quote' placeholder='Название турнира' />
      </div>
      <div className={s.node}>
        <p>Идентификатор*</p>
        <Input img='AtSign' placeholder='Идентификатор турнира' />
      </div>
      <div className={s.node}>
        <p>Ореол турнира*</p>
        <Input img='ImageUp' onChange={bannerInputHandler} type='file' accept='.png, .jpg, .jpeg, .svg, .webm' />
      </div>
      <Separator><i>Настройки сетки</i></Separator>
      <div className={s.node}>
        <p>Максимальное кол-во комманд</p>
        <Select defaultValue={λIterations._32.toString()} value={iterations.toString()} onValueChange={v => setIterations(Number(v) as λIteration)}>
        <SelectTrigger value={iterations}>{iterations}</SelectTrigger>
        <SelectContent>
          {Object.values(λIterations).map(iteration => (
            <SelectItem value={iteration.toString()}>{iteration}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>
      <Chooser
        values={['Только верхнаяя сетка', 'Верхняя и нижнаяя сетки']}
        checked={tournament.has_lower_bracket}
        onCheckedChange={checked => setTournament((t) => ({ ...t, has_lower_bracket: checked}))} />
      <Settings />
    </Banner>
  );
};
