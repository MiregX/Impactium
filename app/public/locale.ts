export interface Locale {
  [key: string]: {
    uk: string;
    it: string;
    us: string;
    ru: string;
  };
}

const locale: Locale = {
  login: {
    uk: "Увійти",
    it: "Accesso",
    us: "Login",
    ru: "Войти"
  },
  logout: {
    uk: "Вийти",
    it: "Disconnettersi",
    us: "Logout",
    ru: "Выйти"
  },
   usernameOrEmail: {
    uk: "Нікнейм або пошта",
    it: "Nome utente o email",
    us: "Username or email",
    ru: "Никнейм или почта"
  },
  continueWithGoogle: {
    uk: "Увійти через Google",
    it: "Continua con Google",
    us: "Continue with Google",
    ru: "Войти используя Google"
  },
  continueWithDiscord: {
    uk: "Увійти через Discord",
    it: "Continua con Discord",
    us: "Continue with Discord",
    ru: "Войти используя Discord"
  },
  nuhuh: {
    uk: "Крінжик...",
    it: "No...",
    us: "Nuh uh...",
    ru: "Кринжовичёк..."
  },
  hours: {
    uk: "годин",
    it: "ore",
    us: "hours",
    ru: "часов"
  },
  hour: {
    uk: "година",
    it: "ora",
    us: "hour",
    ru: "час"
  },
  right_now: {
    uk: "Тільки що",
    it: "adesso",
    us: "Right now",
    ru: "Только что"
  },
  ago: {
    uk: "тому",
    it: "fa",
    us: "ago",
    ru: "назад"
  },
  minutes: {
    uk: "хвилин",
    it: "minuti",
    us: "minutes",
    ru: "минут"
  },
  minute: {
    uk: "хвилина",
    it: "minuto",
    us: "minute",
    ru: "минута"
  },
  minutes_1: {
    uk: "хвилину",
    it: "minuto",
    us: "minute",
    ru: "минуту"
  },
  minutes_2_4: {
    uk: "хвилини",
    it: "minuti",
    us: "minutes",
    ru: "минуты"
  },
  minutes_5: {
    uk: "хвилин",
    it: "minuti",
    us: "minutes",
    ru: "минут"
  },
  hours_1: {
    uk: "година",
    it: "ora",
    us: "hour",
    ru: "час"
  },
  hours_2_4: {
    uk: "години",
    it: "ore",
    us: "hours",
    ru: "часа"
  },
  hours_5: {
    uk: "годин",
    it: "ore",
    us: "hours",
    ru: "часов"
  },
  dontHaveAnAccount: {
    uk: "Не маєте облікового запису?",
    it: "Non hai un account?",
    us: "Don't have an account?",
    ru: "Нет учетной записи?"
  },
  justUseTheseTwo: {
    uk: "Козаче... Просто використай це:",
    it: "Usa semplicemente queste due:",
    us: "Just  use these two:",
    ru: "Чел... Просто используй это:"
  },
  partners: {
    uk: "Партнери",
    it: "Partner",
    us: "Partners",
    ru: "Партнёры"
  },
  products: {
    uk: "Сервіси",
    it: "Servizzi",
    us: "Services",
    ru: "Сервисы"
  },
  cont: {
    uk: "Сервіси",
    it: "Servizzi",
    us: "Services",
    ru: "Сервисы"
  },
  joinToUs: {
    uk: "Приєднуйтесь до нас",
    it: "Unisciti a noi",
    us: "Join Our Community",
    ru: "Присоединяйтесь к нам"
  },
  joinToUsDescription: [
    {
      uk: "Використання голосового чату не обов'язкове, але бажане. Без нього тебе засруть інші гравці.",
      it: "L'uso della chat vocale non è obbligatorio, ma consigliato. Senza di essa, gli altri giocatori ti infastidiranno.",
      us: "The  use of voice chat is not mandatory, but recommended. Without  it, other players may spam you.",
      ru: "Использование войс-чата не обязательно, но желательно. Без него тебя засрут другие игроки."
    },
      {
      uk: "Будь готовий знайти на своїй базі величезну обсидіанову свастику. І немає жодних гарантій, що це не зробив адмін )",
      it: "Sii pronto a scoprire una grande svastica di ossidiana nella tua base. E non ci sono garanzie che non l'abbia fatta l'amministratore )",
      us: "Be prepared to discover a huge obsidian swastika at your base. And there are no guarantees that the admin didn't create  it )",
      ru: "Будь готов обнаружить у себя на базе огромную обсидиановую свастику. И нет никаких гарантий, что это сделал не админ )"
    },
      {
      uk: "Перше правило лісу - завжди ховай шалкера в ендер-скрині. Друге правило лісу: за гриф - сват і дудос",
      it: "La prima regola del bosco - nascondi sempre lo shulker nell'ender chest. La seconda regola del bosco: per il grief - DDoS",
      us: "The first  rule of the forest - always hide the shulker in the ender chest. The second  rule of the forest: for grief - DDoS",
      ru: "Первое правило леса - всегда прячь шалкера в эндер-чест. Второе правило леса: за гриф - сват и дудос"
    },
      {
      uk: "Незважаючи на рофельність проекту, адмін цілком адекватна людина. Якщо є проблеми - пиши в тг @MiregX",
      it: "Nonostante la natura scherzosa del progetto, l'amministratore è una persona del tutto ragionevole. Se ci sono problemi, scrivi su Telegram a @MiregX",
      us: "Despite the project's humorous nature, the admin is quite reasonable. If you have issues, contact on Telegram @MiregX",
      ru: "Не смотря на рофельность проекта, админ вполне вменяемый человек. Если есть проблемы - пиши в тг @MiregX"
    },
      {
      uk: "Ходять чутки, що за виконання всіх досягнень на сайті можна отримати бан.",
      it: "Circolano voci che eseguire tutti gli obiettivi sul sito può portare al ban.",
      us: "Rumors are circulating that completing all achievements on the site may result in a ban.",
      ru: "Ходят слухи, что за выполнение всех достижений на сайте можно получить бан."
    }
  ],
ourPartners: {
    uk: "Наші партнери",
    it: "I nostri partner",
    us: "Our Partners",
    ru: "Наши партнеры"
  },
  contact: {
    uk: "Контакти",
    it: "Contatti",
    us: "Contacts",
    ru: "Контакты"
  },
  backToMain: {
    uk: "Повернутися на головну",
    it: "Torna alla pagina principale",
    us: "Back to main",
    ru: "Вернуться на главную"
  },
  totalMembers: {
  statisticsName: {
      uk: "Кількість учасників",
      it: "Membri totali",
      us: "Total Members",
      ru: "Кол-во участников"
    },
    statisticsNameFull: {
      uk: "Загальна кількість учасників на сервері",
      it: "Membri totali nel server",
      us: "Total members on the server",
      ru: "Общее количество участников на сервере"
    }
  },
  onlineMembers: {
  statisticsName: {
      uk: "Учасників онлайн",
      it: "Membri online",
      us: "Online Members",
      ru: "Кол-во онлайн"
    },
    statisticsNameFull: {
      uk: "Загальна кількість учасників в мережі",
      it: "Membri online nel server",
      us: "Total members online",
      ru: "Общее количество участников в сети"
    }
  },
  playingMembers: {
  statisticsName: {
      uk: "Учасників у грі",
      it: "Membri che giocano",
      us: "Playing Members",
      ru: "Кол-во игроков"
    },
    statisticsNameFull: {
      uk: "Загальна кількість учасників, які грають",
      it: "Membri che giocano nel server",
      us: "Total members playing",
      ru: "Общее количество участников в игре"
    }
  },
  voiceMembers: {
  statisticsName: {
      uk: "Активність в голосовому чаті",
      it: "Membri in chat vocale",
      us: "Voice Activity",
      ru: "Активность в гол."
    },
    statisticsNameFull: {
      uk: "Активність в голосових каналах",
      it: "Attività vocale nel server",
      us: "Voice activity in channels",
      ru: "Активность в голосовых каналах"
    }
  },
  uniqueUsersVoiceActivity: {
  statisticsName: {
      uk: "Унікальних кор. в войсі",
      it: "Utenti unici in chat vocale",
      us: "Unique Voice Users",
      ru: "Уникальных в голосовых."
    },
    statisticsNameFull: {
      uk: "Кількість унікальних приєднань до голосових каналів",
      it: "Utenti unici in chat vocale nel server",
      us: "Number of unique joins in voice channels",
      ru: "Количество уникальных присоединений в голосовые каналы"
    }
  },
  messagesFromUniqueUsers: {
  statisticsName: {
      uk: "Унікальних кор. в чаті",
      it: "Messaggi da utenti unici",
      us: "Messages from Unique Users",
      ru: "Уникальных участников в чате"
    },
    statisticsNameFull: {
      uk: "Кількість унікальних користувачів, які писали в чат",
      it: "Messaggi da utenti unici nel server",
      us: "Number of unique  users who messaged in chat",
      ru: "Количество уникальных пользователей написавших в чат"
    }
  },
  messagesPerHour: {
  statisticsName: {
      uk: "Повідомлень в год.",
      it: "Numero messaggi/ora",
      us: "Messages per hour",
      ru: "Кол-во сообщений в час"      
    },
    statisticsNameFull: {
      uk: "Кількість унікальних користувачів, які писали в чат",
      it: "Messaggi da utenti unici nel server",
      us: "Number of unique  users who messaged in chat",
      ru: "Количество уникальных пользователей написавших в чат"
    }
  },
  totalRegionalMembers: {
  statisticsName: {
      uk: "Учасників з регіону",
      it: "Membri totali della regione",
      us: "Total regional members",
      ru: "Участники из региона"
    },
    statisticsNameFull: {
      uk: "Кількість учасників з регіону, вказаних як основних у налаштуваннях серверу",
      it: "Numero totale dei membri regionali specificati come principali nelle impostazioni del server",
      us: "Total number of regional members specified as primary in server settings",
      ru: "Общее количество участников из региона, указанных как основные в настройках сервера"
    }
  },
  playerNotRegisteredYet: {
    uk: "Немає акаунту",
    it: "",
    us: "No account",
    ru: "Нет аккаунта"
  },
  playerHasNoNickname: {
    uk: "Немає ігрового імені",
    it: "",
    us: "No nickname",
    ru: "Нет никнейма"
  },
  skinChangeWouldBeAbleAgainOn: {
    uk: "Ви зможете змінити вигляд через:",
    it: "Potrai cambiare di nuovo l'aspetto tra:",
    us: "You would be able to change your skin again in:",
    ru: "Вы сможете снова сменить облик через:"
  },
  skinNotSettled: {
    uk: "Ви не встановили костюм",
    it: "Non hai impostato la skin",
    us: "You have not set the skin",
    ru: "Вы не установили скин"
  },
  myProfile: {
    uk: "Мій профіль",
    it: "Il mio profilo",
    us: "My profile",
    ru: "Мой профиль"
  },
  buySomeStuff: {
    uk: "Купити ресурси",
    it: "Acquistare risorse",
    us: "Buy resources",
    ru: "Купить ресурсы"
  },
  adminPanelButtonText: {
    uk: "Термінал",
    it: "Terminal",
    us: "Terminal",
    ru: "Терминал"
  },
  changeNickname: {
    uk: "Змінити нікнейм",
    it: "Cambia nickname",
    us: "Change nickname",
    ru: "Изменить никнейм"
  },
    usterNickname: {
      uk: "Введіть нікнейм",
      it: "Inserisci nickname",
      us: "Enter nickname",
      ru: "Введи ник"
  },
  changeSkin: {
      uk: "Змінити вигляд",
      it: "Cambia skin",
      us: "Change skin",
      ru: "Изменить облик"
  },
  playOnOurProject: {
    uk: "Шість причин пограти на нашому сервері:",
    it: "Sei ragioni per giocare sul nostro server:",
    us: "Six reasons to play on our server:",
    ru: "Шесть причин поиграть на нашем сервере:"
  },
  administrationNotIntervenes: {
    uk: "Адміністрація не втручається в ігровий процес",
    it: "L'amministrazione non interviene nel processo di gioco",
    us: "Administration does not intervene in the gameplay",
    ru: "Администрация не вмешивается в игровой процесс"
  },
  openWorldWithoutPrivates: {
    uk: "Відкритий світ без привату",
    it: "Mondo aperto senza privati",
    us: "Open world without privates",
    ru: "Открытый мир без привата"
  },
  sendAthletesAgainstNonRP: {
    uk: "Висилаємо спортиків проти нон-РП гриферів",
    it: "Inviamo atleti contro i griefer non RP",
    us: "Send athletes against non-RP griefers",
    ru: "Высылаем спортиков против нон-РП гриферов"
  },
  uniqueRewardsSystem: {
    uk: "Унікальна система заохочень",
    it: "Sistema di ricompense unico",
    us: "Unique rewards system",
    ru: "Уникальная система поощрений"
  },
  masterpieceRoleplayWithAdmins: {
    uk: "Шедевроролплей з адмінкою та кристалами",
    it: "Capolavoro del gioco di  ruolo con gli admin e i cristalli",
    us: "Masterpiece roleplay with admins and crystals",
    ru: "Шедевроролплей с админкой и кристалами"
  },
  donateAndGetUniqueSkin: {
    uk: "Отримай унікальний скин пісюна на меч",
    it: "Ricevi una skin unica del pene sulla spada",
    us: "Get a unique penis skin on the sword",
    ru: "Отримай унікальний скин пісюна на меч"
  },
  changePassword: {
      uk: "Змінити пароль",
      it: "Cambia la password",
      us: "Change password",
      ru: "Изменить пароль"
  },
    usterNewPassword: {
      uk: "Введіть новий пароль",
      it: "Inserisci nuova password",
      us: "Enter new password",
      ru: "Введи новый пароль"
  },
  saveChanges: {
      uk: "На головну",
      it: "To main page",
      us: "To main page",
      ru: "На главную"
  },
  _register: {
      uk: "Зареєструватися",
      it: "Registrati",
      us: "Register",
      ru: "Зарегистрироваться"
  },
  confirm: {
      uk: "Підтвердити",
      it: "Conferma",
      us: "Confirm",
      ru: "Подтвердить"
  },
  apply: {
      uk: "Зберегти",
      it: "Applica",
      us: "Apply",
      ru: "Сохранить"
  },
  version: {
    uk: "Версія",
    it: "Versione",
    us: "Version",
    ru: "Версия"
  },
  reward: {
    uk: "Нагороди",
    it: "Rewards",
    us: "Rewards",
    ru: "Награды"
  },
  effect: {
    uk: "Ефект",
    it: "Effetto",
    us: "Effect",
    ru: "Эффект"
  },
  ability: {
    uk: "Здібність",
    it: "Abilità",
    us: "Ability",
    ru: "Способность"
  },
  downloadVoiceChat: {
    uk: "Завантажити голосовий чат",
    it: "Scarica la chat vocale",
    us: "Download voice chat",
    ru: "Скачать голосовой чат"
  },
  supportOurServer: {
    uk: "Підтримати проект",
    it: "Sostieni il progetto",
    us: "Support our server",
    ru: "Поддержать проект"
  },
  playerChat: {
    uk: "Чат гравців сервера",
    it: "Chat con il giocatore",
    us: "Server player`s chat",
    ru: "Чат игроков сервера"
  },
  copyMyReferalLink: {
    uk: "Моє реферальне посилання",
    it: "Mio link di referral",
    us: "My referral link",
    ru: "Моя реферальная ссылка"
  },
  lastSkinFetch: {
    uk: "Ресурс-пак оновлено",
    it: "Ultimo aggiornamento pack",
    us: "Resource pack updated",
    ru: "Ресурс-пак обновлен"
  },
  lastStatFetch: {
    uk: "Статистику оновлено",
    it: "Ultimo aggiornamento statistiche",
    us: "Statistics updated",
    ru: "Статистика обновлена"
  },
  referalsAmount: {
    uk: "Кількість рефералів",
    it: "Numero di referral",
    us: "Referrals amount",
    ru: "Количество рефералов"
  },
  mcsWsConnection: {
    uk: "З'єднання з терміналом",
    it: "Connessione a terminal",
    us: "Terminal connection",
    ru: "Соединение с терминалом"
  },
  verifyUser: {
    uk: "Верифікувати користувача",
    it: "Verifica utente",
    us: "Verify  user",
    ru: "Верифицировать пользователя"
  },
  changeUserBalance: {
    uk: "Змінити баланс користувача",
    it: "Cambia saldo utente",
    us: "Change  user balance",
    ru: "Изменить баланс пользователя"
  },
  serverStatus: {
  200: {
      uk: "",
      it: "",
      us: "Connected",
      ru: ""
    },
    201: {
      uk: "",
      it: "",
      us: "Reconnecting...",
      ru: ""
    },
    500: {
      uk: "",
      it: "",
      us: "Failed",
      ru: ""
    }
  },
  achievmentTitle_casual: {
      uk: "Казуальність",
      it: "Casualità",
      us: "Casuality",
      ru: "Казуальность"
  },
  achievmentTitle_killer: {
      uk: "Вбивця",
      it: "Assasino",
      us: "Killer",
      ru: "Убийца"
  },
  achievmentTitle_defence: {
      uk: "Воїн",
      it: "",
      us: "Warrior",
      ru: "Воин"
  },
  achievmentTitle_hammer: {
      uk: "Відданість",
      it: "Devozione",
      us: "Devotion",
      ru: "Преданность"
  },
  achievmentTitle_event: {
      uk: "Тусовщик",
      it: "Eventi",
      us: "Events",
      ru: "Тусовщик"
  },
  achievmentTitle_donate: {
      uk: "Донатер",
      it: "Donatore",
      us: "Donator",
      ru: "Донатер"
  },
  casual_reward: {
    uk: "Квапливість I",
    it: "Sollecitudine I",
    us: "Haste I",
    ru: "Спешка I"
  },
  defence_reward: {
    uk: "Стійкість I",
    it: "Resistenza I",
    us: "Resistance I",
    ru: "Сопротивление I"
  },
  killer_reward: {
    uk: "Сила I",
    it: "Forza I",
    us: "Strength I",
    ru: "Сила I"
  },
  event_reward: {
    uk: "",
    it: "",
    us: "",
    ru: ""
  },
  donate_reward: {
    uk: "",
    it: "",
    us: "",
    ru: ""
  },
  hammer_reward: {
    uk: "",
    it: "",
    us: "",
    ru: ""
  },
  becomeMayor_todo: {
  title: {
      uk: "Стати мером",
      it: "Diventa sindaco",
      us: "Become Mayor",
      ru: "Мы будем строить и реконструировать"
    },
    description: {
      uk: "Відвідати мерію спавна",
      it: "Visita l'ufficio del sindaco",
      us: "Visit the spawn mayor's office",
      ru: "Побывать мером спавна"
    }
  },
  playsFromFirstSeason_todo: {
  title: {
      uk: "Гравець з першого сезону",
      it: "Gioca dalla prima stagione",
      us: "Plays From First Season",
      ru: "Настоящий олд"
    },
    description: {
      uk: "Грати на першому сезоні 50 годин",
      it: "Gioca per 50 ore nella prima stagione",
      us: "Play for 50 hours in the first season",
      ru: "Наиграть на первом сезоне 50 часов"
    }
  },
  petition_todo: {
  title: {
      uk: "Підпишіть мою петицію!",
      it: "Firma la mia petizione!",
      us: "Sign My Petition!",
      ru: "Подпишите мою петицию!"
    },
    description: {
      uk: "Зібрати мітинг за ваше президентство",
      it: "Organizza una manifestazione per la tua presidenza",
      us: "Hold a rally for your presidency",
      ru: "Собрать митинг за ваше президенство"
    }
  },
  diamonds_todo: {
  title: {
      uk: "Блискучі",
      it: "Diamanti",
      us: "Diamonds",
      ru: "Блестяшки"
    },
    description: {
      uk: "Видобути 10 алмазних руд",
      it: "Estrai 10 minerali di diamante",
      us: "Mine 10 diamond ores",
      ru: "Добыть 10 алмазной руды"
    }
  },
  netherite_todo: {
  title: {
      uk: "Вперше...?",
      it: "Per la prima volta...?",
      us: "For the First Time...?",
      ru: "В первый раз...?"
    },
    description: {
      uk: "Видобути 4 старовинних обломки",
      it: "Estrai 4 frammenti antichi",
      us: "Mine 4 ancient debris",
      ru: "Добыть 4 древних обломка"
    }
  },
    usdStone_todo: {
  title: {
      uk: "Велике розчищення",
      it: "La grande pulizia",
      us: "The Great Cleanup",
      ru: "Великая разчистка"
    },
    description: {
      uk: "Видобути 2048 ендернику",
      it: "Estrai 2048 blocchi di pietra dell'End",
      us: "Mine 2048 end stone blocks",
      ru: "Добыть 2048 эндерняка"
    }
  },
  shrieker_todo: {
  title: {
      uk: "Здається, це зайва справа",
      it: "Sembra superfluo",
      us: "Seems Unnecessary",
      ru: "Похоже это лишнее"
    },
    description: {
      uk: "Зруйнувати 16 скелетон-крикунів",
      it: "Distruggi 16 shrieker",
      us: "Destroy 16 shriekers",
      ru: "Разрушить 16 скалк-крикунов"
    }
  },
  reinforcedDeepslate_todo: {
  title: {
      uk: "Божевільний, блять.",
      it: "Pazzo, cavolo.",
      us: "Insane, damn.",
      ru: "Безумец блять."
    },
    description: {
      uk: "Сламати 64 блоки портального каркасу",
      it: "Rompi 64 blocchi di telaio del portale",
      us: "Break 64 portal frame blocks",
      ru: "Сломать 64 блока рамки портала"
    }
  },
  damageOne_todo: {
  title: {
      uk: "Хлюпик",
      it: "Schizzinoso",
      us: "Dripper",
      ru: "Хлюпик"
    },
    description: {
      uk: "Отримати 100 000 пошкоджень",
      it: "Ricevi 100.000 danni",
      us: "Receive 100,000 damage",
      ru: "Получить 100.000 урона"
    }
  },
  damageTwo_todo: {
  title: {
      uk: "Шнурок",
      it: "Corda",
      us: "Stringer",
      ru: "Шнурок"
    },
    description: {
      uk: "Отримати 250 000 пошкоджень",
      it: "Ricevi 250.000 danni",
      us: "Receive 250,000 damage",
      ru: "Получить 250.000 урона"
    }
  },
  damageThree_todo: {
  title: {
      uk: "Тюбик",
      it: "Tubetto",
      us: "Tube",
      ru: "Тюбик"
    },
    description: {
      uk: "Отримати 500 000 пошкоджень",
      it: "Ricevi 500.000 danni",
      us: "Receive 500,000 damage",
      ru: "Получить 500.000 урона"
    }
  },
  damageFour_todo: {
  title: {
      uk: "Воїн",
      it: "Guerriero",
      us: "Warrior",
      ru: "Воин"
    },
    description: {
      uk: "Отримати 750 000 пошкоджень",
      it: "Ricevi 750.000 danni",
      us: "Receive 750,000 damage",
      ru: "Получить 750.000 урона"
    }
  },
  damageFive_todo: {
  title: {
      uk: "Неуразливий",
      it: "Invulnerabile",
      us: "Invincible",
      ru: "Неуязвимый"
    },
    description: {
      uk: "Отримати 1 000 000 пошкоджень",
      it: "Ricevi 1.000.000 danni",
      us: "Receive 1,000,000 damage",
      ru: "Получить 1.000.000 урона"
    }
  },
  kills_todo: {
  title: {
      uk: "Мисливець",
      it: "Cacciatore",
      us: "Hunter",
      ru: "Охотник"
    },
    description: {
      uk: "Вбити 500 істот",
      it: "Uccidi 500 creature",
      us: "Kill 500 entities",
      ru: "Убить 500 существ"
    }
  },
  wither_todo: {
  title: {
      uk: "Це через те, що я чорний?",
      it: "È perché sono nero?",
      us: "Is  it because I'm black?",
      ru: "Это потому что я чёрный?"
    },
    description: {
      uk: "Запиздячити Засушувача",
      it: "Sconfiggi il Dissicante",
      us: "Defeat the Wither",
      ru: "Запиздячить Иссушителя"
    }
  },
  dragon_todo: {
  title: {
      uk: "Ей, де мої яйця!",
      it: "Ehi, dove sono le mie uova?",
      us: "Hey, where are my eggs?",
      ru: "Э, а где яйца!"
    },
    description: {
      uk: "Навалить на Ендер-дракона",
      it: "Abbatti l'End Drago",
      us: "Defeat the Ender Dragon",
      ru: "Нахлабучить Эндер-дракона"
    }
  },
  warden_todo: {
  title: {
      uk: "Такий крутий",
      it: "Così figo",
      us: "So Cool",
      ru: "Типа крутой"
    },
    description: {
      uk: "Затикати Вардена",
      it: "Blocca il Custode",
      us: "Block the Warden",
      ru: "Затыкать Вардена"
    }
  },
  damage_todo: {
  title: {
      uk: "Відьмак",
      it: "Stregone",
      us: "Witcher",
      ru: "Ведьмак"
    },
    description: {
      uk: "Нанести 1 000 000 пошкоджень",
      it: "Infliggi 1.000.000 danni",
      us: "Inflict 1,000,000 damage",
      ru: "Нанести 1.000.000 урона"
    }
  },
  eventOne_todo: {
  title: {
      uk: "Привіт, друже",
      it: "Ciao amico",
      us: "Hello, friend",
      ru: "Привет, друг"
    },
    description: {
      uk: "Запросити 1 гравців",
      it: "Invita 1 giocatori",
      us: "Invite 1 players",
      ru: "Пригласить 1 игрока"
    }
  },
  eventTwo_todo: {
  title: {
      uk: "Більше - краще!",
      it: "Più è meglio!",
      us: "More is better!",
      ru: "Больше - лучше!"
    },
    description: {
      uk: "Запросити 2 гравців",
      it: "Invita 2 giocatori",
      us: "Invite 2 players",
      ru: "Пригласить 2 игрока"
    }
  },
  eventThree_todo: {
  title: {
      uk: "Міпо!",
      it: "Meepo!",
      us: "Meepo!",
      ru: "Мипо!"
    },
    description: {
      uk: "Запросити 3 гравців",
      it: "Invita 3 giocatori",
      us: "Invite 3 players",
      ru: "Пригласить 3 игрока"
    }
  },
  eventFour_todo: {
  title: {
      uk: "Разом веселіше",
      it: "Insieme è più divertente",
      us: "Together is more fun",
      ru: "Вместе веселее"
    },
    description: {
      uk: "Запросити 5 гравців",
      it: "Invita 5 giocatori",
      us: "Invite 5 players",
      ru: "Пригласить 5 игроков"
    }
  },
  eventFive_todo: {
  title: {
      uk: "Піар менеджер",
      it: "Gestore di pubblicità",
      us: "PR Manager",
      ru: "Пиар менеджер"
    },
    description: {
      uk: "Запросити 10 гравців",
      it: "Invita 10 giocatori",
      us: "Invite 10 players",
      ru: "Пригласить 10 игроков"
    }
  },
  donateOne_todo: {
  title: {
      uk: "Філантроп",
      it: "Filantropo",
      us: "Philanthropist",
      ru: "Филантроп"
    },
    description: {
      uk: "Пожертвувати серверу 10$",
      it: "Dona 10$ al server",
      us: "Donate $10 to the server",
      ru: "Пожертвовать серверу 10$"
    }
  },
  donateTwo_todo: {
  title: {
      uk: "Благодійник",
      it: "Benefattore",
      us: "Benefactor",
      ru: "Благодеятель"
    },
    description: {
      uk: "Пожертвувати серверу 20$",
      it: "Dona 20$ al server",
      us: "Donate $20 to the server",
      ru: "Пожертвовать серверу 20$"
    }
  },
  donateThree_todo: {
  title: {
      uk: "Верни мамі карту",
      it: "Ridai la carta a tua madre",
      us: "Return the Card to Mom",
      ru: "Верни маме карту"
    },
    description: {
      uk: "Пожертвувати серверу 30$",
      it: "Dona 30$ al server",
      us: "Donate $30 to the server",
      ru: "Пожертвовать серверу 30$"
    }
  },
  donateFour_todo: {
  title: {
      uk: "Акціонер",
      it: "Azione",
      us: "Shareholder",
      ru: "Акционер"
    },
    description: {
      uk: "Пожертвувати серверу 40$",
      it: "Dona 40$ al server",
      us: "Donate $40 to the server",
      ru: "Пожертвовать серверу 40$"
    }
  },
  donateFive_todo: {
  title: {
      uk: "Інвестор",
      it: "Investitore",
      us: "Investor",
      ru: "Инвестор"
    },
    description: {
      uk: "Пожертвувати серверу 50$",
      it: "Dona 50$ al server",
      us: "Donate $50 to the server",
      ru: "Пожертвовать серверу 50$"
    }
  },
  copiedMessage: {
    uk: "скопійовано в буфер обміну",
    it: "copiato negli appunti",
    us: "copied to clipboard",
    ru: "скопировано в буфер обмена"
  },
  code_400: {
    uk: "Ви не авторизовані",
    it: "Non sei autorizzato",
    us: "You are not authorized",
    ru: "Вы не авторизированы"
  },
  skin: {
  200: {
      uk: "Зміна скіна пройшла успішно. Тепер ваш персонаж виглядає інакше. Зазвичай зміни вступають в силу протягом 6 годин.",
      it: "Il cambio di skin è avvenuto con successo. Ora il tuo personaggio ha un aspetto diverso. Di solito le modifiche diventano effettive entro 6 ore.",
      us: "Skin change was successful. Now your character looks different. Usually, changes take effect within 6 hours.",
      ru: "Изменение скина прошло успешно. Теперь ваш персонаж выглядит по-другому. Обычно изменения вступают в силу в течение 6 часов."
    },
    401: {
      uk: "Невірне розширення файлу",
      it: "Estensione del file non valida",
      us: "Invalid file extension",
      ru: "Неверное разширение файла"
    },
    402: {
      uk: "Скін повинен мати розмір 64 на 64 пікселі",
      it: "Lo skin deve essere di dimensioni 64 per 64 pixel",
      us: "Skin must be 64 by 64 pixels in size",
      ru: "Скин должен быть размером 64 на 64 пикселя"
    },
    403: {
      uk: "Зовнішній вигляд можна змінювати лише раз на 24 години",
      it: "L'aspetto può essere cambiato solo una volta ogni 24 ore",
      us: "Appearance can be changed only once in 24 hours",
      ru: "Облик можно менять только раз в 24 часа"
    }
  },
  nickname: {
  200: {
      uk: "Ваш нікнейм успішно оновлено. Деякі досягнення та предмети можуть зникнути.",
      it: "Il tuo nickname è stato aggiornato con successo. Alcuni achievement e oggetti potrebbero scomparire.",
      us: "Your nickname has been successfully updated. Some achievements and  items may disappear.",
      ru: "Ваш никнейм успешно обновлен. Некоторые достижения и предметы могут исчезнуть."
    },
    401: {
      uk: "Невірний регістр. Дозволяються тільки a-z, 0-9, '_'",
      it: "Maiuscole non valide. Consentiti solo a-z, 0-9, '_'",
      us: "Invalid case. Only a-z, 0-9, '_' are allowed",
      ru: "Неверный регистр. Разрешаются только a-z, 0-9, '_'"
    },
    402: {
      uk: "Нікнейм повинен бути від 3 до 32 символів",
      it: "Il nickname deve essere lungo da 3 a 32 caratteri",
      us: "Nickname must be between 3 and 32 characters",
      ru: "Никнейм должен быть от 3 до 32 символов"
    },
    403: {
      uk: "Нікнейм можна змінювати лише раз на годину",
      it: "Il nickname può essere cambiato solo una volta all'ora",
      us: "Nickname can be changed only once per hour",
      ru: "Никнейм можно менять только раз час"
    },
    404: {
      uk: "Гравець з таким нікнеймом вже існує",
      it: "Giocatore con lo stesso nickname già esistente",
      us: "Player with such nickname already exists",
      ru: "Такой никнейм уже занят"
    },
    405: {
      uk: "Вибачте, але ви не можете встановити той же самий нікнейм, який ви вже маєте",
      it: "Spiacenti, non puoi impostare lo stesso nickname che hai già",
      us: "Sorry, but you cannot set the same nickname that you already have",
      ru: "Извините, но вы не можете установить тот же никнейм, который уже используете"
    },
    406: {
      uk: "Пароль і нікнейм не можуть збігатися. Будь креативніший, чучело",
      it: "La password e il nickname non possono coincidere. Sii più creativo, fantoccio",
      us: "Password and nickname cannot match. Be more creative, dummy",
      ru: "Пароль и никнейм не могут совпадать. Будь креативнее, чучело"
    }
  },
  _nickname: {
    uk: "Нікнейм",
    it: "Nickname",
    us: "Nickname",
    ru: "Никнейм"
  },
  passWord: {
    uk: "Пароль",
    it: "Password",
    us: "Password",
    ru: "Пароль"
  },
  password: {
  200: {
      uk: "Пароль успішно змінено. Використовуйте /l <ваш пароль> для входу.",
      it: "La tua password è stata modificata con successo. Usa /l <password> per accedere.",
      us: "Password successfully changed. Use /l <your password> to log in.",
      ru: "Пароль успешно изменен. Используйте /l <ваш пароль> для входа."
    },
    401: {
      uk: "Пароль і нікнейм не можуть збігатися. Будь креативніше, чучело",
      it: "La password e il nickname non possono coincidere. Sii più creativo, fantoccio",
      us: "Password and nickname cannot match. Be more creative, dummy",
      ru: "Пароль и никнейм не могут совпадать. Будь креативнее, чучело"
    },
    402: {
      uk: "Завийобістий пароль. Спробуй щось простіше.",
      it: "Password troppo fottutamente fantastico. Prova qualcosa di più semplice.",
      us: "Password too fucking awesome. Try something simpler.",
      ru: "Пароль слишком ахуенен. Будь проще, придумай новый."
    },
    403: {
      uk: "В тебе вже стоїть цей пароль. Не клацай, а то клацну зубами по яйцях",
      it: "Hai già questa password. Non cliccare, altrimenti cliccherò con i denti sulle palle",
      us: "You already have this password. Don't click, or I'll click with my teeth on your balls",
      ru: "У тебя и так стоит этот пароль. Не клацай, а то клацну зубами по яйцам"
    }
  },
  achievement: {
  200: {
      uk: "Нагорода за досягнення активована. Якщо нагороди або еффекту немає - введіть у грі дебаг-команду \"/achievement\"",
      it: "Achievement reward activated. If there are no rewards or effects, enter the in-game debug command \"/achievement\"",
      us: "Achievement reward activated. If there are no rewards or effects, enter the in-game debug command \"/achievement\"",
      ru: "Награда за достижение активирована. Если нет наград или эффектов, введите в игре отладочную команду \"/achievement\""
    },
    401: {
      uk: "Здається ви ще не розблокували це досягнення. Зачекайте 10 хвилин, або повідомте про це адміністратору.",
      it: "Sembra che tu non abbia ancora sbloccato questo obiettivo. Attendi 10 minuti o segnala l'errore all'amministratore.",
      us: "It seems you haven't unlocked this achievement yet. Wait for 10 minutes or report the issue to the administrator.",
      ru: "Похоже, вы еще не разблокировали это достижение. Подождите 10 минут или сообщите об ошибке администратору."
    },
    402: {
      uk: "Це досягнення вже активоване. Якщо нагороди або еффекту немає - введіть у грі дебаг-команду \"/achievement\"",
      it: "Questo obiettivo è già attivato. Se non ci sono ricompense o effetti, inserisci il comando di debug nel gioco \"/achievement\"",
      us: "This achievement is already activated. If there are no rewards or effects, enter the in-game debug command \"/achievement\"",
      ru: "Это достижение уже активировано. Если нет наград или эффектов, введите в игре отладочную команду \"/achievement\""
    },
    403: {
      uk: "Здається такого досягнення не існує. Якщо ви вважаєте, що це помилка - повідомте про це адміністратору.",
      it: "1k",
      us: "1k",
      ru: "Кажется этого достижения не существует. Если вы считаете, что это ошибка - сообщите об этом администратору."
    }
  },
  register: {
  200: {
      uk: "Персонаж успішно створений",
      it: "",
      us: "",
      ru: ""
    },
    403: {
      uk: "Ви вже зареєстровані",
      it: "",
      us: "",
      ru: ""
    }
  },
  code_500: {
    uk: "Внутрішня помилка сервера",
    it: "Errore interno del server",
    us: "Internal server error",
    ru: "Внутренняя ошибка сервера"
  }
}

export default locale;