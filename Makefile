default: up

OS ?= $(shell uname -s)
SLEEP_CMD := sleep 5

ifeq ($(OS),Windows_NT)
  SLEEP_CMD := timeout /t 30
else ifeq ($(OS),MINGW32_NT)
  SLEEP_CMD := timeout /t 30
else ifeq ($(OS),MINGW64_NT)
  SLEEP_CMD := timeout /t 30
endif

up: docker
docker:
	@echo Starting with Docker Compose...
	@docker-compose --env-file .env -f docker-compose.yml up --abort-on-container-exit

down:
	@docker-compose down

post-up:
	@echo Waiting for stabilize...
	@$(SLEEP_CMD)

	@echo Running post-up API
	@cd ./api && $(MAKE) api/prisma/deploy
	@cd ./api && $(MAKE) api/prisma/generate
	@cd ./api && $(MAKE) api/prisma/seed

purge:
	@docker system prune --all --force

.PHONY: pre-up post-up docker-up down restart
