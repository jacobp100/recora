# Recora

![Recora Logo](https://github.com/jacobp100/recora-web/raw/gh-pages/design/icon-calculator-gradient.png?raw=true)

Language processor for [Recora project](https://github.com/jacobp100/recora): a natural language calculator and spreadsheet replacement.

# Code Overview

The process is simple: we take input, put it through a tokeniser, generate an abstract syntax tree, and process the result.

The tokeniser is somewhat unconventional, as it generates multiple interpretations of tokens. For example, *1/12/2000* could be interpreted as a date, or as 1 divided by 12 divided by 2000. The tokeniser will prioritise the different interpretations of tokens: in the previous example, the date would be prioritised.

For every interpretation, we generate an abstract syntax tree (AST), which represents the operations that must be performed. Generating an AST can also fail: for example, if you only had two tokens, a number, and a addition operator (+), there isn’t a suitable AST.

Lastly, for every AST generated, we perform all the operations. Again, this can fail: if you try to add 1 meter to 1 joule, the result is not defined.

The result returned from the process is the first defined result.

## Tokeniser

The tokeniser works very similar to [Pygments](http://pygments.org/docs/lexerdevelopment/). Similar to Pygments, each rule has,

* `match`: a regular expression or string to match the current text
* `token`: a token object or a function to create a token object
* `push` and `pop` to edit the parsing stack

We also have a `userState` object, which is provided as an argument to `token` functions, and can be updated with `updateState`. Currently, the `userState` is only used for calculating the bracket levels for syntax highlighting. I wouldn’t recommend doing anything complicated with it.

The biggest difference is that every rule also has a `penalty`. This is because as noted before, the tokeniser generates multiple interpretations of tokens. Positive penalties indicate if you don’t want the token to be interpreted by the rule, or negative if you do. To get the date to take priority over three numbers and two divide symbols, the date penalty must be less than the sum of the alternatives.

## AST Transformation

We now have an array of tokens, we built the AST. We create a list of rules that match and transform token patterns.

To match cases of tokens using something similar to regular expressions. To match an addition case, we’d look for any amount of non-addition tokens, a single addition token, and any amount of tokens. Like regular expressions, this gives us capture groups: for this example, we’d have three.

If we match a case, we perform a transform. The transform takes capture groups, and can either return an array of new tokens, which will then continue AST transformation; a single token, which will not continue AST transformation; or null, which will not continue AST transformation, and will mark the AST invalid. Invalid ASTs will not be resolved. In the addition example: `1 + 2`, the capture groups would be `1`, `+` and `2` in order. We’d return a single `add` token with an arguments property being the first and last capture groups.

Each transformer can recursively transform capture groups. If we had `1 + 2 + 3`, we’d match the first addition operator to give the left-hand-side as `1` and the right as `2 + 3`. The right-hand-side would be recursively transformed using the same rule, and give an addition token. The first addition operator would then have the left-hand-side be a number, and the right be an addition token.

We use multiple transformers to create operator precedence: for example, you would do addition before multiplication (BODMAS in reverse).

## Resolving

The AST represents the exact operations that must be performed, so this step is really nothing more than performing the operations.
