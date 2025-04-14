"use client"
import s from "./page.module.css"
import { useCallback, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Icon } from "@impactium/icons"
import * as z from "zod"
import { Card } from "@/ui/card"
import { Input, Button, Badge } from "@impactium/components"
import { Select } from "@/ui/Select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form"
import { Command } from "@/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover"
import { Textarea } from "@/ui/textarea"
import { Stack } from "@impactium/components/stack"
import { Slider } from "@/ui/slider"
import { cn } from "@impactium/utils"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Имя должно содержать минимум 2 символа",
  }),
  coname: z.string().min(2, {
    message: "Фамилия должна содержать минимум 2 символа",
  }),
  desiredPosition: z.string().min(2, {
    message: "Укажите желаемую должность",
  }),
  experienceYears: z.string().min(1, {
    message: "Укажите опыт работы в годах",
  }),
  workplaces: z
    .array(
      z.object({
        name: z.string(),
        start: z.number(),
        duration: z.number(),
        achievements: z.array(z.string()),
        technologies: z.array(z.string()),
        country: z.string(),
        logo: z.string().nullable(),
        size: z.number(),
        type: z.string(),
      }),
    )
    .min(1, {
      message: "Укажите минимум 1 место работы",
    }),
  education: z.string().optional(),
  skills: z.array(z.string()).min(1, {
    message: "Укажите минимум 1 навык",
  }),
  achievements: z.array(z.string()).optional(),
  industry: z.string({
    required_error: "Выберите сферу деятельности",
  }),
})

const industries = [
  { label: "Tech", value: "tech" },
  { label: "Marketing", value: "marketing" },
  { label: "Design", value: "design" },
  { label: "Finance", value: "finance" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Other", value: "other" },
]

const skillsList: Record<string, Icon.Name> = {
  "JavaScript": 'AcronymJs',
  "TypeScript": 'AcronymTs',
  "React": 'LogoReact',
  "Next.js": 'LogoNext',
  "Node.js": 'LogoNode',
  "Python": 'LogoPython',
  "Java": 'Coffee',
  "C#": 'Dot',
  "PHP": 'FaceSad',
  "HTML": 'Code',
  "CSS": 'Code',
  "SQL": 'Status',
  "MongoDB": 'Status',
  "PostgreSQL": 'Postgres',
  "AWS": 'Servers',
  "Azure": 'LogoAzure',
  "Docker": 'LogoDocker',
  "Kubernetes": 'Servers',
  "Git": 'LogoGithub',
  "CI/CD": 'Status',
  "Agile": 'Status',
  "Scrum": 'Status',
  "Project Management": 'Status',
  "UI/UX Design": 'Status',
  "Figma": 'Figma',
  "Adobe Photoshop": 'Status',
  "Adobe Illustrator": 'Status',
  "SEO": 'MagnifyingGlass',
  "Content Marketing": 'Status',
  "Social Media Marketing": 'Status',
  "Email Marketing": 'Status',
  "Data Analysis": 'Status',
  "Machine Learning": 'Cpu',
  "AI": 'Robot',
  "Blockchain": 'Status',
}

const achievementTemplates = [
  "Увеличил(а) продажи на X% за Y месяцев",
  "Оптимизировал(а) процесс, сократив время выполнения на X%",
  "Руководил(а) командой из X человек",
  "Успешно запустил(а) X проектов в срок и в рамках бюджета",
  "Разработал(а) стратегию, которая привела к X результату",
  "Внедрил(а) новую технологию/систему, что привело к X улучшению",
  "Получил(а) награду/признание за X достижение",
]

interface Workplace {
  name: string
  start: number
  duration: number
  achievements: string[]
  technologies: string[]
  country: string
  logo: string | null
  size: number
  type: string
}

const baseWorkplace: Workplace = {
  name: "",
  start: new Date().getFullYear(),
  duration: 1,
  achievements: [],
  technologies: [],
  country: "US",
  logo: null,
  size: 1,
  type: "product",
}

const companyTypes = [
  { label: "Продуктовая", value: "product" },
  { label: "Аутсорс", value: "outsource" },
  { label: "Стартап", value: "startup" },
  { label: "Фриланс", value: "freelance" },
  { label: "Корпорация", value: "corporation" },
]

const companySizes = [
  { label: "1-10", value: 1 },
  { label: "11-50", value: 2 },
  { label: "51-200", value: 3 },
  { label: "201-500", value: 4 },
  { label: "501-1000", value: 5 },
  { label: "1000+", value: 6 },
]

const countries = [
  { label: "США", value: "US" },
  { label: "Россия", value: "RU" },
  { label: "Германия", value: "DE" },
  { label: "Великобритания", value: "GB" },
  { label: "Канада", value: "CA" },
  { label: "Австралия", value: "AU" },
  { label: "Франция", value: "FR" },
  { label: "Испания", value: "ES" },
  { label: "Италия", value: "IT" },
  { label: "Япония", value: "JP" },
]

export default function ProfileForm() {
  const [progress, setProgress] = useState<number>(0)
  const [workplaces, setWorkplaces] = useState<Workplace[]>([])
  const [newWorkplace, setNewWorkplace] = useState<Workplace>({ ...baseWorkplace })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [showWorkplaceForm, setShowWorkplaceForm] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      coname: "",
      desiredPosition: "",
      experienceYears: "",
      workplaces: [],
      education: "",
      skills: [],
      achievements: [],
      industry: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const addWorkplace = () => {
    if (newWorkplace.name.trim() !== "") {
      const updatedWorkplaces = [...workplaces, newWorkplace]
      setWorkplaces(updatedWorkplaces)
      form.setValue("workplaces", updatedWorkplaces)
      setNewWorkplace({ ...baseWorkplace })
      setShowWorkplaceForm(false)
    }
  }

  const removeWorkplace = (index: number) => {
    const updatedWorkplaces = workplaces.filter((_, i) => i !== index)
    setWorkplaces(updatedWorkplaces)
    form.setValue("workplaces", updatedWorkplaces)
  }

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill]
      setSelectedSkills(updatedSkills)
      form.setValue("skills", updatedSkills)
    }
  }

  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(updatedSkills)
    form.setValue("skills", updatedSkills)
  }

  const addAchievement = () => {
    if (newAchievement.trim() !== "") {
      const updatedAchievements = [...achievements, newAchievement]
      setAchievements(updatedAchievements)
      form.setValue("achievements", updatedAchievements)
      setNewAchievement("")
    }
  }

  const addAchievementTemplate = (template: string) => {
    const updatedAchievements = [...achievements, template]
    setAchievements(updatedAchievements)
    form.setValue("achievements", updatedAchievements)
  }

  const removeAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index)
    setAchievements(updatedAchievements)
    form.setValue("achievements", updatedAchievements)
  }

  const updateNewWorkplace = (field: keyof Workplace, value: any) => {
    setNewWorkplace((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= currentYear - 30; i--) {
      years.push(i)
    }
    return years
  }, []);

  const NoPreviousExperience = useMemo(() => {
    return (
      <Stack className={s.noPreviousExperience} jc='center' gap={12}>
        <Icon name='FaceSad' size={24} />
        <p>No previous experience</p>
      </Stack>
    )
  }, []);

  return (
    <main className={s.main}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card.Root>
            <Card.Header>
              <Card.Title>Главное</Card.Title>
            </Card.Header>
            <Card.Content>
              <Stack dir="column" ai="stretch" gap={16}>
                <Stack ai="stretch">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem flex>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder="Иван" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coname"
                    render={({ field }) => (
                      <FormItem flex>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <Input placeholder="Иванов" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Stack>
                <FormField
                  control={form.control}
                  name="desiredPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Желаемая должность</FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Опыт в годах</FormLabel>
                        <FormControl>
                          <Slider defaultValue={[3]} max={10} step={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </Stack>
            </Card.Content>
            <Card.Description>
              <p>Укажите настоящее количество опыта. В дальнейшем вы сможете сгенерировать резюме с разными данными</p>
            </Card.Description>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Опыт работы</Card.Title>
              <Badge value="Beta" variant="amber-subtle" icon="Warning" style={{ marginRight: "auto" }} />
            </Card.Header>
            <Card.Content>
              <Stack dir="column" gap={16} ai="stretch">
                <FormField
                  control={form.control}
                  name="workplaces"
                  render={() => (
                    <FormItem>
                      {workplaces.length > 0 ? (
                        <Stack dir="column" ai="stretch" gap={16}>
                          {workplaces.map((workplace, index) => (
                            <Card.Root key={index} style={{ background: 'var(--meta-black)' }}>
                              <Card.Header>
                                <Card.Title>
                                  {workplace.name}
                                </Card.Title>
                                <Button
                                  type="button"
                                  img="X"
                                  variant="ghost"
                                  onClick={() => removeWorkplace(index)}
                                />
                              </Card.Header>
                              <Card.Content>
                                <Stack dir="column" ai="stretch" gap={16}>
                                  <Stack>
                                    <Badge
                                      value={`${workplace.start} - ${workplace.start + workplace.duration}`}
                                      variant="green-subtle"
                                    />
                                    <Badge
                                      value={
                                        countries.find((c) => c.value === workplace.country)?.label ||
                                        workplace.country
                                      }
                                      variant="blue-subtle"
                                    />
                                    <Badge
                                      value={companyTypes.find((t) => t.value === workplace.type)?.label || workplace.type}
                                      variant="purple-subtle"
                                    />
                                  </Stack>
                                </Stack>
                              </Card.Content>
                              <Card.Footer />
                            </Card.Root>
                          ))}
                        </Stack>
                      ) : (showWorkplaceForm ? null : NoPreviousExperience)}
                      <Stack dir="column" ai="stretch" gap={16}>
                        {!showWorkplaceForm ? (
                          <Button style={{ alignSelf: 'flex-end' }} type="button" img="Plus" onClick={() => setShowWorkplaceForm(true)}>
                            Добавить место работы
                          </Button>
                        ) : (
                          <Card.Root style={{ background: 'var(--meta-black)' }}>
                            <Card.Header>
                              <Card.Title>Новое место работы</Card.Title>
                            </Card.Header>
                            <Card.Content>
                              <Stack dir="column" ai="stretch" gap={16}>
                                <FormItem>
                                  <FormLabel>Название компании</FormLabel>
                                  <Input
                                    variant='highlighted'
                                    img='Building2'
                                    placeholder="Название компании"
                                    value={newWorkplace.name}
                                    onChange={(e) => updateNewWorkplace("name", e.target.value)}
                                  />
                                </FormItem>

                                <Stack>
                                  <FormItem style={{ flex: 1 }}>
                                    <FormLabel>Год начала</FormLabel>
                                    <Select.Root
                                      value={String(newWorkplace.start)}
                                      onValueChange={(value) => updateNewWorkplace("start", Number(value))}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder="Год начала" />
                                      </Select.Trigger>
                                      <Select.Content>
                                        {getYearOptions().map((year) => (
                                          <Select.Item key={year} value={String(year)}>
                                            {year}
                                          </Select.Item>
                                        ))}
                                      </Select.Content>
                                    </Select.Root>
                                  </FormItem>
                                  <FormItem style={{ flex: 1 }}>
                                    <FormLabel>Длительность (лет)</FormLabel>
                                    <Select.Root
                                      value={String(newWorkplace.duration)}
                                      onValueChange={(value) => updateNewWorkplace("duration", Number(value))}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder="Длительность" />
                                      </Select.Trigger>
                                      <Select.Content>
                                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10].map((duration) => (
                                          <Select.Item key={duration} value={String(duration)}>
                                            {duration} {duration === 1 ? "год" : duration < 5 ? "года" : "лет"}
                                          </Select.Item>
                                        ))}
                                      </Select.Content>
                                    </Select.Root>
                                  </FormItem>
                                </Stack>

                                <Stack>
                                  <FormItem style={{ flex: 1 }}>
                                    <FormLabel>Тип компании</FormLabel>
                                    <Select.Root
                                      value={newWorkplace.type}
                                      onValueChange={(value) => updateNewWorkplace("type", value)}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder="Тип компании" />
                                      </Select.Trigger>
                                      <Select.Content>
                                        {companyTypes.map((type) => (
                                          <Select.Item key={type.value} value={type.value}>
                                            {type.label}
                                          </Select.Item>
                                        ))}
                                      </Select.Content>
                                    </Select.Root>
                                  </FormItem>

                                  <FormItem style={{ flex: 1 }}>
                                    <FormLabel>Размер компании</FormLabel>
                                    <Select.Root
                                      value={String(newWorkplace.size)}
                                      onValueChange={(value) => updateNewWorkplace("size", Number(value))}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder="Размер компании" />
                                      </Select.Trigger>
                                      <Select.Content>
                                        {companySizes.map((size) => (
                                          <Select.Item key={size.value} value={String(size.value)}>
                                            {size.label}
                                          </Select.Item>
                                        ))}
                                      </Select.Content>
                                    </Select.Root>
                                  </FormItem>
                                </Stack>

                                <FormItem>
                                  <FormLabel>Страна</FormLabel>
                                  <Select.Root
                                    value={newWorkplace.country}
                                    onValueChange={(value) => updateNewWorkplace("country", value)}
                                  >
                                    <Select.Trigger>
                                      <Select.Value placeholder="Страна" />
                                    </Select.Trigger>
                                    <Select.Content>
                                      {countries.map((country) => (
                                        <Select.Item key={country.value} value={country.value}>
                                          {country.label}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Root>
                                </FormItem>
                                <Stack>
                                  <Button type="button" onClick={addWorkplace}>
                                    Добавить
                                  </Button>
                                  <Button type="button" variant="ghost" onClick={() => setShowWorkplaceForm(false)}>
                                    Отмена
                                  </Button>
                                </Stack>
                              </Stack>
                            </Card.Content>
                            <Card.Footer />
                          </Card.Root>
                        )}
                      </Stack>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Stack>
            </Card.Content>
            <Card.Footer></Card.Footer>
          </Card.Root>
          <Card.Root>
            <Card.Header>
              <Card.Title>Навыки и достижения</Card.Title>
            </Card.Header>
            <Card.Content>
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <Stack dir="column" gap={16} ai="stretch">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            img="ChevronsUpDown"
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Выберите навыки
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <Command.Input placeholder="Поиск навыка..." />
                            <Command.List>
                              <Command.Empty>Навык не найден.</Command.Empty>
                              <Command.Group className="max-h-64 overflow-auto">
                                {Object.keys(skillsList).map((skill) => (
                                  <Command.Item key={skill} value={skill} onSelect={() => addSkill(skill)} className={cn(!selectedSkills.includes(skill) && s.dimmed)}>
                                    <Icon name={skillsList[skill]} />
                                    {skill}
                                  </Command.Item>
                                ))}
                              </Command.Group>
                            </Command.List>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <Stack style={{ flexWrap: "wrap" }}>
                        {selectedSkills.map((skill) => (
                          <Badge
                            icon="X"
                            key={skill}
                            variant="gray-subtle"
                            value={skill}
                            onClick={() => removeSkill(skill)}
                          />
                        ))}
                      </Stack>
                    </Stack>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Достижения */}
              <FormField
                control={form.control}
                name="achievements"
                render={() => (
                  <FormItem>
                    <FormLabel>Достижения</FormLabel>
                    <Stack gap={16} dir="column" ai="stretch">
                      <Stack>
                        <Input
                          placeholder="Опишите ваше достижение"
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                        />
                        <Button type="button" img="Plus" onClick={addAchievement} />
                      </Stack>
                      <FormLabel style={{ fontSize: 11 }}>Или выберите из шаблонов:</FormLabel>
                      <Select.Root onValueChange={addAchievementTemplate}>
                        <Select.Trigger>
                          <Select.Value placeholder="Выберите шаблон" />
                        </Select.Trigger>
                        <Select.Content>
                          {achievementTemplates.map((template, index) => (
                            <Select.Item key={index} value={template}>
                              {template}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>

                      <Stack gap={16} dir="column" ai="stretch">
                        {achievements.map((achievement, index) => (
                          <Stack key={index}>
                            <div className="rounded-md border px-3 py-2 text-sm flex-1">{achievement}</div>
                            <Button img="X" type="button" variant="ghost" onClick={() => removeAchievement(index)} />
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Сфера */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Сфера</FormLabel>
                    <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <Select.Trigger>
                          <Icon name="Trophy" />
                          <p>{field.value ?? "Выберите сферу деятельности"}</p>
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
            </Card.Content>
            <Card.Footer></Card.Footer>
          </Card.Root>
          <Card.Root>
            <Card.Header>
              <Card.Title>Образование и сертификаты</Card.Title>
            </Card.Header>
            <Card.Content>
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Образование</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Университет, специальность, годы обучения" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card.Content>
            <Card.Description>
              <p>
                Хоть и рекрутеры не часто проверяют актуальность сертификатов, мы не рекомендуем тут врать. Получить
                сертификацию Vercel или AWS улучшит вашу компетенцию, так ещё и за бесплатно
              </p>
            </Card.Description>
          </Card.Root>
          <Button type="submit" style={{ width: "100%" }} img="Sparkles">
            Сгенерировать резюме
          </Button>
        </form>
      </Form>
    </main >
  )
}
