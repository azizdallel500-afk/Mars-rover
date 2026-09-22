.PHONY: test run fix-start fix-end deploy rollback

DEPLOY_STATE_DIR := .deploy

test: node_modules
	npm test

run: node_modules
	npm run demo

fix-start:
	touch .claude/fix-mode

fix-end:
	rm -f .claude/fix-mode

deploy:
	@if [ -z "$(ENV)" ]; then echo "ENV est requis (ex: make deploy ENV=staging)"; exit 1; fi
	@mkdir -p $(DEPLOY_STATE_DIR)/$(ENV)
	@new=$$(git rev-parse HEAD); \
	old=$$(cat $(DEPLOY_STATE_DIR)/$(ENV)/current 2>/dev/null || true); \
	if [ -n "$$old" ]; then echo "$$old" > $(DEPLOY_STATE_DIR)/$(ENV)/previous; fi; \
	echo "$$new" > $(DEPLOY_STATE_DIR)/$(ENV)/current; \
	if [ -n "$$old" ]; then \
		echo "Déploiement sur $(ENV) : $$old -> $$new"; \
	else \
		echo "Déploiement sur $(ENV) : $$new (première version)"; \
	fi

rollback:
	@if [ -z "$(ENV)" ]; then echo "ENV est requis (ex: make rollback ENV=staging)"; exit 1; fi
	@if [ ! -f $(DEPLOY_STATE_DIR)/$(ENV)/previous ]; then \
		echo "Aucune version précédente sur $(ENV), rollback impossible."; \
		exit 1; \
	fi
	@cur=$$(cat $(DEPLOY_STATE_DIR)/$(ENV)/current 2>/dev/null || true); \
	prev=$$(cat $(DEPLOY_STATE_DIR)/$(ENV)/previous); \
	echo "$$cur" > $(DEPLOY_STATE_DIR)/$(ENV)/previous; \
	echo "$$prev" > $(DEPLOY_STATE_DIR)/$(ENV)/current; \
	echo "Rollback sur $(ENV) : $$cur -> $$prev"

node_modules: package.json package-lock.json
	npm install
	@touch node_modules
