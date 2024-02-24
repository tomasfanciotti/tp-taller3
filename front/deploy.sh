#!/usr/bin/env sh


yarn build || exit 1

aws s3 sync dist s3://lnt.frontend --profile "personal"
aws cloudfront create-invalidation --distribution-id E2TMP4NAG6AI5 --paths "/*" --profile "personal"
