#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AdminPanelStack } from '../lib/admin-panel-stack';


const app = new cdk.App();


const REGION: string = app.node.tryGetContext("Region") || "eu-west-3";
const STAGE_PREFIX: string = app.node.tryGetContext("stage") || "";
const ALLOWED_SIGN_UP_EMAIL_DOMAINS: string[] = app.node.tryGetContext(
  "allowedSignUpEmailDomains"
);
const ALLOWED_SIGN_UP_EMAIL_LIST: string[] = app.node.tryGetContext(
  "allowedSignUpEmailList"
);
const AUTO_JOIN_USER_GROUPS: string[] = app.node.tryGetContext(
  "autoJoinUserGroups"
);
const USERPOOL_DOMAIN_PREFIX_KEY: string = app.node.tryGetContext(
  "userpoolDomainPrefix"
);
const SELF_SIGN_UP_ENABLED: boolean =
  app.node.tryGetContext("selfSignUpEnabled");

const admin = new AdminPanelStack(app, `AdminPanelStack`+ STAGE_PREFIX, {
  env: {
    // account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  stagePrefix: STAGE_PREFIX,
  allowedSignUpEmailDomains: ALLOWED_SIGN_UP_EMAIL_DOMAINS,
  allowedSignUpEmailList: ALLOWED_SIGN_UP_EMAIL_LIST,
  autoJoinUserGroups: AUTO_JOIN_USER_GROUPS,
  userPoolDomainPrefixKey: USERPOOL_DOMAIN_PREFIX_KEY,
  selfSignUpEnabled: SELF_SIGN_UP_ENABLED,
});


// Add a tag to all constructs in the stack
cdk.Tags.of(admin).add('owner', '@antoinefradin');
cdk.Tags.of(admin).add('email', 'antoine.fradin@iqanto.net');
cdk.Tags.of(admin).add('project', 'IQ Agent');
cdk.Tags.of(admin).add('environment', 'Development');
cdk.Tags.of(admin).add('project_scope', 'internal');