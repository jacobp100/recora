// @flow
import Recora from '.';
import { NODE_ASSIGNMENT } from './modules/math/types';

const readline = require('readline');

const recora = new Recora();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processInput = input => {
  const value = recora.parse(input);

  console.log(value ? value.pretty : '(no result)'); // eslint-disable-line

  const result = value && value.value;
  if (result && result.type === NODE_ASSIGNMENT) {
    recora.setConstant(result.identifier, result.value);
  }

  getInput(); // eslint-disable-line
};

const getInput = () => {
  rl.question('> ', processInput);
};

getInput();
