test:
	@./node_modules/.bin/mocha

run:
	node controllers/server.js

.PHONY: test
