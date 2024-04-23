# Impactium | *Архитектурный гайд*

## Вступление



## Project Structure

Репозиторий Impactium организован в папки `CLIENT` и `API`, содержащие разные библиотеки, но которые имеют косвенную связь между собой через использование ссылкок в виде:
```js
import { Configuration } from '@impactium/config';
```
or
```js
import { User } from '@api/main/user/user.entity';
```

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

## `API`

soon...

## Как запустить?

Чтобы развернуть проект через Docker в режиме "production" как `testnet` то выполни команду:

```bash
$ npm install
$ docker compose up -d
```

Чтобы запустить в режиме разработки, то `Run and Debug (CTRL + Shift + D)` в Visual Studio Code и вверху появившейся панели выбери в выпадающем меню Start API и приступай к работе

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

## Support

For questions or support, contact at `admin@impactium.fun`.
