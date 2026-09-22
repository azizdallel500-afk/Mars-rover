.PHONY: test run fix-start fix-end

test: node_modules
	npm test

run: node_modules
	npm run demo

fix-start:
	touch .claude/fix-mode

fix-end:
	rm -f .claude/fix-mode

node_modules: package.json package-lock.json
	npm install
	@touch node_modules
