MAIN_SERVICE_NAME = app
COMPOSE_BIN ?= docker compose
COMPOSE_CMD = $(COMPOSE_BIN)

setup: build dependencies boot

# Builds docker images needed for this project from scratch
build:
	$(COMPOSE_CMD) build --no-cache --pull

# Installs dependencies with composer
dependencies:
	$(COMPOSE_CMD) run --rm $(MAIN_SERVICE_NAME) npm install

# Boots all the services in the docker-compose stack
boot:
	$(COMPOSE_CMD) up -d --remove-orphans

# Runs all the steps to be ready for PR
pr: audit lint test prepare

# Lints the code with ESLint
audit:
	$(COMPOSE_CMD) exec $(MAIN_SERVICE_NAME) npm audit --audit-level high

# Lints the code with ESLint
lint:
	$(COMPOSE_CMD) exec $(MAIN_SERVICE_NAME) npm run lint

# Runs the unit tests
test:
	$(COMPOSE_CMD) exec $(MAIN_SERVICE_NAME) npm run test

# Prepare
prepare:
	$(COMPOSE_CMD) exec $(MAIN_SERVICE_NAME) npm run prepare

# Opens a shell inside the main container
shell:
	$(COMPOSE_CMD) exec $(MAIN_SERVICE_NAME) ash