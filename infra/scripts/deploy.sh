#!/usr/bin/env bash
set -oex pipefail

CURRENT_AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text --profile personal-admin)

function cdk {
  args=$*
  npm run cdk --  $args
}

function diff {
  stack=$1
  cdk diff $stack
}

function deploy {
  stack=$1
  cdk deploy $stack --require-approval never --exclusively
}

# Prepare CDK Stack Templates and AWS
cdk bootstrap "aws://${CURRENT_AWS_ACCOUNT}/*"

echo ---------- List stacks -----------
cdk list
echo ----------------------------------

echo ---------- Diff stacks -----------
diff data-viewer
echo ----------------------------------
