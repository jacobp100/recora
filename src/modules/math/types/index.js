// @flow
/* eslint-disable max-len */
export type Node = Object;

export const zeroTime = {
  year: null,
  month: null,
  date: null,
  hour: null,
  minute: null,
  second: null,
  timezone: 'UTC',
};

// NOTE: We're using the timezone library, so months are 1-based (sane)
export type DateTime = {
  year: ?number,
  month: ?number,
  date: ?number,
  hour: ?number,
  minute: ?number,
  second: ?number,
  timezone: ?string,
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

export type ResolverContext = {
  conversionDescriptors: ConversionDescriptors,
  date: DateTime,
  setUnits: (conversionDescriptors: ConversionDescriptors) => ResolverContext,
  setDate: (dateTime: DateTime) => ResolverContext,
};


export type BracketsNode = Node &
  { type: 'NODE_BRACKETS', value: ?Node };
export const NODE_BRACKETS = 'NODE_BRACKETS';
export const baseBrackets: BracketsNode =
  { type: NODE_BRACKETS, value: null };

export type ArrayGroupNode = Node &
  { type: 'NODE_ARRAY_GROUP', value: Node[] };
export const NODE_ARRAY_GROUP = 'NODE_ARRAY_GROUP';
export const baseArrayGroup: ArrayGroupNode =
  { type: NODE_ARRAY_GROUP, value: [] };

export type FunctionNode = Node &
  { type: 'NODE_FUNCTION', name: string, args: Node[] };
export const NODE_FUNCTION = 'NODE_FUNCTION';
export const baseFunction: FunctionNode =
  { type: NODE_FUNCTION, name: '', args: [] };

export type AssignmentNode = Node &
  { type: 'NODE_ASSIGNMENT', identifier: string, value: ?Node };
export const NODE_ASSIGNMENT = 'NODE_ASSIGNMENT';
export const baseAssignment: AssignmentNode =
  { type: NODE_ASSIGNMENT, identifier: '', value: null };

export type MiscGroupNode = Node &
  { type: 'NODE_MISC_GROUP', value: Node[] };
export const NODE_MISC_GROUP = 'NODE_MISC_GROUP';
export const baseMiscGroup: MiscGroupNode =
  { type: NODE_MISC_GROUP, value: [] };

export type ConversionNode = Node &
  { type: 'NODE_CONVERSION', value: ?Node, entityConversion: Units[], pseudoConversion: ?string, formatting: Object };
export const NODE_CONVERSION = 'NODE_CONVERSION';
export const baseConversion: ConversionNode =
  { type: NODE_CONVERSION, value: null, entityConversion: [], pseudoConversion: null, formatting: {} };

export type EntityNode = Node &
  { type: 'NODE_ENTITY', quantity: number, units: Units, formatting: {} };
export const NODE_ENTITY = 'NODE_ENTITY';
export const baseEntity: EntityNode =
  { type: NODE_ENTITY, quantity: NaN, units: {}, formatting: {} };

export type CompositeEntityNode = Node &
  { type: 'NODE_COMPOSITE_ENTITY', value: EntityNode[] };
export const NODE_COMPOSITE_ENTITY = 'NODE_COMPOSITE_ENTITY';
export const baseCompositeEntity: CompositeEntityNode =
  { type: 'NODE_COMPOSITE_ENTITY', value: [] };

export type PercentageNode = Node &
  { type: 'NODE_PERCENTAGE', value: number };
export const NODE_PERCENTAGE = 'NODE_PERCENTAGE';
export const basePercentage: PercentageNode =
  { type: 'NODE_PERCENTAGE', value: NaN };

export type ColorNode = Node &
  { type: 'NODE_COLOR', space: string, values: [number, number, number], alpha: number };
export const NODE_COLOR = 'NODE_COLOR';
export const baseColor: ColorNode =
  { type: NODE_COLOR, space: 'rgb', values: [0, 0, 0], alpha: 1, formatting: {} };

// directionHint is used for miscGroup to work out whether to add or subtract an entity
export type DateTimeNode = Node &
  { type: 'NODE_DATE_TIME', value: DateTime, directionHint: number };
export const NODE_DATE_TIME = 'NODE_DATE_TIME';
export const baseDateTime: DateTimeNode =
  { type: NODE_DATE_TIME, value: zeroTime, directionHint: 1 };
