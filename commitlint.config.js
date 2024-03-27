const ERROR = 2;
const ALWAYS = 'always';
const NEVER = 'never';

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      noteKeywords: ['See', '^\\[[1-9]+[0-9]*\\]']
    }
  },
  formatter: '@commitlint/format',
  rules: {
    'header-full-stop': [ERROR, NEVER, '.'],
    'header-max-length': [ERROR, ALWAYS, 80],
    "body-case": [ERROR, ALWAYS, 'sentence-case'],
    "body-leading-blank": [ERROR, ALWAYS],
    "body-max-line-length": [ERROR, ALWAYS, 80],
    "footer-leading-blank": [ERROR, ALWAYS],
    "footer-max-line-length": [ERROR, ALWAYS, Infinity],
    'type-empty': [ERROR, NEVER],
    'scope-empty': [0, NEVER],
    'subject-empty': [0, NEVER],
    'type-enum': [
      ERROR,
      'always',
      [
        'build', // Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        'chore', // updating grunt tasks etc; no production code change
        'ci', // Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
        'docs', // Documentation only changes
        'feat', // A new feature
        'fix', // A bug fix
        'perf', // A code change that improves performance
        'refactor', // A code change that neither fixes a bug nor adds a feature
        'revert', // Reverts a previous commit
        'style', // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
        'test', // Adding missing tests or correcting existing tests
        'translation', // Changes to the translation files
        'security', // Changes to the security files/policies
      ],
    ],
  },
  ignores: [(commit) => commit.includes('Signed-off-by: dependabot[bot] <support@github.com>') || commit.toLowerCase().startsWith('wip'), ],
  defaultIgnores: true,
  helpUrl: 'https://chris.beams.io/posts/git-commit/',
};

module.exports = Configuration;
