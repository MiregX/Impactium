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

up: docker post-up
docker:
	@echo λ Starting with Docker Compose...
	@docker-compose -f docker-compose.yml up -d

down:
	@docker-compose down --dry-run

post-up:
	@echo λ Waiting for stabilize...
	@$(SLEEP_CMD)

	@echo λ Running post-up API
	@cd ./api && $(MAKE) api/prisma/deploy
	@cd ./api && $(MAKE) api/prisma/generate
	@cd ./api && $(MAKE) api/prisma/seed

.PHONY: pre-up post-up docker-up down restart
