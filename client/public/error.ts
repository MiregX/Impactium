import { λError } from "@impactium/types"

const error = {
  // Identifier
  username_not_provided: {
    us: 'Oops! You forgot to provide a username. Even superheroes have names!',
    ru: 'Ой! Ты забыл ввести имя пользователя. Даже у супергероев есть имена!',
    ua: 'Ой! Ви забули ввести ім\'я користувача. Навіть у супергероїв є імена!',
    it: 'Ops! Hai dimenticato di fornire un nome utente. Anche i supereroi hanno nomi!',
    pl: 'Ups! Zapomniałeś podać nazwę użytkownika. Nawet superbohaterowie mają imiona!'
  },
  username_taken: {
    us: 'This username is already taken. Try something more unique, like "SuperPudge123"!',
    ru: 'Это имя пользователя уже занято. Попробуй что-то более уникальное, например "СуперПадж123"!',
    ua: 'Це ім\'я користувача вже зайняте. Спробуйте щось більш унікальне, наприклад "СуперПадж123"!',
    it: 'Questo nome utente è già preso. Prova qualcosa di più unico, come "SuperPudge123"!',
    pl: 'Ta nazwa użytkownika jest już zajęta. Spróbuj czegoś bardziej unikalnego, jak "SuperPudge123"!'
  },
  username_invalid_format: {
    us: 'The username you entered is the same as the current one.',
    ru: 'Имя пользователя не подходит. Попробуй ещё раз, но на этот раз с чувством, с толком, с расстановкой!',
    ua: 'Ім\'я користувача не підходить. Спробуй ще раз, але на цей раз зі свідомістю, з розумінням, з розстановкою!',
    it: 'Il nome utente non è adatto. Prova ancora, ma questa volta con consapevolezza, con chiarezza, con disposizione!',
    pl: 'Nazwa użytkownika nie pasuje. Spróbuj ponownie, ale tym razem z świadomością, z rozumem, z rozstawieniem!',
  },
  username_is_same: {
    us: 'The username you entered is the same as the current one.',
    ru: 'Введённое вами имя пользователя совпадает с текущим.',
    ua: 'Введене вами ім\'я користувача є таким же, як і поточне.',
    it: 'Il nome utente che hai inserito è lo stesso di quello attuale.',
    pl: 'Wprowadzona nazwa użytkownika jest taka sama jak aktualna.'
  },

  indent_not_provided: {
    us: 'It seems you forgot to provide an ID.',
    ru: 'Кажется ты забыл ввести айди',
    ua: 'Здається ви забули ввести ідентифікатор',
    it: 'Sembra che tu abbia dimenticato di fornire un ID',
    pl: 'Wygląda na to, że zapomniałeś podać identyfikator'
  },
  indent_invalid_format: {
    us: 'Invalid ID format. This isn’t Instagram, we have standards here.',
    ru: 'Хреновый формат айди. Это тебе не инстаграм, тут есть стандарты',
    ua: 'Поганий формат ідентифікатора. Це тобі не Інстаграм, тут є стандарти',
    it: 'Formato ID non valido. Questo non è Instagram, qui abbiamo standard',
    pl: 'Nieprawidłowy format identyfikatora. To nie Instagram, mamy tu standardy'
  },
  indent_taken: {
    us: 'A team with this ID already exists, please come up with something new.',
    ru: 'Команда с таким айди уже существует, придумайте что-то новое',
    ua: 'Команда з таким ідентифікатором вже існує, придумайте щось нове',
    it: 'Un team con questo ID esiste già, per favore pensa a qualcosa di nuovo',
    pl: 'Zespół z takim identyfikatorem już istnieje, wymyśl coś nowego'
  },

  code_not_provided: {
    us: 'Oops! You forgot to provide a tournament code. Even Techies remember to plant their mines!',
    ru: 'Ой! Ты забыл ввести код турнира. Даже Течис не забывает ставить мины!',
    ua: 'Ой! Ви забули ввести код турніру. Навіть Течіс не забуває ставити міни!',
    it: 'Ops! Hai dimenticato di fornire un codice torneo. Anche Techies ricordano di piazzare le loro mine!',
    pl: 'Ups! Zapomniałeś podać kod turnieju. Nawet Techies pamiętają, żeby postawić swoje miny!'
  },
  code_invalid_format: {
    us: 'Invalid tournament code format. This isn’t a random pub game, we have standards here!',
    ru: 'Неправильный формат кода турнира. Это не случайная паб игра, у нас тут стандарты!',
    ua: 'Неправильний формат коду турніру. Це не випадкова паб гра, у нас тут стандарти!',
    it: 'Formato del codice torneo non valido. Questo non è un gioco pub casuale, qui abbiamo standard!',
    pl: 'Nieprawidłowy format kodu turnieju. To nie jest losowa gra pubowa, mamy tu standardy!'
  },
  code_taken: {
    us: 'A tournament with this code already exists. Try something more unique, like "PudgeHookMaster"!',
    ru: 'Турнир с таким кодом уже существует. Попробуй что-то более уникальное, например "PudgeHookMaster"!',
    ua: 'Турнір з таким кодом вже існує. Спробуйте щось більш унікальне, наприклад "PudgeHookMaster"!',
    it: 'Un torneo con questo codice esiste già. Prova qualcosa di più unico, come "PudgeHookMaster"!',
    pl: 'Turniej z takim kodem już istnieje. Spróbuj czegoś bardziej unikalnego, jak "PudgeHookMaster"!'
  },

  // DisplayName
  display_name_invalid_format: {
    us: 'Bad nickname. Don\'t cause us trouble, or we\'ll bite.',
    ru: 'Хреновый никнейм. Не создавай нам проблем, а то откусим яйца.',
    ua: 'Паршивий нікнейм. Не створюй нам проблем, а то ми відкусимо яйця.',
    it: 'Brutto soprannome. Non crearci problemi, o morderemo.',
    pl: 'Zły pseudonim. Nie sprawiaj nam problemów, bo cię ugryziemy.'
  },
  display_name_is_same: {
    us: 'The display name you entered is the same as the current one.',
    ru: 'Введённое вами имя пользователя совпадает с текущим.',
    ua: 'Введене вами ім\'я користувача є таким же, як і поточне.',
    it: 'Il nome visualizzato che hai inserito è lo stesso di quello attuale.',
    pl: 'Wprowadzona nazwa wyświetlana jest taka sama jak aktualna.'
  },
  not_inplemented_description: {
    us: 'Expected release date: later.',
    ru: 'Ожидаемая дата релиза: потом.',
    ua: 'Очікувана дата релізу: пізніше.',
    it: 'Data di rilascio prevista: più tardi.',
    pl: 'Oczekiwana data wydania: później.'
  },
  team_already_exists: {
    us: 'A team with this ID already exists, please come up with something new.',
    ru: 'Команда с таким айди уже существует, придумайте что-то новое',
    ua: 'Команда з таким ідентифікатором вже існує, придумайте щось нове',
    it: 'Un team con questo ID esiste già, per favore pensa a qualcosa di nuovo',
    pl: 'Zespół z takim identyfikatorem już istnieje, wymyśl coś nowego'
  },
  team_limit_exception: {
    us: 'You’ve hit the team limit. Maximum is 3 teams.',
    ru: 'Всё. Приехали. У вас лимит по командам. Максимум 3 команды',
    ua: 'У вас ліміт по командам. Максимум 3 команди',
    it: 'Hai raggiunto il limite del team. Il massimo è di 3 team',
    pl: 'Osiągnąłeś limit zespołów. Maksymalnie 3 zespoły'
  },
  team_member_with_exact_role_already_exist: {
    us: 'Cannot assign the same role to different team members',
    ru: 'Нельзя установить одинаковую роль для разных участников',
    ua: 'Не можна призначити однакову роль різним учасникам',
    it: 'Non è possibile assegnare lo stesso ruolo a membri diversi del team',
    pl: 'Nie można przypisać tej samej roli różnym członkom zespołu'
  },
  team_is_free_to_join: {
    us: "Cannot generate an invitation, the team is open for everyone to join",
    ru: "Нельзя сгенерировать приглашение, команда открыта к вступлению для всех",
    ua: "Неможливо створити запрошення, команда відкрита для всіх",
    it: "Impossibile generare un invito, la squadra è aperta a tutti",
    pl: "Nie można wygenerować zaproszenia, drużyna jest otwarta dla wszystkich"
  },
  team_is_close_to_everyone: {
    us: "Cannot generate an invitation, the team is closed for joining",
    ru: "Нельзя сгенерировать приглашение, команда закрыта к вступлению",
    ua: "Неможливо створити запрошення, команда закрита для вступу",
    it: "Impossibile generare un invito, la squadra è chiusa all'adesione",
    pl: "Nie można wygenerować zaproszenia, drużyna jest zamknięta na dołączenie"
  },
  unallowed_file_format: {
    us: 'Only PNG, JPG, and SVG formats are allowed.',
    ru: 'Я разрешаю вам выгружать файлы только в формате PNG, JPG, SVG',
    ua: 'Я дозволяю вам завантажувати файли лише у форматах PNG, JPG, SVG',
    it: 'Permetto solo file nei formati PNG, JPG e SVG',
    pl: 'Dozwolone są tylko formaty PNG, JPG i SVG'
  },
  unallowed_file_size: {
    us: 'File too large. Please upload a file smaller than 1 MB.',
    ru: 'Ого какой большой. Загрузи в меня файл меньше 1 мегабайта',
    ua: 'Ого який великий. Завантажте файл менший за 1 мегабайт',
    it: 'Il file è troppo grande. Carica un file più piccolo di 1 MB',
    pl: 'Plik za duży. Prześlij plik mniejszy niż 1 MB'
  },
  'File too large': {
    us: 'File too large. Please upload a file smaller than 1 MB.',
    ru: 'Ого какой большой. Загрузи в меня файл меньше 1 мегабайта',
    ua: 'Ого який великий. Завантажте файл менший за 1 мегабайт',
    it: 'Il file è troppo grande. Carica un file più piccolo di 1 MB',
    pl: 'Plik za duży. Prześlij plik mniejszy niż 1 MB'
  },
  unallowed_file_metadata: {
    us: 'Images must be up to 512x512 pixels.',
    ru: 'Картинки принимаются только до 512 на 512 пикселей',
    ua: 'Зображення приймаються тільки до 512 на 512 пікселів',
    it: 'Le immagini devono essere fino a 512x512 pixel',
    pl: 'Obrazy muszą mieć maksymalnie 512x512 pikseli'
  },
  ftp_upload_error: {
    us: 'Error uploading file to the cloud. If this is an actual error, contact @MiregX.',
    ru: 'Ошибка выгрузки файла в облако. Если это реально ошибка - пиши ему: @MiregX',
    ua: 'Помилка завантаження файлу в хмару. Якщо це справді помилка - пишіть йому: @MiregX',
    it: 'Errore durante il caricamento del file sul cloud. Se questo è un errore effettivo, contatta @MiregX',
    pl: 'Błąd przesyłania pliku do chmury. Jeśli to faktyczny błąd, skontaktuj się z @MiregX'
  },
  'Forbidden resource': {
    us: 'Forbidden resource',
    ru: 'Отказано в доступе',
    ua: 'Відмовлено в доступі',
    it: 'Accesso negato',
    pl: 'Kurwa bober'
  },
  'Forbidden': {
    us: 'Forbidden resource',
    ru: 'Отказано в доступе',
    ua: 'Відмовлено в доступі',
    it: 'Accesso negato',
    pl: 'Kurwa bober'
  },
  [λError.user_not_found]: {
    us: 'User not found',
    ru: 'Пользователь не найден',
    ua: 'Користувача не знайдено',
    it: 'Porco dio',
    pl: 'Kurwa bober'
  }
}

export { error }
