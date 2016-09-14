// @flow
export type TokenBase = Object & { type: string, value?: any };
export type Token = TokenBase & { start: number, end: number };

export type TokenResult = ?TokenBase | (?TokenBase)[];
export type TokenTransform = (token: string, tokens: string[], state: Object) => TokenResult;
export type TokenizerSpecEntry = {
  match: RegExp | string,
  penalty: number,
  token?: TokenTransform | TokenResult,
  push?: string[],
  pop?: boolean | number,
  updateState?: (state: Object) => Object
};
export type TokenizerSpecEntryRef = {
  ref: string,
  match?: RegExp | string,
  penalty?: number,
  token?: TokenTransform | TokenResult,
  push?: string[],
  pop?: boolean | number,
  updateState?: (state: Object) => Object
}

export type TokenizerSpec = ({ [key:string]: (TokenizerSpecEntry | TokenizerSpecEntryRef)[] });
export type TokenizerState = {
  character: number,
  stack: string[],
  penalty: number,
  remainingText: string,
  tokens: TokenBase[],
  userState: Object,
};

export type Tokenizer = (text: string, initialUserState: ?Object) => (TokenBase[])[];
