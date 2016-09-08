import { set, map } from 'lodash/fp';

const OPERATOR_ADD = 'add';

const math = {
  functionTrie: {},
  config: {},
  extendFunction(functionName, types, fn) {
    return set(['functionTrie', functionName, ...types], fn, this);
  },
  execute(functionName, args) {
    const triePath = map('type', args);
    const func = get(['functionTrie', functionName, ...triePath], this);
    if (!func) return;
  },
};

export default math
  .extendFunction(OPERATOR_ADD, [RESULT_ENTITY, RESULT_ENTITY], addEntityToEntity);
