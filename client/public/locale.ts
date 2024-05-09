export interface Translation {
  ua: string;
  it: string;
  us: string;
  ru: string;
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
    ru: "Выйти"
  },
  _translationWarning: {
    ua: "Переклад був виконаний за допомогою нейромереж, і може містити помилки",
    it: "La traduzione è stata effettuata con IA e può contenere errori.",
    us: "The translation was performed using AI and may contain errors",
    ru: "Перевод был выполнен при помощи нейросетей, и может содержать ошибки"
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





  playerHasNoNickname: {
    ua: "Немає ігрового імені",
    it: "",
    us: "No nickname",
    ru: "Нет никнейма"
  },
  skinChangeWouldBeAbleAgainOn: {
    ua: "Ви зможете змінити вигляд через:",
    it: "Potrai cambiare di nuovo l'aspetto tra:",
    us: "You would be able to change your skin again in:",
    ru: "Вы сможете снова сменить облик через:"
  },
  skinNotSettled: {
    ua: "Ви не встановили костюм",
    it: "Non hai impostato la skin",
    us: "You have not set the skin",
    ru: "Вы не установили скин"
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
  buySomeStuff: {
    ua: "Купити ресурси",
    it: "Acquistare risorse",
    us: "Buy resources",
    ru: "Купить ресурсы"
  },
  adminPanelButtonText: {
    ua: "Термінал",
    it: "Terminal",
    us: "Terminal",
    ru: "Терминал"
  },
  changeNickname: {
    ua: "Змінити нікнейм",
    it: "Cambia nickname",
    us: "Change nickname",
    ru: "Изменить никнейм"
  },
  enterNickname: {
    ua: "Введіть нікнейм",
    it: "Inserisci nickname",
    us: "Enter nickname",
    ru: "Введи ник"
  },
  changeSkin: {
      ua: "Змінити вигляд",
      it: "Cambia skin",
      us: "Change skin",
      ru: "Изменить облик"
  },
  playOnOurProject: {
    ua: "Шість причин пограти на нашому сервері:",
    it: "Sei ragioni per giocare sul nostro server:",
    us: "Six reasons to play on our server:",
    ru: "Шесть причин поиграть на нашем сервере:"
  },
  administrationNotIntervenes: {
    ua: "Адміністрація не втручається в ігровий процес",
    it: "L'amministrazione non interviene nel processo di gioco",
    us: "Administration does not intervene in the gameplay",
    ru: "Администрация не вмешивается в игровой процесс"
  },
  openWorldWithoutPrivates: {
    ua: "Відкритий світ без привату",
    it: "Mondo aperto senza privati",
    us: "Open world without privates",
    ru: "Открытый мир без привата"
  },
  sendAthletesAgainstNonRP: {
    ua: "Висилаємо спортиків проти нон-РП гриферів",
    it: "Inviamo atleti contro i griefer non RP",
    us: "Send athletes against non-RP griefers",
    ru: "Высылаем спортиков против нон-РП гриферов"
  },
  uniqueRewardsSystem: {
    ua: "Унікальна система заохочень",
    it: "Sistema di ricompense unico",
    us: "Unique rewards system",
    ru: "Уникальная система поощрений"
  },
  masterpieceRoleplayWithAdmins: {
    ua: "Шедевроролплей з адмінкою та кристалами",
    it: "Capolavoro del gioco di  ruolo con gli admin e i cristalli",
    us: "Masterpiece roleplay with admins and crystals",
    ru: "Шедевроролплей с админкой и кристалами"
  },
  donateAndGetUniqueSkin: {
    ua: "Отримай унікальний скин пісюна на меч",
    it: "Ricevi una skin unica del pene sulla spada",
    us: "Get a unique penis skin on the sword",
    ru: "Отримай унікальний скин пісюна на меч"
  },
  changePassword: {
      ua: "Змінити пароль",
      it: "Cambia la password",
      us: "Change password",
      ru: "Изменить пароль"
  },
    usterNewPassword: {
      ua: "Введіть новий пароль",
      it: "Inserisci nuova password",
      us: "Enter new password",
      ru: "Введи новый пароль"
  },
  saveChanges: {
      ua: "На головну",
      it: "To main page",
      us: "To main page",
      ru: "На главную"
  },
  _register: {
      ua: "Зареєструватися",
      it: "Registrati",
      us: "Register",
      ru: "Зарегистрироваться"
  },
  confirm: {
      ua: "Підтвердити",
      it: "Conferma",
      us: "Confirm",
      ru: "Подтвердить"
  },
  apply: {
      ua: "Зберегти",
      it: "Applica",
      us: "Apply",
      ru: "Сохранить"
  },
  version: {
    ua: "Версія",
    it: "Versione",
    us: "Version",
    ru: "Версия"
  },
  reward: {
    ua: "Нагороди",
    it: "Rewards",
    us: "Rewards",
    ru: "Награды"
  },
  effect: {
    ua: "Ефект",
    it: "Effetto",
    us: "Effect",
    ru: "Эффект"
  },
  ability: {
    ua: "Здібність",
    it: "Abilità",
    us: "Ability",
    ru: "Способность"
  },
  downloadVoiceChat: {
    ua: "Завантажити голосовий чат",
    it: "Scarica la chat vocale",
    us: "Download voice chat",
    ru: "Скачать голосовой чат"
  },
  supportOurServer: {
    ua: "Підтримати проект",
    it: "Sostieni il progetto",
    us: "Support our server",
    ru: "Поддержать проект"
  },
  playerChat: {
    ua: "Чат гравців сервера",
    it: "Chat con il giocatore",
    us: "Server player`s chat",
    ru: "Чат игроков сервера"
  },
  copyMyReferalLink: {
    ua: "Моє реферальне посилання",
    it: "Mio link di referral",
    us: "My referral link",
    ru: "Моя реферальная ссылка"
  },
  lastSkinFetch: {
    ua: "Ресурс-пак оновлено",
    it: "Ultimo aggiornamento pack",
    us: "Resource pack updated",
    ru: "Ресурс-пак обновлен"
  },
  lastStatFetch: {
    ua: "Статистику оновлено",
    it: "Ultimo aggiornamento statistiche",
    us: "Statistics updated",
    ru: "Статистика обновлена"
  },
  referalsAmount: {
    ua: "Кількість рефералів",
    it: "Numero di referral",
    us: "Referrals amount",
    ru: "Количество рефералов"
  },
  mcsWsConnection: {
    ua: "З'єднання з терміналом",
    it: "Connessione a terminal",
    us: "Terminal connection",
    ru: "Соединение с терминалом"
  },
  verifyUser: {
    ua: "Верифікувати користувача",
    it: "Verifica utente",
    us: "Verify  user",
    ru: "Верифицировать пользователя"
  },
  changeUserBalance: {
    ua: "Змінити баланс користувача",
    it: "Cambia saldo utente",
    us: "Change  user balance",
    ru: "Изменить баланс пользователя"
  },
  serverStatus: {
    "200": {
      ua: "",
      it: "",
      us: "Connected",
      ru: ""
    },
    "201": {
      ua: "",
      it: "",
      us: "Reconnecting...",
      ru: ""
    },
    "500": {
      ua: "",
      it: "",
      us: "Failed",
      ru: ""
    }
  },
  achievmentTitle_casual: {
      ua: "Казуальність",
      it: "Casualità",
      us: "Casuality",
      ru: "Казуальность"
  },
  achievmentTitle_killer: {
      ua: "Вбивця",
      it: "Assasino",
      us: "Killer",
      ru: "Убийца"
  },
  achievmentTitle_defence: {
      ua: "Воїн",
      it: "",
      us: "Warrior",
      ru: "Воин"
  },
  achievmentTitle_hammer: {
      ua: "Відданість",
      it: "Devozione",
      us: "Devotion",
      ru: "Преданность"
  },
  achievmentTitle_event: {
      ua: "Тусовщик",
      it: "Eventi",
      us: "Events",
      ru: "Тусовщик"
  },
  achievmentTitle_donate: {
      ua: "Донатер",
      it: "Donatore",
      us: "Donator",
      ru: "Донатер"
  },
  casual_reward: {
    ua: "Квапливість I",
    it: "Sollecitudine I",
    us: "Haste I",
    ru: "Спешка I"
  },
  defence_reward: {
    ua: "Стійкість I",
    it: "Resistenza I",
    us: "Resistance I",
    ru: "Сопротивление I"
  },
  killer_reward: {
    ua: "Сила I",
    it: "Forza I",
    us: "Strength I",
    ru: "Сила I"
  },
  event_reward: {
    ua: "",
    it: "",
    us: "",
    ru: ""
  },
  donate_reward: {
    ua: "",
    it: "",
    us: "",
    ru: ""
  },
  hammer_reward: {
    ua: "",
    it: "",
    us: "",
    ru: ""
  },
  becomeMayor_todo: {
    title: {
      ua: "Стати мером",
      it: "Diventa sindaco",
      us: "Become Mayor",
      ru: "Мы будем строить и реконструировать"
    },
    description: {
      ua: "Відвідати мерію спавна",
      it: "Visita l'ufficio del sindaco",
      us: "Visit the spawn mayor's office",
      ru: "Побывать мером спавна"
    }
  },
  playsFromFirstSeason_todo: {
    title: {
      ua: "Гравець з першого сезону",
      it: "Gioca dalla prima stagione",
      us: "Plays From First Season",
      ru: "Настоящий олд"
    },
    description: {
      ua: "Грати на першому сезоні 50 годин",
      it: "Gioca per 50 ore nella prima stagione",
      us: "Play for 50 hours in the first season",
      ru: "Наиграть на первом сезоне 50 часов"
    }
  },
  petition_todo: {
    title: {
      ua: "Підпишіть мою петицію!",
      it: "Firma la mia petizione!",
      us: "Sign My Petition!",
      ru: "Подпишите мою петицию!"
    },
    description: {
      ua: "Зібрати мітинг за ваше президентство",
      it: "Organizza una manifestazione per la tua presidenza",
      us: "Hold a rally for your presidency",
      ru: "Собрать митинг за ваше президенство"
    }
  },
  diamonds_todo: {
    title: {
      ua: "Блискучі",
      it: "Diamanti",
      us: "Diamonds",
      ru: "Блестяшки"
    },
    description: {
      ua: "Видобути 10 алмазних руд",
      it: "Estrai 10 minerali di diamante",
      us: "Mine 10 diamond ores",
      ru: "Добыть 10 алмазной руды"
    }
  },
  netherite_todo: {
    title: {
      ua: "Вперше...?",
      it: "Per la prima volta...?",
      us: "For the First Time...?",
      ru: "В первый раз...?"
    },
    description: {
      ua: "Видобути 4 старовинних обломки",
      it: "Estrai 4 frammenti antichi",
      us: "Mine 4 ancient debris",
      ru: "Добыть 4 древних обломка"
    }
  },
  endStone_todo: {
    title: {
      ua: "Велике розчищення",
      it: "La grande pulizia",
      us: "The Great Cleanup",
      ru: "Великая разчистка"
    },
    description: {
      ua: "Видобути 2048 ендернику",
      it: "Estrai 2048 blocchi di pietra dell'End",
      us: "Mine 2048 end stone blocks",
      ru: "Добыть 2048 эндерняка"
    }
  },
  shrieker_todo: {
    title: {
      ua: "Здається, це зайва справа",
      it: "Sembra superfluo",
      us: "Seems Unnecessary",
      ru: "Похоже это лишнее"
    },
    description: {
      ua: "Зруйнувати 16 скелетон-крикунів",
      it: "Distruggi 16 shrieker",
      us: "Destroy 16 shriekers",
      ru: "Разрушить 16 скалк-крикунов"
    }
  },
  reinforcedDeepslate_todo: {
    title: {
      ua: "Божевільний, блять.",
      it: "Pazzo, cavolo.",
      us: "Insane, damn.",
      ru: "Безумец блять."
    },
    description: {
      ua: "Сламати 64 блоки портального каркасу",
      it: "Rompi 64 blocchi di telaio del portale",
      us: "Break 64 portal frame blocks",
      ru: "Сломать 64 блока рамки портала"
    }
  },
  damageOne_todo: {
    title: {
      ua: "Хлюпик",
      it: "Schizzinoso",
      us: "Dripper",
      ru: "Хлюпик"
    },
    description: {
      ua: "Отримати 100 000 пошкоджень",
      it: "Ricevi 100.000 danni",
      us: "Receive 100,000 damage",
      ru: "Получить 100.000 урона"
    }
  },
  damageTwo_todo: {
    title: {
      ua: "Шнурок",
      it: "Corda",
      us: "Stringer",
      ru: "Шнурок"
    },
    description: {
      ua: "Отримати 250 000 пошкоджень",
      it: "Ricevi 250.000 danni",
      us: "Receive 250,000 damage",
      ru: "Получить 250.000 урона"
    }
  },
  damageThree_todo: {
    title: {
      ua: "Тюбик",
      it: "Tubetto",
      us: "Tube",
      ru: "Тюбик"
    },
    description: {
      ua: "Отримати 500 000 пошкоджень",
      it: "Ricevi 500.000 danni",
      us: "Receive 500,000 damage",
      ru: "Получить 500.000 урона"
    }
  },
  damageFour_todo: {
    title: {
      ua: "Воїн",
      it: "Guerriero",
      us: "Warrior",
      ru: "Воин"
    },
    description: {
      ua: "Отримати 750 000 пошкоджень",
      it: "Ricevi 750.000 danni",
      us: "Receive 750,000 damage",
      ru: "Получить 750.000 урона"
    }
  },
  damageFive_todo: {
    title: {
      ua: "Неуразливий",
      it: "Invulnerabile",
      us: "Invincible",
      ru: "Неуязвимый"
    },
    description: {
      ua: "Отримати 1 000 000 пошкоджень",
      it: "Ricevi 1.000.000 danni",
      us: "Receive 1,000,000 damage",
      ru: "Получить 1.000.000 урона"
    }
  },
  kills_todo: {
    title: {
      ua: "Мисливець",
      it: "Cacciatore",
      us: "Hunter",
      ru: "Охотник"
    },
    description: {
      ua: "Вбити 500 істот",
      it: "Uccidi 500 creature",
      us: "Kill 500 entities",
      ru: "Убить 500 существ"
    }
  },
  wither_todo: {
    title: {
      ua: "Це через те, що я чорний?",
      it: "È perché sono nero?",
      us: "Is  it because I'm black?",
      ru: "Это потому что я чёрный?"
    },
    description: {
      ua: "Запиздячити Засушувача",
      it: "Sconfiggi il Dissicante",
      us: "Defeat the Wither",
      ru: "Запиздячить Иссушителя"
    }
  },
  dragon_todo: {
    title: {
      ua: "Ей, де мої яйця!",
      it: "Ehi, dove sono le mie uova?",
      us: "Hey, where are my eggs?",
      ru: "Э, а где яйца!"
    },
    description: {
      ua: "Навалить на Ендер-дракона",
      it: "Abbatti l'End Drago",
      us: "Defeat the Ender Dragon",
      ru: "Нахлабучить Эндер-дракона"
    }
  },
  warden_todo: {
    title: {
      ua: "Такий крутий",
      it: "Così figo",
      us: "So Cool",
      ru: "Типа крутой"
    },
    description: {
      ua: "Затикати Вардена",
      it: "Blocca il Custode",
      us: "Block the Warden",
      ru: "Затыкать Вардена"
    }
  },
  damage_todo: {
    title: {
      ua: "Відьмак",
      it: "Stregone",
      us: "Witcher",
      ru: "Ведьмак"
    },
    description: {
      ua: "Нанести 1 000 000 пошкоджень",
      it: "Infliggi 1.000.000 danni",
      us: "Inflict 1,000,000 damage",
      ru: "Нанести 1.000.000 урона"
    }
  },
  eventOne_todo: {
    title: {
      ua: "Привіт, друже",
      it: "Ciao amico",
      us: "Hello, friend",
      ru: "Привет, друг"
    },
    description: {
      ua: "Запросити 1 гравців",
      it: "Invita 1 giocatori",
      us: "Invite 1 players",
      ru: "Пригласить 1 игрока"
    }
  },
  eventTwo_todo: {
    title: {
      ua: "Більше - краще!",
      it: "Più è meglio!",
      us: "More is better!",
      ru: "Больше - лучше!"
    },
    description: {
      ua: "Запросити 2 гравців",
      it: "Invita 2 giocatori",
      us: "Invite 2 players",
      ru: "Пригласить 2 игрока"
    }
  },
  eventThree_todo: {
    title: {
      ua: "Міпо!",
      it: "Meepo!",
      us: "Meepo!",
      ru: "Мипо!"
    },
    description: {
      ua: "Запросити 3 гравців",
      it: "Invita 3 giocatori",
      us: "Invite 3 players",
      ru: "Пригласить 3 игрока"
    }
  },
  eventFour_todo: {
    title: {
      ua: "Разом веселіше",
      it: "Insieme è più divertente",
      us: "Together is more fun",
      ru: "Вместе веселее"
    },
    description: {
      ua: "Запросити 5 гравців",
      it: "Invita 5 giocatori",
      us: "Invite 5 players",
      ru: "Пригласить 5 игроков"
    }
  },
  eventFive_todo: {
    title: {
      ua: "Піар менеджер",
      it: "Gestore di pubblicità",
      us: "PR Manager",
      ru: "Пиар менеджер"
    },
    description: {
      ua: "Запросити 10 гравців",
      it: "Invita 10 giocatori",
      us: "Invite 10 players",
      ru: "Пригласить 10 игроков"
    }
  },
  donateOne_todo: {
    title: {
      ua: "Філантроп",
      it: "Filantropo",
      us: "Philanthropist",
      ru: "Филантроп"
    },
    description: {
      ua: "Пожертвувати серверу 10$",
      it: "Dona 10$ al server",
      us: "Donate $10 to the server",
      ru: "Пожертвовать серверу 10$"
    }
  },
  donateTwo_todo: {
    title: {
      ua: "Благодійник",
      it: "Benefattore",
      us: "Benefactor",
      ru: "Благодеятель"
    },
    description: {
      ua: "Пожертвувати серверу 20$",
      it: "Dona 20$ al server",
      us: "Donate $20 to the server",
      ru: "Пожертвовать серверу 20$"
    }
  },
  donateThree_todo: {
    title: {
      ua: "Верни мамі карту",
      it: "Ridai la carta a tua madre",
      us: "Return the Card to Mom",
      ru: "Верни маме карту"
    },
    description: {
      ua: "Пожертвувати серверу 30$",
      it: "Dona 30$ al server",
      us: "Donate $30 to the server",
      ru: "Пожертвовать серверу 30$"
    }
  },
  donateFour_todo: {
    title: {
      ua: "Акціонер",
      it: "Azione",
      us: "Shareholder",
      ru: "Акционер"
    },
    description: {
      ua: "Пожертвувати серверу 40$",
      it: "Dona 40$ al server",
      us: "Donate $40 to the server",
      ru: "Пожертвовать серверу 40$"
    }
  },
  donateFive_todo: {
    title: {
      ua: "Інвестор",
      it: "Investitore",
      us: "Investor",
      ru: "Инвестор"
    },
    description: {
      ua: "Пожертвувати серверу 50$",
      it: "Dona 50$ al server",
      us: "Donate $50 to the server",
      ru: "Пожертвовать серверу 50$"
    }
  },
  copiedMessage: {
    ua: "скопійовано в буфер обміну",
    it: "copiato negli appunti",
    us: "copied to clipboard",
    ru: "скопировано в буфер обмена"
  },
  code_400: {
    ua: "Ви не авторизовані",
    it: "Non sei autorizzato",
    us: "You are not authorized",
    ru: "Вы не авторизированы"
  },
  skin: {
      "200": {
      ua: "Зміна скіна пройшла успішно. Тепер ваш персонаж виглядає інакше. Зазвичай зміни вступають в силу протягом 6 годин.",
      it: "Il cambio di skin è avvenuto con successo. Ora il tuo personaggio ha un aspetto diverso. Di solito le modifiche diventano effettive entro 6 ore.",
      us: "Skin change was successful. Now your character looks different. Usually, changes take effect within 6 hours.",
      ru: "Изменение скина прошло успешно. Теперь ваш персонаж выглядит по-другому. Обычно изменения вступают в силу в течение 6 часов."
    },
    "401": {
      ua: "Невірне розширення файлу",
      it: "Estensione del file non valida",
      us: "Invalid file extension",
      ru: "Неверное разширение файла"
    },
    "402": {
      ua: "Скін повинен мати розмір 64 на 64 пікселі",
      it: "Lo skin deve essere di dimensioni 64 per 64 pixel",
      us: "Skin must be 64 by 64 pixels in size",
      ru: "Скин должен быть размером 64 на 64 пикселя"
    },
    "403": {
      ua: "Зовнішній вигляд можна змінювати лише раз на 24 години",
      it: "L'aspetto può essere cambiato solo una volta ogni 24 ore",
      us: "Appearance can be changed only once in 24 hours",
      ru: "Облик можно менять только раз в 24 часа"
    }
  },
  nickname: {
      "201": {
      ua: "Ваш нікнейм успішно оновлено. Деякі досягнення та предмети можуть зникнути.",
      it: "Il tuo nickname è stato aggiornato con successo. Alcuni achievement e oggetti potrebbero scomparire.",
      us: "Your nickname has been successfully updated. Some achievements and  items may disappear.",
      ru: "Ваш никнейм успешно обновлен. Некоторые достижения и предметы могут исчезнуть."
    },
    "401": {
      ua: "Невірний регістр. Дозволяються тільки a-z, 0-9, '_'",
      it: "Maiuscole non valide. Consentiti solo a-z, 0-9, '_'",
      us: "Invalid case. Only a-z, 0-9, '_' are allowed",
      ru: "Неверный регистр. Разрешаются только a-z, 0-9, '_'"
    },
    "402": {
      ua: "Нікнейм повинен бути від 3 до 32 символів",
      it: "Il nickname deve essere lungo da 3 a 32 caratteri",
      us: "Nickname must be between 3 and 32 characters",
      ru: "Никнейм должен быть от 3 до 32 символов"
    },
    "403": {
      ua: "Нікнейм можна змінювати лише раз на годину",
      it: "Il nickname può essere cambiato solo una volta all'ora",
      us: "Nickname can be changed only once per hour",
      ru: "Никнейм можно менять только раз час"
    },
    "already_exists": {
      ua: "Гравець з таким нікнеймом вже існує",
      it: "Giocatore con lo stesso nickname già esistente",
      us: "Player with such nickname already exists",
      ru: "Такой никнейм уже занят"
    },
    "in_use": {
      ua: "Вибачте, але ви не можете встановити той же самий нікнейм, який ви вже маєте",
      it: "Spiacenti, non puoi impostare lo stesso nickname che hai già",
      us: "Sorry, but you cannot set the same nickname that you already have",
      ru: "Извините, но вы не можете установить тот же никнейм, который уже используете"
    },
    "406": {
      ua: "Пароль і нікнейм не можуть збігатися. Будь креативніший, чучело",
      it: "La password e il nickname non possono coincidere. Sii più creativo, fantoccio",
      us: "Password and nickname cannot match. Be more creative, dummy",
      ru: "Пароль и никнейм не могут совпадать. Будь креативнее, чучело"
    }
  },
  _nickname: {
    ua: "Нікнейм",
    it: "Nickname",
    us: "Nickname",
    ru: "Никнейм"
  },
  _password: {
    ua: "Пароль",
    it: "Password",
    us: "Password",
    ru: "Пароль"
  },
  password: {
      "200": {
      ua: "Пароль успішно змінено. Використовуйте /l <ваш пароль> для входу.",
      it: "La tua password è stata modificata con successo. Usa /l <password> per accedere.",
      us: "Password successfully changed. Use /l <your password> to log in.",
      ru: "Пароль успешно изменен. Используйте /l <ваш пароль> для входа."
    },
    "401": {
      ua: "Пароль і нікнейм не можуть збігатися. Будь креативніше, чучело",
      it: "La password e il nickname non possono coincidere. Sii più creativo, fantoccio",
      us: "Password and nickname cannot match. Be more creative, dummy",
      ru: "Пароль и никнейм не могут совпадать. Будь креативнее, чучело"
    },
    "402": {
      ua: "Завийобістий пароль. Спробуй щось простіше.",
      it: "Password troppo fottutamente fantastico. Prova qualcosa di più semplice.",
      us: "Password too fucking awesome. Try something simpler.",
      ru: "Пароль слишком ахуенен. Будь проще, придумай новый."
    },
    "403": {
      ua: "В тебе вже стоїть цей пароль. Не клацай, а то клацну зубами по яйцях",
      it: "Hai già questa password. Non cliccare, altrimenti cliccherò con i denti sulle palle",
      us: "You already have this password. Don't click, or I'll click with my teeth on your balls",
      ru: "У тебя и так стоит этот пароль. Не клацай, а то клацну зубами по яйцам"
    }
  },
  achievement: {
      "200": {
      ua: "Нагорода за досягнення активована. Якщо нагороди або еффекту немає - введіть у грі дебаг-команду \"/achievement\"",
      it: "Achievement reward activated. If there are no rewards or effects, enter the in-game debug command \"/achievement\"",
      us: "Achievement reward activated. If there are no rewards or effects, enter the in-game debug command \"/achievement\"",
      ru: "Награда за достижение активирована. Если нет наград или эффектов, введите в игре отладочную команду \"/achievement\""
    },
    "401": {
      ua: "Здається ви ще не розблокували це досягнення. Зачекайте 10 хвилин, або повідомте про це адміністратору.",
      it: "Sembra che tu non abbia ancora sbloccato questo obiettivo. Attendi 10 minuti o segnala l'errore all'amministratore.",
      us: "It seems you haven't unlocked this achievement yet. Wait for 10 minutes or report the issue to the administrator.",
      ru: "Похоже, вы еще не разблокировали это достижение. Подождите 10 минут или сообщите об ошибке администратору."
    },
    "402": {
      ua: "Це досягнення вже активоване. Якщо нагороди або еффекту немає - введіть у грі дебаг-команду \"/achievement\"",
      it: "Questo obiettivo è già attivato. Se non ci sono ricompense o effetti, inserisci il comando di debug nel gioco \"/achievement\"",
      us: "This achievement is already activated. If there are no rewards or effects, enter the in-game debug command \"/achievement\"",
      ru: "Это достижение уже активировано. Если нет наград или эффектов, введите в игре отладочную команду \"/achievement\""
    },
    "403": {
      ua: "Здається такого досягнення не існує. Якщо ви вважаєте, що це помилка - повідомте про це адміністратору.",
      it: "1k",
      us: "1k",
      ru: "Кажется этого достижения не существует. Если вы считаете, что это ошибка - сообщите об этом администратору."
    }
  },
  register: {
      "200": {
      ua: "Персонаж успішно створений",
      it: "",
      us: "",
      ru: ""
    },
    "403": {
      ua: "Ви вже зареєстровані",
      it: "",
      us: "",
      ru: ""
    }
  },
  code_500: {
    ua: "Внутрішня помилка сервера",
    it: "Errore interno del server",
    us: "Internal server error",
    ru: "Внутренняя ошибка сервера"
  },
  chooseLanguages: {
    ua: "Мова сайту",
    it: "Lingua del sito",
    us: "Язык сайта",
    ru: "Site language"
  },
  enforsedPreloader:{
    enforsedPhrase1: {
      ua: "Збираємо Dockerfile",
      it: "Costruendo Dockerfile",
      us: "Building Dockerfile",
      ru: "Собираем Dockerfile"
    },
    enforsedPhrase2: {
      ua: "Тримаємо ритм нижче пояса",
      it: "Tenendo il ritmo sotto la cintura",
      us: "Keeping the rhythm below the belt",
      ru: "Держим ритм ниже пояса"
    },
    enforsedPhrase3: {
      ua: "Відзначаємо перемогу",
      it: "Celebrando la vittoria",
      us: "Celebrating victory",
      ru: "Празднуем перемогу"
    },
    enforsedPhrase4: {
      ua: "Верстаємо сайт",
      it: "Costruendo il sito web",
      us: "Building the website",
      ru: "Верстаем сайт"
    },
    enforsedPhrase5: {
      ua: "Синхронізуємо дані",
      it: "Sincronizzazione dei dati",
      us: "Synchronize data",
      ru: "Синхронизируем данные"
    },
    enforsedPhrase6: {
      ua: "Шукаємо вразливості",
      it: "Cercando vulnerabilità",
      us: "Looking for vulnerabilities",
      ru: "Ищем уязвимости"
    },
    enforsedPhrase7: {
      ua: "Перевіряємо угоди",
      it: "Controllando i contratti",
      us: "We check deals",
      ru: "Проверяем договора"
    },
    enforsedPhrase8: {
      ua: "Надихаємося ідеями",
      it: "Ispirandosi alle idee",
      us: "We are inspired by ideas",
      ru: "Вдохновляемся идями"
    }
  },
  _selected: {
    ua: "Обраний",
    it: "Selezionato",
    us: "Selected",
    ru: "Выбраный"
  },
  team: {
    edit_team: {
      ua: "Редагувати",
      it: "Modifica squadra",
      us: "Edit team",
      ru: "Редактировать"
    }
  },
  comments: {
    title: {
      ua: "Коментарі",
      it: "Commenti",
      us: "Comments",
      ru: "Коментарии"
    },
    empty: {
      ua: "Здається, тут немає коментарів...",
      it: "Non sembra esserci alcun commento...",
      us: "There doesn't seem to be any comments...",
      ru: "Кажестся тут нет коментариев..."
    }
  }
}
export default locale;