.PHONY: test run

test: node_modules
	npm test

run: node_modules
	npm run demo

node_modules: package.json package-lock.json
	npm install
	@touch node_modules
