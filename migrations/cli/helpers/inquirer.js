const inquirer = require('inquirer');

const migrations = require('../../migrations');

module.exports = {
  askParams() {
    const questions = [
      {
        name: 'action',
        type: 'list',
        message: 'What do you want to do?',
        choices: [
          { name: 'Get a list of the widgets to migrate', value: 'report' },
          { name: 'Test a migration (dry run)', value: 'dry-run' },
          { name: 'Migrate some widgets', value: 'migrate' }
        ]
      },
      {
        name: 'version',
        type: 'list',
        message: 'Which version do you want to migrate to?',
        choices: migrations.map(
          (migration, i) => ({
            name: i === 0
              ? `${migration.version} or later`
              : migration.version,
            value: migration.version
          })
        )
      },
      {
        name: 'applications',
        type: 'input',
        message: 'Enter the applications (separated with commas):',
        default: 'rw',
        validate: value => !!value.length
      },
      {
        name: 'env',
        type: 'input',
        message: 'Enter the environments (separated with commas):',
        default: 'production,preproduction',
        validate: value => !!value.length
      },
      {
        name: 'url',
        type: 'input',
        message: 'Enter the API\'s URL (without last slash):',
        default: 'https://api.resourcewatch.org/v1',
        validate: value => !!value.length
          && !!/^[a-z][a-z\d.+-]*:\/*(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i.test(value)
      },
      {
        name: 'token',
        type: 'input',
        message: 'Enter your token (without "Bearer"):',
        validate: value => !!value.length,
        when: answers => answers.action === 'migrate'
      }
    ];

    return inquirer.prompt(questions);
  },

  askConfirmation() {
    const questions = [
      {
        name: 'confirm',
        type: 'confirm',
        message: 'Are you sure you want to continue?',
        default: false
      }
    ];

    return inquirer.prompt(questions);
  },

  askOverride() {
    const questions = [
      {
        name: 'override',
        type: 'confirm',
        message: 'A report already exists. Do you want to override it?',
        default: true
      }
    ];

    return inquirer.prompt(questions);
  }
};
