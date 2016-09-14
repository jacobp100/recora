// @flow
import Recora from '.';

const readline = require('readline');

const recora = new Recora();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processInput = input => {
  const value = recora.parse(input);
  console.log(value ? value.pretty : '(no result)'); // eslint-disable-line
  getInput(); // eslint-disable-line
};

const getInput = () => {
  rl.question('> ', processInput);
};

getInput();
