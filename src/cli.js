// @flow
import { set } from 'lodash/fp';
import Recora from '.';
import { NODE_ASSIGNMENT } from './modules/math/types';

const readline = require('readline');

const recora = new Recora();
let constants = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const processInput = input => {
  const value = recora.parse(input);
  console.log(value ? value.pretty : '(no result)'); // eslint-disable-line
  const result = value && value.result;
  if (result && result.type === NODE_ASSIGNMENT) {
    constants = set(result.identifier, result.value, constants);
    recora.setConstants(constants);
  }
  getInput(); // eslint-disable-line
};

const getInput = () => {
  rl.question('> ', processInput);
};

getInput();
