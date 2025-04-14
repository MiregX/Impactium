'use client'
import s from './page.module.css';
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Icon } from '@impactium/icons'
import * as z from 'zod'
import { Card } from '@/ui/card'
import { Input, Button, Badge } from '@impactium/components'
import { Select } from '@/ui/Select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { cn } from '@impactium/utils'
import { Textarea } from '@/ui/textarea'
import { Stack } from '@impactium/components/stack';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Имя и фамилия должны содержать минимум 2 символа',
  }),
  desiredPosition: z.string().min(2, {
    message: 'Укажите желаемую должность',
  }),
  experienceYears: z.string().min(1, {
    message: 'Укажите опыт работы в годах',
  }),
  workplaces: z.array(z.string()).min(1, {
    message: 'Укажите минимум 1 место работы',
  }),
  education: z.string().optional(),
  skills: z.array(z.string()).min(1, {
    message: 'Укажите минимум 1 навык',
  }),
  achievements: z.array(z.string()).optional(),
  industry: z.string({
    required_error: 'Выберите сферу деятельности',
  }),
})

const industries = [
  { label: 'Tech', value: 'tech' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Design', value: 'design' },
  { label: 'Finance', value: 'finance' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Other', value: 'other' },
]

const skillsList = [
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Java',
  'C#',
  'PHP',
  'HTML',
  'CSS',
  'SQL',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Git',
  'CI/CD',
  'Agile',
  'Scrum',
  'Project Management',
  'UI/UX Design',
  'Figma',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'SEO',
  'Content Marketing',
  'Social Media Marketing',
  'Email Marketing',
  'Data Analysis',
  'Machine Learning',
  'AI',
  'Blockchain',
]

const achievementTemplates = [
  'Увеличил(а) продажи на X% за Y месяцев',
  'Оптимизировал(а) процесс, сократив время выполнения на X%',
  'Руководил(а) командой из X человек',
  'Успешно запустил(а) X проектов в срок и в рамках бюджета',
  'Разработал(а) стратегию, которая привела к X результату',
  'Внедрил(а) новую технологию/систему, что привело к X улучшению',
  'Получил(а) награду/признание за X достижение',
]

export default function ProfileForm() {
  const [workplaces, setWorkplaces] = useState<string[]>([])
  const [newWorkplace, setNewWorkplace] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      desiredPosition: '',
      experienceYears: '',
      workplaces: [],
      education: '',
      skills: [],
      achievements: [],
      industry: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert('Профиль успешно сохранен!')
  }

  const addWorkplace = () => {
    if (newWorkplace.trim() !== '') {
      const updatedWorkplaces = [...workplaces, newWorkplace]
      setWorkplaces(updatedWorkplaces)
      form.setValue('workplaces', updatedWorkplaces)
      setNewWorkplace('')
    }
  }

  const removeWorkplace = (index: number) => {
    const updatedWorkplaces = workplaces.filter((_, i) => i !== index)
    setWorkplaces(updatedWorkplaces)
    form.setValue('workplaces', updatedWorkplaces)
  }

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill]
      setSelectedSkills(updatedSkills)
      form.setValue('skills', updatedSkills)
    }
  }

  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(updatedSkills)
    form.setValue('skills', updatedSkills)
  }

  const addAchievement = () => {
    if (newAchievement.trim() !== '') {
      const updatedAchievements = [...achievements, newAchievement]
      setAchievements(updatedAchievements)
      form.setValue('achievements', updatedAchievements)
      setNewAchievement('')
    }
  }

  const addAchievementTemplate = (template: string) => {
    const updatedAchievements = [...achievements, template]
    setAchievements(updatedAchievements)
    form.setValue('achievements', updatedAchievements)
  }

  const removeAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index)
    setAchievements(updatedAchievements)
    form.setValue('achievements', updatedAchievements)
  }

  return (
    <main className={s.main}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Card.Root>
            <Card.Title>
              Главное
            </Card.Title>
            <Card.Content>
              <Stack dir='column' ai='stretch' gap={16}>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя / Фамилия</FormLabel>
                      <FormControl>
                        <Input placeholder='Иван Иванов' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Желаемая должность */}
                <FormField
                  control={form.control}
                  name='desiredPosition'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Желаемая должность (для таргетинга)</FormLabel>
                      <FormControl>
                        <Input placeholder='Frontend Developer' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Опыт в годах */}
                <FormField
                  control={form.control}
                  name='experienceYears'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Опыт в годах</FormLabel>
                      <FormControl>
                        <Input type='number' min='0' placeholder='3' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Последние места работы */}
                <FormField
                  control={form.control}
                  name='workplaces'
                  render={() => (
                    <FormItem>
                      <FormLabel>Последние 2-3 места работы</FormLabel>
                      <div className='space-y-2'>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='Компания, должность, период работы'
                            value={newWorkplace}
                            onChange={(e) => setNewWorkplace(e.target.value)}
                          />
                          <Button img='Plus' type='button' onClick={addWorkplace} />
                        </div>
                        <div className='space-y-2'>
                          {workplaces.map((workplace, index) => (
                            <div key={index} className='flex items-center gap-2'>
                              <div className='rounded-md border px-3 py-2 text-sm flex-1'>{workplace}</div>
                              <Button type='button' img='X' variant='ghost' onClick={() => removeWorkplace(index)} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Образование */}
                <FormField
                  control={form.control}
                  name='education'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Образование (опционально)</FormLabel>
                      <FormControl>
                        <Textarea placeholder='Университет, специальность, годы обучения' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Навыки */}
                <FormField
                  control={form.control}
                  name='skills'
                  render={() => (
                    <FormItem>
                      <FormLabel>Навыки (с автодополнением)</FormLabel>
                      <div className='space-y-4'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button img='ChevronsUpDown' variant='outline' role='combobox' className='w-full justify-between'>
                              Выберите навыки
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-full p-0'>
                            <Command>
                              <CommandInput placeholder='Поиск навыка...' />
                              <CommandList>
                                <CommandEmpty>Навык не найден.</CommandEmpty>
                                <CommandGroup className='max-h-64 overflow-auto'>
                                  {skillsList.map((skill) => (
                                    <CommandItem key={skill} value={skill} onSelect={() => addSkill(skill)}>
                                      <Icon
                                        name='Check'
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          selectedSkills.includes(skill) ? 'opacity-100' : 'opacity-0',
                                        )}
                                      />
                                      {skill}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <div className='flex flex-wrap gap-2'>
                          {selectedSkills.map((skill) => (
                            <Badge key={skill} variant='gray-subtle'>
                              {skill}
                              <Button
                                type='button'
                                variant='ghost'
                                className='h-auto p-0 ml-1'
                                onClick={() => removeSkill(skill)}
                              >
                                <Icon size={12} name='X' />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Достижения */}
                <FormField
                  control={form.control}
                  name='achievements'
                  render={() => (
                    <FormItem>
                      <FormLabel>Достижения</FormLabel>
                      <div className='space-y-4'>
                        <div className='flex gap-2'>
                          <Input
                            placeholder='Опишите ваше достижение'
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                          />
                          <Button type='button' img='Plus' onClick={addAchievement} size='sm' />
                        </div>

                        <div>
                          <FormLabel className='text-sm'>Или выберите из шаблонов:</FormLabel>
                          <Select.Root onValueChange={addAchievementTemplate}>
                            <Select.Trigger>
                              <Select.Value placeholder='Выберите шаблон' />
                            </Select.Trigger>
                            <Select.Content>
                              {achievementTemplates.map((template, index) => (
                                <Select.Item key={index} value={template}>
                                  {template}
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </div>

                        <div className='space-y-2'>
                          {achievements.map((achievement, index) => (
                            <div key={index} className='flex items-center gap-2'>
                              <div className='rounded-md border px-3 py-2 text-sm flex-1'>{achievement}</div>
                              <Button img='X' type='button' variant='ghost' size='sm' onClick={() => removeAchievement(index)} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Сфера */}
                <FormField
                  control={form.control}
                  name='industry'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сфера</FormLabel>
                      <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <Select.Trigger>
                            <Select.Value placeholder='Выберите сферу деятельности' />
                          </Select.Trigger>
                        </FormControl>
                        <Select.Content>
                          {industries.map((industry) => (
                            <Select.Item key={industry.value} value={industry.value}>
                              {industry.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Stack>
            </Card.Content>
          </Card.Root>
          <Button type='submit' className='w-full'>
            Сохранить профиль
          </Button>
        </form>
      </Form>
    </main>
  )
}
