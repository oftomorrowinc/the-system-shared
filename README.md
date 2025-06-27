# The System Shared

Shared files for internal project The System.

## Development Setup

### Installation

```bash
npm install
```

### Development

```bash
# Run TypeScript in watch mode
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Run TypeScript type check
npm run tscheck

# Format code with Prettier
npm run prettier
```

### Code Quality Tools

This project uses several tools to ensure code quality:

- **ESLint**: For code linting
- **Prettier**: For code formatting
- **TypeScript**: For static type checking
- **Jest**: For testing
- **Husky & lint-staged**: For pre-commit hooks

The pre-commit hooks will automatically run linting and formatting on your staged files.

## Releasing a new package version

- Increment the version number in package.json as appropriate
- ALSO update the package.json release script to match the version number (needed for Windows)
- Run `npm run build` to ensure there are no errors
- Run `npm run release`
- Go to the project page on Github, go to releases, click draft a new release, select your tag, add a title/description and click publish
- In client and server/functions, update the dependency to the latest version number in package.json and run `npm install git+https://github.com/oftomorrowinc/the-system-shared.git#v{version.number}`

## To update packages

- Run `npx npm-check-updates -u` to update the package.json
- Then run a standard `npm install` to upgrade

Copyright 2025 Of Tomorrow, Inc. All Rights Reserved.
