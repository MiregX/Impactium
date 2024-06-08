export interface Translation {
  ua: string;
  it: string;
  us: string;
  ru: string;
  pl: string;
}

const template = {
  us: '',
  ru: '',
  ua: '',
  it: '',
  pl: ''
}

export interface Locale {
  [key: string]: {
    [key: string]: string | Translation;
  } | Array<Translation>;
}

const locale: Locale = {
  _verified: {
    us: 'Verified',
    ru: 'Верифицирован',
    ua: 'Підтверджено',
    it: 'Verificato',
    pl: 'Zweryfikowano'
  },
  _soon: {
    us: 'Soon',
    ru: 'Скоро',
    ua: 'Незабаром',
    it: 'Presto',
    pl: 'Wkrótce'
  },
  _login: {
    ua: "Увійти",
    it: "Accesso",
    us: "Sign in",
    ru: "Войти",
    pl: "Zaloguj się"
  },
  _selected: {
    us: 'Selected',
    ru: 'Выбрано',
    ua: 'Обрано',
    it: 'Selezionato',
    pl: "Wybrany"
  },
  _or: {
    ua: "Або",
    it: "O",
    us: "Or",
    ru: "Или",
    pl: "Lub"
  },
  _save: {
    ua: "Зберегти",
    it: "Salva",
    us: "Save",
    ru: "Сохранить",
    pl: "Zapisz"
  },
  logout: {
    ua: "Вийти",
    it: "Disconnettersi",
    us: "Logout",
    ru: "Выйти",
    pl: "Wyloguj się"
  },
  found_a_translation_error: {
    ua: "Знайшли помилку в перекладі?",
    it: "Hai trovato un errore di traduzione?",
    us: "Found an error in translation?",
    ru: "Нашёл ошибку в переводе? Иди нахуй",
    pl: "Znalazłeś błąd w tłumaczeniu?"
  },
  _translationWarning: {
    ua: "Переклад був виконаний за допомогою нейромереж, і може містити помилки",
    it: "La traduzione è stata effettuata con IA e può contenere errori.",
    us: "The translation was performed using AI and may contain errors",
    ru: "Перевод был выполнен при помощи нейросетей, и может содержать ошибки",
    pl: "Tłumaczenie zostało wykonane za pomocą SI i może zawierać błędy"
  },
  login: {
    auth_with: {
      ua: "Увійти через",
      it: "Continua con",
      us: "Continue with",
      ru: "Войти используя",
      pl: "Kontynuuj z" 
    },
    title: {
      us: 'Log in',
      ru: 'Авторизоваться',
      ua: 'Авторизуватися',
      it: 'Accedi',
      pl: 'Zaloguj się'
    }  
  },
  _account: {
    us: 'Account Settings',
    ru: '',
    ua: '',
    it: '',
    pl: ''
  },
  account: {
    avatar: {
      us: 'Avatar',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    avatar_description: {
      us: "An avatar is optional but strongly recommended.",
      ru: "",
      ua: "",
      it: "",
      pl: ""
    },
    avatar_content: {
      us: 'This is your avatar.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    displayName: {
      us: 'Display Name',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    displayName_description: {
      us: 'Please use 48 characters at maximum.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    displayName_content: {
      us: 'Please enter your full name, or a display name you are comfortable with.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    username: {
      us: 'Username',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    username_description: {
      us: 'Please use 32 characters at maximum.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    username_content: {
      us: 'This is your URL namespace within Impactium.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    email: {
      us: 'Email',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    email_description: {
      us: 'Emails must be verified to be able to login with them or be used as primary email.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    email_content: {
      us: 'Enter the email addresses you want to use to log in with Impactium. Your primary email will be used for account-related notifications.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    connections: {
      us: 'Connections',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    connections_description: {
      us: 'Social networks and authorizations associated with this account',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    connections_content: {
      us: 'To add or change a binding, click on the corresponding panel below.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    no_email: {
      us: 'No email is associated with your account.',
      ru: 'С вашим аккаунтом не ассоциируется ни один email.',
      ua: '',
      it: '',
      pl: ''
    },
    delete: {
      us: 'Delete Account',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
    delete_content: {
      us: 'Permanently remove your Personal Account and all of its contents from the Impactium platform. This action is not reversible, so please continue with caution.',
      ru: '',
      ua: '',
      it: '',
      pl: ''
    },
  },
  // Main page
  main: {
    h3: {
      us: 'Dota 2 Tournaments',
      ru: 'Турниры Dota 2',
      ua: 'Турніри Dota 2',
      it: 'Tornei di Dota 2',
      pl: "Turnieje Dota 2"
    },
    we_are: {
      us: 'We are a technological and modern service for conducting amateur and professional tournaments in the game Dota 2. Join in one click. Track statistics. Get notifications about new tournaments. Win prizes.',
      ru: 'Мы - технологичный и современный сервис для проведения любительских и профессиональных турниров в игре Dota 2. Прими участие в один клик. Отслеживай статистику. Получай уведомления о новых турнирах. Получай призы',
      ua: 'Ми - технологічний та сучасний сервіс для проведення любительських та професійних турнірів у грі Dota 2. Приєднуйтеся в один клік. Відстежуйте статистику. Отримуйте сповіщення про нові турніри. Вигравайте призи.',
      it: 'Siamo un servizio tecnologico e moderno per la conduzione di tornei amatoriali e professionali nel gioco Dota 2. Unisciti in un clic. Tieni traccia delle statistiche. Ricevi notifiche sui nuovi tornei. Vinci premi.',
      pl: "Jesteśmy technologicznym i nowoczesnym serwisem do organizacji amatorskich i profesjonalnych turniejów w grze Dota 2. Dołącz w jednym kliknięciu. Śledź statystyki. Otrzymuj powiadomienia o nowych turniejach. Wygrywaj nagrody."
    },
    find_team: {
      us: 'Find the perfect team or lead your own.',
      ru: 'Найди идеальную команду, или возглавь собственную.',
      ua: 'Знайдіть ідеальну команду або очоліть власну.',
      it: 'Trova la squadra perfetta o guida la tua.',
      pl: "Znajdź idealną drużynę lub poprowadź własną."
    },
    find_team_description: {
      us: 'With our matching algorithms, we will find you skilled agents of Gaben who will ruin every game for you.',
      ru: 'С нашими алгоритмами подбора мы найдём тебе зассаных агентов габена которые будут руинить тебе каждую игру.',
      ua: 'З нашими алгоритмами підбору ми знайдемо тобі засраніх агентів габена, які будуть руйнувати тобі кожну гру.',
      it: 'Con i nostri algoritmi di abbinamento, troveremo per te agenti esperti di Gaben che rovineranno ogni partita per te.',
      pl: "Dzięki naszym algorytmom dopasowania znajdziemy dla ciebie wykwalifikowanych agentów Gaben, którzy zrujnują każdą grę dla ciebie."
    },
    participate: {
      us: 'Participate in the tournament for free!',
      ru: 'Прими участие в турнире бесплатно!',
      ua: 'Прийміть участь у турнірі безкоштовно!',
      it: 'Partecipa al torneo gratuitamente!',
      pl: "Weź udział w turnieju za darmo!"
    },
    participate_description: {
      us: 'We provide a convenient control panel and high-quality standardization. Notify teams of changes and viewers about the start of the tournament. Set up the event by filling out a short form - we\'ll take care of the rest.',
      ru: 'Мы предоставим удобную панель управления и высококачественную стандартизацию. Уведомим команды об изменениях, а зрителей о начале турнира. Настройте событие, заполнив небольшую форму - об остальном позаботимося мы сами.',
      ua: 'Ми надамо зручну панель управління та високоякісну стандартизацію. Повідомимо команди про зміни, а глядачів про початок турніру. Налаштуйте подію, заповнивши коротку форму - про решту позаботимося ми самі.',
      it: 'Forniamo un pannello di controllo comodo e una standardizzazione di alta qualità. Notifichiamo le squadre sui cambiamenti e gli spettatori sull\'inizio del torneo. Configura l\'evento compilando un breve modulo: noi ci occupiamo del resto.',
      pl: "Zapewniamy wygodną panel sterowania i wysokiej jakości standaryzację. Powiadamiamy zespoły o zmianach, a widzów o rozpoczęciu turnieju. Skonfiguruj wydarzenie, wypełniając krótki formularz - resztę załatwimy sami."
    }
  },
  create_team: {
    title: {
      us: 'Team name',
      ru: 'Название команды',
      ua: 'Назва команди',
      it: 'Nome della squadra',
      pl: "Nazwa drużyny"
    },
    indent: {
      us: 'Team ID (only: a-z, 0-9, _ and -)',
      ru: 'Айди команды (только: a-z, 0-9, _ и -)',
      ua: 'Ідентифікатор команди (тільки: a-z, 0-9, _ і -)',
      it: 'ID squadra (solo: a-z, 0-9, _ e -)',
      pl: "ID drużyny (tylko: a-z, 0-9, _ i -)"
    },
    logo: {
      us: 'Upload logo (PNG, JPG, SVG, >1MB, 512x512px)',
      ru: 'Загрузить логотип (PNG, JPG, SVG, >1MB, 512x512px)',
      ua: 'Завантажити логотип (PNG, JPG, SVG, >1MB, 512x512px)',
      it: 'Carica logo (PNG, JPG, SVG, >1MB, 512x512px)',
      pl: "Prześlij logo (PNG, JPG, SVG, >1MB, 512x512px)"
    },
    logo_title: {
      us: 'Team Logo',
      ru: 'Логотип команды',
      ua: 'Логотип команди',
      it: 'Logo della squadra',
      pl: "Logo drużyny"
    }
  },
  team: {
    has_no_description: {
      us: 'The team has no description',
      ru: 'У команды нет описания',
      ua: 'У команди немає опису',
      it: 'La squadra non ha una descrizione',
      pl: 'Drużyna nie ma opisu'
    },
    enter_indent_or_title: {
      us: 'Enter team name or its tag...',
      ru: 'Название команды или её тег...',
      ua: 'Назва команди або її тег...',
      it: 'Inserisci il nome della squadra o il suo tag...',
      pl: 'Wprowadź nazwę zespołu lub jego tag...'
    },
    recomendations: {
      us: "Recommendations",
      ru: "Рекомендации",
      ua: "Рекомендації",
      it: "Raccomandazioni",
      pl: "Rekomendacje"
    },
    yours: {
      us: "Your Teams",
      ru: "Ваши команды",
      ua: "Ваші команди",
      it: "Le tue squadre",
      pl: "Twoje zespoły"
    },
    members: {
      us: "Team members",
      ru: "Участники команды",
      ua: "Учасники команди",
      it: "Membri del team",
      pl: "Członkowie zespołu"
    }
  },
  tournament: {
    recomendations: {
      us: 'Popular tournaments',
      ru: 'Популярные турниры',
      ua: 'Популярні турніри',
      it: 'Tornei popolari',
      pl: 'Popularne turnieje'
    }  
  },
  already_exists: {
    us: 'A team with this ID already exists, please choose another one',
    ru: 'Команда с таким айди уже существует, придумай другое',
    ua: 'Команда з таким ідентифікатором вже існує, придумайте інший',
    it: 'Una squadra con questo ID già esiste, scegline un altro',
    pl: "Drużyna o tym ID już istnieje, wybierz inne"
  },
  comments: {
    title: {
      us: "Comments",
      ru: "Коментарии",
      ua: "Коментарі",
      it: "Commenti",
      pl: "Komentarze"
    },
    empty: {
      us: "There doesn't seem to be any comments...",
      ru: "Кажестся тут нет коментариев...",
      ua: "Здається, тут немає коментарів...",
      it: "Non sembra esserci alcun commento...",
      pl: "Nie wygląda na to, żeby były jakiekolwiek komentarze..."
    },
    leave: {
      us: "Leave a comment...",
      ru: "Написать комментарий...",
      ua: "Залиште коментар...",
      it: "Lascia un commento...",
      pl: "Zostaw komentarz..."
    }
  },
  save: {
  },
  change: {
    description: {
      us: 'Edit team description',
      ru: 'Редактировать описание команды',
      ua: 'Редагувати опис команди',
      it: 'Modifica descrizione squadra',
      pl: 'Edytuj opis drużyny'
    }    
  },
  find: {
    team: {
      us: 'Find team',
      ru: 'Найти команду',
      ua: 'Знайти команду',
      it: 'Trova squadra',
      pl: "Znajdź drużynę"
    },
    tournament: {
      us: 'Find tournament',
      ru: 'Найти турнир',
      ua: 'Знайти турнір',
      it: 'Trova torneo',
      pl: "Znajdź turniej"
    },
  },
  create: {
    team: {
      us: 'Create team',
      ru: 'Создать команду',
      ua: 'Створити команду',
      it: 'Crea squadra',
      pl: "Stwórz drużynę"
    },
    tournament: {
      us: 'Create tournament',
      ru: 'Создать турнир',
      ua: 'Створити турнір',
      it: 'Crea torneo',
      pl: "Stwórz turniej"
    },
  },
  choose: {
    language: {
      us: 'Choose language',
      ru: 'Выбрать язык',
      ua: 'Вибрати мову',
      it: 'Scegli la lingua',
      pl: "Wybierz język"
    },
  },
  edit: {
    team: {
      us: 'Edit team',
      ru: 'Редактировать команду',
      ua: 'Редагувати команду',
      it: 'Modifica squadra',
      pl: "Edytuj drużynę"
    },
  },
  _undo: {
    us: 'Undo',
    ru: 'Отменить',
    ua: 'Скасувати',
    it: 'Annulla',
    pl: "Cofnij"
  },
  status: {
    ok: {
      us: 'All systems normal.',
      ru: 'Все системы в норме.',
      ua: 'Усі системи в нормі.',
      it: 'Tutti i sistemi normali.',
      pl: 'Wszystkie systemy w porządku.'
    },
    good: {
      us: '',
      ru: 'В норме',
      ua: '',
      it: '',
      pl: ''
    },
    warn: {
      us: '',
      ru: 'Нагружен',
      ua: '',
      it: '',
      pl: ''
    },
    error: {
      us: '',
      ru: 'Что-то наебнулось',
      ua: '',
      it: '',
      pl: ''
    },
    heading: {
      us: 'Summary of our systems',
      ru: 'СВОдка о наших системах',
      ua: 'Огляд наших систем',
      it: 'Sommario dei nostri sistemi',
      pl: 'Podsumowanie naszych systemów'
    },
    redis: {
      us: 'Redis Storage',
      ru: 'Redis Storage',
      ua: 'Redis Storage',
      it: 'Redis Storage',
      pl: 'Redis Storage'
    },
    cockroachdb: {
      us: 'CockroachDB',
      ru: 'CockroachDB',
      ua: 'CockroachDB',
      it: 'CockroachDB',
      pl: 'CockroachDB'
    },
    telegram: {
      us: 'Telegram',
      ru: 'Telegram',
      ua: 'Telegram',
      it: 'Telegram',
      pl: 'Telegram'
    }
  },
  footer: {
    teams: {
      us: 'Teams',
      ru: 'Команды',
      ua: 'Команди',
      it: 'Squadre',
      pl: 'Zespoły'
    },
    tournaments: {
      us: 'Tournaments',
      ru: 'Турниры',
      ua: 'Турніри',
      it: 'Tornei',
      pl: 'Turnieje'
    },
    documentation: {
      us: 'Documentation',
      ru: 'Документация',
      ua: 'Документація',
      it: 'Documentazione',
      pl: 'Dokumentacja'
    },
    services: {
      us: 'Services',
      ru: 'Наши продукты',
      ua: 'Наші послуги',
      it: 'Servizi',
      pl: 'Usługi'
    },
    developers: {
      us: 'Developers',
      ru: 'Разработчики',
      ua: 'Розробники',
      it: 'Sviluppatori',
      pl: 'Deweloperzy'
    },
    privacy: {
      us: 'Privacy Policy',
      ru: 'Политика конфиденциальности',
      ua: 'Політика конфіденційності',
      it: 'Informativa sulla privacy',
      pl: 'Polityka prywatności'
    },
    terms: {
      us: 'Terms of Service',
      ru: 'Условия использования',
      ua: 'Умови використання',
      it: 'Termini di servizio',
      pl: 'Warunki korzystania'
    },
    changelog: {
      us: "Changelog",
      ru: "История изменений",
      ua: "Журнал змін",
      it: "Registro delle modifiche",
      pl: "Dziennik zmian"
    }
  },
  balance: {
    top_up: {
      us: 'Top up balance',
      ru: 'Пополнить баланс',
      ua: 'Поповнити баланс',
      it: 'Ricarica il saldo',
      pl: 'Doładuj saldo'
    }    
  },
  error: {
    indent_not_provided: {
      us: '',
      ru: 'Кажеться ты забыл ввести айди',
      ua: '',
      it: '',
      pl: ''    
    },
    indent_invalid_format: {
      us: '',
      ru: 'Хреновый формат айди. Это тебе не инстаграм, тут есть стандарты',
      ua: '',
      it: '',
      pl: ''    
    },
    team_already_exists: {
      us: '',
      ru: 'Команда с таким айди уже существует, придумайте что-то новое',
      ua: '',
      it: '',
      pl: ''    
    },
    team_limit_exception: {
      us: '',
      ru: 'Всё. Приехали. У вас лимит по командам. Максимум 3 команды',
      ua: '',
      it: '',
      pl: ''    
    },
    unallowed_file_format: {
      us: '',
      ru: 'Я разрешаю вам выгружать файлы только в формате PNG, JPG, SVG',
      ua: '',
      it: '',
      pl: ''    
    },
    unallowed_file_size: {
      us: '',
      ru: 'Ого какой большой. Загрузи в меня файл меньше 1 мегабайта',
      ua: '',
      it: '',
      pl: ''    
    },
    unallowed_file_metadata: {
      us: '',
      ru: 'Картинки принимаются только до 512 на 512 пикслелей',
      ua: '',
      it: '',
      pl: ''    
    },
    ftp_upload_error: {
      us: '',
      ru: 'Ошибка выгрузки файла в облако. Если это реально ошибка - пиши ему: @MiregX',
      ua: '',
      it: '',
      pl: ''    
    }
  }
}

export default locale;