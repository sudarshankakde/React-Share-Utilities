# Release Process

This document outlines how to release new versions of `react-share-utilities`.

## Prerequisites

1. **NPM Account**: Must have access to publish on npm
2. **GitHub Token**: Stored as `NPM_TOKEN` secret in GitHub
3. **Semantic Versioning**: Follow [semver](https://semver.org/)

## Setting Up Secrets

### NPM Token

1. Generate an NPM token at [https://www.npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
   - Choose "Automation" token type for CI/CD
2. Add to GitHub Secrets as `NPM_TOKEN`:
   - Go to Settings → Secrets and variables → Actions
   - Create new repository secret: `NPM_TOKEN`
   - Paste your npm token

## Release Steps

### 1. Prepare Release

- Update `package.json` version
- Update `CHANGELOG.md` (if exists)
- Commit changes: `git commit -m "chore: bump version to x.y.z"`

### 2. Create Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

Version format: `v[MAJOR].[MINOR].[PATCH]`

### 3. Push Tag

```bash
git push origin v1.0.0
```

## What Happens Automatically

When you push a version tag (e.g., `v1.0.0`):

### Validation Phase

- ✅ Installs dependencies
- ✅ Runs type checking (`tsc --noEmit`)
- ✅ Runs linting with ESLint
- ✅ Checks formatting with Prettier
- ✅ Runs test suite

### Publishing Phase (after validation)

1. **NPM Registry** (via npm)
   - Builds package with npm
   - Publishes to [npm](https://www.npmjs.com/package/react-share-utilities)
   - Requires `NPM_TOKEN` secret

2. **NPM Registry** (via Yarn)
   - Builds package with Yarn
   - Publishes to [npm](https://www.npmjs.com/package/react-share-utilities) using Yarn
   - Requires `NPM_TOKEN` secret
   - Ensures Yarn compatibility

3. **GitHub Packages**
   - Builds package
   - Publishes to [GitHub Packages](https://github.com/sudarshankakde/React-Share-Utilities/packages)
   - Uses `GITHUB_TOKEN` (automatic)

4. **GitHub Release**
   - Creates release on GitHub
   - Includes changelog from git history
   - Installation instructions for npm, yarn, pnpm

## CI/CD Workflows

### publish.yml

Triggered by: Git tags matching `v*.*.*`

Jobs:

- `validate` - Runs all checks
- `publish-npm` - Publishes to npm
- `publish-github` - Publishes to GitHub Packages
- `create-release` - Creates GitHub release

### ci.yml

Triggered by: Pull requests and pushes to main/develop

Jobs:

- `test` - Tests across Node.js 18, 20, 22 with both npm and Yarn
- `validate` - Full validation suite

## Package Installation Methods

After release, users can install via:

```bash
# npm
npm install react-share-utilities

# yarn
yarn add react-share-utilities

# pnpm
pnpm add react-share-utilities
```

## Troubleshooting

### Publish fails with NPM_TOKEN error

- Verify `NPM_TOKEN` secret is set correctly
- Check token hasn't expired
- Ensure token has publish permissions

### Release created but package not on npm

- Check the "publish-npm" job logs
- Verify package version isn't already published
- Check for scope issues if using scoped package

### GitHub release created with empty changelog

- Ensure previous tag exists for changelog generation
- Check git history between tags

## Version Bumping Script (Optional)

Create a script to automate versioning:

```bash
#!/bin/bash
# bump-version.sh
NEW_VERSION=$1
npm version $NEW_VERSION
git push --follow-tags
```

Usage:

```bash
./bump-version.sh minor  # Bumps minor version
```
