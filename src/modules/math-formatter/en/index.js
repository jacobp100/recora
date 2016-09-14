// @flow
import { NODE_ENTITY } from '../../math/types';
import type { NodeFormatter } from '../types';
import formatEntity from './entity';


const enFormatter: NodeFormatter = {
  [NODE_ENTITY]: formatEntity,
};
export default enFormatter;
