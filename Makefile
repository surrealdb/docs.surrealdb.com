.PHONY: deploy
deploy:
	@echo "Deploy..."
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude ".DS_Store" ./build/docs s3://www.surrealdb.com/docs/

.PHONY: deploy-dev
deploy-dev:
	@echo "Deploy Dev..."
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude ".DS_Store" ./build/docs s3://www.surrealdb.dev/docs/


.PHONY: build
build:
	@echo "Build prod..."
	IS_PROD_BUILD=true pnpm build