# Contributing to React Share Utilities

Thank you for your interest in contributing to React Share Utilities! We welcome contributions from the community and appreciate your help in making this project better.

## Project Author

This project was created and is maintained by **[Sudarshan Kakde](https://github.com/sudarshankakde)**.

Special thanks to Sudarshan for building this amazing library and making it open source for the community! 🙏

## Code of Conduct

Please be respectful and professional in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 18+ and npm or yarn or pnpm
- Git
- Basic knowledge of React and TypeScript

### Local Development Setup

1. **Fork the repository**

   ```bash
   # Visit https://github.com/sudarshankakde/React-Share-Utilities and click "Fork"
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/React-Share-Utilities.git
   cd React-Share-Utilities
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/sudarshankakde/React-Share-Utilities.git
   ```

4. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Types of Contributions

We welcome all kinds of contributions:

- **Bug Reports** - Found a bug? Please open an issue!
- **Feature Requests** - Have an idea? Share it in an issue!
- **Code Contributions** - Fix bugs or implement features
- **Documentation** - Improve our README, docs, or code comments
- **Tests** - Add or improve test coverage
- **Performance Improvements** - Help us optimize the code

### Reporting Issues

When reporting a bug, please include:

1. **Clear description** - What is the issue?
2. **Steps to reproduce** - How can we reproduce it?
3. **Expected behavior** - What should happen?
4. **Actual behavior** - What actually happens?
5. **Environment** - Node version, OS, browser (if applicable)
6. **Code example** - A minimal code snippet to demonstrate the issue

### Making Changes

1. **Create a feature branch** (if you haven't already)

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Keep commits focused and logical
   - Write meaningful commit messages
   - Update related documentation
   - Add or update tests as needed

3. **Follow coding standards** (see below)

4. **Test your changes**

   ```bash
   npm run type-check
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Add proper type annotations
- Avoid `any` type - use specific types instead
- Export interfaces and types that are part of the public API

### Code Style

- Use 2-space indentation
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Follow the existing code style in the project

### Component Guidelines

If adding React components:

- Use functional components with hooks
- Add PropTypes or TypeScript interfaces for props
- Write clear docstrings explaining component usage
- Keep components reusable and composable

### Example TypeScript Code

```typescript
interface ShareOptions {
  url: string;
  title?: string;
  text?: string;
}

/**
 * Shares content using the Web Share API
 * @param options - Share options
 * @returns Promise that resolves when sharing is complete
 */
export async function shareContent(options: ShareOptions): Promise<void> {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  await navigator.share(options);
}
```

## Commit Message Guidelines

Follow these conventions for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat` - A new feature
- `fix` - A bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build process, dependencies, etc.

### Examples

```bash
git commit -m "feat: add useShare hook for web share API"
git commit -m "fix: resolve clipboard permission issue"
git commit -m "docs: update README with new examples"
git commit -m "test: add tests for useClipboard hook"
```

## Testing

- Write tests for new features and bug fixes
- Ensure all tests pass before submitting a PR
- Aim for good code coverage
- Test edge cases and error scenarios

```bash
npm run test
```

## Pull Request Process

1. **Update your branch** with the latest upstream changes

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch and provide a clear description

4. **PR Description Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement

   ## Changes Made

   - Change 1
   - Change 2

   ## Testing

   Describe how you tested your changes

   ## Checklist

   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] Tests added/updated
   - [ ] All tests passing
   ```

5. **Respond to feedback**
   - Address review comments
   - Make requested changes
   - Push updates (don't force push)

## Documentation

### Updating Documentation

- Keep README.md up to date
- Add JSDoc comments to exported functions and components
- Include examples for new features
- Update CHANGELOG.md with your changes

### Example JSDoc

````typescript
/**
 * Copy text to the clipboard
 * @param text - The text to copy
 * @param options - Optional configuration
 * @returns Promise that resolves when copy is complete
 * @throws Error if copy operation fails
 *
 * @example
 * ```tsx
 * const { copy } = useClipboard();
 * await copy('Hello World');
 * ```
 */
export async function useClipboard(
  text: string,
  options?: ClipboardOptions
): Promise<void> {
  // Implementation
}
````

## Performance Considerations

- Minimize bundle size
- Avoid unnecessary re-renders
- Use efficient algorithms
- Profile code for performance bottlenecks
- Document performance-critical code

## Security

- Don't commit sensitive information (API keys, tokens, etc.)
- Follow security best practices
- Report security vulnerabilities privately to the maintainers
- Validate user inputs
- Sanitize data before using it

## Release Process

The maintainers will handle releases, but here's what to expect:

1. Changes are merged to main
2. Version is bumped following semver
3. CHANGELOG is updated
4. Package is published to npm
5. GitHub release is created

## Project Structure

```
pakage/
├── index.js                 # Main entry point
├── index.d.ts              # TypeScript declarations
├── components/             # React components
├── hooks/                  # React hooks
├── assets/                 # Component assets
└── types/                  # Type definitions
```

## Need Help?

- Check existing issues and discussions
- Read the documentation
- Look at existing code examples
- Ask in a new issue
- Reach out to maintainers

## Recognition

All contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page
- Project website footer

Thank you for contributing! Your efforts help make React Share Utilities better for everyone. 🎉

## Maintainers

- **Sudarshan Kakde** - [@sudarshankakde](https://github.com/sudarshankakde) - _Creator & Maintainer_

For questions or discussions, feel free to reach out to the maintainers through GitHub issues or discussions.

## License

By contributing to React Share Utilities, you agree that your contributions will be licensed under the [MIT License](https://github.com/sudarshankakde/React-Share-Utilities/blob/main/LICENSE).
