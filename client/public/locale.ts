export interface Translation {
  ua: string;
  it: string;
  us: string;
  ru: string;
}

const template = {
  us: '',
  ru: '',
  ua: '',
  it: ''
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
    ru: "Войти"
  },
  _selected: {
    us: 'Selected',
    ru: 'Выбрано',
    ua: 'Обрано',
    it: 'Selezionato'
  },
  _or: {
    ua: "Або",
    it: "O",
    us: "Or",
    ru: "Или"
  },
  _save: {
    ua: "Зберегти",
    it: "Salva",
    us: "Save",
    ru: "Сохранить"
  },
  logout: {
    ua: "Вийти",
    it: "Disconnettersi",
    us: "Logout",
    ru: "Выйти"
  },
  found_a_translation_error: {
    ua: "Знайшли помилку в перекладі?",
    it: "Hai trovato un errore di traduzione?",
    us: "Found an error in translation?",
    ru: "Нашёл ошибку в переводе? Иди нахуй"
  },
  _translationWarning: {
    ua: "Переклад був виконаний за допомогою нейромереж, і може містити помилки",
    it: "La traduzione è stata effettuata con IA e può contenere errori.",
    us: "The translation was performed using AI and may contain errors",
    ru: "Перевод был выполнен при помощи нейросетей, и может содержать ошибки"
  },
  _choose_language: {
    us: 'Choose language',
    ru: 'Выбрать язык',
    ua: 'Вибрати мову',
    it: 'Scegli la lingua'
  },
  login: {
    username_or_email: {
      ua: "Нікнейм або пошта",
      it: "Nome utente o email",
      us: "Username or email",
      ru: "Никнейм или почта"
    },
    continue_with_github: {
      ua: "Увійти через GitHub",
      it: "Continua con GitHub",
      us: "Continue with GitHub",
      ru: "Войти используя GitHub"
    },
    continue_with_discord: {
      ua: "Увійти через Discord",
      it: "Continua con Discord",
      us: "Continue with Discord",
      ru: "Войти используя Discord"
    },
    dont_have_an_account: {
      ua: "Не маєте облікового запису?",
      it: "Non hai un account?",
      us: "Don't have an account?",
      ru: "Нет учетной записи?"
    },
    nuhuh: {
      ua: "Крінжик...",
      it: "No...",
      us: "Nuh uh...",
      ru: "Кринжовичёк..."
    },
    just_use_these_two: {
      ua: "Козаче... Просто використай це:",
      it: "Usa semplicemente queste due:",
      us: "Just use these two:",
      ru: "Чел... Просто используй это:"
    },
  },
  account: {
    ua: "Мій профіль",
    it: "Il mio profilo",
    us: "My profile",
    ru: "Мой профиль"
  },
  settings: {
    ua: "Налаштування",
    it: "Impostazioni",
    us: "Settings",
    ru: "Настройки"
  },
  _find_team: {
    us: 'Find team',
    ru: 'Найти команду',
    ua: 'Знайти команду',
    it: 'Trova squadra',
  },
  _find_tournament: {
    us: 'Find tournament',
    ru: 'Найти турнир',
    ua: 'Знайти турнір',
    it: 'Trova torneo',
  },
  _create_team: {
    us: 'Create team',
    ru: 'Создать команду',
    ua: 'Створити команду',
    it: 'Crea squadra',
  },
  _create_tournament: {
    us: 'Create tournament',
    ru: 'Создать турнир',
    ua: 'Створити турнір',
    it: 'Crea torneo',
  },
  // Main page
  main: {
    h3: {
      us: 'Dota 2 Tournaments',
      ru: 'Турниры Dota 2',
      ua: 'Турніри Dota 2',
      it: 'Tornei di Dota 2',
    },
    we_are: {
      us: 'We are a technological and modern service for conducting amateur and professional tournaments in the game Dota 2. Join in one click. Track statistics. Get notifications about new tournaments. Win prizes.',
      ru: 'Мы - технологичный и современный сервис для проведения любительских и профессиональных турниров в игре Dota 2. Прими участие в один клик. Отслеживай статистику. Получай уведомления о новых турнирах. Получай призы',
      ua: 'Ми - технологічний та сучасний сервіс для проведення любительських та професійних турнірів у грі Dota 2. Приєднуйтеся в один клік. Відстежуйте статистику. Отримуйте сповіщення про нові турніри. Вигравайте призи.',
      it: 'Siamo un servizio tecnologico e moderno per la conduzione di tornei amatoriali e professionali nel gioco Dota 2. Unisciti in un clic. Tieni traccia delle statistiche. Ricevi notifiche sui nuovi tornei. Vinci premi.',
    },
    find_team: {
      us: 'Find the perfect team or lead your own.',
      ru: 'Найди идеальную команду, или возглавь собственную.',
      ua: 'Знайдіть ідеальну команду або очоліть власну.',
      it: 'Trova la squadra perfetta o guida la tua.',
    },
    find_team_description: {
      us: 'With our matching algorithms, we will find you skilled agents of Gaben who will ruin every game for you.',
      ru: 'С нашими алгоритмами подбора мы найдём тебе зассаных агентов габена которые будут руинить тебе каждую игру.',
      ua: 'З нашими алгоритмами підбору ми знайдемо тобі засраніх агентів габена, які будуть руйнувати тобі кожну гру.',
      it: 'Con i nostri algoritmi di abbinamento, troveremo per te agenti esperti di Gaben che rovineranno ogni partita per te.',
    },
    participate: {
      us: 'Participate in the tournament for free!',
      ru: 'Прими участие в турнире бесплатно!',
      ua: 'Прийміть участь у турнірі безкоштовно!',
      it: 'Partecipa al torneo gratuitamente!',
    },
    participate_description: {
      us: 'We provide a convenient control panel and high-quality standardization. Notify teams of changes and viewers about the start of the tournament. Set up the event by filling out a short form - we\'ll take care of the rest.',
      ru: 'Мы предоставим удобную панель управления и высококачественную стандартизацию. Уведомим команды об изменениях, а зрителей о начале турнира. Настройте событие, заполнив небольшую форму - об остальном позаботимся мы сами.',
      ua: 'Ми надамо зручну панель управління та високоякісну стандартизацію. Повідомимо команди про зміни, а глядачів про початок турніру. Налаштуйте подію, заповнивши коротку форму - про решту позаботимося ми самі.',
      it: 'Forniamo un pannello di controllo comodo e una standardizzazione di alta qualità. Notifichiamo le squadre sui cambiamenti e gli spettatori sull\'inizio del torneo. Configura l\'evento compilando un breve modulo: noi ci occupiamo del resto.',
    }
  },
  create_team: {
    title: {
      us: 'Team name',
      ru: 'Название команды',
      ua: 'Назва команди',
      it: 'Nome della squadra'
    },
    indent: {
      us: 'Team ID (only: a-z, 0-9, _ and -)',
      ru: 'Айди команды (только: a-z, 0-9, _ и -)',
      ua: 'Ідентифікатор команди (тільки: a-z, 0-9, _ і -)',
      it: 'ID squadra (solo: a-z, 0-9, _ e -)'
    },
    logo: {
      us: 'Upload logo (PNG, JPG, SVG, >1MB, 512x512px)',
      ru: 'Загрузить логотип (PNG, JPG, SVG, >1MB, 512x512px)',
      ua: 'Завантажити логотип (PNG, JPG, SVG, >1MB, 512x512px)',
      it: 'Carica logo (PNG, JPG, SVG, >1MB, 512x512px)'
    },
    logo_title: {
      us: 'Team Logo',
      ru: 'Логотип команды',
      ua: 'Логотип команди',
      it: 'Logo della squadra'
    }
  },
  already_exists: {
    us: 'A team with this ID already exists, please choose another one',
    ru: 'Команда с таким айди уже существует, придумай другое',
    ua: 'Команда з таким ідентифікатором вже існує, придумайте інший',
    it: 'Una squadra con questo ID già esiste, scegline un altro'
  },
  team: {
    edit: {
      us: 'Edit team',
      ru: 'Редактировать команду',
      ua: 'Редагувати команду',
      it: 'Modifica squadra'
    },
  },
  comments: {
    title: {
      us: "Comments",
      ru: "Коментарии",
      ua: "Коментарі",
      it: "Commenti"
    },
    empty: {
      us: "There doesn't seem to be any comments...",
      ru: "Кажестся тут нет коментариев...",
      ua: "Здається, тут немає коментарів...",
      it: "Non sembra esserci alcun commento..."
    }
  },
}
export default locale;