#!/bin/sh -x

bun esbuild index.js --minify --outfile=index.min.js
aws --profile surreal cloudfront describe-function --name www-surrealdb-com-docs-viewer-request > temp.json
ETAG=$(jq -r '.ETag' temp.json)
aws --profile surreal cloudfront update-function --name www-surrealdb-com-docs-viewer-request --function-code fileb://index.js --function-config Comment="",Runtime="cloudfront-js-2.0" --if-match $ETAG > temp.json
ETAG=$(jq -r '.ETag' temp.json)
aws --profile surreal cloudfront publish-function --name www-surrealdb-com-docs-viewer-request --if-match $ETAG > temp.json
rm -rf temp.json
