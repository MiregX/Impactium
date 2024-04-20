default:
	dev

dev:
	copy lib\dev.env .env

prod:
	copy lib\prod.env .env

deploy:
	up && docker compose --profile production up -d