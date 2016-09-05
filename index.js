// @flow

type TokenType = string;

const numberToken: TokenType = 'number';
const vectorEndToken: TokenType = 'vector-end';

type Token = { type: TokenType };
type TokenOptions = Token[];

const tokenOptions = (tokens: Token[]): TokenOptions => tokens;

type TokenMatcher = (RegExp | string);
type TokenTransform = (token: string) => TokenOptions | () => TokenOptions;
type TransformNoPop = [TokenMatcher, TokenTransform];
type TransformPop = [TokenMatcher, TokenTransform, string];
type stackAstTransformerArg =
  ({ [key:string]: (TransformNoPop | TransformPop)[] });

const stackAstTransformer = (stack: stackAstTransformerArg) => {
};

stackAstTransformer({
  number: [
    [/\d+/, token => tokenOptions([{ type: numberToken, value: Number(token) }])],
  ],
  matrix: [
    [']', () => tokenOptions([{ type: vectorEndToken }]), '#pop'],
  ],
  default: [
  ],
});
