// @flow
import Recora from '.';

const readline = require('readline');

const recora = new Recora();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processInput = input => {
  console.log(recora.parse(input)); // eslint-disable-line
  getInput(); // eslint-disable-line
};

const getInput = () => {
  rl.question('> ', processInput);
};

getInput();
