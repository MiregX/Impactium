.PHONY: system/up
system/up:
	@cd ../.. && $(MAKE) up

.PHONY: system/down
system/down:
	@cd ../.. && $(MAKE) down

.PHONY: api/prisma/deploy
api/prisma/deploy:
	@docker exec api npm run prisma:deploy

.PHONY: api/prisma/migrate
api/prisma/migrate:
	@docker exec api npm run prisma:migrate -- --name $(name)

.PHONY: api/prisma/rollback
api/prisma/rollback:
	@docker exec api npm run prisma:rollback -- $(name)

.PHONY: api/prisma/generate
api/prisma/generate:
	@docker exec api npm run prisma:generate

.PHONY: api/prisma/seed
api/prisma/seed:
	@docker exec api npm run prisma:seed