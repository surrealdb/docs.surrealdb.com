.PHONY: deploy
deploy:
	@echo "Deploy..."
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude ".DS_Store" ./build/docs/assets s3://www.surrealdb.com/docs/assets/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=300" --delete ./build/docs/img s3://www.surrealdb.com/docs/img/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=300" --exact-timestamps --delete --exclude "*" --include "*.html" ./build/docs s3://www.surrealdb.com/docs/
	aws s3 cp --region eu-west-2 --cache-control "public, max-age=30" ./build/docs/sitemap.xml s3://www.surrealdb.dev/docs/

.PHONY: stage
stage:
	@echo "Stage..."
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude ".DS_Store" ./build/docs/assets s3://www.surrealdb.dev/docs/assets/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=300" --delete ./build/docs/img s3://www.surrealdb.dev/docs/img/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=300" --exact-timestamps --delete --exclude "*" --include "*.html" ./build/docs s3://www.surrealdb.dev/docs/
	aws s3 cp --region eu-west-2 --cache-control "public, max-age=30" ./build/docs/sitemap.xml s3://www.surrealdb.com/docs/

.PHONY: build
build:
	@echo "Build prod..."
	IS_PROD_BUILD=true pnpm build