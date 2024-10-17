'use client'
import { ChangeEvent, Fragment, useCallback, useState } from 'react';
import { Banner } from '@/ui/Banner';
import { useApplication } from '@/context/Application.context';
import { useLanguage } from '@/context/Language.context';
import { authGuard } from '@/decorator/authGuard';
import { LoginBanner } from './login/Login.banner';
import s from './Manager.module.css';
import { Input } from '@/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select';
import { Chooser } from '@/components/Chooser';
import { Tournament, λTournament } from '@/dto/Tournament';
import { Combination } from '@/ui/Combitation';
import { Separator } from '@/ui/Separator';
import { DisplayName, Identifier, PowerOfTwo, λError, λIteration, λIterations, Grid } from '@impactium/pattern';
import { cn, λIcon } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs';
import { Icon } from '@/ui/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/Tooltip';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { toast } from 'sonner';
import { λ } from '@/decorator/λ.class';

type SettingsMode = 'standart' | 'professional' | 'custom';

interface Material {
  title: string,
  description: string,
  icon: λIcon
}

export function ManageTournamentBanner() {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();
  const [tournament, setTournament] = useState<Partial<Tournament>>({});
  const [rawBanner, setRawBanner] = useState<File | undefined>();
  const [iterations, setIterations] = useState<λIteration>(32);
  const [settings, setSettings] = useState<Grid>({});
  const [settingsMode, setSettingsMode] = useState<SettingsMode>('standart');
  const [loading, setLoading] = useState<boolean>(false);
  const [titleValid, setTitleValid] = useState<boolean>(true);
  const [codeValid, setCodeValid] = useState<boolean>(true);

  !authGuard({
    useRedirect: false
  }) && spawnBanner(<LoginBanner />);

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTournament(t => ({ ...t, code: event.target.value }));
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;

    setTitleValid(title.length >= 3);
    setTournament(t => ({ ...t, title: event.target.value }));
  }

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
  }

  const Settings = useCallback(() => {
    const upper_bracket = [];

    const predefined: Record<SettingsMode, Partial<Record<λIteration, 1 | 2 | 3>>> = {
      standart: {
        1: 3,
      },
      professional: {
        1: 3,
        2: 2,
        4: 2
      },
      custom: {}
    }

    const handleTabsChange = (key: SettingsMode) => {
      setSettingsMode(key);
      setSettings(predefined[key]);
    }

    const materials: Record<SettingsMode, Material> = {
      standart: {
        title: 'Стандартный формат',
        description: 'Для любительских турниров, только финалисты играют до 2 побед',
        icon: 'CircleHelp'
      },
      professional: {
        title: 'Професиональный турнир',
        description: 'Финал до 3 побед, Топ 2 и Топ 4 играют до 2 побед. Остальные - до одной',
        icon: 'Trophy'
      },
      custom: {
        title: 'Пользовательские настройки',
        description: 'Настройка параметров ВО в ручном режиме',
        icon: 'Wrench'
      }
    }

    const lower_bracket = [];

    for (let iteration = iterations; iteration >= 1; iteration = PowerOfTwo.prev(iteration)) {
      upper_bracket.unshift(
        <div key={iteration} className={s.node}>
          <p>Топ {iteration}</p>
          <Input type='number' value={settings[iteration] || 1} onChange={ev => handleSettingsValueChange(iteration, ev)} />
        </div>
      );

      if (tournament.has_lower_bracket && iteration > 1 && iteration < iterations) {
        lower_bracket.unshift(
          <div key={iteration} className={s.node}>
            <p>Топ {iteration}</p>
            <Input type='number' value={settings[iteration] || 1} onChange={ev => handleSettingsValueChange(iteration, ev)} />
          </div>
        );
      }
    }

    return (
      <div className={s.settings}>
        <Tabs onValueChange={(key) => handleTabsChange(key as SettingsMode)}>
          <TabsList className={s.list} defaultValue={settingsMode}>
            {Object.keys(predefined).map((key, i) => (
              <Fragment key={key}>
                {!!i && <Separator orientation='vertical' />}
                <TabsTrigger value={key} className={cn(key === settingsMode && s.active)}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {materials[key as SettingsMode].title}<Icon name={materials[key as SettingsMode].icon} />
                      </TooltipTrigger>
                      <TooltipContent className={s.tooltip}>
                        {materials[key as SettingsMode].description}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsTrigger>
              </Fragment>
            ))}
          </TabsList>
          <div className={s.preview_wrapper}>
            <Card className={s.preview}>
              <h3><Icon name='ArrowUp' />Верхняя сетка</h3>
              {upper_bracket}
            </Card>
            <Card className={s.preview}>
              <h3><Icon name='ArrowDown' />Нижняя сетка</h3>
              {lower_bracket.length ? lower_bracket : <NoBracket />}
            </Card>
          </div>
        </Tabs>
      </div>
    );
  }, [iterations, settings, tournament.has_lower_bracket]);

  const NoBracket = useCallback(() => (
    <div className={s.no_bracket}>
      <Icon name='CircleOff' />
      <p>Нижняя сетка не нужна</p>
    </div>
  ), []);

  const submit = () => {
    if (!Identifier.test(tournament.code || '')) {
      setCodeValid(false);
      return toast(lang.error.code_invalid_format);
    }
    if (!DisplayName.test(tournament.title || '')) {
      setTitleValid(false);
      return toast(lang.error.display_name_invalid_format);
    }

    api<Tournament>('/tournament/create', {
      method: 'POST',
      body: λTournament.create({
        code: tournament.code,
        title: tournament.title,
        banner: rawBanner,
        has_lower_bracket: tournament.has_lower_bracket,
        iterations,
        settings
      }),
      toast: true,
      setLoading
    }, console.log);
  }

  return (
    <Banner className={s.banner} title={lang.create.tournament}>
      <Combination size='heading' id={tournament.code || 'identifier'} src={tournament.banner} name={tournament.title || 'Название турнира'} />
      <Separator />
      <div className={s.node}>
        <p>Название*</p>
        <Input img='Quote' placeholder='Название турнира' onChange={handleTitleChange} value={tournament.title} valid={titleValid} />
      </div>
      <div className={s.node}>
        <p>Идентификатор*</p>
        <Input img='AtSign' placeholder='Идентификатор турнира' onChange={handleCodeChange} value={tournament.code} valid={codeValid} />
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
      <Button className={s.submit} img='Plus' onClick={submit} loading={loading} disabled={!titleValid || !codeValid}>Создать турнир</Button>
    </Banner>
  );
};
