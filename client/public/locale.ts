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
  _choose_language: {
    us: 'Choose language',
    ru: 'Выбрать язык',
    ua: 'Вибрати мову',
    it: 'Scegli la lingua',
    pl: "Wybierz język"
  },
  login: {
    username_or_email: {
      ua: "Нікнейм або пошта",
      it: "Nome utente o email",
      us: "Username or email",
      ru: "Никнейм или почта",
      pl: "Nazwa użytkownika lub email"
    },
    continue_with_github: {
      ua: "Увійти через GitHub",
      it: "Continua con GitHub",
      us: "Continue with GitHub",
      ru: "Войти используя GitHub",
      pl: "Kontynuuj z GitHub"
    },
    continue_with_discord: {
      ua: "Увійти через Discord",
      it: "Continua con Discord",
      us: "Continue with Discord",
      ru: "Войти используя Discord",
      pl: "Kontynuuj z Discord"
    },
    dont_have_an_account: {
      ua: "Не маєте облікового запису?",
      it: "Non hai un account?",
      us: "Don't have an account?",
      ru: "Нет учетной записи?",
      pl: "Nie masz konta?"
    },
    nuhuh: {
      ua: "Крінжик...",
      it: "No...",
      us: "Nuh uh...",
      ru: "Кринжовичёк...",
      pl: "Nuuu..."
    },
    just_use_these_two: {
      ua: "Козаче... Просто використай це:",
      it: "Usa semplicemente queste due:",
      us: "Just use these two:",
      ru: "Чел... Просто используй это:",
      pl: "Po prostu użyj tych dwóch:"
    },
  },
  account: {
    ua: "Мій профіль",
    it: "Il mio profilo",
    us: "My profile",
    ru: "Мой профиль",
    pl: "Mój profil"
  },
  settings: {
    ua: "Налаштування",
    it: "Impostazioni",
    us: "Settings",
    ru: "Настройки",
    pl: "Ustawienia"
  },
  _find_team: {
    us: 'Find team',
    ru: 'Найти команду',
    ua: 'Знайти команду',
    it: 'Trova squadra',
    pl: "Znajdź drużynę"
  },
  _find_tournament: {
    us: 'Find tournament',
    ru: 'Найти турнир',
    ua: 'Знайти турнір',
    it: 'Trova torneo',
    pl: "Znajdź turniej"
  },
  _create_team: {
    us: 'Create team',
    ru: 'Создать команду',
    ua: 'Створити команду',
    it: 'Crea squadra',
    pl: "Stwórz drużynę"
  },
  _create_tournament: {
    us: 'Create tournament',
    ru: 'Создать турнир',
    ua: 'Створити турнір',
    it: 'Crea torneo',
    pl: "Stwórz turniej"
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
  already_exists: {
    us: 'A team with this ID already exists, please choose another one',
    ru: 'Команда с таким айди уже существует, придумай другое',
    ua: 'Команда з таким ідентифікатором вже існує, придумайте інший',
    it: 'Una squadra con questo ID già esiste, scegline un altro',
    pl: "Drużyna o tym ID już istnieje, wybierz inne"
  },
  team: {
    edit: {
      us: 'Edit team',
      ru: 'Редактировать команду',
      ua: 'Редагувати команду',
      it: 'Modifica squadra',
      pl: "Edytuj drużynę"
    },
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
    }
  },
}

export default locale;