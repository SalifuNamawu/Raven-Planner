# Document Templates

Templates for portability documentation.

---

## PORTABILITY.md TEMPLATE

```markdown
# Portability

## Architecture

```
{{DEV_ENV}} → GitHub (source of truth) → {{DEPLOY_TARGET}} → DNS (custom domain)
```

## Production Architecture

```
{{DEPLOY_TARGET}}
├── Static frontend  ({{BUILD_OUTPUT}})
{{#if API_EXISTS}}
└── /api/{{FUNCTION_NAME}}  (api/{{FUNCTION_FILE}} — {{FUNCTION_TYPE}})
{{/if}}
```

{{REPO_SUMMARY}}

## Project Structure

```
/
{{#each STRUCTURE}}
├── {{.}}
{{/each}}
```

## Development Environment

{{DEV_ENV_DESCRIPTION}}

## GitHub — Source of Truth

{{GITHUB_DESCRIPTION}}

## External Production Services

| Service | Provider | Purpose |
|---|---|---|
{{#each SERVICES}}
| {{NAME}} | {{PROVIDER}} | {{PURPOSE}} |
{{/each}}

## Runtime Inventory

| Runtime | Purpose | Entry Point | Deploy Target | Build Tool | TS Config |
|---|---|---|---|---|---|
{{#each RUNTIMES}}
| {{NAME}} | {{PURPOSE}} | {{ENTRY}} | {{TARGET}} | {{TOOL}} | {{TSCONFIG}} |
{{/each}}

## Portability Status

**{{STATUS}}**

{{#each CHECKS}}
- {{STATUS}} {{DESCRIPTION}}
{{/each}}

## Handover Checklist

To hand this project to a client or another developer:

{{#each HANDOVER}}
- [ ] {{ITEM}}
{{/each}}
```

---

## DEPLOYMENT.md TEMPLATE

```markdown
# Deployment Guide

## Stack

- **Package manager:** {{PACKAGE_MANAGER}}
- **Node version:** {{NODE_VERSION}}
- **Frontend framework:** {{FRONTEND_FRAMEWORK}}
- **API:** {{API_TYPE}}
- **Structure:** {{STRUCTURE_TYPE}}

## Project Structure

```
/
{{#each STRUCTURE}}
├── {{.}}
{{/each}}
```

## Install

```bash
{{INSTALL_CMD}}
```

## Build

```bash
{{BUILD_CMD}}
```

Output: `{{OUTPUT_DIR}}/`

## {{DEPLOY_TARGET}} Deployment

{{DEPLOY_DESCRIPTION}}

### Configuration

{{CONFIG_DESCRIPTION}}

```json
{{VERCEL_JSON}}
```

### Project Settings

| Setting | Value |
|---|---|
{{#each SETTINGS}}
| {{NAME}} | {{VALUE}} |
{{/each}}

### Functions

{{FUNCTIONS_DESCRIPTION}}

### Environment Variables

Configure in **{{DEPLOY_TARGET}} → Settings → Environment Variables**.

| Variable | Environments | Description |
|---|---|---|
{{#each ENV_VARS}}
| {{NAME}} | {{ENVS}} | {{DESC}} |
{{/each}}

---

## Deployment Workflow

```
{{WORKFLOW}}
```

---

## Custom Domain / DNS

{{DNS_INSTRUCTIONS}}

---

## External Services Setup

{{#each SERVICES}}
### {{NAME}} ({{PROVIDER}})

{{SETUP_STEPS}}
{{/each}}

---

## Local Development

```bash
{{LOCAL_DEV_CMDS}}
```

Required local env vars:

| Variable | Example | Notes |
|---|---|---|
{{#each LOCAL_VARS}}
| {{NAME}} | {{EXAMPLE}} | {{NOTES}} |
{{/each}}

---

## Architecture Notes

{{ARCH_NOTES}}
```

---

## PRODUCTION_READINESS_REPORT.md TEMPLATE

```markdown
# Production Readiness Report

## PROJECT STRUCTURE

{{STRUCTURE_TREE}}

## REMOVED FILES

| File/Directory | Reason |
|---|---|
{{#each REMOVED_FILES}}
| {{FILE}} | {{REASON}} |
{{/each}}

## REMOVED DEPENDENCIES

| Package | Reason |
|---|---|
{{#each REMOVED_DEPS}}
| {{PKG}} | {{REASON}} |
{{/each}}

## REMOVED CONFIGURATION

| Configuration | Change |
|---|---|
{{#each REMOVED_CONFIG}}
| {{CONFIG}} | {{CHANGE}} |
{{/each}}

## DEPLOYMENT CHANGES

{{DEPLOY_CHANGES}}

## PORTABILITY IMPROVEMENTS

{{PORTABILITY_IMPROVEMENTS}}

## REMAINING RISKS

| Risk | Severity | Mitigation |
|---|---|---|
{{#each RISKS}}
| {{RISK}} | {{SEVERITY}} | {{MITIGATION}} |
{{/each}}

## RECOMMENDED {{DEPLOY_TARGET}} SETTINGS

| Setting | Value |
|---|---|
{{#each SETTINGS}}
| {{NAME}} | {{VALUE}} |
{{/each}}

**Environment Variables:**
{{#each ENV_VARS}}
- {{NAME}} — {{ENVS}} — {{DESC}}
{{/each}}

## EXPECTED BUILD OUTPUT

```
{{BUILD_OUTPUT_TREE}}
```

## EXPECTED ROOT DIRECTORY

{{ROOT_DIR}}

## EXPECTED OUTPUT DIRECTORY

{{OUTPUT_DIR}}

## ENVIRONMENT VARIABLES

| Variable | Required | Environments | Description |
|---|---|---|---|
{{#each ENV_VARS}}
| {{NAME}} | {{REQUIRED}} | {{ENVS}} | {{DESC}} |
{{/each}}

## VALIDATION STATUS

| Check | Status |
|---|---|
{{#each VALIDATIONS}}
| {{CHECK}} | {{STATUS}} |
{{/each}}
```