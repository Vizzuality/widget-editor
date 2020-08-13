/* eslint-disable no-console */
const chalk = require('chalk');
const clear = require('clear');
const clui = require('clui');

const clearScreen = () => {
  clear();
  console.log('');
};

const printTitle = () => {
  console.log(chalk.hex('#ea3a78').bold('Widgets migration'));
  console.log('');
};

const printDescription = () => {
  console.log('This tool is here to help you migrate widgets that have been created with previous versions of the widget-editor and that are no longer supported by a newer version.');
  console.log('This tool has been created with the RW API in mind.');
  console.log('');
  console.log(chalk.yellow('Before the migration starts, you will be asked to confirm one last time.'));
  console.log('');
};

const printMessage = (title, message, level) => {
  let printer;
  if (level === 'success') {
    printer = chalk.green;
  } else {
    printer = chalk.red;
  }

  clearScreen();
  printTitle();
  console.log(printer(title));
  if (message) {
    console.log(message);
  }
  console.log('');
};

module.exports = {
  printIntro() {
    clearScreen();
    printTitle();
    printDescription();
  },

  printNewScreen() {
    clearScreen();
    printTitle();
  },

  printSuccess(title, message) {
    printMessage(title, message, 'success');
  },

  printError(title, message) {
    printMessage(title, message, 'error');
  },

  log(message) {
    console.log(message);
  },

  printSpinner(message) {
    return new clui.Spinner(message);
  }
};
