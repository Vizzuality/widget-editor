#!/usr/bin/env node

const chalk = require('chalk');

const ui = require('./helpers/ui');
const inquirer = require('./helpers/inquirer');
const api = require('./helpers/api');
const files = require('./helpers/files');

const REPORT_NAME = 'widgets-migration-report.txt';

const run = async () => {
  ui.printIntro();

  const params = await inquirer.askParams();
  const apiService = api.createAPIService(params);

  // We ask the user whether they want to override the
  // report if it already exists
  let createReport = true;
  if (files.fileExists(REPORT_NAME)) {
    ({ override: createReport } = await inquirer.askOverride());
  }

  if (params.action === 'report' && !createReport) {
    process.exit();
  }

  // We obtain the list of all the widgets to upload
  let widgets;
  const widgetsSpinner = ui.printSpinner('Fetching the widgets to migrate...');
  try {
    widgetsSpinner.start();
    widgets = await api.getWidgetsToMigrate(apiService);
    widgetsSpinner.stop();
  } catch (e) {
    widgetsSpinner.stop();
    ui.printError(
      'The tool failed to retrieve basic information about the widgets.',
      'Make sure you\'ve entered correct information.'
    );
    throw new Error('controlled');
  }

  // If the user only wants the list of the widgets to migrate,
  // we generate a report and exit
  if (params.action === 'report') {
    let content = 'Widgets to migrate:\n';
    content += widgets.map(w => `* ${w.id}`).join('\n');

    try {
      files.createReport(params, REPORT_NAME, content);
    } catch (e) {
      ui.printError('The tool failed to create the report.');
      throw new Error('controlled');
    }

    ui.printSuccess(
      'The report has been created.',
      `You can find the file here: ./${REPORT_NAME}`
    );

    process.exit();
  }

  // If the user wants to migrate the widgets, we ask for their confirmation
  if (params.action === 'migrate') {
    ui.printNewScreen();
    ui.log(`This script will migrate ${chalk.yellow.bold(widgets.length)} widgets.`);
    ui.log('');
    const { confirm } = await inquirer.askConfirmation();
    if (!confirm) {
      process.exit();
    }
  }

  const performer = params.action === 'migrate'
    ? api.performMigration
    : api.performDryRunMigration;

  const migrationSpinner = ui.printSpinner(
    params.action === 'migrate'
      ? 'Migrating the widgets...'
      : 'Simulating the migration...'
  );
  const progress = { migrated: [], remaining: [...widgets] };
  try {
    migrationSpinner.start();
    await performer(apiService, progress);
    migrationSpinner.stop();
  } catch (e) {
    migrationSpinner.stop();

    let content = 'Migrated widgets:\n';
    content += progress.migrated.map(w => `* ${w.id}`).join('\n');
    content += '\n\nUntouched widgets:\n';
    content += progress.remaining.map(w => `* ${w.id}`).join('\n');
    content += '\n\nError:\n';
    content += e.message;

    try {
      files.createReport(params, REPORT_NAME, content);
    } catch (_) { } // eslint-disable-line no-empty


    ui.printError(
      params.action === 'migrate'
        ? 'The tool failed to run the migration.'
        : 'The tool failed to simulate the migration.',
      `You can find the report here: ./${REPORT_NAME}`
    );

    throw new Error('controlled');
  }

  let content = 'Migrated widgets:\n';
  content += widgets.map(w => `* ${w.id}`).join('\n');

  try {
    files.createReport(params, REPORT_NAME, content);
  } catch (e) {
    ui.printError('The tool failed to create the report.');
    throw new Error('controlled');
  }

  ui.printSuccess(
    params.action === 'migrate'
      ? 'The widgets have been successfully migrated.'
      : 'The dry run has been successful.',
    `You can find the report here: ./${REPORT_NAME}`
  );
};

run().catch((e) => {
  if (e.message !== 'controlled') {
    ui.printError('An unknown error occurred. Please report it with the reproduction steps.');
  }
});
