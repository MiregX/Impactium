import { error } from './error';
import { success, SuccessLocale } from './success';
import { landing } from './landing';
import { item } from './item';

export interface Template {
  ua: string;
  it: string;
  us: string;
  ru: string;
  pl: string;
}

const template: Template = {
  us: '',
  ru: '',
  ua: '',
  it: '',
  pl: ''
}

export type _Locale = Record<string, Template | Record<string, LocaleUnit | Template>> & {
  success: SuccessLocale,
  landing: LocaleUnit
}

export interface LocaleUnit {
  [key: string]: Template;
}

const locale = {
  search: {
    team: {
      us: 'Enter team name or its tag...',
      ru: 'Название команды или её тег...',
      ua: 'Назва команди або її тег...',
      it: 'Inserisci il nome della squadra o il suo tag...',
      pl: 'Wprowadź nazwę zespołu lub jego tag...'
    },
    tournament: {
      us: 'Enter tournament title or its tag...',
      ru: 'Название турнира или тег...',
      ua: 'Назва змагання або його тег...',
      it: 'Inserisci il titolo del torneo o il suo tag...',
      pl: 'Wpisz tytuł turnieju lub jego tag...'
    },    
  },
  _admin_panel: {
    us: 'Admin panel',
    ru: 'Админ-панель',
    ua: 'Адмін-панель',
    it: 'Pannello amministrativo',
    pl: 'Panel administracyjny'
  },
  _select_file: {
    us: 'Select a file',
    ru: 'Выберите файл',
    ua: 'Виберіть файл',
    it: 'Seleziona un file',
    pl: 'Wybierz plik'
  },
  _please_wait: {
    us: 'Please wait',
    ru: 'Подождите',
    ua: 'Зачекайте',
    it: 'Attendere prego',
    pl: 'Proszę czekać'
  },
  _watch_live: {
    us: 'Watch Live',
    ru: 'Смотреть прямую трансляцию',
    ua: 'Дивитися прямий ефір',
    it: 'Guarda in diretta',
    pl: 'Oglądaj na żywo'
  },
  copied: {
    title: {
      us: 'Copied to clipboard',
      ru: 'Скопировано в буфер обмена',
      ua: 'Скопійовано до буфера обміну',
      it: 'Copiato negli appunti',
      pl: 'Skopiowano do schowka'
    },
    description: {
      us: 'CTRL + V to paste the value',
      ru: 'CTRL + V чтобы вставить значение',
      ua: 'CTRL + V щоб вставити значення',
      it: 'CTRL + V per incollare il valore',
      pl: 'CTRL + V, aby wkleić wartość'
    }
  },
  or: {
    us: 'OR',
    ru: 'ИЛИ',
    ua: 'АБО',
    it: 'O',
    pl: 'LUB'
  },
  copyUrl: {
    us: 'Copy link',
    ru: 'Копировать ссылку',
    ua: 'Копіювати посилання',
    it: 'Copia il link',
    pl: 'Kopiuj link'
  },
  max: {
    us: 'Max',
    ru: 'Макс.',
    ua: 'Макс.',
    it: 'Max',
    pl: 'Maks.'
  },
  min: {
    us: 'Min',
    ru: 'Мин.',
    ua: 'Мин.',
    it: 'Min',
    pl: 'Min.'
  },
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
    ua: 'Увійти',
    it: 'Accesso',
    us: 'Sign in',
    ru: 'Войти',
    pl: 'Zaloguj się'
  },
  _selected: {
    us: 'Selected',
    ru: 'Выбрано',
    ua: 'Обрано',
    it: 'Selezionato',
    pl: 'Wybrany'
  },
  _or: {
    ua: 'Або',
    it: 'O',
    us: 'Or',
    ru: 'Или',
    pl: 'Lub'
  },
  _save: {
    ua: 'Зберегти',
    it: 'Salva',
    us: 'Save',
    ru: 'Сохранить',
    pl: 'Zapisz'
  },
  logout: {
    ua: 'Вийти',
    it: 'Disconnettersi',
    us: 'Logout',
    ru: 'Выйти',
    pl: 'Wyloguj się'
  },
  found_a_Template_error: {
    ua: 'Знайшли помилку в перекладі?',
    it: 'Hai trovato un errore di traduzione?',
    us: 'Found an error in Template?',
    ru: 'Нашёл ошибку в переводе? Иди нахуй',
    pl: 'Znalazłeś błąd w tłumaczeniu?'
  },
  _TemplateWarning: {
    ua: 'Переклад був виконаний за допомогою нейромереж, і може містити помилки',
    it: 'La traduzione è stata effettuata con IA e può contenere errori.',
    us: 'The Template was performed using AI and may contain errors',
    ru: 'Перевод был выполнен при помощи нейросетей, и может содержать ошибки',
    pl: 'Tłumaczenie zostało wykonane za pomocą SI i może zawierać błędy'
  },
  login: {
    auth_with: {
      ua: 'Увійти через',
      it: 'Continua con',
      us: 'Continue with',
      ru: 'Войти используя',
      pl: 'Kontynuuj z' 
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
    ru: 'Настройки аккаунта',
    ua: 'Налаштування облікового запису',
    it: 'Impostazioni dell\'account',
    pl: 'Ustawienia konta'
  },
  _inventory: {
    us: 'Inventory',
    ru: 'Инвентарь',
    ua: 'Інвентар',
    it: 'Inventario',
    pl: 'Inwentarz'
  },
  account: {
    avatar: {
      us: 'Avatar',
      ru: 'Аватар',
      ua: 'Аватар',
      it: 'Avatar',
      pl: 'Awatar'
    },
    avatar_description: {
      us: 'An avatar is optional but strongly recommended.',
      ru: 'Аватар не обязателен, но настоятельно рекомендуется.',
      ua: "Аватар не обов'язковий, але настійно рекомендується.",
      it: "L'avatar è facoltativo ma fortemente consigliato.",
      pl: 'Awatar jest opcjonalny, ale zdecydowanie zalecany.'
    },
    avatar_content: {
      us: 'This is your avatar.',
      ru: 'Это ваш аватар.',
      ua: 'Це ваш аватар.',
      it: 'Questo è il tuo avatar.',
      pl: 'To jest twój awatar.'
    },
    balance: {
      us: 'Your coin balance',
      ru: 'Количество ваших монет',
      ua: 'Кількість ваших монет',
      it: 'Il tuo saldo di monete',
      pl: 'Ilość twoich monet'
    },
    balance_content: {
      us: 'One coin is one dollar. Used to participate in some tournaments.',
      ru: 'Одна монета - один доллар. Используется для участия в некоторых турнирах',
      ua: 'Одна монета - один долар. Використовується для участі в деяких турнірах.',
      it: 'Una moneta è un dollaro. Utilizzato per partecipare ad alcuni tornei.',
      pl: 'Jedna moneta to jeden dolar. Używane do udziału w niektórych turniejach.'
    },
    balance_description: {
      us: 'Withdraw coins starting from $5, or by tournament organizers to a card.',
      ru: 'Вывод монет от 5$, или организаторами турнира на карту',
      ua: 'Виведення монет від 5$, або організаторами турніру на карту',
      it: 'Prelievo di monete a partire da 5$, o dagli organizzatori del torneo sulla carta',
      pl: 'Wypłata monet od 5$, lub przez organizatorów turnieju na kartę'
    },
    displayName: {
      us: 'Display Name',
      ru: 'Отображаемое имя',
      ua: "Ім'я для відображення",
      it: 'Nome visualizzato',
      pl: 'Nazwa wyświetlana'
    },
    displayName_description: {
      us: 'Please use 48 characters at maximum.',
      ru: 'Используйте не более 48 символов.',
      ua: 'Використовуйте максимум 48 символів.',
      it: 'Utilizza un massimo di 48 caratteri.',
      pl: 'Użyj maksymalnie 48 znaków.'
    },
    displayName_content: {
      us: 'Please enter your full name, or a display name you are comfortable with.',
      ru: 'Пожалуйста, введите ваше полное имя или отображаемое имя, которое вам удобно.',
      ua: 'Будь ласка, введіть ваше повне ім\'я або ім\'я для відображення, яке вам зручно.',
      it: 'Si prega di inserire il nome completo o un nome visualizzato che ti è comodo.',
      pl: 'Proszę wprowadzić pełne imię i nazwisko lub nazwę wyświetlaną, z którą czujesz się komfortowo.'
    },
    username: {
      us: 'Username',
      ru: 'Имя пользователя',
      ua: 'Ім\'я користувача',
      it: 'Nome utente',
      pl: 'Nazwa użytkownika'
    },
    username_description: {
      us: 'Please use 32 characters at maximum.',
      ru: 'Используйте не более 32 символов.',
      ua: 'Використовуйте максимум 32 символи.',
      it: 'Utilizza un massimo di 32 caratteri.',
      pl: 'Użyj maksymalnie 32 znaków.'
    },
    username_content: {
      us: 'This is your URL namespace within Impactium.',
      ru: 'Это ваш URL-неймспейс в Impactium.',
      ua: 'Це ваш простір імен URL в Impactium.',
      it: 'Questo è il tuo spazio dei nomi URL all\'interno di Impactium.',
      pl: 'To jest twoja przestrzeń nazw URL w Impactium.'
    },
    email: {
      us: 'Email',
      ru: 'Электронная почта',
      ua: 'Електронна пошта',
      it: 'Email',
      pl: 'E-mail'
    },
    email_description: {
      us: 'Emails must be verified to be able to login with them or be used as primary email.',
      ru: 'Электронные письма должны быть проверены, чтобы можно было войти с их помощью или использовать их в качестве основной электронной почты.',
      ua: 'Електронні листи повинні бути перевірені, щоб можна було увійти з їх допомогою або використовувати їх як основну електронну пошту.',
      it: 'Le email devono essere verificate per poter accedere con esse o essere utilizzate come email principale.',
      pl: 'E-maile muszą być zweryfikowane, aby można było się za ich pomocą zalogować lub używać ich jako głównego e-maila.'
    },
    email_content: {
      us: 'Enter the email addresses you want to use to log in with Impactium. Your primary email will be used for account-related notifications.',
      ru: 'Введите адреса электронной почты, которые вы хотите использовать для входа в Impactium. Ваша основная электронная почта будет использоваться для уведомлений, связанных с аккаунтом.',
      ua: 'Введіть адреси електронної пошти, які ви хочете використовувати для входу в Impactium. Ваша основна електронна пошта буде використовуватися для повідомлень, пов\'язаних з обліковим записом.',
      it: 'Inserisci gli indirizzi email che desideri utilizzare per accedere a Impactium. La tua email principale verrà utilizzata per le notifiche relative all\'account.',
      pl: 'Wprowadź adresy e-mail, których chcesz używać do logowania się do Impactium. Twój główny e-mail będzie używany do powiadomień związanych z kontem.'
    },
    connections: {
      us: 'Connections',
      ru: 'Подключения',
      ua: 'З\'єднання',
      it: 'Connessioni',
      pl: 'Połączenia'
    },
    connections_description: {
      us: 'Social networks and authorizations associated with this account',
      ru: 'Социальные сети и авторизации, связанные с этим аккаунтом',
      ua: 'Соціальні мережі та авторизації, пов\'язані з цим обліковим записом',
      it: 'Social network e autorizzazioni associate a questo account',
      pl: 'Sieci społecznościowe i autoryzacje związane z tym kontem'
    },
    connections_content: {
      us: 'To add or change a binding, click on the corresponding panel below.',
      ru: 'Чтобы добавить или изменить привязку, нажмите на соответствующую панель ниже.',
      ua: 'Щоб додати або змінити прив\'язку, натисніть на відповідну панель нижче.',
      it: 'Per aggiungere o modificare un\'associazione, fai clic sul pannello corrispondente qui sotto.',
      pl: 'Aby dodać lub zmienić powiązanie, kliknij odpowiedni panel poniżej.'
    },
    connect: {
      us: 'Connect',
      ru: 'Присоеденить',
      ua: 'Присобачити',
      it: 'Autorizzare',
      pl: 'Połączen'
    },
    no_email: {
      us: 'No email is associated with your account.',
      ru: 'С вашим аккаунтом не ассоциируется ни один email.',
      ua: 'З вашим обліковим записом не пов\'язаний жоден email.',
      it: 'Nessuna email è associata al tuo account.',
      pl: 'Żaden e-mail nie jest powiązany z twoim kontem.'
    },
    delete: {
      us: 'Delete Account',
      ru: 'Удалить аккаунт',
      ua: 'Видалити обліковий запис',
      it: 'Elimina account',
      pl: 'Usuń konto'
    },
    delete_content: {
      us: 'Permanently remove your Personal Account and all of its contents from the Impactium platform. This action is not reversible, so please continue with caution.',
      ru: 'Полностью удалить ваш персональный аккаунт и все его содержимое с платформы Impactium. Это действие необратимо, поэтому продолжайте с осторожностью.',
      ua: 'Назавжди видалити ваш персональний обліковий запис і весь його вміст з платформи Impactium. Ця дія незворотна, тому продовжуйте з обережністю.',
      it: 'Rimuovi permanentemente il tuo account personale e tutti i suoi contenuti dalla piattaforma Impactium. Questa azione non è reversibile, quindi procedi con cautela.',
      pl: 'Trwale usuń swoje konto osobiste i całą jego zawartość z platformy Impactium. Ta czynność jest nieodwracalna, więc kontynuuj ostrożnie.'
    },
  },
  // Main page
  main: {
    h3: {
      us: 'Dota 2 Tournaments',
      ru: 'Турниры Dota 2',
      ua: 'Турніри Dota 2',
      it: 'Tornei di Dota 2',
      pl: 'Turnieje Dota 2'
    },
    we_are: {
      us: 'We are a technological and modern service for conducting amateur and professional tournaments in the game Dota 2. Join in one click. Track statistics. Get notifications about new tournaments. Win prizes.',
      ru: 'Мы - технологичный и современный сервис для проведения любительских и профессиональных турниров в игре Dota 2. Прими участие в один клик. Отслеживай статистику. Получай уведомления о новых турнирах. Получай призы',
      ua: 'Ми - технологічний та сучасний сервіс для проведення любительських та професійних турнірів у грі Dota 2. Приєднуйтеся в один клік. Відстежуйте статистику. Отримуйте сповіщення про нові турніри. Вигравайте призи.',
      it: 'Siamo un servizio tecnologico e moderno per la conduzione di tornei amatoriali e professionali nel gioco Dota 2. Unisciti in un clic. Tieni traccia delle statistiche. Ricevi notifiche sui nuovi tornei. Vinci premi.',
      pl: 'Jesteśmy technologicznym i nowoczesnym serwisem do organizacji amatorskich i profesjonalnych turniejów w grze Dota 2. Dołącz w jednym kliknięciu. Śledź statystyki. Otrzymuj powiadomienia o nowych turniejach. Wygrywaj nagrody.'
    },
    find_team: {
      us: 'Find the perfect team or lead your own.',
      ru: 'Найди идеальную команду, или возглавь собственную.',
      ua: 'Знайдіть ідеальну команду або очоліть власну.',
      it: 'Trova la squadra perfetta o guida la tua.',
      pl: 'Znajdź idealną drużynę lub poprowadź własną.'
    },
    find_team_description: {
      us: 'With our matching algorithms, we will find you skilled agents of Gaben who will ruin every game for you.',
      ru: 'С нашими алгоритмами подбора мы найдём тебе зассаных агентов габена которые будут руинить тебе каждую игру.',
      ua: 'З нашими алгоритмами підбору ми знайдемо тобі засраніх агентів габена, які будуть руйнувати тобі кожну гру.',
      it: 'Con i nostri algoritmi di abbinamento, troveremo per te agenti esperti di Gaben che rovineranno ogni partita per te.',
      pl: 'Dzięki naszym algorytmom dopasowania znajdziemy dla ciebie wykwalifikowanych agentów Gaben, którzy zrujnują każdą grę dla ciebie.'
    },
    participate: {
      us: 'Participate in the tournament for free!',
      ru: 'Прими участие в турнире бесплатно!',
      ua: 'Прийміть участь у турнірі безкоштовно!',
      it: 'Partecipa al torneo gratuitamente!',
      pl: 'Weź udział w turnieju za darmo!'
    },
    participate_description: {
      us: 'We provide a convenient control panel and high-quality standardization. Notify teams of changes and viewers about the start of the tournament. Set up the event by filling out a short form - we\'ll take care of the rest.',
      ru: 'Мы предоставим удобную панель управления и высококачественную стандартизацию. Уведомим команды об изменениях, а зрителей о начале турнира. Настройте событие, заполнив небольшую форму - об остальном позаботимося мы сами.',
      ua: 'Ми надамо зручну панель управління та високоякісну стандартизацію. Повідомимо команди про зміни, а глядачів про початок турніру. Налаштуйте подію, заповнивши коротку форму - про решту позаботимося ми самі.',
      it: 'Forniamo un pannello di controllo comodo e una standardizzazione di alta qualità. Notifichiamo le squadre sui cambiamenti e gli spettatori sull\'inizio del torneo. Configura l\'evento compilando un breve modulo: noi ci occupiamo del resto.',
      pl: 'Zapewniamy wygodną panel sterowania i wysokiej jakości standaryzację. Powiadamiamy zespoły o zmianach, a widzów o rozpoczęciu turnieju. Skonfiguruj wydarzenie, wypełniając krótki formularz - resztę załatwimy sami.'
    }
  },
  create_team: {
    title: {
      us: 'Team name',
      ru: 'Название команды',
      ua: 'Назва команди',
      it: 'Nome della squadra',
      pl: 'Nazwa drużyny'
    },
    indent: {
      us: 'Team ID (only: a-z, 0-9, _ and -)',
      ru: 'Айди команды (только: a-z, 0-9, _ и -)',
      ua: 'Ідентифікатор команди (тільки: a-z, 0-9, _ і -)',
      it: 'ID squadra (solo: a-z, 0-9, _ e -)',
      pl: 'ID drużyny (tylko: a-z, 0-9, _ i -)'
    },
    logo: {
      us: 'Upload logo (PNG, JPG, SVG, >1MB, 512x512px)',
      ru: 'Загрузить логотип (PNG, JPG, SVG, >1MB, 512x512px)',
      ua: 'Завантажити логотип (PNG, JPG, SVG, >1MB, 512x512px)',
      it: 'Carica logo (PNG, JPG, SVG, >1MB, 512x512px)',
      pl: 'Prześlij logo (PNG, JPG, SVG, >1MB, 512x512px)'
    },
    logo_title: {
      us: 'Team Logo',
      ru: 'Логотип команды',
      ua: 'Логотип команди',
      it: 'Logo della squadra',
      pl: 'Logo drużyny'
    }
  },
  created_at: {
    us: 'Created at ',
    ru: 'Создано ',
    ua: 'Створено ',
    it: 'Creato il ',
    pl: 'Utworzono '
  },  
  joinable: {
    Closed: {
      us: 'Closed to new members',
      ru: 'Закрыта для присоединения',
      ua: 'Закрита для приєднання',
      it: 'Chiuso per nuove adesioni',
      pl: 'Zamknięta na nowych członków'
    },
    Invites: {
      us: 'Invite only',
      ru: 'Только по приглашению',
      ua: 'Лише за запрошенням',
      it: 'Solo su invito',
      pl: 'Tylko na zaproszenie'
    },
    Free: {
      us: 'Open to join',
      ru: 'Открыта для вступления',
      ua: 'Відкрита для приєднання',
      it: 'Aperto a tutti',
      pl: 'Otwarta dla wszystkich'
    }
  },
  team: {
    invite: {
      us: 'Invitation',
      ru: 'Приглашение',
      ua: 'Запрошення',
      it: 'Invito',
      pl: 'Zaproszenie'
    },
    settings: {
      us: 'Privacy settings',
      ru: 'Настройки приватности',
      ua: 'Налаштування приватності',
      it: 'Impostazioni sulla privacy',
      pl: 'Ustawienia prywatności'
    },
    for_teams: {
      us: 'For teams',
      ru: 'Командам',
      ua: 'Командам',
      it: 'Per le squadre',
      pl: 'Dla drużyn'
    },
    amount: {
      us: 'Teams',
      ru: 'Комманд',
      ua: 'Команд',
      it: 'Squadre',
      pl: 'Drużyn'
    },
    has_no_description: {
      us: 'The team has no description',
      ru: 'У команды нет описания',
      ua: 'У команди немає опису',
      it: 'La squadra non ha una descrizione',
      pl: 'Drużyna nie ma opisu'
    },
    recomendations: {
      us: 'Recommendations',
      ru: 'Рекомендации',
      ua: 'Рекомендації',
      it: 'Raccomandazioni',
      pl: 'Rekomendacje'
    },
    yours: {
      us: 'Your Teams',
      ru: 'Ваши команды',
      ua: 'Ваші команди',
      it: 'Le tue squadre',
      pl: 'Twoje zespoły'
    },
    members: {
      us: 'Team members',
      ru: 'Участники команды',
      ua: 'Учасники команди',
      it: 'Membri del team',
      pl: 'Członkowie zespołu'
    },
    not_found: {
      us: 'No teams found with that name',
      ru: 'Команд с таким названием не найдены',
      ua: 'Команд з такою назвою не знайдено',
      it: 'Nessuna squadra trovata con quel nome',
      pl: 'Nie znaleziono drużyn o tej nazwie'            
    },
    empty: {
      us: 'I don\'t think there\'s really fucking anything here. Fuck...',
      ru: 'Кажется тут реально нихуя нет. Пиздец...',
      ua: 'Здається тут реально ніхуя немає. Пиздець...',
      it: 'Non credo che ci sia davvero un cazzo di niente qui. Cazzo...',
      pl: 'Nie wydaje mi się, żeby było tu cokolwiek pieprzonego. Kurwa...'
    },
    delete: {
      us: 'Delete team',
      ru: 'Удалить команду',
      ua: 'Видалити команду',
      it: 'Elimina squadra',
      pl: 'Usuń drużynu'
    },
  },
  display_options: {
    top: {
      us: 'On top',
      ru: 'Вверху',
      ua: 'Зверху',
      it: 'In alto',
      pl: 'Na górze'
    },
    middle: {
      us: 'Default',
      ru: 'По умолчанию',
      ua: 'За замовчуванням',
      it: 'Predefinito',
      pl: 'Domyślny'
    },
    center: {
      us: 'In the center',
      ru: 'В центре',
      ua: 'В центрі',
      it: 'Al centro',
      pl: 'W centrum'
    }    
  },
  tournament: {
    for_organizers: {
      us: 'For organizers',
      ru: 'Организаторам',
      ua: 'Організаторам',
      it: 'Per gli organizzatori',
      pl: 'Dla organizatorów'
    },
    recomendations: {
      us: 'Popular tournaments',
      ru: 'Популярные турниры',
      ua: 'Популярні турніри',
      it: 'Tornei popolari',
      pl: 'Popularne turnieje'
    },
    well: {
      us: 'Got it :(',
      ru: 'Понятно :(',
      ua: 'Зрозуміло :(',
      it: 'Capito :(',
      pl: 'Rozumiem :('
    },
    forbidden: {
      us: 'You need to be verified to be able to create tournaments.',
      ru: 'Необходимо пройти верификацию, чтобы получить возможность создавать турниры.',
      ua: 'Потрібно пройти верифікацію, щоб отримати можливість створювати турніри.',
      it: 'Devi essere verificato per poter creare tornei.',
      pl: 'Musisz zostać zweryfikowany, aby móc tworzyć turnieje.'
    },
    members: {
      us: 'Tournament members',
      ru: 'Участники турнира',
      ua: 'Учасники турніру',
      it: 'Partecipanti al torneo',
      pl: 'Uczestnicy turnieju'
    },
    empty: {
      us: "We're so fucking poor that no one made the tournament. Come back tomorrow.",
      ru: 'Мы настролько нищеёбы что никто не сделал турнир. Заходи завтра.',
      ua: 'Ми настільки ніщєйоби, що ніхто не зробив турнір. Заходь завтра.',
      it: 'Siamo così poveri che nessuno ha partecipato al torneo. Tornate domani.',
      pl: 'Jesteśmy tak kurewsko biedni, że nikt nie dostał się do turnieju. Wróć jutro.'
    },
    not_found: {
      us: 'No tournaments found with that name',
      ru: 'Турниров с таким названием не найдены',
      ua: 'Змагань з такою назвою не знайдено',
      it: 'Nessun torneo trovato con questo nome',
      pl: 'Nie znaleziono turniejów o takiej nazwie'            
    },
    delete: {
      us: 'Delete tournament',
      ru: 'Удалить турнир',
      ua: 'Видалити змагання',
      it: 'Elimina torneo',
      pl: 'Usuń turniej'
    },
  },
  already_exists: {
    us: 'A team with this ID already exists, please choose another one',
    ru: 'Команда с таким айди уже существует, придумай другое',
    ua: 'Команда з таким ідентифікатором вже існує, придумайте інший',
    it: 'Una squadra con questo ID già esiste, scegline un altro',
    pl: 'Drużyna o tym ID już istnieje, wybierz inne'
  },
  comments: {
    title: {
      us: 'Comments',
      ru: 'Коментарии',
      ua: 'Коментарі',
      it: 'Commenti',
      pl: 'Komentarze'
    },
    empty: {
      us: "There doesn't seem to be any comments...",
      ru: 'Кажестся тут нет коментариев...',
      ua: 'Здається, тут немає коментарів...',
      it: 'Non sembra esserci alcun commento...',
      pl: 'Nie wygląda na to, żeby były jakiekolwiek komentarze...'
    },
    leave: {
      us: 'Leave a comment...',
      ru: 'Написать комментарий...',
      ua: 'Залиште коментар...',
      it: 'Lascia un commento...',
      pl: 'Zostaw komentarz...'
    }
  },
  warn_everyone_can_join: {
    us: 'The team is open and anyone can join.',
    ru: 'Команда открыта и каждый желающий может присоеденится.',
    ua: 'Команда відкрита і кожен охочий може приєднатися.',
    it: 'La squadra è aperta e tutti sono invitati a farne parte.',
    pl: 'Zespół jest otwarty i każdy może do niego dołączyć.'
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
      pl: 'Znajdź drużynę'
    },
    tournament: {
      us: 'Find tournament',
      ru: 'Найти турнир',
      ua: 'Знайти турнір',
      it: 'Trova torneo',
      pl: 'Znajdź turniej'
    },
  },
  create: {
    team: {
      us: 'Create team',
      ru: 'Создать команду',
      ua: 'Створити команду',
      it: 'Crea squadra',
      pl: 'Stwórz drużynę'
    },
    tournament: {
      us: 'Create tournament',
      ru: 'Создать турнир',
      ua: 'Створити турнір',
      it: 'Crea torneo',
      pl: 'Stwórz turniej'
    },
  },
  choose: {
    language: {
      us: 'Choose language',
      ru: 'Выбрать язык',
      ua: 'Вибрати мову',
      it: 'Scegli la lingua',
      pl: 'Wybierz język'
    },
  },
  edit: {
    team: {
      us: 'Edit team',
      ru: 'Редактировать команду',
      ua: 'Редагувати команду',
      it: 'Modifica squadra',
      pl: 'Edytuj drużynę'
    },
  },
  _undo: {
    us: 'Undo',
    ru: 'Отменить',
    ua: 'Скасувати',
    it: 'Annulla',
    pl: 'Cofnij'
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
      us: 'Operational',
      ru: 'В норме',
      ua: 'У нормі',
      it: 'Operativo',
      pl: 'Operacyjny'
    },
    warn: {
      us: 'Under load',
      ru: 'Нагружен',
      ua: 'Під навантаженням',
      it: 'Sotto carico',
      pl: 'Pod obciążeniem'
    },
    error: {
      us: 'Something broke',
      ru: 'Что-то наебнулось',
      ua: 'Щось зламалося',
      it: 'Qualcosa si è rotto',
      pl: 'Coś się zepsuło'
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
      us: 'Changelog',
      ru: 'История изменений',
      ua: 'Журнал змін',
      it: 'Registro delle modifiche',
      pl: 'Dziennik zmian'
    }
  },
  impersonate: {
    us: 'Impersonate',
    ru: 'Осуществить вход от имени',
    ua: 'Увійти від імені',
    it: 'Impersonare',
    pl: 'Podszyj się' 
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
  error,
  success,
  landing,
  item
}

export default locale;

type Generic = typeof locale;

type Translations<T> = {
  [K in keyof T]: T[K] extends Template
    ? string
    : Translations<T[K]>
};

export type Locale = Translations<Generic>;
