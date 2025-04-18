'use client'
import s from './page.module.css'
import { useCallback, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Icon } from '@impactium/icons'
import z from 'zod'
import { Card } from '@/ui/card'
import { Stack, Input, Button, Badge } from '@impactium/components'
import { Select } from '@/ui/Select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Command } from '@/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { Textarea } from '@/ui/textarea'
import { Slider } from '@/ui/slider'
import { cn } from '@impactium/utils'
import { Separator } from '@/ui/Separator'
import { Spinner } from '@impactium/components'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Имя должно содержать минимум 2 символа',
  }),
  coname: z.string().min(2, {
    message: 'Фамилия должна содержать минимум 2 символа',
  }),
  linkedin: z.string().min(2, {
    message: 'Ссылка неправильная',
  }),
  desiredPosition: z.string().min(2, {
    message: 'Укажите желаемую должность',
  }),
  experienceYears: z.number().min(0, {
    message: 'Укажите опыт работы в годах',
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
        position: z.string(),
        linkedin: z.string().optional()
      }),
    )
    .min(1, {
      message: 'Укажите минимум 1 место работы',
    }),
  education: z.string().optional(),
  skills: z.array(z.string()).min(1, {
    message: 'Укажите минимум 1 навык',
  }),
  achievements: z.array(z.string()).optional(),
})

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
  'Blockchain'
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
  position: string
  linkedin: string
}

const baseWorkplace: Workplace = {
  name: '',
  start: new Date().getFullYear(),
  duration: 1,
  achievements: [],
  technologies: [],
  country: 'US',
  logo: null,
  size: 1,
  type: 'product',
  position: '',
  linkedin: ''
}

const companyTypes = [
  { label: 'Продуктовая', value: 'product' },
  { label: 'Аутсорс', value: 'outsource' },
  { label: 'Стартап', value: 'startup' },
  { label: 'Фриланс', value: 'freelance' },
  { label: 'Корпорация', value: 'corporation' },
]

const companySizes = [
  { label: '1-10', value: 1 },
  { label: '11-50', value: 2 },
  { label: '51-200', value: 3 },
  { label: '201-500', value: 4 },
  { label: '501-1000', value: 5 },
  { label: '1000+', value: 6 },
]

const countries = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'land Islands', value: 'AX' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'AndorrA', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Anguilla', value: 'AI' },
  { label: 'Antarctica', value: 'AQ' },
  { label: 'Antigua and Barbuda', value: 'AG' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Aruba', value: 'AW' },
  { label: 'Australia', value: 'AU' },
  { label: 'Austria', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahamas', value: 'BS' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Barbados', value: 'BB' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Belgium', value: 'BE' },
  { label: 'Belize', value: 'BZ' },
  { label: 'Benin', value: 'BJ' },
  { label: 'Bermuda', value: 'BM' },
  { label: 'Bhutan', value: 'BT' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia and Herzegovina', value: 'BA' },
  { label: 'Botswana', value: 'BW' },
  { label: 'Bouvet Island', value: 'BV' },
  { label: 'Brazil', value: 'BR' },
  { label: 'British Indian Ocean Territory', value: 'IO' },
  { label: 'Brunei Darussalam', value: 'BN' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Burkina Faso', value: 'BF' },
  { label: 'Burundi', value: 'BI' },
  { label: 'Cambodia', value: 'KH' },
  { label: 'Cameroon', value: 'CM' },
  { label: 'Canada', value: 'CA' },
  { label: 'Cape Verde', value: 'CV' },
  { label: 'Cayman Islands', value: 'KY' },
  { label: 'Central African Republic', value: 'CF' },
  { label: 'Chad', value: 'TD' },
  { label: 'Chile', value: 'CL' },
  { label: 'China', value: 'CN' },
  { label: 'Christmas Island', value: 'CX' },
  { label: 'Cocos (Keeling) Islands', value: 'CC' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Comoros', value: 'KM' },
  { label: 'Congo', value: 'CG' },
  { label: 'Congo, The Democratic Republic of the', value: 'CD' },
  { label: 'Cook Islands', value: 'CK' },
  { label: 'Costa Rica', value: 'CR' },
  { label: 'Cote D\'Ivoire', value: 'CI' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cuba', value: 'CU' },
  { label: 'Cyprus', value: 'CY' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Djibouti', value: 'DJ' },
  { label: 'Dominica', value: 'DM' },
  { label: 'Dominican Republic', value: 'DO' },
  { label: 'Ecuador', value: 'EC' },
  { label: 'Egypt', value: 'EG' },
  { label: 'El Salvador', value: 'SV' },
  { label: 'Equatorial Guinea', value: 'GQ' },
  { label: 'Eritrea', value: 'ER' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Falkland Islands (Malvinas)', value: 'FK' },
  { label: 'Faroe Islands', value: 'FO' },
  { label: 'Fiji', value: 'FJ' },
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'French Guiana', value: 'GF' },
  { label: 'French Polynesia', value: 'PF' },
  { label: 'French Southern Territories', value: 'TF' },
  { label: 'Gabon', value: 'GA' },
  { label: 'Gambia', value: 'GM' },
  { label: 'Georgia', value: 'GE' },
  { label: 'Germany', value: 'DE' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Gibraltar', value: 'GI' },
  { label: 'Greece', value: 'GR' },
  { label: 'Greenland', value: 'GL' },
  { label: 'Grenada', value: 'GD' },
  { label: 'Guadeloupe', value: 'GP' },
  { label: 'Guam', value: 'GU' },
  { label: 'Guatemala', value: 'GT' },
  { label: 'Guernsey', value: 'GG' },
  { label: 'Guinea', value: 'GN' },
  { label: 'Guinea-Bissau', value: 'GW' },
  { label: 'Guyana', value: 'GY' },
  { label: 'Haiti', value: 'HT' },
  { label: 'Heard Island and Mcdonald Islands', value: 'HM' },
  { label: 'Holy See (Vatican City State)', value: 'VA' },
  { label: 'Honduras', value: 'HN' },
  { label: 'Hong Kong', value: 'HK' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'India', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Iran, Islamic Republic Of', value: 'IR' },
  { label: 'Iraq', value: 'IQ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Isle of Man', value: 'IM' },
  { label: 'Israel', value: 'IL' },
  { label: 'Italy', value: 'IT' },
  { label: 'Jamaica', value: 'JM' },
  { label: 'Japan', value: 'JP' },
  { label: 'Jersey', value: 'JE' },
  { label: 'Jordan', value: 'JO' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Kiribati', value: 'KI' },
  { label: 'Korea, Democratic Peoples Republic of', value: 'KP' },
  { label: 'Korea, Republic of', value: 'KR' },
  { label: 'Kuwait', value: 'KW' },
  { label: 'Kyrgyzstan', value: 'KG' },
  { label: 'Lao Peoples Democratic Republic', value: 'LA' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Lebanon', value: 'LB' },
  { label: 'Lesotho', value: 'LS' },
  { label: 'Liberia', value: 'LR' },
  { label: 'Libyan Arab Jamahiriya', value: 'LY' },
  { label: 'Liechtenstein', value: 'LI' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Macao', value: 'MO' },
  { label: 'Macedonia, The Former Yugoslav Republic of', value: 'MK' },
  { label: 'Madagascar', value: 'MG' },
  { label: 'Malawi', value: 'MW' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Maldives', value: 'MV' },
  { label: 'Mali', value: 'ML' },
  { label: 'Malta', value: 'MT' },
  { label: 'Marshall Islands', value: 'MH' },
  { label: 'Martinique', value: 'MQ' },
  { label: 'Mauritania', value: 'MR' },
  { label: 'Mauritius', value: 'MU' },
  { label: 'Mayotte', value: 'YT' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Micronesia, Federated States of', value: 'FM' },
  { label: 'Moldova, Republic of', value: 'MD' },
  { label: 'Monaco', value: 'MC' },
  { label: 'Mongolia', value: 'MN' },
  { label: 'Montenegro', value: 'ME' },
  { label: 'Montserrat', value: 'MS' },
  { label: 'Morocco', value: 'MA' },
  { label: 'Mozambique', value: 'MZ' },
  { label: 'Myanmar', value: 'MM' },
  { label: 'Namibia', value: 'NA' },
  { label: 'Nauru', value: 'NR' },
  { label: 'Nepal', value: 'NP' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'Netherlands Antilles', value: 'AN' },
  { label: 'New Caledonia', value: 'NC' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Nicaragua', value: 'NI' },
  { label: 'Niger', value: 'NE' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Niue', value: 'NU' },
  { label: 'Norfolk Island', value: 'NF' },
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Norway', value: 'NO' },
  { label: 'Oman', value: 'OM' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Palau', value: 'PW' },
  { label: 'Palestinian Territory, Occupied', value: 'PS' },
  { label: 'Panama', value: 'PA' },
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Paraguay', value: 'PY' },
  { label: 'Peru', value: 'PE' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Pitcairn', value: 'PN' },
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Qatar', value: 'QA' },
  { label: 'Reunion', value: 'RE' },
  { label: 'Romania', value: 'RO' },
  { label: 'Russian Federation', value: 'RU' },
  { label: 'RWANDA', value: 'RW' },
  { label: 'Saint Helena', value: 'SH' },
  { label: 'Saint Kitts and Nevis', value: 'KN' },
  { label: 'Saint Lucia', value: 'LC' },
  { label: 'Saint Pierre and Miquelon', value: 'PM' },
  { label: 'Saint Vincent and the Grenadines', value: 'VC' },
  { label: 'Samoa', value: 'WS' },
  { label: 'San Marino', value: 'SM' },
  { label: 'Sao Tome and Principe', value: 'ST' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Senegal', value: 'SN' },
  { label: 'Serbia', value: 'RS' },
  { label: 'Seychelles', value: 'SC' },
  { label: 'Sierra Leone', value: 'SL' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Solomon Islands', value: 'SB' },
  { label: 'Somalia', value: 'SO' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'South Georgia and the South Sandwich Islands', value: 'GS' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'Sudan', value: 'SD' },
  { label: 'Suriname', value: 'SR' },
  { label: 'Svalbard and Jan Mayen', value: 'SJ' },
  { label: 'Swaziland', value: 'SZ' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Switzerland', value: 'CH' },
  { label: 'Syrian Arab Republic', value: 'SY' },
  { label: 'Taiwan, Province of China', value: 'TW' },
  { label: 'Tajikistan', value: 'TJ' },
  { label: 'Tanzania, United Republic of', value: 'TZ' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Timor-Leste', value: 'TL' },
  { label: 'Togo', value: 'TG' },
  { label: 'Tokelau', value: 'TK' },
  { label: 'Tonga', value: 'TO' },
  { label: 'Trinidad and Tobago', value: 'TT' },
  { label: 'Tunisia', value: 'TN' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Turkmenistan', value: 'TM' },
  { label: 'Turks and Caicos Islands', value: 'TC' },
  { label: 'Tuvalu', value: 'TV' },
  { label: 'Uganda', value: 'UG' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'United Arab Emirates', value: 'AE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'United States Minor Outlying Islands', value: 'UM' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Uzbekistan', value: 'UZ' },
  { label: 'Vanuatu', value: 'VU' },
  { label: 'Venezuela', value: 'VE' },
  { label: 'Viet Nam', value: 'VN' },
  { label: 'Virgin Islands, British', value: 'VG' },
  { label: 'Virgin Islands, U.S.', value: 'VI' },
  { label: 'Wallis and Futuna', value: 'WF' },
  { label: 'Western Sahara', value: 'EH' },
  { label: 'Yemen', value: 'YE' },
  { label: 'Zambia', value: 'ZM' },
  { label: 'Zimbabwe', value: 'ZW' }
]

export default function ProfileForm() {
  const [progress, setProgress] = useState<number>(0)
  const [workplaces, setWorkplaces] = useState<Workplace[]>([])
  const [newWorkplace, setNewWorkplace] = useState<Workplace>({ ...baseWorkplace })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState('')
  const [showWorkplaceForm, setShowWorkplaceForm] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      coname: '',
      linkedin: '',
      desiredPosition: '',
      experienceYears: 1,
      workplaces: [],
      education: '',
      skills: [],
      achievements: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const addWorkplace = () => {
    if (newWorkplace.name.trim() !== '') {
      const updatedWorkplaces = [...workplaces, newWorkplace]
      setWorkplaces(updatedWorkplaces)
      form.setValue('workplaces', updatedWorkplaces)
      setNewWorkplace({ ...baseWorkplace })
      setShowWorkplaceForm(false)
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

  const removeAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index)
    setAchievements(updatedAchievements)
    form.setValue('achievements', updatedAchievements)
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
              <Stack dir='column' ai='stretch' gap={16}>
                <Stack ai='stretch'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem flex>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                          <Input placeholder='Иван' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='coname'
                    render={({ field }) => (
                      <FormItem flex>
                        <FormLabel>Фамилия</FormLabel>
                        <FormControl>
                          <Input placeholder='Иванов' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Stack>
                <FormField
                  control={form.control}
                  name='desiredPosition'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Желаемая должность</FormLabel>
                      <FormControl>
                        <Input placeholder='Frontend Developer' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='linkedin'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на LinkedIn</FormLabel>
                      <FormControl>
                        <Input variant='highlighted' img='Linkedin' placeholder='https://www.linkedin.com/in/...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='experienceYears'
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Опыт в годах</FormLabel>
                        <FormControl>
                          <Stack>
                            <Slider defaultValue={[3]} max={10} step={1} {...field} onValueChange={v => field.onChange(v[0])} onChange={undefined} value={[field.value]} />
                            <p className={s.years_indicator}>{field.value === 10 ? field.value + '+' : field.value}</p>
                          </Stack>
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
            </Card.Header>
            <Card.Content>
              <Stack dir='column' gap={16} ai='stretch'>
                <FormField
                  control={form.control}
                  name='workplaces'
                  render={() => (
                    <FormItem>
                      {workplaces.length > 0 ? (
                        <Stack dir='column' ai='stretch' gap={16}>
                          {workplaces.map((workplace, index) => (
                            <Card.Root key={index} style={{ background: 'var(--meta-black)' }}>
                              <Card.Header>
                                <Card.Title>
                                  {workplace.name}
                                </Card.Title>
                                <Button
                                  type='button'
                                  img='X'
                                  variant='ghost'
                                  onClick={() => removeWorkplace(index)}
                                />
                              </Card.Header>
                              <Card.Content>
                                <Stack dir='column' ai='stretch' gap={16}>
                                  <Stack>
                                    <Badge
                                      value={`${workplace.start} - ${workplace.start + workplace.duration}`}
                                      variant='green-subtle'
                                    />
                                    <Badge
                                      value={
                                        countries.find((c) => c.value === workplace.country)?.label ||
                                        workplace.country
                                      }
                                      variant='blue-subtle'
                                    />
                                    <Badge
                                      value={companyTypes.find((t) => t.value === workplace.type)?.label || workplace.type}
                                      variant='purple-subtle'
                                    />
                                  </Stack>
                                </Stack>
                              </Card.Content>
                              <Card.Footer />
                            </Card.Root>
                          ))}
                        </Stack>
                      ) : (showWorkplaceForm ? null : NoPreviousExperience)}
                      <Stack dir='column' ai='stretch' gap={16}>
                        {!showWorkplaceForm ? (
                          <Button style={{ alignSelf: 'flex-end' }} type='button' img='Plus' onClick={() => setShowWorkplaceForm(true)}>
                            Добавить место работы
                          </Button>
                        ) : (
                          <Card.Root style={{ background: 'var(--meta-black)' }}>
                            <Card.Header>
                              <Card.Title>Новое место работы</Card.Title>
                            </Card.Header>
                            <Card.Content>
                              <Stack dir='column' ai='stretch' gap={16}>
                                <FormItem>
                                  <FormLabel>Название компании</FormLabel>
                                  <Input
                                    variant='highlighted'
                                    img='Building2'
                                    placeholder='Название компании'
                                    value={newWorkplace.name}
                                    onChange={(e) => updateNewWorkplace('name', e.target.value)}
                                  />
                                </FormItem>
                                <FormItem>
                                  <FormLabel>Должность</FormLabel>
                                  <Input
                                    placeholder='Занимаемая должность'
                                    value={newWorkplace.position}
                                    onChange={(e) => updateNewWorkplace('position', e.target.value)}
                                  />
                                </FormItem>
                                <FormField
                                  control={form.control}
                                  name='linkedin'
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ссылка на LinkedIn компании</FormLabel>
                                      <FormControl>
                                        <Input variant='highlighted' img='Linkedin' placeholder='https://www.linkedin.com/in/...' {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Stack>
                                  <FormItem style={{ flex: 1 }}>
                                    <FormLabel>Год начала</FormLabel>
                                    <Select.Root
                                      value={String(newWorkplace.start)}
                                      onValueChange={(value) => updateNewWorkplace('start', Number(value))}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder='Год начала' />
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
                                    <FormLabel>Отработал</FormLabel>
                                    <Select.Root
                                      value={String(newWorkplace.duration)}
                                      onValueChange={(value) => updateNewWorkplace('duration', Number(value))}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder='Длительность' />
                                      </Select.Trigger>
                                      <Select.Content>
                                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10].map((duration) => (
                                          <Select.Item key={duration} value={String(duration)}>
                                            {duration} {duration === 1 ? 'год' : duration < 5 ? 'года' : 'лет'}
                                          </Select.Item>
                                        ))}
                                      </Select.Content>
                                    </Select.Root>
                                  </FormItem>
                                  <FormItem style={{ flex: 1 }}>
                                    <FormLabel>Тип компании</FormLabel>
                                    <Select.Root
                                      value={newWorkplace.type}
                                      onValueChange={(value) => updateNewWorkplace('type', value)}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder='Тип компании' />
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
                                      onValueChange={(value) => updateNewWorkplace('size', Number(value))}
                                    >
                                      <Select.Trigger>
                                        <Select.Value placeholder='Размер компании' />
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
                                    onValueChange={(value) => updateNewWorkplace('country', value)}
                                  >
                                    <Select.Trigger>
                                      <Select.Value placeholder='Страна' />
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
                                  <Button type='button' onClick={addWorkplace}>
                                    Добавить
                                  </Button>
                                  <Button type='button' variant='ghost' onClick={() => setShowWorkplaceForm(false)}>
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
            <Card.Description>
              <p>Некоторыми полями можно принебречь</p>
            </Card.Description>
          </Card.Root>
          <Card.Root>
            <Card.Header>
              <Card.Title>Навыки и достижения</Card.Title>
            </Card.Header>
            <Card.Content>
              <Stack ai='stretch' dir='column'>
                <FormField
                  control={form.control}
                  name='skills'
                  render={() => (
                    <FormItem>
                      <Stack dir='column' gap={16} ai='stretch'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              img='ChevronsUpDown'
                              variant='outline'
                              role='combobox'
                              style={{ width: '100%' }}
                            >
                              Выберите навыки
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-full p-0'>
                            <Command>
                              <Command.Input placeholder='Поиск навыка...' />
                              <Command.List>
                                <Command.Empty>Навык не найден.</Command.Empty>
                                <Command.Group>
                                  {skillsList.map((skill) => (
                                    <Command.Item key={skill} value={skill} onSelect={() => addSkill(skill)} className={cn(selectedSkills.includes(skill) && s.dimmed)}>
                                      {skill}
                                    </Command.Item>
                                  ))}
                                </Command.Group>
                              </Command.List>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <Separator />
                        <Stack style={{ flexWrap: 'wrap' }}>
                          {selectedSkills.map((skill) => (
                            <Badge
                              icon='X'
                              key={skill}
                              variant='gray-subtle'
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
                <FormField
                  control={form.control}
                  name='achievements'
                  render={() => (
                    <FormItem>
                      <FormLabel>Достижения</FormLabel>
                      <Stack gap={16} dir='column' ai='stretch'>
                        <Stack>
                          <Input
                            placeholder='Опишите ваше достижение'
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                          />
                          <Button type='button' img='Plus' onClick={addAchievement} />
                        </Stack>
                        <Stack gap={16} dir='column' ai='stretch'>
                          {achievements.map((achievement, index) => (
                            <Stack key={index}>
                              <div className='rounded-md border px-3 py-2 text-sm flex-1'>{achievement}</div>
                              <Button img='X' type='button' variant='ghost' onClick={() => removeAchievement(index)} />
                            </Stack>
                          ))}
                        </Stack>
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
              <Card.Title>Образование и сертификаты</Card.Title>
            </Card.Header>
            <Card.Content>
              <FormField
                control={form.control}
                name='education'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Образование</FormLabel>
                    <FormControl>
                      <Textarea style={{ minHeight: 128, resize: 'vertical', maxHeight: 512 }} placeholder='Университет, специальность, годы обучения' {...field} />
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
          <Button type='submit' style={{ width: '100%' }} img='Sparkles'>
            Сгенерировать резюме
          </Button>
          <Spinner />
        </form>
      </Form>
    </main >
  )
}
