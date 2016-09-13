// @flow
export type Node = Object;

export type DateTime = {
  year: ?number,
  month: ?number,
  date: ?number,
  hour: ?number,
  minute: ?number,
  second: ?number,
  tz: ?number,
};
export type DimensionTransformer = {
  convertToBase: (value: number) => number,
  convertFromBase: (value: number) => number,
};
export type UnitName = string;
export type UnitValue = number;
export type Units = { [key: UnitName]: UnitValue };
export type ConversionDescriptor = [number | DimensionTransformer, Units];
export type ConversionDescriptors = { [key: UnitName]: ConversionDescriptor };


export const NODE_BRACKETS = 'NODE_BRACKETS';
export type BracketsNode = Node &
  { type: 'NODE_BRACKETS', value: Node };

export const NODE_FUNCTION = 'NODE_FUNCTION';
export type FunctionNode = Node &
  { type: 'NODE_FUNCTION', name: string, args: Node[] };

export const NODE_MISC_GROUP = 'NODE_MISC_GROUP';
export type MiscGroupNode = Node &
  { type: 'NODE_MISC_GROUP', value: Node[] };

export const NODE_CONVERSION = 'NODE_CONVERSION';
export type ConversionNode = Node &
  { type: 'NODE_CONVERSION', value: Node, units: Units[] };

export const NODE_ENTITY = 'NODE_ENTITY';
export type EntityNode = Node &
  { type: 'NODE_ENTITY', quantity: number, units: Units };

export const NODE_COLOR = 'NODE_COLOR';
export type ColorNode = Node &
  { type: 'NODE_COLOR', space: string, values: [number, number, number], alpha: number };

export const NODE_DATETIME = 'NODE_DATETIME';
export type DateTimeNode = Node &
  { type: 'NODE_DATETIME', value: DateTime };