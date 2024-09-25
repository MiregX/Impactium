# Impactium | *Архитектурный гайд*

## Вступление

Я рот ебал этих ваших бюрократий и прочую бесполезную хуйню. Проект мой, а значит я могу делать на нём всё что захочу. Если вас не просят о совете - просьба, закрыть ебальник и его не открывать до наступления великой чистки.

Использование λ (лямбды):

1. Когда есть `ui` елемент и `dto/class` с таким же названием, то для `dto/class` подставляем λ.
2. Когда нужно заредекларировать неймспейс, но `ts` ругается. Например `λthrow`.
3. Для ахуенно хрупкого и ахуенно важного функционала. Например выделить админский `Bearer` в логах или класс парсинга `api`

### Приглашения
QRCode генерим картинку на клиенте, и в query подставляем lang таргетного юзера, потому что с 80% вероятностью участники говорят на одном языке, или по крайней мере поймут написанное.

#### Команда открыта
Просто генерим статик ссылку без использования сервера, после чего при сканировании ссылки микрочелика перекидывает на /team/:indent/join и говорим ему что мол туда сюда, регайся, присоединяйся.

#### Команда закрыта
Просто генерим private ссылку с использованием сервера, после чего при сканировании ссылки микрочелика перекидывает на /team/:indent/join/code и говорим ему что мол туда сюда, регайся, и при регестрации сразу добавляем его в тиму.

#### Команда закрыта
Предлагаем открыть тиму

## Project Structure

Репозиторий Impactium организован в папки `client`, `lib` и `api`, содержащие разные библиотеки, но которые имеют идейную связь между собой через использование ссылкок в виде:
```js
import { Configuration } from '@impactium/config';
```
or
```js
import { User } from '@api/main/user/user.entity';
```

Object Key value for: {
  user: @username
  team: @indent
  tournament: @code
}

## Team

Для аватарок используем title в качестве альта

### Зависимости

- Docker для контейнеризации и развёртывания.
- Node.js and npm для запуска и установки зависимостей.

## `CLIENT`

Клиентская часть написана на фреймворке `NEXT` и использует [`/app`](https://nextjs.org/docs/app) роутинг а также встроенный функционал фреймворка для облегчения разработки и поддержания кода. Использует ссылки на другие части приложения как это было описанно выше. Во время разработки должна соблюдаться айдентика и кодстайл проекта, а также чистота и читабельность кода. 

Части клиентского приложения раскиданы по следующим папкам: 

- **/app:** Роутинг и server-side рендеринг, где каждая папка отвечает за свой path в ссылке запроса. Подробнее читайте в [@next/routing](https://nextjs.org/docs/app/building-your-application/routing).
- **/components:** Редкоиспользуемые компоненты которые можно инплементировать в любой части приложения если позволяет абстракция, или контекстные компоненты с усконаправленным функционалом.
- **/context:** Здесь лежат оболочки приложения для облегчения доступа к переменным или контексту. Подробнее читай в [@react/useContext](https://react.dev/reference/react/useContext).
- **/dto:** Проходник между `API` и `CLIENT`. Здесь находяться удобные в использовании запросы которые можно вызывать одной функцией/методом.
- **/pubic:** Публичные файлы, доступ к которым может получить клиент, а также locale файл для локализации
- **/styles:** Модульные стили
- **/ui:** Реиспользуемые и пиздатые компоненты которые используются повсеместно и нужны для поддержания чистоты кода и общей айдентики проекта

Папка `/app` является родительской для всех других, а это значит что папки в папках должны копировать путь страницы, для которой они изначально создавались. Исключением является `/ui` и компоненты которые нужны в абстракции повыше. 

Компоненты должны иметь скуффикс Component. Например компонент юзера который находиться в Header должен иметь название `UserComponent`, потому что в инном случае в коде будуть набиратся неразберихи. Игнорировать это правило разрешается в случае если это уникальный компонент который семантически имеет одноимённый смысл и не имеет именных конфликтов с другими типами приложения.

Стили используем только модульные, если есть елемент, верстаем для него через `this = _`, если композитный елемент, верстаем через `this = s`. Тоесть:
```js
import s from './Something.module.css'
```

## `API`

Приложение в `edge` архитектуре, развёрнут на серверах аезы. Контроллер, сервис, и модуль запихиваем в рутовую папку функционала, аддоны (дто-шки, интерфейсы, декораторы, и прочую хуйню) запиздячиваем в папку `addon`

## Как запустить?

Чтобы развернуть проект через Docker в режиме "production" как `testnet` то выполни команду:

```bash
$ npm install
$ docker compose up -d
```

Чтобы запустить в режиме разработки, то `Run and Debug (CTRL + Shift + D)` в Visual Studio Code и вверху появившейся панели выбери в выпадающем меню Start API и приступай к работе

## Team.INDENT

На клиенте в h6 и ссылке [indent] используем с @, на бекенде используем без собачки

## Prisma

```bash
# Create migration
# All services are consolidated within the libs directory.
# {service} - api | etc
# Example: npm run prisma:migrate:api
$ npm run prisma:migrate:{service}

# Rollback migration
# All services are consolidated within the libs directory.
# {service} - api | etc
# Example: npm run prisma:rollback:api
$ npm run prisma:rollback:{service}

# Prisma production deploy
$ npm run prisma:deploy

# @prisma/client
$ npm run prisma:generate

# Format Prisma schema (lint fix)
$ npm run prisma:format
```

## AWS Deploying

```bash
$ aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 905418431500.dkr.ecr.eu-north-1.amazonaws.com

$ docker tag impactium-client:latest 905418431500.dkr.ecr.eu-north-1.amazonaws.com/impactium/impactium-client:latest

$ docker push 905418431500.dkr.ecr.eu-north-1.amazonaws.com/impactium/impactium-client:latest

$ docker tag impactium-api:latest 905418431500.dkr.ecr.eu-north-1.amazonaws.com/impactium/impactium-api:latest

$ docker push 905418431500.dkr.ecr.eu-north-1.amazonaws.com/impactium/impactium-api:latest

```


## Aeza Deploying

```bash
$ git clone git@github.com:Mireg-V/Impactium.git

$ cd Impactium

$ git pull

```
## Support

С любыми вопросами обращаемся к лиду, или идём с вопросиком к `admin@impactium.fun`.
