# Copyright © 2024 SurrealDB Ltd
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

.PHONY: default
default:
	@echo "Choose a Makefile target:"
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print "  - " $$1}}' | sort

.PHONY: dev
dev:
	@echo "Run development build..."
	bun dev

.PHONY: build
build:
	@echo "Build..."
	bun run build

.PHONY: preview
preview:
	@echo "Preview existing build..."
	bun preview

.PHONY: install
install:
	@echo "Installing dependencies..."
	bun i

.PHONY: ts
ts:
	@echo "Validating TypeScript types..."
	bun ts

.PHONY: qc
qc:
	@echo "Checking code quality..."
	bun run quality:check

.PHONY: qa
qa:
	@echo "Apply safe code quality suggestions..."
	bun run quality:apply

.PHONY: qau
qau:
	@echo "Apply (un)safe code quality suggestions..."
	bun run quality:apply:unsafe

.PHONY: check-quality
check-quality:
	@echo "Checking code quality..."
	bun run quality:check

.PHONY: apply-quality
apply-quality:
	@echo "Apply safe code quality suggestions..."
	bun run quality:apply

.PHONY: apply-quality-unsafe
apply-quality-unsafe:
	@echo "Apply all code quality suggestions..."
	bun run quality:apply:unsafe

.PHONY: deploy
deploy:
	@echo "Deploy..."
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude '.DS_Store' --exclude '*' --include '*.webp' --content-type 'image/webp' ./dist/_astro s3://www.surrealdb.com/_astro/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude '.DS_Store' --exclude '*.webp' ./dist/_astro s3://www.surrealdb.com/_astro/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=31536000, immutable" --exclude '.DS_Store' ./dist/static s3://www.surrealdb.com/static/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=86400" --exclude '.DS_Store' ./dist/~partytown s3://www.surrealdb.com/~partytown/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=300" --delete --exclude '.DS_Store' ./dist/.well-known/ s3://www.surrealdb.com/.well-known/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=30" --delete --exclude '*' --include '*.rss' ./dist/feed s3://www.surrealdb.com/feed/
	aws s3 cp --region eu-west-2 --cache-control "public, max-age=86400" ./dist/favicon.ico s3://www.surrealdb.com/
	aws s3 cp --region eu-west-2 --cache-control "public, max-age=86400" ./dist/robots.txt s3://www.surrealdb.com/
	aws s3 sync --region eu-west-2 --cache-control "public, max-age=30" --delete --exclude '*' --include '*.html' --exclude 'docs/*.html' ./dist/ s3://www.surrealdb.com/

.PHONY: sitemap
sitemap:
	@echo "Generating sitemap..."
	bunx --yes sitemap-generator-cli --priority-map "1.0,0.9,0.8,0.7" https://surrealdb.com
	aws s3 cp --region eu-west-2 --cache-control "public, max-age=30" ./sitemap.xml s3://www.surrealdb.com/
