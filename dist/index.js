(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/fp"), require("color-forge"), require("lodash"), require("timezone/loaded"), require("gamma"), require("mathp"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/fp", "color-forge", "lodash", "timezone/loaded", "gamma", "mathp"], factory);
	else if(typeof exports === 'object')
		exports["recora"] = factory(require("lodash/fp"), require("color-forge"), require("lodash"), require("timezone/loaded"), require("gamma"), require("mathp"));
	else
		root["recora"] = factory(root["lodash/fp"], root["color-forge"], root["lodash"], root["timezone/loaded"], root["gamma"], root["mathp"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_32__, __WEBPACK_EXTERNAL_MODULE_36__, __WEBPACK_EXTERNAL_MODULE_46__, __WEBPACK_EXTERNAL_MODULE_50__, __WEBPACK_EXTERNAL_MODULE_51__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fp = __webpack_require__(1);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _tokenizer = __webpack_require__(3);
	
	var _tokenizer2 = _interopRequireDefault(_tokenizer);
	
	var _en = __webpack_require__(7);
	
	var _en2 = _interopRequireDefault(_en);
	
	var _transformer = __webpack_require__(17);
	
	var _transformer2 = _interopRequireDefault(_transformer);
	
	var _math = __webpack_require__(34);
	
	var _mathFormatter = __webpack_require__(59);
	
	var _mathFormatter2 = _interopRequireDefault(_mathFormatter);
	
	var _units = __webpack_require__(66);
	
	var _units2 = _interopRequireDefault(_units);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var cleanTokens = (0, _fp.flow)((0, _fp.reject)({ type: _tokenTypes.TOKEN_NOOP }), (0, _fp.reject)(function (_ref) {
	  var start = _ref.start;
	  var end = _ref.end;
	  return start >= end;
	}), (0, _fp.map)((0, _fp.pick)(['type', 'start', 'end'])));
	
	var Recora = function () {
	  function Recora() {
	    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    var _ref2$locale = _ref2.locale;
	    var locale = _ref2$locale === undefined ? 'en' : _ref2$locale;
	
	    _classCallCheck(this, Recora);
	
	    this.userConstants = {};
	
	    var tokenizer = (0, _tokenizer2.default)((0, _en2.default)({
	      userConstants: this.userConstants
	    }));
	    this.tokenizer = tokenizer;
	
	    var resolverContext = _math.defaultContext.setUnits(_units2.default);
	    this.resolverContext = resolverContext;
	    this.resolver = _math.resolver.setContext(resolverContext);
	
	    this.formatter = _mathFormatter2.default.setLocale(locale);
	  }
	
	  _createClass(Recora, [{
	    key: 'setCustomUnits',
	    value: function setCustomUnits(customUnits) {
	      var newUnits = (0, _fp.assign)(_units2.default, customUnits);
	      this.resolverContext = this.resolverContext.setUnits(newUnits);
	      this.resolver = this.resolver.setContext(this.resolverContext);
	    }
	  }, {
	    key: 'setConstants',
	    value: function setConstants(userConstants) {
	      this.userConstants = userConstants;
	      var tokenizer = (0, _tokenizer2.default)((0, _en2.default)({
	        userConstants: this.userConstants
	      }));
	      this.tokenizer = tokenizer;
	      return this;
	    }
	  }, {
	    key: 'setConstant',
	    value: function setConstant(identifier, value) {
	      return this.setConstants((0, _fp.set)(identifier, value, this.userConstants));
	    }
	  }, {
	    key: 'setDate',
	    value: function setDate(dateObject) {
	      this.resolverContext = this.resolverContext.setDate(dateObject);
	      this.resolver = this.resolver.setContext(this.resolverContext);
	    }
	  }, {
	    key: 'getResult',
	    value: function getResult(text) {
	      var tokenizer = this.tokenizer;
	      var resolver = this.resolver;
	
	
	      var tokenOptions = tokenizer(text);
	      var result = void 0;
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = tokenOptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var tokens = _step.value;
	
	          var ast = (0, _transformer2.default)(tokens);
	          result = ast ? resolver.resolve(ast) : null;
	          if (result) return { result: result, tokens: tokens };
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return null;
	    }
	  }, {
	    key: 'parse',
	    value: function parse(text) {
	      var value = this.getResult(text);
	      if (!value) return null;
	
	      var resolverContext = this.resolverContext;
	      var formatter = this.formatter;
	      var result = value.result;
	      var tokens = value.tokens;
	
	
	      return {
	        text: text,
	        value: result,
	        pretty: formatter.format(resolverContext, result),
	        tokens: cleanTokens(tokens)
	      };
	    }
	  }]);
	
	  return Recora;
	}();
	
	exports.default = Recora;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var TOKEN_ASSIGNMENT = exports.TOKEN_ASSIGNMENT = 'TOKEN_ASSIGNMENT';
	var TOKEN_BRACKET_CLOSE = exports.TOKEN_BRACKET_CLOSE = 'TOKEN_BRACKET_CLOSE';
	var TOKEN_BRACKET_OPEN = exports.TOKEN_BRACKET_OPEN = 'TOKEN_BRACKET_OPEN';
	var TOKEN_COLOR = exports.TOKEN_COLOR = 'TOKEN_COLOR';
	var TOKEN_COMMA = exports.TOKEN_COMMA = 'TOKEN_COMMA';
	var TOKEN_CONSTANT = exports.TOKEN_CONSTANT = 'TOKEN_CONSTANT';
	var TOKEN_DATE_TIME = exports.TOKEN_DATE_TIME = 'TOKEN_DATE_TIME';
	var TOKEN_FORMATTING_HINT = exports.TOKEN_FORMATTING_HINT = 'TOKEN_FORMATTING_HINT';
	var TOKEN_FUNCTION = exports.TOKEN_FUNCTION = 'TOKEN_FUNCTION';
	var TOKEN_NOOP = exports.TOKEN_NOOP = 'TOKEN_NOOP';
	var TOKEN_NUMBER = exports.TOKEN_NUMBER = 'TOKEN_NUMBER';
	var TOKEN_OPERATOR_ADD = exports.TOKEN_OPERATOR_ADD = 'TOKEN_OPERATOR_ADD';
	var TOKEN_OPERATOR_DIVIDE = exports.TOKEN_OPERATOR_DIVIDE = 'TOKEN_OPERATOR_DIVIDE';
	var TOKEN_OPERATOR_EXPONENT = exports.TOKEN_OPERATOR_EXPONENT = 'TOKEN_OPERATOR_EXPONENT';
	var TOKEN_OPERATOR_FACTORIAL = exports.TOKEN_OPERATOR_FACTORIAL = 'TOKEN_OPERATOR_FACTORIAL';
	var TOKEN_OPERATOR_MULTIPLY = exports.TOKEN_OPERATOR_MULTIPLY = 'TOKEN_OPERATOR_MULTIPLY';
	var TOKEN_OPERATOR_NEGATE = exports.TOKEN_OPERATOR_NEGATE = 'TOKEN_OPERATOR_NEGATE';
	var TOKEN_OPERATOR_SUBTRACT = exports.TOKEN_OPERATOR_SUBTRACT = 'TOKEN_OPERATOR_SUBTRACT';
	var TOKEN_PERCENTAGE = exports.TOKEN_PERCENTAGE = 'TOKEN_PERCENTAGE';
	var TOKEN_PSEUDO_UNIT = exports.TOKEN_PSEUDO_UNIT = 'TOKEN_PSEUDO_UNIT';
	var TOKEN_UNIT_NAME = exports.TOKEN_UNIT_NAME = 'TOKEN_UNIT_NAME';
	var TOKEN_UNIT_PREFIX = exports.TOKEN_UNIT_PREFIX = 'TOKEN_UNIT_PREFIX';
	var TOKEN_UNIT_SUFFIX = exports.TOKEN_UNIT_SUFFIX = 'TOKEN_UNIT_SUFFIX';

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _functions = __webpack_require__(4);
	
	var functions = _interopRequireWildcard(_functions);
	
	var _tokenizer = __webpack_require__(5);
	
	var _tokenizer2 = _interopRequireDefault(_tokenizer);
	
	var _tokenizerUtil = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var functionNames = (0, _fp.values)(functions);
	
	/* eslint-disable max-len */
	var createTokenizerWithLocale = function createTokenizerWithLocale(locale) {
	  return (0, _tokenizer2.default)((0, _tokenizerUtil.mergeTokenizerSpecs)(locale, {
	    operator: [{ match: '**', token: { type: _tokenTypes.TOKEN_OPERATOR_EXPONENT }, penalty: -1000 }, { match: '^', token: { type: _tokenTypes.TOKEN_OPERATOR_EXPONENT }, penalty: -1000 }, { match: /\*(?!\*)/, token: { type: _tokenTypes.TOKEN_OPERATOR_MULTIPLY }, penalty: -1000 }, { match: '/', token: { type: _tokenTypes.TOKEN_OPERATOR_DIVIDE }, penalty: -1000 }, { match: '+', token: { type: _tokenTypes.TOKEN_OPERATOR_ADD }, penalty: -1000 }, { match: '-', token: { type: _tokenTypes.TOKEN_OPERATOR_SUBTRACT }, penalty: -1000 }, { match: '-', token: { type: _tokenTypes.TOKEN_OPERATOR_NEGATE }, penalty: -500 }, { match: '!', token: { type: _tokenTypes.TOKEN_OPERATOR_FACTORIAL }, penalty: -500 }],
	    assignment: [
	    // Must override reassignment,
	    // Say if you do test = 5 and then test = 6
	    // we need to override the possibility of (test: constant) (=: noop) (6: number)
	    {
	      match: /(\w+)\s*=/,
	      token: function token(_token, _ref) {
	        var _ref2 = _slicedToArray(_ref, 2);
	
	        var identifier = _ref2[1];
	        return { type: _tokenTypes.TOKEN_ASSIGNMENT, value: identifier };
	      },
	      penalty: -10000
	    }],
	    percent: [{ match: '%', token: { type: _tokenTypes.TOKEN_PERCENTAGE }, penalty: -1000 }],
	    unit: [{ match: '/', token: { type: _tokenTypes.TOKEN_UNIT_PREFIX, value: -1 }, penalty: -1500 }],
	    virtualUnit: [{ match: /(rgb|hs[lv])a?/i, token: function token(_token2) {
	        return { type: _tokenTypes.TOKEN_PSEUDO_UNIT, value: _token2 };
	      }, penalty: -1500 }],
	    constant: [],
	    formattingHint: [],
	    color: [{ match: /#[0-9a-f]{3,8}/i, token: function token(_token3) {
	        return { type: _tokenTypes.TOKEN_COLOR, value: _token3 };
	      }, penalty: -1000 }],
	    date: [{
	      // ISO 8601 RegExp
	      // http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
	      // Remove the end question mark so we don't match every single number that's 4 digits
	      match: /([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)/,
	      token: function token(_token4) {
	        var date = new Date(_token4); // Spec says Date should parse ISO formats
	
	        var value = {
	          year: date.getFullYear(),
	          month: date.getMonth() + 1,
	          date: date.getDate(),
	          hour: date.getHours(),
	          minute: date.getMinutes(),
	          second: date.getSeconds(),
	          timezone: 'UTC'
	        };
	        return { type: _tokenTypes.TOKEN_DATE_TIME, value: { value: value, directionHint: 1 } };
	      },
	      penalty: -50000 }],
	    bracket: [{
	      match: '(',
	      token: function token(_token5, matches, state) {
	        return { type: _tokenTypes.TOKEN_BRACKET_OPEN, value: state.bracketLevel };
	      },
	      penalty: -1000,
	      updateState: function updateState(state) {
	        return { bracketLevel: state.bracketLevel + 1 };
	      }
	    }, {
	      match: ')',
	      token: function token(_token6, matches, state) {
	        return { type: _tokenTypes.TOKEN_BRACKET_CLOSE, value: state.bracketLevel - 1 };
	      },
	      penalty: -1000,
	      updateState: function updateState(state) {
	        return { bracketLevel: state.bracketLevel - 1 };
	      }
	    }, {
	      match: ',',
	      token: { type: _tokenTypes.TOKEN_COMMA },
	      penalty: -1000
	    }],
	    function: [{
	      match: new RegExp('(' + functionNames.join('|') + ')\\b', 'i'),
	      token: function token(_token7) {
	        return { type: _tokenTypes.TOKEN_FUNCTION, value: _token7 };
	      },
	      penalty: -1000
	    }],
	    noop: [{ match: /[a-z]+/i, token: { type: _tokenTypes.TOKEN_NOOP }, penalty: 10 }],
	    whitespace: [{ match: /\s+/, penalty: 0 }],
	    otherCharacter: [
	    // No numbers, letters, whitespace, operators (except - and !), or brackets
	    // the less this catches, the better the perf
	    { match: /[^\w\s*^/+%()]/, penalty: 1000 }],
	    default: [{ ref: 'operator' }, { ref: 'assignment' }, { ref: 'percent' }, { ref: 'number' }, { ref: 'unit' }, { ref: 'virtualUnit' }, { ref: 'constant' }, { ref: 'formattingHint' }, { ref: 'color' }, { ref: 'date' }, { ref: 'bracket' }, { ref: 'function' }, { ref: 'noop' }, { ref: 'whitespace' }, { ref: 'otherCharacter' }]
	  }), {
	    bracketLevel: 0
	  });
	};
	/* eslint-enable */
	
	exports.default = createTokenizerWithLocale;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	
	// Bilinear operators
	var FUNCTION_ADD = exports.FUNCTION_ADD = 'add';
	var FUNCTION_SUBTRACT = exports.FUNCTION_SUBTRACT = 'subtract';
	var FUNCTION_MULTIPLY = exports.FUNCTION_MULTIPLY = 'multiply';
	var FUNCTION_DIVIDE = exports.FUNCTION_DIVIDE = 'divide';
	var FUNCTION_EXPONENT = exports.FUNCTION_EXPONENT = 'exponent';
	
	// Entity functions
	var FUNCTION_SQRT = exports.FUNCTION_SQRT = 'sqrt';
	var FUNCTION_CBRT = exports.FUNCTION_CBRT = 'cbrt';
	var FUNCTION_NEGATE = exports.FUNCTION_NEGATE = 'negate';
	var FUNCTION_ROUND = exports.FUNCTION_ROUND = 'round';
	var FUNCTION_FLOOR = exports.FUNCTION_FLOOR = 'floor';
	var FUNCTION_CEIL = exports.FUNCTION_CEIL = 'ceil';
	var FUNCTION_ABS = exports.FUNCTION_ABS = 'abs';
	var FUNCTION_FROUND = exports.FUNCTION_FROUND = 'fround';
	var FUNCTION_TRUNC = exports.FUNCTION_TRUNC = 'trunc';
	var FUNCTION_SIGN = exports.FUNCTION_SIGN = 'sign';
	var FUNCTION_CLZ32 = exports.FUNCTION_CLZ32 = 'clz32';
	var FUNCTION_FACTORIAL = exports.FUNCTION_FACTORIAL = 'factorial';
	var FUNCTION_SIN = exports.FUNCTION_SIN = 'sin';
	var FUNCTION_COS = exports.FUNCTION_COS = 'cos';
	var FUNCTION_TAN = exports.FUNCTION_TAN = 'tan';
	var FUNCTION_LOG = exports.FUNCTION_LOG = 'log';
	var FUNCTION_LOG1P = exports.FUNCTION_LOG1P = 'log1p';
	var FUNCTION_LOG10 = exports.FUNCTION_LOG10 = 'log10';
	var FUNCTION_LOG2 = exports.FUNCTION_LOG2 = 'log2';
	var FUNCTION_ACOSH = exports.FUNCTION_ACOSH = 'acosh';
	var FUNCTION_ASINH = exports.FUNCTION_ASINH = 'asinh';
	var FUNCTION_ATANH = exports.FUNCTION_ATANH = 'atanh';
	var FUNCTION_COSH = exports.FUNCTION_COSH = 'cosh';
	var FUNCTION_SINH = exports.FUNCTION_SINH = 'sinh';
	var FUNCTION_TANH = exports.FUNCTION_TANH = 'tanh';
	var FUNCTION_SINC = exports.FUNCTION_SINC = 'sinc';
	var FUNCTION_SEC = exports.FUNCTION_SEC = 'sec';
	var FUNCTION_CSC = exports.FUNCTION_CSC = 'csc';
	var FUNCTION_COT = exports.FUNCTION_COT = 'cot';
	var FUNCTION_ASEC = exports.FUNCTION_ASEC = 'asec';
	var FUNCTION_ACSC = exports.FUNCTION_ACSC = 'acsc';
	var FUNCTION_ACOT = exports.FUNCTION_ACOT = 'acot';
	var FUNCTION_SECH = exports.FUNCTION_SECH = 'sech';
	var FUNCTION_CSCH = exports.FUNCTION_CSCH = 'csch';
	var FUNCTION_COTH = exports.FUNCTION_COTH = 'coth';
	var FUNCTION_ASECH = exports.FUNCTION_ASECH = 'asech';
	var FUNCTION_ACSCH = exports.FUNCTION_ACSCH = 'acsch';
	var FUNCTION_ACOTH = exports.FUNCTION_ACOTH = 'acoth';
	var FUNCTION_COSC = exports.FUNCTION_COSC = 'cosc';
	var FUNCTION_TANC = exports.FUNCTION_TANC = 'tanc';
	
	// Colour functions
	var FUNCTION_LIGHTEN = exports.FUNCTION_LIGHTEN = 'lighten';
	var FUNCTION_DARKEN = exports.FUNCTION_DARKEN = 'darken';
	var FUNCTION_MIX = exports.FUNCTION_MIX = 'mix';
	var FUNCTION_SCREEN = exports.FUNCTION_SCREEN = 'screen';
	var FUNCTION_OVERLAY = exports.FUNCTION_OVERLAY = 'overlay';
	var FUNCTION_DODGE = exports.FUNCTION_DODGE = 'dodge';
	var FUNCTION_BURN = exports.FUNCTION_BURN = 'burn';
	
	// Constructors
	var FUNCTION_RGB = exports.FUNCTION_RGB = 'rgb';
	var FUNCTION_RGBA = exports.FUNCTION_RGBA = 'rgba';
	var FUNCTION_HSL = exports.FUNCTION_HSL = 'hsl';
	var FUNCTION_HSLA = exports.FUNCTION_HSLA = 'hsla';
	var FUNCTION_HSV = exports.FUNCTION_HSV = 'hsv';
	var FUNCTION_HSVA = exports.FUNCTION_HSVA = 'hsva';

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _fp = __webpack_require__(1);
	
	var defaultTokenizerState = {
	  character: 0,
	  stack: ['default'],
	  penalty: 0,
	  remainingText: '',
	  tokens: [],
	  userState: {}
	};
	
	var setTokenArrayStartEndValues = function setTokenArrayStartEndValues(start, defaultTokenIndexes, matchedText, matches, token) {
	  var tokenIndexes = defaultTokenIndexes || (0, _fp.range)(1, matches.length);
	
	  var _reduce = (0, _fp.reduce)(function (accum, index) {
	    accum.tokenMatches.push({
	      token: accum.remainingTokens.shift(),
	      match: (0, _fp.includes)(index + 1, tokenIndexes) ? accum.remainingMatches.shift() : null
	    });
	    return accum;
	  }, {
	    tokenMatches: [],
	    remainingTokens: token.slice(),
	    remainingMatches: matches.length > 1 ? (0, _fp.drop)(1, matches) : [matchedText]
	  }, (0, _fp.range)(0, token.length));
	
	  var tokenMatches = _reduce.tokenMatches;
	
	  var _reduce2 = (0, _fp.reduce)(function (accum, _ref) {
	    var match = _ref.match;
	    var token = _ref.token;
	
	    var index = -1;
	
	    if (match !== null) index = matchedText.indexOf(match, accum.index);
	    if (index === -1) index = accum.index;
	
	    var tokenStart = start + index;
	    var tokenEnd = tokenStart + (match !== null ? match.length : 0);
	
	    if (token) accum.tokens.push(_extends({}, token, { start: tokenStart, end: tokenEnd }));
	    accum.index = index; // eslint-disable-line
	
	    return accum;
	  }, {
	    index: 0,
	    tokens: []
	  }, tokenMatches);
	
	  var mappedTokens = _reduce2.tokens;
	
	
	  return mappedTokens;
	};
	
	exports.default = function (inputSpec) {
	  var _marked = [tokenizer].map(regeneratorRuntime.mark);
	
	  var defaultUserState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	  var flattenRefs = (0, _fp.flatMap)(function (option) {
	    return !option.ref ? option : (0, _fp.flow)(flattenRefs, (0, _fp.map)((0, _fp.assign)(_fp.__, option)))(inputSpec[option.ref]);
	  });
	  var spec = (0, _fp.mapValues)(flattenRefs, inputSpec);
	
	  function tokenizer(state) {
	    var remainingText, options, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, option, matchSpec, matches, regexMatch, matchedText, token, start, end, tokens, mappedTokens, stack, userState;
	
	    return regeneratorRuntime.wrap(function tokenizer$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            remainingText = state.remainingText;
	
	            if (!(remainingText.length === 0)) {
	              _context.next = 5;
	              break;
	            }
	
	            _context.next = 4;
	            return { tokens: state.tokens, penalty: state.penalty };
	
	          case 4:
	            return _context.abrupt('return');
	
	          case 5:
	            options = (0, _fp.get)((0, _fp.last)(state.stack), spec);
	
	            /* eslint-disable no-continue */
	
	            _iteratorNormalCompletion = true;
	            _didIteratorError = false;
	            _iteratorError = undefined;
	            _context.prev = 9;
	            _iterator = options[Symbol.iterator]();
	
	          case 11:
	            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
	              _context.next = 36;
	              break;
	            }
	
	            option = _step.value;
	            matchSpec = option.match;
	            matches = null;
	
	
	            if (typeof matchSpec === 'string') {
	              matches = (0, _fp.startsWith)(matchSpec, remainingText) ? [matchSpec] : null;
	            } else if (matchSpec instanceof RegExp) {
	              regexMatch = remainingText.search(matchSpec) === 0 && remainingText.match(matchSpec);
	
	              matches = regexMatch || null;
	            }
	
	            if (matches) {
	              _context.next = 18;
	              break;
	            }
	
	            return _context.abrupt('continue', 33);
	
	          case 18:
	            matchedText = matches[0];
	            token = typeof option.token === 'function' ? option.token(matchedText, matches, state.userState) : option.token;
	
	            /*
	            FIXME:
	            Currently the behaviour is if the token is null, don't advance the parser
	            If it's undefined, do advance the parser, but don't log the token
	            Otherwise log the token and advance the parser
	            We need all three of these cases, but it needs to be more explicit
	            */
	
	            if (!(token === null)) {
	              _context.next = 22;
	              break;
	            }
	
	            return _context.abrupt('continue', 33);
	
	          case 22:
	            start = state.character;
	            end = state.character + matchedText.length;
	            tokens = void 0;
	
	
	            if (!token) {
	              tokens = state.tokens;
	            } else if (Array.isArray(token)) {
	              mappedTokens = setTokenArrayStartEndValues(start, option.tokenIndexes, matchedText, matches, token);
	
	              tokens = state.tokens.concat(mappedTokens);
	            } else {
	              tokens = state.tokens.concat(_extends({}, token, { start: start, end: end }));
	            }
	
	            stack = state.stack;
	            userState = state.userState;
	
	
	            if (typeof option.pop === 'boolean') stack = stack.slice(0, -1);
	            if (typeof option.pop === 'number') stack = stack.slice(0, -option.pop);
	            if (option.push) stack = stack.concat(option.push);
	
	            if (typeof option.updateState === 'function') {
	              userState = _extends({}, userState, option.updateState(userState));
	            }
	
	            return _context.delegateYield(tokenizer({
	              penalty: state.penalty + option.penalty,
	              remainingText: remainingText.substring(matchedText.length),
	              character: end,
	              stack: stack,
	              tokens: tokens,
	              userState: userState
	            }), 't0', 33);
	
	          case 33:
	            _iteratorNormalCompletion = true;
	            _context.next = 11;
	            break;
	
	          case 36:
	            _context.next = 42;
	            break;
	
	          case 38:
	            _context.prev = 38;
	            _context.t1 = _context['catch'](9);
	            _didIteratorError = true;
	            _iteratorError = _context.t1;
	
	          case 42:
	            _context.prev = 42;
	            _context.prev = 43;
	
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	
	          case 45:
	            _context.prev = 45;
	
	            if (!_didIteratorError) {
	              _context.next = 48;
	              break;
	            }
	
	            throw _iteratorError;
	
	          case 48:
	            return _context.finish(45);
	
	          case 49:
	            return _context.finish(42);
	
	          case 50:
	          case 'end':
	            return _context.stop();
	        }
	      }
	    }, _marked[0], this, [[9, 38, 42, 50], [43,, 45, 49]]);
	  }
	  /* eslint-enable */
	
	  return function (text) {
	    var initialUserState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    var results = [];
	    var userState = _extends({}, defaultUserState, initialUserState);
	    var _iteratorNormalCompletion2 = true;
	    var _didIteratorError2 = false;
	    var _iteratorError2 = undefined;
	
	    try {
	      for (var _iterator2 = tokenizer(_extends({}, defaultTokenizerState, { userState: userState, remainingText: text }))[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	        var result = _step2.value;
	
	        results.push(result);
	      }
	    } catch (err) {
	      _didIteratorError2 = true;
	      _iteratorError2 = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion2 && _iterator2.return) {
	          _iterator2.return();
	        }
	      } finally {
	        if (_didIteratorError2) {
	          throw _iteratorError2;
	        }
	      }
	    }
	
	    results = (0, _fp.flow)((0, _fp.sortBy)('penalty'), (0, _fp.map)('tokens'))(results);
	    return results;
	  };
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.wordRegexpMatcher = exports.multipleWordsMatcher = exports.customWordMatcher = exports.mergeTokenizerSpecs = undefined;
	
	var _fp = __webpack_require__(1);
	
	var wordRegexpCreator = (0, _fp.flow)((0, _fp.range)(0), (0, _fp.map)(function () {
	  return '[a-z]+';
	}), (0, _fp.join)('\\s+'), function (str) {
	  return new RegExp(str, 'i');
	});
	
	
	var concatCompact = (0, _fp.flow)(_fp.concat, _fp.compact);
	var mergeTokenizerSpecs = exports.mergeTokenizerSpecs = (0, _fp.assignWith)(concatCompact);
	
	var customWordMatcher = exports.customWordMatcher = function customWordMatcher(_ref) {
	  var dictionary = _ref.dictionary;
	  var penalty = _ref.penalty;
	  var match = _ref.match;
	  var matchIndex = _ref.matchIndex;
	  var transform = _ref.transform;
	  return {
	    token: function token(_token, tokens) {
	      var match = tokens[matchIndex].toLowerCase();
	      return (0, _fp.has)(match, dictionary) ? transform(dictionary[match], tokens) : null;
	    },
	    match: match,
	    penalty: penalty
	  };
	};
	
	var multipleWordsMatcher = exports.multipleWordsMatcher = function multipleWordsMatcher(_ref2) {
	  var type = _ref2.type;
	  var words = _ref2.words;
	  var dictionary = _ref2.dictionary;
	  var penalty = _ref2.penalty;
	  return customWordMatcher({
	    dictionary: dictionary,
	    penalty: penalty,
	    match: wordRegexpCreator(words),
	    matchIndex: 0,
	    transform: function transform(value) {
	      return { type: type, value: value };
	    }
	  });
	};
	
	var wordRegexpMatcher = exports.wordRegexpMatcher = function wordRegexpMatcher(_ref3) {
	  var type = _ref3.type;
	  var dictionary = _ref3.dictionary;
	  var penalty = _ref3.penalty;
	  var match = _ref3.match;
	  var _ref3$matchIndex = _ref3.matchIndex;
	  var matchIndex = _ref3$matchIndex === undefined ? 0 : _ref3$matchIndex;
	  return customWordMatcher({
	    dictionary: dictionary,
	    penalty: penalty,
	    match: match,
	    matchIndex: matchIndex,
	    transform: function transform(value) {
	      return { type: type, value: value };
	    }
	  });
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _constants = __webpack_require__(8);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _unit = __webpack_require__(10);
	
	var _unit2 = _interopRequireDefault(_unit);
	
	var _date = __webpack_require__(15);
	
	var _date2 = _interopRequireDefault(_date);
	
	var _tokenizerUtil = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var numberReString = '\\d(?:,\\d|\\d)*(?:\\.\\d+)?';
	var toNumber = function toNumber(value) {
	  return Number(value.replace(/,/g, '') || 0);
	};
	
	var baseEnLocale = {
	  number: [{
	    // Don't match commas when you write `add(1, 1)`
	    match: new RegExp(numberReString),
	    token: function token(_token) {
	      return { type: _tokenTypes.TOKEN_NUMBER, value: toNumber(_token) };
	    },
	    penalty: -1000
	  }],
	  percent: [{ match: /\bper\s*cent/i, token: { type: _tokenTypes.TOKEN_PERCENTAGE }, penalty: -1000 }],
	  formattingHint: [{
	    match: /\bbase\s+(\d+)\b/i,
	    token: function token(_token2, tokens) {
	      return {
	        type: _tokenTypes.TOKEN_FORMATTING_HINT,
	        value: {
	          key: 'base',
	          value: Number(tokens[1])
	        }
	      };
	    },
	    penalty: -2000
	  }, {
	    match: /\boct(?:al)?\b/i,
	    token: { type: _tokenTypes.TOKEN_FORMATTING_HINT, value: { key: 'base', value: 8 } },
	    penalty: -2000
	  }, {
	    match: /\bbin(?:ary)?\b/i,
	    token: { type: _tokenTypes.TOKEN_FORMATTING_HINT, value: { key: 'base', value: 2 } },
	    penalty: -2000
	  }, {
	    match: /\bhex(?:adecimal)?\b/i,
	    token: { type: _tokenTypes.TOKEN_FORMATTING_HINT, value: { key: 'base', value: 16 } },
	    penalty: -2000
	  }],
	  unit: _unit2.default,
	  date: _date2.default
	};
	
	/* eslint-disable max-len */
	var createEnLocale = function createEnLocale(_ref) {
	  var userConstants = _ref.userConstants;
	  return (0, _tokenizerUtil.mergeTokenizerSpecs)(baseEnLocale, {
	    constant: [{
	      match: new RegExp('(' + (0, _fp.concat)((0, _fp.keys)(_constants2.default), (0, _fp.keys)(userConstants)).join('|') + ')(\\^' + numberReString + '|)\\b', 'i'),
	      token: function token(_token3, _ref2) {
	        var _ref3 = _slicedToArray(_ref2, 3);
	
	        var name = _ref3[1];
	        var power = _ref3[2];
	        return {
	          type: _tokenTypes.TOKEN_CONSTANT,
	          value: {
	            value: name in userConstants ? userConstants[name] : _constants2.default[name],
	            power: power ? toNumber(power.substring(1)) : 1
	          }
	        };
	      },
	      penalty: -5000
	    }]
	  });
	};
	/* eslint-enable */
	
	exports.default = createEnLocale;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _types = __webpack_require__(9);
	
	exports.default = {
	  pi: _extends({}, _types.baseEntity, { quantity: Math.PI }),
	  tau: _extends({}, _types.baseEntity, { quantity: 2 * Math.PI }),
	  e: _extends({}, _types.baseEntity, { quantity: Math.E }),
	  phi: _extends({}, _types.baseEntity, { quantity: (1 + Math.sqrt(5)) / 2 })
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var zeroTime = exports.zeroTime = {
	  year: null,
	  month: null,
	  date: null,
	  hour: null,
	  minute: null,
	  second: null,
	  timezone: 'UTC'
	};
	
	// NOTE: We're using the timezone library, so months are 1-based (sane)
	
	/* eslint-disable max-len */
	var NODE_BRACKETS = exports.NODE_BRACKETS = 'NODE_BRACKETS';
	var baseBrackets = exports.baseBrackets = { type: NODE_BRACKETS, value: null };
	
	var NODE_ARRAY_GROUP = exports.NODE_ARRAY_GROUP = 'NODE_ARRAY_GROUP';
	var baseArrayGroup = exports.baseArrayGroup = { type: NODE_ARRAY_GROUP, value: [] };
	
	var NODE_FUNCTION = exports.NODE_FUNCTION = 'NODE_FUNCTION';
	var baseFunction = exports.baseFunction = { type: NODE_FUNCTION, name: '', args: [] };
	
	var NODE_ASSIGNMENT = exports.NODE_ASSIGNMENT = 'NODE_ASSIGNMENT';
	var baseAssignment = exports.baseAssignment = { type: NODE_ASSIGNMENT, identifier: '', value: null };
	
	var NODE_MISC_GROUP = exports.NODE_MISC_GROUP = 'NODE_MISC_GROUP';
	var baseMiscGroup = exports.baseMiscGroup = { type: NODE_MISC_GROUP, value: [] };
	
	var NODE_CONVERSION = exports.NODE_CONVERSION = 'NODE_CONVERSION';
	var baseConversion = exports.baseConversion = { type: NODE_CONVERSION, value: null, entityConversion: [], pseudoConversion: null, formatting: {} };
	
	var NODE_ENTITY = exports.NODE_ENTITY = 'NODE_ENTITY';
	var baseEntity = exports.baseEntity = { type: NODE_ENTITY, quantity: NaN, units: {}, formatting: {} };
	
	var NODE_COMPOSITE_ENTITY = exports.NODE_COMPOSITE_ENTITY = 'NODE_COMPOSITE_ENTITY';
	var baseCompositeEntity = exports.baseCompositeEntity = { type: 'NODE_COMPOSITE_ENTITY', value: [] };
	
	var NODE_PERCENTAGE = exports.NODE_PERCENTAGE = 'NODE_PERCENTAGE';
	var basePercentage = exports.basePercentage = { type: 'NODE_PERCENTAGE', value: NaN };
	
	var NODE_COLOR = exports.NODE_COLOR = 'NODE_COLOR';
	var baseColor = exports.baseColor = { type: NODE_COLOR, space: 'rgb', values: [0, 0, 0], alpha: 1, formatting: {} };
	
	// directionHint is used for miscGroup to work out whether to add or subtract an entity
	var NODE_DATE_TIME = exports.NODE_DATE_TIME = 'NODE_DATE_TIME';
	var baseDateTime = exports.baseDateTime = { type: NODE_DATE_TIME, value: zeroTime, directionHint: 1 };

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _tokenTypes = __webpack_require__(2);
	
	var _wordUnits = __webpack_require__(11);
	
	var _wordUnits2 = _interopRequireDefault(_wordUnits);
	
	var _wordUnits3 = __webpack_require__(12);
	
	var _wordUnits4 = _interopRequireDefault(_wordUnits3);
	
	var _wordUnits5 = __webpack_require__(13);
	
	var _wordUnits6 = _interopRequireDefault(_wordUnits5);
	
	var _abbreviations = __webpack_require__(14);
	
	var _abbreviations2 = _interopRequireDefault(_abbreviations);
	
	var _tokenizerUtil = __webpack_require__(6);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var unitPrefixes = {
	  per: -1,
	  square: 2,
	  cubic: 3
	};
	var unitSuffixes = {
	  squared: 2,
	  cubed: 3
	};
	
	var wordWithPowerMatcherBase = {
	  match: /([a-z]+)(\^-?\d+(?:\.\d+)?)/i,
	  matchIndex: 1,
	  transform: function transform(value, tokens) {
	    return [{ type: _tokenTypes.TOKEN_UNIT_NAME, value: value }, { type: _tokenTypes.TOKEN_UNIT_SUFFIX, value: Number(tokens[2].substring(1)) }];
	  }
	};
	
	/* eslint-disable max-len */
	var unitSpecEntry = [(0, _tokenizerUtil.multipleWordsMatcher)({ words: 3, type: _tokenTypes.TOKEN_UNIT_NAME, dictionary: _wordUnits6.default, penalty: -600 }), (0, _tokenizerUtil.multipleWordsMatcher)({ words: 2, type: _tokenTypes.TOKEN_UNIT_NAME, dictionary: _wordUnits4.default, penalty: -500 }), (0, _tokenizerUtil.multipleWordsMatcher)({ words: 1, type: _tokenTypes.TOKEN_UNIT_NAME, dictionary: _wordUnits2.default, penalty: -400 }), (0, _tokenizerUtil.multipleWordsMatcher)({ words: 1, type: _tokenTypes.TOKEN_UNIT_PREFIX, dictionary: unitPrefixes, penalty: -300 }), (0, _tokenizerUtil.multipleWordsMatcher)({ words: 1, type: _tokenTypes.TOKEN_UNIT_SUFFIX, dictionary: unitSuffixes, penalty: -300 }), (0, _tokenizerUtil.wordRegexpMatcher)({
	  type: _tokenTypes.TOKEN_UNIT_NAME,
	  dictionary: _abbreviations2.default,
	  match: /([a-z]+|[£$€]|)/i,
	  matchIndex: 1,
	  penalty: -200
	}), (0, _tokenizerUtil.customWordMatcher)(_extends({}, wordWithPowerMatcherBase, {
	  dictionary: _wordUnits2.default,
	  penalty: -5000
	})), (0, _tokenizerUtil.customWordMatcher)(_extends({}, wordWithPowerMatcherBase, {
	  dictionary: _abbreviations2.default,
	  penalty: -3000
	}))];
	/* eslint-enable */
	
	exports.default = unitSpecEntry;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = {
		"second": "second",
		"seconds": "second",
		"minute": "minute",
		"minutes": "minute",
		"hour": "hour",
		"hours": "hour",
		"day": "day",
		"days": "day",
		"weekday": "weekday",
		"weekdays": "weekday",
		"week": "week",
		"weeks": "week",
		"fortnight": "fortnight",
		"fortnights": "fortnight",
		"month": "month",
		"months": "month",
		"year": "year",
		"years": "year",
		"decade": "decade",
		"decades": "decade",
		"century": "century",
		"centuries": "century",
		"meter": "meter",
		"metre": "meter",
		"meters": "meter",
		"metres": "meter",
		"inch": "inch",
		"inches": "inch",
		"foot": "foot",
		"feet": "foot",
		"yard": "yard",
		"yards": "yard",
		"mile": "mile",
		"miles": "mile",
		"league": "league",
		"leagues": "league",
		"fathom": "fathom",
		"fathoms": "fathom",
		"furlong": "furlong",
		"furlongs": "furlong",
		"parsec": "parsec",
		"parsecs": "parsec",
		"angstrom": "angstrom",
		"angstroms": "angstrom",
		"gram": "gram",
		"grams": "gram",
		"tonne": "tonne",
		"tonnes": "tonne",
		"ounce": "ounce",
		"ounces": "ounce",
		"pound": "pound",
		"pounds": "pound",
		"stone": "stone",
		"stones": "stone",
		"acre": "acre",
		"acres": "acre",
		"hectare": "hectare",
		"hectares": "hectare",
		"liter": "liter",
		"litre": "liter",
		"liters": "liter",
		"litres": "liter",
		"gallon": "gallon",
		"gallons": "gallon",
		"quart": "quart",
		"quarts": "quart",
		"cup": "cup",
		"cups": "cup",
		"teaspoon": "teaspoon",
		"teaspoons": "teaspoon",
		"tablespoon": "tablespoon",
		"tablespoons": "tablespoon",
		"drop": "drop",
		"drops": "drop",
		"joule": "Joule",
		"joules": "Joule",
		"calorie": "Calorie",
		"calories": "Calorie",
		"btu": "BTU",
		"therm": "therm",
		"therms": "therm",
		"watt": "Watt",
		"watts": "Watt",
		"bit": "bit",
		"bits": "bit",
		"byte": "byte",
		"bytes": "byte",
		"aud": "AUD",
		"bgn": "BGN",
		"lev": "BGN",
		"levs": "BGN",
		"brl": "BRL",
		"cad": "CAD",
		"chf": "CHF",
		"cny": "CNY",
		"yuan": "CNY",
		"yuans": "CNY",
		"czk": "CZK",
		"koruna": "CZK",
		"korunas": "CZK",
		"dkk": "DKK",
		"eur": "EUR",
		"euro": "EUR",
		"euros": "EUR",
		"gbp": "GBP",
		"quid": "GBP",
		"sterling": "GBP",
		"quids": "GBP",
		"sterlings": "GBP",
		"hkd": "HKD",
		"hrk": "HRK",
		"kuna": "HRK",
		"kunas": "HRK",
		"huf": "HUF",
		"forint": "HUF",
		"forints": "HUF",
		"idr": "IDR",
		"rupiah": "IDR",
		"rupiahs": "IDR",
		"ils": "ILS",
		"shekel": "ILS",
		"sheqel": "ILS",
		"shekels": "ILS",
		"sheqels": "ILS",
		"inr": "INR",
		"rupee": "INR",
		"rupees": "INR",
		"jpy": "JPY",
		"yen": "JPY",
		"yens": "JPY",
		"krw": "KRW",
		"won": "KRW",
		"wons": "KRW",
		"mxn": "MXN",
		"myr": "MYR",
		"ringgit": "MYR",
		"ringgits": "MYR",
		"nok": "NOK",
		"nzd": "NZD",
		"php": "PHP",
		"pln": "PLN",
		"zloty": "PLN",
		"zloties": "PLN",
		"ron": "RON",
		"leu": "RON",
		"leus": "RON",
		"rub": "RUB",
		"ruble": "RUB",
		"rubles": "RUB",
		"sek": "SEK",
		"sgd": "SGD",
		"thb": "THB",
		"baht": "THB",
		"bahts": "THB",
		"try": "TRY",
		"lira": "TRY",
		"liras": "TRY",
		"usd": "USD",
		"dollar": "USD",
		"dollars": "USD",
		"zar": "ZAR",
		"rand": "ZAR",
		"rands": "ZAR",
		"femtosecond": "femtosecond",
		"femtoseconds": "femtosecond",
		"picosecond": "picosecond",
		"picoseconds": "picosecond",
		"nanosecond": "nanosecond",
		"nanoseconds": "nanosecond",
		"microsecond": "microsecond",
		"microseconds": "microsecond",
		"millisecond": "millisecond",
		"milliseconds": "millisecond",
		"femtometer": "femtometer",
		"femtometre": "femtometer",
		"fermi": "femtometer",
		"femtometers": "femtometer",
		"femtometres": "femtometer",
		"fermis": "femtometer",
		"picometer": "picometer",
		"picometre": "picometer",
		"picometers": "picometer",
		"picometres": "picometer",
		"nanometer": "nanometer",
		"nanometre": "nanometer",
		"nanometers": "nanometer",
		"nanometres": "nanometer",
		"micrometer": "micrometer",
		"micrometre": "micrometer",
		"micrometers": "micrometer",
		"micrometres": "micrometer",
		"millimeter": "millimeter",
		"millimetre": "millimeter",
		"millimeters": "millimeter",
		"millimetres": "millimeter",
		"centimeter": "centimeter",
		"centimetre": "centimeter",
		"centimeters": "centimeter",
		"centimetres": "centimeter",
		"kilometer": "kilometer",
		"kilometre": "kilometer",
		"kilometers": "kilometer",
		"kilometres": "kilometer",
		"megameter": "megameter",
		"megametre": "megameter",
		"megameters": "megameter",
		"megametres": "megameter",
		"gigameter": "gigameter",
		"gigametre": "gigameter",
		"gigameters": "gigameter",
		"gigametres": "gigameter",
		"terameter": "terameter",
		"terametre": "terameter",
		"terameters": "terameter",
		"terametres": "terameter",
		"petameter": "petameter",
		"petametre": "petameter",
		"petameters": "petameter",
		"petametres": "petameter",
		"femtogram": "femtogram",
		"femtograms": "femtogram",
		"picogram": "picogram",
		"picograms": "picogram",
		"nanogram": "nanogram",
		"nanograms": "nanogram",
		"microgram": "microgram",
		"micrograms": "microgram",
		"milligram": "milligram",
		"milligrams": "milligram",
		"kilogram": "kilogram",
		"kilograms": "kilogram",
		"megagram": "megagram",
		"megagrams": "megagram",
		"gigagram": "gigagram",
		"gigagrams": "gigagram",
		"teragram": "teragram",
		"teragrams": "teragram",
		"petagram": "petagram",
		"petagrams": "petagram",
		"milliliter": "milliliter",
		"millilitre": "milliliter",
		"milliliters": "milliliter",
		"millilitres": "milliliter",
		"centiliter": "centiliter",
		"centilitre": "centiliter",
		"centiliters": "centiliter",
		"centilitres": "centiliter",
		"femtojoule": "femtojoule",
		"femtojoules": "femtojoule",
		"picojoule": "picojoule",
		"picojoules": "picojoule",
		"nanojoule": "nanojoule",
		"nanojoules": "nanojoule",
		"microjoule": "microjoule",
		"microjoules": "microjoule",
		"millijoule": "millijoule",
		"millijoules": "millijoule",
		"centijoule": "centijoule",
		"centijoules": "centijoule",
		"kilojoule": "kilojoule",
		"kilojoules": "kilojoule",
		"megajoule": "megajoule",
		"megajoules": "megajoule",
		"gigajoule": "gigajoule",
		"gigajoules": "gigajoule",
		"terajoule": "terajoule",
		"terajoules": "terajoule",
		"petajoule": "petajoule",
		"petajoules": "petajoule",
		"femtowatt": "femtowatt",
		"femtowatts": "femtowatt",
		"picowatt": "picowatt",
		"picowatts": "picowatt",
		"nanowatt": "nanowatt",
		"nanowatts": "nanowatt",
		"microwatt": "microwatt",
		"microwatts": "microwatt",
		"milliwatt": "milliwatt",
		"milliwatts": "milliwatt",
		"kilowatt": "kilowatt",
		"kilowatts": "kilowatt",
		"megawatt": "megawatt",
		"megawatts": "megawatt",
		"gigawatt": "gigawatt",
		"gigawatts": "gigawatt",
		"terawatt": "terawatt",
		"terawatts": "terawatt",
		"petawatt": "petawatt",
		"petawatts": "petawatt",
		"kilobit": "kilobit",
		"kilobits": "kilobit",
		"megabit": "megabit",
		"megabits": "megabit",
		"gigabit": "gigabit",
		"gigabits": "gigabit",
		"terabit": "terabit",
		"terabits": "terabit",
		"petabit": "petabit",
		"petabits": "petabit",
		"kibibit": "kibibit",
		"kibibits": "kibibit",
		"mebibit": "mebibit",
		"mebibits": "mebibit",
		"gibibit": "gibibit",
		"gibibits": "gibibit",
		"tebibit": "tebibit",
		"tebibits": "tebibit",
		"pebibit": "pebibit",
		"pebibits": "pebibit",
		"kilobyte": "kilobyte",
		"kilobytes": "kilobyte",
		"megabyte": "megabyte",
		"megabytes": "megabyte",
		"gigabyte": "gigabyte",
		"gigabytes": "gigabyte",
		"terabyte": "terabyte",
		"terabytes": "terabyte",
		"petabyte": "petabyte",
		"petabytes": "petabyte",
		"kibibyte": "kibibyte",
		"kibibytes": "kibibyte",
		"mebibyte": "mebibyte",
		"mebibytes": "mebibyte",
		"gibibyte": "gibibyte",
		"gibibytes": "gibibyte",
		"tebibyte": "tebibyte",
		"tebibytes": "tebibyte",
		"pebibyte": "pebibyte",
		"pebibytes": "pebibyte",
		"degree": "degree",
		"degrees": "degree",
		"radian": "radian",
		"radians": "radian",
		"arcminute": "arcminute",
		"arcminutes": "arcminute",
		"arcsecond": "arcsecond",
		"arcseconds": "arcsecond",
		"kelvin": "Kelvin",
		"kelvins": "Kelvin",
		"celsius": "Celsius",
		"centigrade": "Celsius",
		"celsiuses": "Celsius",
		"centigrades": "Celsius",
		"fahrenheit": "Fahrenheit",
		"fahrenheits": "Fahrenheit"
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = {
		"light year": "light year",
		"light years": "light year",
		"nautical mile": "nautical mile",
		"nautical miles": "nautical mile",
		"us gallon": "us gallon",
		"us gallons": "us gallon",
		"us cup": "US cup",
		"us cups": "US cup",
		"fluid ounce": "fluid ounce",
		"fluid ounces": "fluid ounce",
		"electron volt": "electron volt",
		"electron volts": "electron volt",
		"degrees kelvin": "Kelvin",
		"degrees kelvins": "Kelvin",
		"degrees celsius": "Celsius",
		"degrees celsiuses": "Celsius",
		"degrees fahrenheit": "Fahrenheit",
		"degrees fahrenheits": "Fahrenheit",
		"degrees rankine": "degrees Rankine",
		"degrees rankines": "degrees Rankine",
		"aus dollar": "AUD",
		"australian dollar": "AUD",
		"aus dollars": "AUD",
		"australian dollars": "AUD",
		"bulgarian lev": "BGN",
		"bulgarian levs": "BGN",
		"brazilian real": "BRL",
		"brazilian reals": "BRL",
		"canadian dollar": "CAD",
		"canadian dollars": "CAD",
		"swiss franc": "CHF",
		"swiss francs": "CHF",
		"chinese yuan": "CNY",
		"chinese yuans": "CNY",
		"czech koruna": "CZK",
		"czech korunas": "CZK",
		"danish krone": "DKK",
		"danish krones": "DKK",
		"british pound": "GBP",
		"pound sterling": "GBP",
		"pounds sterling": "GBP",
		"british pounds": "GBP",
		"pound sterlings": "GBP",
		"pounds sterlings": "GBP",
		"croatian kuna": "HRK",
		"croatian kunas": "HRK",
		"hungarian forint": "HUF",
		"hungarian forints": "HUF",
		"undonesian rupiah": "IDR",
		"undonesian rupiahs": "IDR",
		"israeli shekel": "ILS",
		"israeli sheqel": "ILS",
		"israeli shekels": "ILS",
		"israeli sheqels": "ILS",
		"indian rupee": "INR",
		"indian rupees": "INR",
		"japanese yen": "JPY",
		"japanese yens": "JPY",
		"korean won": "KRW",
		"korean wons": "KRW",
		"mexican peso": "MXN",
		"mexican pesos": "MXN",
		"malaysian ringgit": "MYR",
		"malaysian ringgits": "MYR",
		"philippine peso": "PHP",
		"philippine pesos": "PHP",
		"polish zloty": "PLN",
		"polish zloties": "PLN",
		"romanian leu": "RON",
		"romanian leus": "RON",
		"russian ruble": "RUB",
		"russian rubles": "RUB",
		"swedish krona": "SEK",
		"swedish kronas": "SEK",
		"singapore dollar": "SGD",
		"singapore dollars": "SGD",
		"thai baht": "THB",
		"thai bahts": "THB",
		"turkish lira": "TRY",
		"turkish liras": "TRY",
		"us dollar": "USD",
		"american dollar": "USD",
		"us dollars": "USD",
		"american dollars": "USD",
		"african rand": "ZAR",
		"african rands": "ZAR",
		"degree kelvin": "Kelvin",
		"degree kelvins": "Kelvin",
		"degree celsius": "Celsius",
		"degree centigrade": "Celsius",
		"degrees centigrade": "Celsius",
		"degree celsiuses": "Celsius",
		"degree centigrades": "Celsius",
		"degrees centigrades": "Celsius",
		"gas mark": "gas mark",
		"gas marks": "gas mark",
		"degree fahrenheit": "Fahrenheit",
		"degree fahrenheits": "Fahrenheit"
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = {
		"hong kong dollar": "HKD",
		"hong kong dollars": "HKD",
		"israeli new shekel": "ILS",
		"israeli new sheqel": "ILS",
		"israeli new shekels": "ILS",
		"israeli new sheqels": "ILS",
		"new zealand dollar": "NZD",
		"new zealand dollars": "NZD",
		"south african rand": "ZAR",
		"south african rands": "ZAR"
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
		"ms": "millisecond",
		"s": "second",
		"sec": "second",
		"secs": "second",
		"min": "minute",
		"mins": "minute",
		"h": "hour",
		"hr": "hour",
		"hs": "hour",
		"hrs": "hour",
		"d": "day",
		"dy": "day",
		"ds": "day",
		"dies": "day",
		"wk": "week",
		"wks": "week",
		"yr": "year",
		"yrs": "year",
		"mg": "milligram",
		"mgs": "milligram",
		"g": "gram",
		"gs": "gram",
		"kg": "kilogram",
		"kilo": "kilogram",
		"kgs": "kilogram",
		"kilos": "kilogram",
		"oz": "ounce",
		"ozs": "ounce",
		"lb": "pound",
		"lbs": "pound",
		"m": "meter",
		"mm": "millimeter",
		"mms": "millimeter",
		"cm": "centimeter",
		"cms": "centimeter",
		"km": "kilometer",
		"kms": "kilometer",
		"l": "liter",
		"ls": "liter",
		"ml": "milliliter",
		"mls": "milliliter",
		"tsp": "teaspoon",
		"tsps": "teaspoon",
		"tbsp": "tablespoon",
		"tbsps": "tablespoon",
		"floz": "fluid ounce",
		"flozs": "fluid ounce",
		"€": "EUR",
		"£": "GBP",
		"$": "USD",
		"kb": "kilobyte",
		"kbs": "kilobyte",
		"mb": "megabyte",
		"mbs": "megabyte",
		"gb": "gigabyte",
		"gbs": "gigabyte",
		"tb": "terabyte",
		"tbs": "terabyte",
		"pb": "petabyte",
		"pbs": "petabyte",
		"kib": "kibibyte",
		"kibs": "kibibyte",
		"mib": "mebibyte",
		"mibs": "mebibyte",
		"gib": "gibibyte",
		"gibs": "gibibyte",
		"tib": "tebibyte",
		"tibs": "tebibyte",
		"pib": "pebibyte",
		"pibs": "pebibyte",
		"j": "Joule",
		"js": "Joule",
		"cal": "Calorie",
		"cals": "Calorie",
		"ev": "electron volt",
		"evs": "electron volt",
		"deg": "degree",
		"degs": "degree",
		"rad": "radian",
		"rads": "radian",
		"%": "percent"
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fp = __webpack_require__(1);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _util = __webpack_require__(16);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var numberUnlessEmptyString = function numberUnlessEmptyString(value) {
	  return value === '' ? null : Number(value);
	};
	
	var time = {
	  match: '([0-2]?\\d)(:[0-5]\\d|)(:[0-5]\\d|)(\\s*am|\\s*pm|)',
	  matchCount: 4,
	  transform: function transform(hour, minute, second, amPm) {
	    return minute === '' && amPm === '' ? null : {
	      hour: Number(hour) + (amPm.toLowerCase() === 'pm' ? 12 : 0),
	      minute: numberUnlessEmptyString(minute.substring(1)),
	      second: numberUnlessEmptyString(second.substring(1))
	    };
	  }
	};
	
	var date = {
	  match: '([1-9]|[0-3][0-9])(?:\\s*(?:st|nd|rd|th))?',
	  transform: function transform(value) {
	    return {
	      date: Number(value)
	    };
	  }
	};
	
	var monthPrefixes = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	
	var monthName = {
	  match: '(' + ['jan(?:uary)?', 'feb(?:ruary)?', 'mar(?:ch)?', 'apr(?:il)?', 'may', 'june?', 'july?', 'aug(?:ust)?', 'sep(?:t(?:ember)?)?', 'oct(?:ober)?', 'nov(?:ember)?', 'dec(?:ember)?'].join('|') + ')',
	  transform: function transform(match) {
	    return {
	      month: monthPrefixes.indexOf(match.substring(0, 3).toLowerCase()) + 1
	    };
	  }
	};
	
	var year = {
	  match: '([1-9]\\d{1,3})',
	  transform: function transform(year) {
	    return {
	      year: Number(year)
	    };
	  }
	};
	
	var defaultValue = {
	  year: null,
	  month: null,
	  date: null,
	  hour: null,
	  minute: null,
	  second: null,
	  timezone: null
	};
	
	var createRegExp = (0, _fp.flow)((0, _fp.map)('match'), (0, _fp.map)(function (match) {
	  return '\\b' + match + '\\b';
	}), (0, _fp.join)('\\s*'), function (string) {
	  return new RegExp(string, 'i');
	});
	
	var createTransformer = function createTransformer(transformers) {
	  return function (match, matches) {
	    var valueMatches = (0, _fp.reduce)((0, _util.propagateNull)(function (accum, transformer) {
	      var arity = transformer.matchCount || 1;
	      var args = accum.remainingMatches.slice(0, arity);
	      var remainingMatches = accum.remainingMatches.slice(arity);
	
	      var newValue = transformer.transform.apply(transformer, _toConsumableArray(args).concat([accum.value]));
	      if (!newValue) return null;
	      var value = (0, _fp.assign)(accum.value, newValue);
	
	      return { value: value, remainingMatches: remainingMatches };
	    }), {
	      value: defaultValue,
	      remainingMatches: (0, _fp.drop)(1, matches)
	    }, transformers);
	
	    if (!valueMatches) return null;
	    var value = valueMatches.value;
	
	
	    return { type: _tokenTypes.TOKEN_DATE_TIME, value: { value: value, directionHint: 1 } };
	  };
	};
	
	var createDateMatcher = function createDateMatcher(transformers, penalty) {
	  return {
	    match: createRegExp(transformers),
	    token: createTransformer(transformers),
	    penalty: penalty
	  };
	};
	
	var createRelativeDate = function createRelativeDate(count, unit) {
	  return [{ type: _tokenTypes.TOKEN_BRACKET_OPEN }, { type: _tokenTypes.TOKEN_DATE_TIME, value: { value: defaultValue, directionHint: 1 } }, { type: _tokenTypes.TOKEN_OPERATOR_ADD }, { type: _tokenTypes.TOKEN_NUMBER, value: count }, { type: _tokenTypes.TOKEN_UNIT_NAME, value: unit }, { type: _tokenTypes.TOKEN_BRACKET_CLOSE }];
	};
	
	/* eslint-disable max-len */
	var dateSpec = [createDateMatcher([date, monthName, year], -50000), createDateMatcher([monthName, date, year], -50000), createDateMatcher([date, monthName], -30000), createDateMatcher([monthName, date], -30000), createDateMatcher([time, date, monthName, year], -70000), createDateMatcher([time, monthName, date, year], -70000), createDateMatcher([time, date, monthName], -50000), createDateMatcher([time, monthName, date], -50000), createDateMatcher([time, date], -30000), createDateMatcher([date, time], -30000), createDateMatcher([time], -20000), {
	  match: /\bnow|today\b/i,
	  token: { type: _tokenTypes.TOKEN_DATE_TIME, value: { value: defaultValue, directionHint: 1 } },
	  penalty: -500
	}, {
	  match: /\byesterday\b/i,
	  token: function token() {
	    return createRelativeDate(-1, 'day');
	  },
	  tokenIndices: [2],
	  penalty: -500
	}, {
	  match: /\btomorrow\b/i,
	  token: function token() {
	    return createRelativeDate(1, 'day');
	  },
	  tokenIndices: [2],
	  penalty: -500
	}, {
	  match: /\bago\b/i,
	  token: { type: _tokenTypes.TOKEN_DATE_TIME, value: { value: defaultValue, directionHint: -1 } },
	  penalty: -500
	}, {
	  match: /\b(next|last)\s+(week|month|year|century|millenium)\b/i,
	  token: function token(match, matches) {
	    return createRelativeDate(matches[1].toLowerCase() === 'next' ? 1 : -1, matches[2].toLowerCase());
	  },
	  tokenIndices: [2, 5],
	  penalty: -500
	}];
	/* eslint-enable */
	
	exports.default = dateSpec;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.singleArrayValue = exports.uncastArray = exports.flatZip = exports.mapUnlessNull = exports.propagateNull = exports.oddIndexElements = exports.evenIndexElements = undefined;
	
	var _fp = __webpack_require__(1);
	
	var everyOtherFrom = function everyOtherFrom(startIndex) {
	  return function (array) {
	    var accum = [];
	    for (var i = startIndex; i < array.length; i += 2) {
	      accum.push(array[i]);
	    }
	    return accum;
	  };
	};
	var evenIndexElements = exports.evenIndexElements = everyOtherFrom(0);
	var oddIndexElements = exports.oddIndexElements = everyOtherFrom(1);
	
	var propagateNull = exports.propagateNull = function propagateNull(cb) {
	  return function (accum, value) {
	    return accum === null ? null : cb(accum, value);
	  };
	};
	
	var mapUnlessNull = exports.mapUnlessNull = function mapUnlessNull(cb, array) {
	  var accum = [];
	  for (var i = 0; i < array.length; i += 1) {
	    var _value = cb(array[i]);
	    if (_value === null) return null;
	    accum[i] = _value;
	  }
	  return accum;
	};
	
	var flatZip = exports.flatZip = (0, _fp.curry)(function (array1, array2) {
	  var accum = [];
	  var to = Math.min(array1.length, array2.length);
	
	  for (var i = 0; i < to; i += 1) {
	    accum = accum.concat(array1[i], array2[i]);
	  }
	
	  if (to < array1.length) {
	    accum = accum.concat((0, _fp.flatten)(array1.slice(to)));
	  } else if (to < array2.length) {
	    accum = accum.concat((0, _fp.flatten)(array2.slice(to)));
	  }
	
	  return accum;
	});
	
	var uncastArray = exports.uncastArray = function uncastArray(value) {
	  if (!(0, _fp.isArray)(value) || value.length > 1) {
	    return value;
	  } else if (value.length === 1) {
	    return value[0];
	  }
	  return null;
	};
	
	var singleArrayValue = exports.singleArrayValue = function singleArrayValue(value) {
	  if (!(0, _fp.isArray)(value)) {
	    return value;
	  } else if (value.length === 1) {
	    return value[0];
	  }
	  return null;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _tokenTypes = __webpack_require__(2);
	
	var _transformer = __webpack_require__(18);
	
	var _transformer2 = _interopRequireDefault(_transformer);
	
	var _assignmentTransform = __webpack_require__(19);
	
	var _assignmentTransform2 = _interopRequireDefault(_assignmentTransform);
	
	var _bracketTransform = __webpack_require__(21);
	
	var _bracketTransform2 = _interopRequireDefault(_bracketTransform);
	
	var _commaTransform = __webpack_require__(22);
	
	var _commaTransform2 = _interopRequireDefault(_commaTransform);
	
	var _createOperatorTransform = __webpack_require__(23);
	
	var _functionShorthandTransform = __webpack_require__(25);
	
	var _functionShorthandTransform2 = _interopRequireDefault(_functionShorthandTransform);
	
	var _conversionTransform = __webpack_require__(26);
	
	var _conversionTransform2 = _interopRequireDefault(_conversionTransform);
	
	var _percentTransform = __webpack_require__(27);
	
	var _percentTransform2 = _interopRequireDefault(_percentTransform);
	
	var _entityTransform = __webpack_require__(28);
	
	var _entityTransform2 = _interopRequireDefault(_entityTransform);
	
	var _remainingTokensTransform = __webpack_require__(31);
	
	var _remainingTokensTransform2 = _interopRequireDefault(_remainingTokensTransform);
	
	var _miscGroupTransform = __webpack_require__(33);
	
	var _miscGroupTransform2 = _interopRequireDefault(_miscGroupTransform);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _transformer2.default)([_assignmentTransform2.default, _conversionTransform2.default, _bracketTransform2.default, _commaTransform2.default, (0, _createOperatorTransform.createForwardOperatorTransform)([_tokenTypes.TOKEN_OPERATOR_ADD, _tokenTypes.TOKEN_OPERATOR_SUBTRACT]), (0, _createOperatorTransform.createForwardOperatorTransform)([_tokenTypes.TOKEN_OPERATOR_MULTIPLY, _tokenTypes.TOKEN_OPERATOR_DIVIDE]), _functionShorthandTransform2.default, (0, _createOperatorTransform.createBackwardOperatorTransform)([_tokenTypes.TOKEN_OPERATOR_EXPONENT, _tokenTypes.TOKEN_OPERATOR_NEGATE]), (0, _createOperatorTransform.createForwardOperatorTransform)([_tokenTypes.TOKEN_OPERATOR_FACTORIAL]), _remainingTokensTransform2.default, _percentTransform2.default, _entityTransform2.default, _miscGroupTransform2.default]);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _util = __webpack_require__(16);
	
	/*
	# Transformers
	
	A transformer has the properties pattern and transform.
	
	The pattern can be a PatternMatcher instance or anything that generates capture groups.
	
	The transform property is a function that takes the capture groups matched, and a recurse function
	to recursively parse a set of the capture groups; and returns a transformed capture group. TL;DR,
	
	```js
	const transform = (captureGroups, recurse) => recurse([
	  captureGroups[0],
	  captureGroups[2],
	], ([transformedLhs, transformedRhs]) => {
	  // transformed{Lhs,Rhs} are not null
	  return createFunction(operator, transformedLhs, transformedRhs);
	});
	```
	
	If you return an array from the transform function, it will continue trying to apply transform
	rules. If you return an object, it will make that the return value and stop transforming. If you
	return null, it will return null and stop transforming.
	
	The recurse function takes an array of array of tokens (aka, capture groups), and a callback that
	is invoked with the transformed capture groups. If one of the things you tried to transform
	recursively returns null, the callback is not invoked: you can be certain that the capture groups
	the callback was invoked with are actual results.
	
	Say for example, you match a some tokens, an operator (like +), and then some more tokens. You'd
	need the left and right hand sides to be transformed to create the function, so you call the
	recurse function on these.
	
	# Algorithm
	
	We take an array of transformers and input tokens. We start from the first transformer, and if we
	create a match, we do the transform, and attempt to match the same case. Only when we do not match
	a case do we continue on to the next.
	*/
	exports.default = function (transforms) {
	  var iter = function iter(tokens) {
	    var location = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	
	    if (!Array.isArray(tokens)) return tokens;
	
	    var transform = transforms[location];
	    var captureGroups = transform.pattern.match(tokens);
	
	    if (captureGroups) {
	      var transformResult = transform.transform(captureGroups, function (captureGroupsToTransform, cb) {
	        var transformedCaptureGroups = (0, _util.mapUnlessNull)(function (captureGroupToTransform) {
	          return iter(captureGroupToTransform, location);
	        }, captureGroupsToTransform);
	
	        return transformedCaptureGroups ? cb(transformedCaptureGroups) : null;
	      });
	
	      return transformResult ? iter(transformResult, location) : null;
	    } else if (location < transforms.length - 1) {
	      return iter(tokens, location + 1);
	    }
	    return tokens;
	  };
	
	  return function (tokens) {
	    var result = iter(tokens, 0);
	    return !Array.isArray(result) ? result : null;
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _patternMatcher = __webpack_require__(20);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _types = __webpack_require__(9);
	
	var bracketTransform = {
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_ASSIGNMENT), new _patternMatcher.CaptureWildcard().any().lazy()]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform([captureGroups[1]], function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 1);
	
	      var value = _ref2[0];
	      return _extends({}, _types.baseAssignment, { identifier: captureGroups[0][0].value, value: value
	      });
	    });
	  }
	};
	exports.default = bracketTransform;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Pattern = exports.CaptureWildcard = exports.CaptureOptions = exports.CaptureElement = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	/* globals Generator */
	
	
	var _fp = __webpack_require__(1);
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BaseMatcher = function () {
	  function BaseMatcher(pattern) {
	    _classCallCheck(this, BaseMatcher);
	
	    this.pattern = null;
	    this.isNegative = false;
	    this.isLazy = false;
	    this.start = 1;
	    this.end = 1;
	
	    this.pattern = pattern;
	  }
	
	  _createClass(BaseMatcher, [{
	    key: 'from',
	    value: function from(start) {
	      return (0, _fp.set)('start', start, this);
	    }
	  }, {
	    key: 'to',
	    value: function to(end) {
	      return (0, _fp.set)('end', end, this);
	    }
	  }, {
	    key: 'zeroOrOne',
	    value: function zeroOrOne() {
	      return this.from(0).to(1);
	    }
	  }, {
	    key: 'any',
	    value: function any() {
	      return this.from(0).to(Infinity);
	    }
	  }, {
	    key: 'oneOrMore',
	    value: function oneOrMore() {
	      return this.from(1).to(Infinity);
	    }
	  }, {
	    key: 'negate',
	    value: function negate() {
	      return (0, _fp.set)('isNegative', true, this);
	    }
	  }, {
	    key: 'lazy',
	    value: function lazy() {
	      return (0, _fp.set)('isLazy', true, this);
	    }
	  }, {
	    key: 'match',
	    value: function match(tokens) {
	      var types = (0, _fp.map)('type', tokens);
	
	      var matchStack = { index: 0, captureRanges: [], array: types };
	      var minIndex = tokens.length;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = this.getMatches(matchStack)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var result = _step.value;
	
	          if (result.index >= minIndex) {
	            var capturedTokens = (0, _fp.map)(function (captureRange) {
	              return tokens.slice(captureRange[0], captureRange[1]);
	            }, result.captureRanges);
	
	            return capturedTokens;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return null;
	    }
	  }, {
	    key: 'getMatches',
	    value: regeneratorRuntime.mark(function getMatches(matchStack) {
	      return regeneratorRuntime.wrap(function getMatches$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              throw new Error('Not implemented');
	
	            case 1:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, getMatches, this);
	    })
	  }]);
	
	  return BaseMatcher;
	}();
	
	var BaseCaptureMatcher = function (_BaseMatcher) {
	  _inherits(BaseCaptureMatcher, _BaseMatcher);
	
	  function BaseCaptureMatcher() {
	    _classCallCheck(this, BaseCaptureMatcher);
	
	    return _possibleConstructorReturn(this, (BaseCaptureMatcher.__proto__ || Object.getPrototypeOf(BaseCaptureMatcher)).apply(this, arguments));
	  }
	
	  _createClass(BaseCaptureMatcher, [{
	    key: 'conforms',
	    value: function conforms(element, pattern) {
	      // eslint-disable-line
	      throw new Error('Not implemented');
	    }
	  }, {
	    key: 'getLazyMatchesFrom',
	    value: regeneratorRuntime.mark(function getLazyMatchesFrom(startI, end, lastElementIndex, _ref) {
	      var index = _ref.index;
	      var captureRanges = _ref.captureRanges;
	      var array = _ref.array;
	      var pattern, isNegative, i;
	      return regeneratorRuntime.wrap(function getLazyMatchesFrom$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              pattern = this.pattern;
	              isNegative = this.isNegative;
	              i = startI;
	
	            case 3:
	              if (!(i <= end)) {
	                _context2.next = 11;
	                break;
	              }
	
	              if (!(i === lastElementIndex || this.conforms(array[i], pattern) === isNegative)) {
	                _context2.next = 8;
	                break;
	              }
	
	              _context2.next = 7;
	              return {
	                index: index + i,
	                captureRanges: captureRanges.concat([[index, index + i]]),
	                array: array.slice(i)
	              };
	
	            case 7:
	              return _context2.abrupt('return');
	
	            case 8:
	              i += 1;
	              _context2.next = 3;
	              break;
	
	            case 11:
	            case 'end':
	              return _context2.stop();
	          }
	        }
	      }, getLazyMatchesFrom, this);
	    })
	  }, {
	    key: 'getNonLazyMatchesFrom',
	    value: regeneratorRuntime.mark(function getNonLazyMatchesFrom(startI, end, lastElementIndex, _ref2) {
	      var index = _ref2.index;
	      var captureRanges = _ref2.captureRanges;
	      var array = _ref2.array;
	      var pattern, isNegative, i;
	      return regeneratorRuntime.wrap(function getNonLazyMatchesFrom$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              pattern = this.pattern;
	              isNegative = this.isNegative;
	              i = startI;
	
	            case 3:
	              if (!(i <= end)) {
	                _context3.next = 11;
	                break;
	              }
	
	              _context3.next = 6;
	              return {
	                index: index + i,
	                captureRanges: captureRanges.concat([[index, index + i]]),
	                array: array.slice(i)
	              };
	
	            case 6:
	              if (!(i !== lastElementIndex && this.conforms(array[i], pattern) === isNegative)) {
	                _context3.next = 8;
	                break;
	              }
	
	              return _context3.abrupt('return');
	
	            case 8:
	              i += 1;
	              _context3.next = 3;
	              break;
	
	            case 11:
	            case 'end':
	              return _context3.stop();
	          }
	        }
	      }, getNonLazyMatchesFrom, this);
	    })
	  }, {
	    key: 'getMatches',
	    value: regeneratorRuntime.mark(function getMatches(matchStack) {
	      var array, pattern, isNegative, isLazy, start, i, lastElementIndex, end;
	      return regeneratorRuntime.wrap(function getMatches$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              // const { index, captureRanges, array } = matchStack;
	              array = matchStack.array;
	              pattern = this.pattern;
	              isNegative = this.isNegative;
	              isLazy = this.isLazy;
	              start = this.start;
	
	              if (!(start > array.length)) {
	                _context4.next = 7;
	                break;
	              }
	
	              return _context4.abrupt('return');
	
	            case 7:
	              i = 0;
	
	            case 8:
	              if (!(i < start)) {
	                _context4.next = 14;
	                break;
	              }
	
	              if (!(this.conforms(array[i], pattern) === isNegative)) {
	                _context4.next = 11;
	                break;
	              }
	
	              return _context4.abrupt('return');
	
	            case 11:
	              i += 1;
	              _context4.next = 8;
	              break;
	
	            case 14:
	
	              // if (i === this.end) {
	              //   yield {
	              //     index: index + i,
	              //     captureRanges: captureRanges.concat([[index, index + i]]),
	              //     array: array.slice(i),
	              //   };
	              //   return;
	              // }
	
	              lastElementIndex = array.length;
	              end = Math.min(this.end, lastElementIndex);
	
	              if (!isLazy) {
	                _context4.next = 20;
	                break;
	              }
	
	              return _context4.delegateYield(this.getLazyMatchesFrom(i, end, lastElementIndex, matchStack), 't0', 18);
	
	            case 18:
	              _context4.next = 21;
	              break;
	
	            case 20:
	              return _context4.delegateYield(this.getNonLazyMatchesFrom(i, end, lastElementIndex, matchStack), 't1', 21);
	
	            case 21:
	            case 'end':
	              return _context4.stop();
	          }
	        }
	      }, getMatches, this);
	    })
	  }]);
	
	  return BaseCaptureMatcher;
	}(BaseMatcher);
	
	var CaptureElement = exports.CaptureElement = function (_BaseCaptureMatcher) {
	  _inherits(CaptureElement, _BaseCaptureMatcher);
	
	  function CaptureElement() {
	    _classCallCheck(this, CaptureElement);
	
	    return _possibleConstructorReturn(this, (CaptureElement.__proto__ || Object.getPrototypeOf(CaptureElement)).apply(this, arguments));
	  }
	
	  _createClass(CaptureElement, [{
	    key: 'conforms',
	    value: function conforms(element, pattern) {
	      return element === pattern;
	    }
	  }]);
	
	  return CaptureElement;
	}(BaseCaptureMatcher);
	
	var CaptureOptions = exports.CaptureOptions = function (_BaseCaptureMatcher2) {
	  _inherits(CaptureOptions, _BaseCaptureMatcher2);
	
	  function CaptureOptions() {
	    _classCallCheck(this, CaptureOptions);
	
	    return _possibleConstructorReturn(this, (CaptureOptions.__proto__ || Object.getPrototypeOf(CaptureOptions)).apply(this, arguments));
	  }
	
	  _createClass(CaptureOptions, [{
	    key: 'conforms',
	    value: function conforms(element, pattern) {
	      return (0, _fp.includes)(element, pattern);
	    }
	  }]);
	
	  return CaptureOptions;
	}(BaseCaptureMatcher);
	
	var CaptureWildcard = exports.CaptureWildcard = function (_BaseCaptureMatcher3) {
	  _inherits(CaptureWildcard, _BaseCaptureMatcher3);
	
	  function CaptureWildcard() {
	    _classCallCheck(this, CaptureWildcard);
	
	    return _possibleConstructorReturn(this, (CaptureWildcard.__proto__ || Object.getPrototypeOf(CaptureWildcard)).apply(this, arguments));
	  }
	
	  _createClass(CaptureWildcard, [{
	    key: 'conforms',
	    value: function conforms() {
	      return true;
	    }
	  }]);
	
	  return CaptureWildcard;
	}(BaseCaptureMatcher);
	
	var Pattern = exports.Pattern = function (_BaseMatcher2) {
	  _inherits(Pattern, _BaseMatcher2);
	
	  function Pattern() {
	    _classCallCheck(this, Pattern);
	
	    return _possibleConstructorReturn(this, (Pattern.__proto__ || Object.getPrototypeOf(Pattern)).apply(this, arguments));
	  }
	
	  _createClass(Pattern, [{
	    key: 'getSubmatches',
	    value: regeneratorRuntime.mark(function getSubmatches(iteration, remainingPatterns, matchStack) {
	      var numRemainingPatterns, remainingPattern, isFirstPattern, isLastPattern, didMatchSubCase, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, match, matchedNothing;
	
	      return regeneratorRuntime.wrap(function getSubmatches$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              numRemainingPatterns = remainingPatterns.length;
	
	              if (!(numRemainingPatterns === 0)) {
	                _context5.next = 9;
	                break;
	              }
	
	              if (!(iteration >= this.start)) {
	                _context5.next = 5;
	                break;
	              }
	
	              _context5.next = 5;
	              return matchStack;
	
	            case 5:
	              if (!(iteration < this.end - 1)) {
	                _context5.next = 7;
	                break;
	              }
	
	              return _context5.delegateYield(this.getSubmatches(iteration + 1, this.pattern, matchStack), 't0', 7);
	
	            case 7:
	              _context5.next = 49;
	              break;
	
	            case 9:
	              if (!(numRemainingPatterns > 0)) {
	                _context5.next = 49;
	                break;
	              }
	
	              remainingPattern = remainingPatterns[0];
	              isFirstPattern = numRemainingPatterns === this.pattern.length;
	              isLastPattern = numRemainingPatterns === 1;
	              didMatchSubCase = false;
	              _iteratorNormalCompletion2 = true;
	              _didIteratorError2 = false;
	              _iteratorError2 = undefined;
	              _context5.prev = 17;
	              _iterator2 = remainingPattern.getMatches(matchStack)[Symbol.iterator]();
	
	            case 19:
	              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
	                _context5.next = 31;
	                break;
	              }
	
	              match = _step2.value;
	
	              didMatchSubCase = true;
	
	              if (!(isLastPattern && match.array.length === 0)) {
	                _context5.next = 27;
	                break;
	              }
	
	              _context5.next = 25;
	              return match;
	
	            case 25:
	              _context5.next = 28;
	              break;
	
	            case 27:
	              return _context5.delegateYield(this.getSubmatches(iteration, remainingPatterns.slice(1), match), 't1', 28);
	
	            case 28:
	              _iteratorNormalCompletion2 = true;
	              _context5.next = 19;
	              break;
	
	            case 31:
	              _context5.next = 37;
	              break;
	
	            case 33:
	              _context5.prev = 33;
	              _context5.t2 = _context5['catch'](17);
	              _didIteratorError2 = true;
	              _iteratorError2 = _context5.t2;
	
	            case 37:
	              _context5.prev = 37;
	              _context5.prev = 38;
	
	              if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                _iterator2.return();
	              }
	
	            case 40:
	              _context5.prev = 40;
	
	              if (!_didIteratorError2) {
	                _context5.next = 43;
	                break;
	              }
	
	              throw _iteratorError2;
	
	            case 43:
	              return _context5.finish(40);
	
	            case 44:
	              return _context5.finish(37);
	
	            case 45:
	              matchedNothing = !didMatchSubCase && isFirstPattern;
	
	              if (!(matchedNothing && iteration === 0 && this.start === 0)) {
	                _context5.next = 49;
	                break;
	              }
	
	              _context5.next = 49;
	              return matchStack;
	
	            case 49:
	            case 'end':
	              return _context5.stop();
	          }
	        }
	      }, getSubmatches, this, [[17, 33, 37, 45], [38,, 40, 44]]);
	    })
	  }, {
	    key: 'getMatches',
	    value: regeneratorRuntime.mark(function getMatches(matchStack) {
	      return regeneratorRuntime.wrap(function getMatches$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              return _context6.delegateYield(this.getSubmatches(0, this.pattern, matchStack), 't0', 1);
	
	            case 1:
	            case 'end':
	              return _context6.stop();
	          }
	        }
	      }, getMatches, this);
	    })
	  }]);
	
	  return Pattern;
	}(BaseMatcher);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _types = __webpack_require__(9);
	
	var _util = __webpack_require__(16);
	
	var bracketTransform = {
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureWildcard().any(), new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_FUNCTION).zeroOrOne(), new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_BRACKET_OPEN), new _patternMatcher.CaptureOptions([_tokenTypes.TOKEN_BRACKET_OPEN, _tokenTypes.TOKEN_BRACKET_CLOSE]).negate().lazy().any(), new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_BRACKET_CLOSE), new _patternMatcher.CaptureWildcard().any().lazy()]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform([captureGroups[3]], function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 1);
	
	      var bracketGroup = _ref2[0];
	
	      if (Array.isArray(bracketGroup)) return null;
	
	      var fn = (0, _fp.first)(captureGroups[1]);
	
	      var value = void 0;
	      if (!fn) {
	        value = _extends({}, _types.baseBrackets, { value: bracketGroup });
	      } else if (bracketGroup.type === _types.NODE_ARRAY_GROUP) {
	        value = _extends({}, _types.baseFunction, { name: fn.value, args: bracketGroup.value });
	      } else {
	        value = _extends({}, _types.baseFunction, { name: fn.value, args: [bracketGroup] });
	      }
	
	      var concatSegments = [].concat((0, _fp.first)(captureGroups), value, (0, _fp.last)(captureGroups));
	      return (0, _util.uncastArray)(concatSegments);
	    });
	  }
	};
	exports.default = bracketTransform;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _patternMatcher = __webpack_require__(20);
	
	var _types = __webpack_require__(9);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _util = __webpack_require__(16);
	
	var entityTransform = {
	  // TODO: Could be made more efficient
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_COMMA).negate().lazy().any(), new _patternMatcher.Pattern([new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_COMMA), new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_COMMA).negate().lazy().any()]).oneOrMore()]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform((0, _util.evenIndexElements)(captureGroups), function (segments) {
	      return _extends({}, _types.baseArrayGroup, { value: segments });
	    });
	  }
	};
	exports.default = entityTransform;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createBackwardOperatorTransform = exports.createForwardOperatorTransform = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _operatorTypes, _operatorArity, _unaryBindingDirectio;
	
	var _fp = __webpack_require__(1);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _types = __webpack_require__(9);
	
	var _functions = __webpack_require__(4);
	
	var _util = __webpack_require__(16);
	
	var _util2 = __webpack_require__(24);
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // eslint-disable-line
	
	
	var FORWARD = 0;
	var BACKWARD = 1;
	
	var operatorTypes = (_operatorTypes = {}, _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_ADD, _functions.FUNCTION_ADD), _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_SUBTRACT, _functions.FUNCTION_SUBTRACT), _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_MULTIPLY, _functions.FUNCTION_MULTIPLY), _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_DIVIDE, _functions.FUNCTION_DIVIDE), _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_EXPONENT, _functions.FUNCTION_EXPONENT), _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_NEGATE, _functions.FUNCTION_NEGATE), _defineProperty(_operatorTypes, _tokenTypes.TOKEN_OPERATOR_FACTORIAL, _functions.FUNCTION_FACTORIAL), _operatorTypes);
	
	var operatorArity = (_operatorArity = {}, _defineProperty(_operatorArity, _functions.FUNCTION_ADD, 2), _defineProperty(_operatorArity, _functions.FUNCTION_SUBTRACT, 2), _defineProperty(_operatorArity, _functions.FUNCTION_MULTIPLY, 2), _defineProperty(_operatorArity, _functions.FUNCTION_DIVIDE, 2), _defineProperty(_operatorArity, _functions.FUNCTION_EXPONENT, 2), _defineProperty(_operatorArity, _functions.FUNCTION_NEGATE, 1), _defineProperty(_operatorArity, _functions.FUNCTION_FACTORIAL, 1), _operatorArity);
	
	var unaryBindingDirections = (_unaryBindingDirectio = {}, _defineProperty(_unaryBindingDirectio, _functions.FUNCTION_NEGATE, FORWARD), _defineProperty(_unaryBindingDirectio, _functions.FUNCTION_FACTORIAL, BACKWARD), _unaryBindingDirectio);
	
	var getOperatorTypes = (0, _fp.flow)(_util.oddIndexElements, (0, _fp.map)(_fp.first), (0, _fp.map)('type'));
	
	var createBilinearNode = function createBilinearNode(name, leftSegment, rightSegment) {
	  var lhs = (0, _util.singleArrayValue)(leftSegment);
	  var rhs = (0, _util.singleArrayValue)(rightSegment);
	
	  return lhs && rhs ? _extends({}, _types.baseFunction, { name: name, args: [lhs, rhs] }) : null;
	};
	
	var createUnaryNode = function createUnaryNode(bindingDirection, name, leftSegment, rightSegment) {
	  var leftSide = !(0, _fp.isEmpty)(leftSegment) ? leftSegment : null;
	  var rightSide = !(0, _fp.isEmpty)(rightSegment) ? rightSegment : null;
	  var argument = void 0;
	
	  if (bindingDirection === FORWARD && rightSide && rightSide.type === _types.NODE_MISC_GROUP) {
	    argument = (0, _fp.first)(rightSide.value);
	    var _miscGroup = _extends({}, _types.baseMiscGroup, { value: rightSide.value.slice(1) });
	    rightSide = (0, _util2.compactMiscGroup)(_miscGroup);
	  } else if (bindingDirection === FORWARD) {
	    argument = rightSide;
	    rightSide = null;
	  } else if (bindingDirection === BACKWARD && leftSide && leftSide.type === _types.NODE_MISC_GROUP) {
	    argument = (0, _fp.last)(leftSide.value);
	    var _miscGroup2 = _extends({}, _types.baseMiscGroup, { value: leftSide.value.slice(1) });
	    leftSide = (0, _util2.compactMiscGroup)(_miscGroup2);
	  } else if (bindingDirection === BACKWARD) {
	    argument = leftSide;
	    leftSide = null;
	  }
	
	  if (!argument) return null;
	
	  var node = _extends({}, _types.baseFunction, { name: name, args: [argument] });
	  var group = (0, _fp.compact)([leftSide, node, rightSide]);
	  var miscGroup = _extends({}, _types.baseMiscGroup, { value: group });
	  var value = (0, _util2.compactMiscGroup)(miscGroup);
	
	  return value;
	};
	
	var createNode = function createNode(operatorType, leftSegment, rightSegment) {
	  var name = operatorTypes[operatorType];
	  var arity = operatorArity[name];
	
	  if (arity === 2) {
	    return createBilinearNode(name, leftSegment, rightSegment);
	  }
	  var bindingDirection = unaryBindingDirections[name];
	  return createUnaryNode(bindingDirection, name, leftSegment, rightSegment);
	};
	
	var createPattern = function createPattern(operators) {
	  return new _patternMatcher.Pattern([new _patternMatcher.CaptureOptions(operators).negate().lazy().any(), new _patternMatcher.Pattern([new _patternMatcher.CaptureOptions(operators), new _patternMatcher.CaptureOptions(operators).negate().lazy().any()]).oneOrMore()]);
	};
	
	var createForwardOperatorTransform = exports.createForwardOperatorTransform = function createForwardOperatorTransform(operators) {
	  return {
	    pattern: createPattern(operators),
	    transform: function transform(captureGroups, _transform) {
	      return _transform((0, _util.evenIndexElements)(captureGroups), function (segments) {
	        var operatorTypes = getOperatorTypes(captureGroups);
	
	        var _segments = _toArray(segments);
	
	        var initialSegment = _segments[0];
	
	        var remainingSegments = _segments.slice(1);
	
	        return (0, _fp.reduce)((0, _util.propagateNull)(function (lhs, _ref) {
	          var _ref2 = _slicedToArray(_ref, 2);
	
	          var operator = _ref2[0];
	          var rhs = _ref2[1];
	          return createNode(operator, lhs, rhs);
	        }), initialSegment, (0, _fp.zip)(operatorTypes, remainingSegments));
	      });
	    }
	  };
	};
	
	var createBackwardOperatorTransform = exports.createBackwardOperatorTransform = function createBackwardOperatorTransform(operators) {
	  return {
	    pattern: createPattern(operators),
	    transform: function transform(captureGroups, _transform2) {
	      return _transform2((0, _util.evenIndexElements)(captureGroups), function (segments) {
	        var operatorTypes = getOperatorTypes(captureGroups);
	        var initialSegment = (0, _fp.last)(segments);
	        var remainingSegments = (0, _fp.dropRight)(1, segments);
	
	        return (0, _fp.reduceRight)((0, _util.propagateNull)(function (lhs, _ref3) {
	          var _ref4 = _slicedToArray(_ref3, 2);
	
	          var operator = _ref4[0];
	          var rhs = _ref4[1];
	          return createNode(operator, rhs, lhs);
	        }), initialSegment, (0, _fp.zip)(operatorTypes, remainingSegments));
	      });
	    }
	  };
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.compactMiscGroup = exports.combineUnitNamesPrefixesSuffixes = exports.INTERMEDIATE_UNIT = undefined;
	
	var _fp = __webpack_require__(1);
	
	var _types = __webpack_require__(9);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _util = __webpack_require__(16);
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // eslint-disable-line
	
	
	var INTERMEDIATE_UNIT = exports.INTERMEDIATE_UNIT = 'INTERMEDIATE_UNIT';
	
	var combineUnitNamesPrefixesSuffixes = exports.combineUnitNamesPrefixesSuffixes = function combineUnitNamesPrefixesSuffixes(segment) {
	  var segmentWithIntermediateUnits = (0, _fp.map)(function (tag) {
	    return tag.type === _tokenTypes.TOKEN_UNIT_NAME ? { type: INTERMEDIATE_UNIT, name: tag.value, power: 1 } : tag;
	  }, segment);
	
	  // Combine unit suffixes with intermediate unit powers
	  segmentWithIntermediateUnits = (0, _fp.reduce)((0, _util.propagateNull)(function (accum, tag) {
	    if (tag.type !== _tokenTypes.TOKEN_UNIT_SUFFIX) {
	      return [].concat(_toConsumableArray(accum), [tag]);
	    } else if ((0, _fp.get)('type', (0, _fp.last)(accum)) === INTERMEDIATE_UNIT) {
	      return (0, _fp.update)([accum.length - 1, 'power'], (0, _fp.multiply)(tag.value), accum);
	    }
	    return null;
	  }), [], segmentWithIntermediateUnits);
	
	  // Combine unit prefixes with intermediate unit powers
	  segmentWithIntermediateUnits = (0, _fp.reduceRight)((0, _util.propagateNull)(function (accum, tag) {
	    if (tag.type !== _tokenTypes.TOKEN_UNIT_PREFIX) {
	      return [tag].concat(_toConsumableArray(accum));
	    } else if ((0, _fp.get)('type', (0, _fp.first)(accum)) === INTERMEDIATE_UNIT) {
	      return (0, _fp.update)([0, 'power'], (0, _fp.multiply)(tag.value), accum);
	    }
	    return null;
	  }), [], segmentWithIntermediateUnits);
	
	  return segmentWithIntermediateUnits;
	};
	
	var compactMiscGroup = exports.compactMiscGroup = function compactMiscGroup(node) {
	  if (node.type !== _types.NODE_MISC_GROUP || !node.value) return node;
	
	  var value = node.value;
	  if (value.length > 1) {
	    return node;
	  } else if (value.length === 1) {
	    return value[0];
	  }
	  return null;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _types = __webpack_require__(9);
	
	var _util = __webpack_require__(16);
	
	var bracketTransform = {
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureWildcard().any(), new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_FUNCTION), new _patternMatcher.CaptureWildcard().any().lazy()]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform([captureGroups[2]], function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 1);
	
	      var arg = _ref2[0];
	
	      if ((0, _fp.isEmpty)(arg)) return null;
	
	      var fn = (0, _fp.first)(captureGroups[1]);
	
	      var concatSegments = [].concat((0, _fp.first)(captureGroups), _extends({}, _types.baseFunction, { name: fn.value, args: [arg] }));
	      return (0, _util.uncastArray)(concatSegments);
	    });
	  }
	};
	exports.default = bracketTransform;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _types = __webpack_require__(9);
	
	var _util = __webpack_require__(24);
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var conversionTokens = [_tokenTypes.TOKEN_FORMATTING_HINT, _tokenTypes.TOKEN_NOOP, _tokenTypes.TOKEN_PSEUDO_UNIT, _tokenTypes.TOKEN_UNIT_NAME, _tokenTypes.TOKEN_UNIT_PREFIX, _tokenTypes.TOKEN_UNIT_SUFFIX];
	var unitTokens = [_tokenTypes.TOKEN_UNIT_NAME, _tokenTypes.TOKEN_UNIT_PREFIX, _tokenTypes.TOKEN_UNIT_SUFFIX];
	var isNoop = function isNoop(type) {
	  return type === _tokenTypes.TOKEN_NOOP;
	};
	var notNoop = function notNoop(type) {
	  return type !== _tokenTypes.TOKEN_NOOP;
	};
	var isConversionToken = (0, _fp.includes)(_fp.__, conversionTokens);
	
	var findLeftConversion = function findLeftConversion(tags) {
	  var tagTypes = (0, _fp.map)('type', tags);
	
	  var conversionTagTypes = (0, _fp.flow)((0, _fp.takeWhile)(isConversionToken), (0, _fp.dropRightWhile)(notNoop), (0, _fp.dropWhile)(isNoop))(tagTypes);
	
	  if ((0, _fp.isEmpty)(conversionTagTypes) || (0, _fp.last)(conversionTagTypes) !== _tokenTypes.TOKEN_NOOP) return null;
	
	  var index = conversionTagTypes.length;
	  var conversionTags = (0, _fp.take)(index, tags);
	  var remainingTags = (0, _fp.drop)(index, tags);
	  return [remainingTags, conversionTags];
	};
	
	var findRightConversion = function findRightConversion(tags) {
	  var tagTypes = (0, _fp.map)('type', tags);
	
	  var conversionTagTypes = (0, _fp.takeRightWhile)(isConversionToken, tagTypes);
	
	  var precedingTag = tags[tags.length - conversionTagTypes.length - 1];
	
	  if (precedingTag && precedingTag.type === _tokenTypes.TOKEN_NUMBER) {
	    // Gathered too many tags and went into tags that would form an entity, drop some tags
	    conversionTagTypes = (0, _fp.dropWhile)(notNoop, conversionTagTypes);
	  }
	
	  if ((0, _fp.isEmpty)(conversionTagTypes)) return null;
	
	  var index = conversionTagTypes.length;
	  var conversionTags = (0, _fp.takeRight)(index, tags);
	  var remainingTags = (0, _fp.dropRight)(index, tags);
	  return [remainingTags, conversionTags];
	};
	
	var findConversion = function findConversion(tags) {
	  return findLeftConversion(tags) || findRightConversion(tags);
	};
	
	var conversionsTransform = {
	  pattern: { match: findConversion },
	  transform: function transform(captureGroups, _transform) {
	    return _transform([captureGroups[0]], function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 1);
	
	      var value = _ref2[0];
	
	      var conversionSegment = captureGroups[1];
	
	      var pseudoConversions = (0, _fp.filter)({ type: _tokenTypes.TOKEN_PSEUDO_UNIT }, conversionSegment);
	      if (pseudoConversions.length > 1) return null;
	
	      var unitSegmentWithIntermediateUnits = (0, _fp.flow)((0, _fp.filter)(function (token) {
	        return (0, _fp.includes)(token.type, unitTokens);
	      }), _util.combineUnitNamesPrefixesSuffixes)(conversionSegment);
	      if (!unitSegmentWithIntermediateUnits) return null;
	
	      var entityConversion = (0, _fp.flow)((0, _fp.filter)({ type: _util.INTERMEDIATE_UNIT }), (0, _fp.map)(function (unit) {
	        return _defineProperty({}, unit.name, unit.power);
	      }))(unitSegmentWithIntermediateUnits);
	
	      var pseudoConversion = (0, _fp.getOr)(null, [0, 'value'], pseudoConversions);
	
	      var formatting = (0, _fp.flow)((0, _fp.filter)({ type: _tokenTypes.TOKEN_FORMATTING_HINT }), (0, _fp.map)('value'), (0, _fp.reduce)(function (accum, _ref4) {
	        var key = _ref4.key;
	        var value = _ref4.value;
	        return (0, _fp.set)(key, value, accum);
	      }, {}))(conversionSegment);
	
	      return _extends({}, _types.baseConversion, { value: value, entityConversion: entityConversion, pseudoConversion: pseudoConversion, formatting: formatting });
	    });
	  }
	};
	exports.default = conversionsTransform;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _fp = __webpack_require__(1);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _types = __webpack_require__(9);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _util = __webpack_require__(16);
	
	var entityTransform = {
	  // TODO: Could be made more efficient
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_NUMBER).negate().lazy().any(), new _patternMatcher.Pattern([new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_NUMBER), new _patternMatcher.CaptureElement(_tokenTypes.TOKEN_PERCENTAGE), new _patternMatcher.CaptureWildcard().lazy().any()])]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform([captureGroups[0], captureGroups[3]], function (segments) {
	      var value = captureGroups[1][0].value;
	      var percentage = _extends({}, _types.basePercentage, { value: value });
	
	      var concatSegments = [].concat((0, _fp.first)(segments), percentage, (0, _fp.last)(segments));
	      return (0, _util.uncastArray)(concatSegments);
	    });
	  }
	};
	exports.default = entityTransform;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _fp = __webpack_require__(1);
	
	var _entity = __webpack_require__(29);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _types = __webpack_require__(9);
	
	var _util = __webpack_require__(24);
	
	var _util2 = __webpack_require__(16);
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var getEntities = function getEntities(segment) {
	  var segmentWithIntermediateUnits = (0, _util.combineUnitNamesPrefixesSuffixes)(segment);
	  if (segmentWithIntermediateUnits === null) return null;
	
	  /*
	  Combine all units and numbers into entities. Examples of algorithm below:
	  number unit1
	    => [Entity(number unit1)]
	  unit1 number
	    => [Entity(number unit1)]
	  number unit1 unit2
	    => [Entity(number unit1 unit2)]
	  number1 unit1 number1 unit2
	    => [Entity(number1 unit1), Entity(number2 unit2)]
	  unit1 number1 unit2 number2 unit3
	    => [Entity(number1 unit1 unit2), Entity(number2 unit3)]
	  */
	  var baseEntityValue = _extends({}, _types.baseEntity, { quantity: undefined });
	  var maybeEntities = (0, _fp.reduce)(function (accum, tag) {
	    if (tag.type === _util.INTERMEDIATE_UNIT) {
	      var unit = _defineProperty({}, tag.name, tag.power);
	      return (0, _fp.update)([accum.length - 1, 'units'], (0, _entity.combineUnits)(unit), accum);
	    } else if (tag.type === _tokenTypes.TOKEN_NUMBER && (0, _fp.last)(accum).quantity === undefined) {
	      return (0, _fp.set)([accum.length - 1, 'quantity'], tag.value, accum);
	    } else if (tag.type === _tokenTypes.TOKEN_NUMBER) {
	      var newEntityValue = (0, _fp.set)('quantity', tag.value, baseEntityValue);
	      return (0, _fp.concat)(accum, newEntityValue);
	    }
	    return accum;
	  }, [baseEntityValue], segmentWithIntermediateUnits);
	
	  if ((0, _fp.some)(function (entity) {
	    return entity.quantity === undefined;
	  }, maybeEntities)) return null;
	
	  var entities = maybeEntities;
	  return entities;
	};
	
	var unitParts = [_tokenTypes.TOKEN_NUMBER, _tokenTypes.TOKEN_UNIT_NAME, _tokenTypes.TOKEN_UNIT_PREFIX, _tokenTypes.TOKEN_UNIT_SUFFIX];
	
	var entityTransform = {
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureOptions(unitParts).negate().lazy().any(), new _patternMatcher.Pattern([new _patternMatcher.CaptureOptions(unitParts).lazy().oneOrMore(), new _patternMatcher.CaptureOptions(unitParts).negate().lazy().any()]).oneOrMore()]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform((0, _util2.evenIndexElements)(captureGroups), function (segments) {
	      var unitSegments = (0, _util2.mapUnlessNull)(getEntities, (0, _util2.oddIndexElements)(captureGroups));
	      if (!unitSegments) return null;
	
	      var zippedSegments = (0, _util2.flatZip)(segments, unitSegments);
	      return (0, _util2.uncastArray)(zippedSegments);
	    });
	  }
	};
	exports.default = entityTransform;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.simplifyUnits = exports.convertComposite = exports.convertToFundamentalUnits = exports.convertTo = exports.isUnitless = exports.groupUnitsByFundamentalDimensions = exports.unitsAreCompatable = exports.unitsAreLinear = exports.getFundamentalUnits = exports.combineUnits = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _ = __webpack_require__(9);
	
	var _util = __webpack_require__(16);
	
	var _baseDimensions = __webpack_require__(30);
	
	var _baseDimensions2 = _interopRequireDefault(_baseDimensions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var getConversionDescriptor = function getConversionDescriptor(context, unitName) {
	  var siUnitDescriptor = context.conversionDescriptors[unitName];
	  if (!siUnitDescriptor) throw new Error(unitName + ' is not defined');
	  return siUnitDescriptor;
	};
	
	// Unit utils
	var addUnitValues = function addUnitValues(lhsUnitValue, rhsUnitValue) {
	  return (lhsUnitValue || 0) + (rhsUnitValue || 0);
	};
	
	var unitIsLinear = (0, _fp.curry)(function (context, unitName) {
	  return typeof getConversionDescriptor(context, unitName)[0] === 'number';
	});
	
	var combineUnits = exports.combineUnits = (0, _fp.curry)(function (units1, units2) {
	  return (0, _fp.flow)((0, _fp.mergeWith)(addUnitValues), (0, _fp.omitBy)((0, _fp.eq)(0)))(units1, units2);
	});
	
	var getFundamentalUnits = exports.getFundamentalUnits = (0, _fp.curry)(function (context, units) {
	  return (0, _fp.reduce)(function (accum, _ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var unitName = _ref2[0];
	    var unitValue = _ref2[1];
	
	    var siUnitDimensions = (0, _fp.mapKeys)((0, _fp.propertyOf)(_baseDimensions2.default), getConversionDescriptor(context, unitName)[1]);
	    var scaledSiUnitDimensions = (0, _fp.mapValues)((0, _fp.multiply)(unitValue), siUnitDimensions);
	    return combineUnits(scaledSiUnitDimensions, accum);
	  }, {}, (0, _fp.toPairs)(units));
	});
	
	var unitsAreLinear = exports.unitsAreLinear = (0, _fp.curry)(function (context, units) {
	  return (0, _fp.flow)(_fp.keys, (0, _fp.every)(unitIsLinear(context)))(units);
	});
	
	var unitsAreCompatable = exports.unitsAreCompatable = (0, _fp.curry)(function (context, units1, units2) {
	  return (0, _fp.isEqual)(getFundamentalUnits(context, units1), getFundamentalUnits(context, units2));
	});
	
	var sizeWithoutLengthBug = (0, _fp.flow)(_fp.keys, _fp.size);
	var groupUnitsByFundamentalDimensions = exports.groupUnitsByFundamentalDimensions = (0, _fp.curry)(function (context, units) {
	  var unitNames = (0, _fp.keys)(units);
	
	  var unitsWithOneFundamentalQuantity = (0, _fp.filter)(function (unitName) {
	    return sizeWithoutLengthBug(getConversionDescriptor(context, unitName)[1]) === 1;
	  }, unitNames);
	
	  var unitsGroupedByFundamentalType = (0, _fp.groupBy)(function (unitName) {
	    return (0, _fp.keys)(getConversionDescriptor(context, unitName)[1])[0];
	  }, unitsWithOneFundamentalQuantity);
	
	  var unitsGroupedByFundamentalTypeThenFundamentalPower = (0, _fp.mapValues)((0, _fp.groupBy)(function (unitName) {
	    return (0, _fp.values)(getConversionDescriptor(context, unitName)[1])[0];
	  }), unitsGroupedByFundamentalType);
	
	  return unitsGroupedByFundamentalTypeThenFundamentalPower;
	});
	
	// Entity utils
	var isUnitless = exports.isUnitless = function isUnitless(entity) {
	  return (0, _fp.isEmpty)(entity.units);
	};
	
	var conversionValueNumerator = 1;
	var conversionValueDenominator = -1;
	
	var calculateConversionValue = function calculateConversionValue(context, direction, units) {
	  return function (quantity) {
	    return (0, _fp.reduce)(function (quantity, unitName) {
	      var siUnitValue = getConversionDescriptor(context, unitName)[0];
	
	      if (typeof siUnitValue === 'number') {
	        return quantity * Math.pow(siUnitValue, units[unitName] * direction);
	      } else if (direction === conversionValueNumerator) {
	        return siUnitValue.convertFromBase(quantity);
	      }
	      return siUnitValue.convertToBase(quantity);
	    }, quantity, (0, _fp.keys)(units));
	  };
	};
	
	var convertTo = exports.convertTo = function convertTo(context, units, entity) {
	  if ((0, _fp.isEqual)(units, entity.units)) return entity;
	  if (!unitsAreCompatable(context, units, entity.units)) return null;
	  var quantity = (0, _fp.flow)(calculateConversionValue(context, conversionValueNumerator, entity.units), calculateConversionValue(context, conversionValueDenominator, units))(entity.quantity);
	  return _extends({}, _.baseEntity, { quantity: quantity, units: units });
	};
	
	var convertToFundamentalUnits = exports.convertToFundamentalUnits = function convertToFundamentalUnits(context, entity) {
	  return convertTo(context, getFundamentalUnits(context, entity.units), entity);
	};
	
	var convertComposite = exports.convertComposite = function convertComposite(context, units, entity) {
	  var unitNames = (0, _util.mapUnlessNull)(function (unit) {
	    return (0, _fp.size)(unit) === 1 ? (0, _fp.keys)(unit)[0] : null;
	  }, units);
	
	  if (!unitNames) return null;
	
	  var sortedUnitNames = (0, _fp.sortBy)(function (unit) {
	    return -Number(getConversionDescriptor(context, unit)[0]);
	  }, unitNames);
	  var sortedUnits = (0, _fp.map)(function (unit) {
	    return _defineProperty({}, unit, 1);
	  }, sortedUnitNames);
	
	  var result = (0, _fp.reduce)((0, _util.propagateNull)(function (accum, unit) {
	    var convertedEntity = convertTo(context, unit, accum.remainder);
	    if (!convertedEntity) return null;
	
	    var quantity = convertedEntity.quantity;
	
	    // Add small amount to account for rounding errors
	
	    var compositeQuantity = Math.floor(quantity + 1E-6);
	    var remainderQuantity = quantity - compositeQuantity;
	
	    return {
	      composite: accum.composite.concat((0, _fp.set)('quantity', compositeQuantity, convertedEntity)),
	      remainder: (0, _fp.set)('quantity', remainderQuantity, convertedEntity)
	    };
	  }), {
	    remainder: entity,
	    composite: []
	  }, sortedUnits);
	
	  if (!result) return null;
	
	  return _extends({}, _.baseCompositeEntity, { value: result.composite });
	};
	
	// If you have lhs = x meter^-1 yard, convert to unitless
	var simplifyUnits = exports.simplifyUnits = function simplifyUnits(context, entity) {
	  var allUnitGroups = (0, _fp.flow)(groupUnitsByFundamentalDimensions(context), _fp.values, (0, _fp.flatMap)(_fp.values))(entity.units);
	
	  // If a unit group has both positive and negative powers
	  // { yard: -1 meter: 1 } is rejected, but { yard: 1, meter: 1 } is not
	  var unitsToConvertTo = (0, _fp.reject)((0, _fp.overEvery)([(0, _fp.some)(function (unit) {
	    return entity.units[unit] > 0;
	  }), (0, _fp.some)(function (unit) {
	    return entity.units[unit] < 0;
	  })]), allUnitGroups);
	
	  if ((0, _fp.size)(entity.units) === unitsToConvertTo.length) return entity;
	
	  var conversionUnits = (0, _fp.flow)(_fp.flatten, (0, _fp.map)(function (unit) {
	    return [unit, entity.units[unit]];
	  }), _fp.fromPairs)(unitsToConvertTo);
	
	  return convertTo(context, conversionUnits, entity);
	};

/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = {
		"time": "second",
		"length": "meter",
		"mass": "kilogram",
		"currency": "EUR",
		"memory": "bit",
		"absoluteTemperature": "Kelvin"
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _transforms;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _fp = __webpack_require__(1);
	
	var _colorForge = __webpack_require__(32);
	
	var _colorForge2 = _interopRequireDefault(_colorForge);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _types = __webpack_require__(9);
	
	var _functions = __webpack_require__(4);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _util = __webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var transforms = (_transforms = {}, _defineProperty(_transforms, _tokenTypes.TOKEN_COLOR, function (token) {
	  var _Color$hex = _colorForge2.default.hex(token.value);
	
	  var values = _Color$hex.values;
	  var alpha = _Color$hex.alpha;
	  var space = _Color$hex.space;
	
	  return _extends({}, _types.baseColor, { values: values, alpha: alpha, space: space });
	}), _defineProperty(_transforms, _tokenTypes.TOKEN_DATE_TIME, function (token) {
	  var _token$value = token.value;
	  var directionHint = _token$value.directionHint;
	  var value = _token$value.value;
	
	  if (!value) return null;
	  return _extends({}, _types.baseDateTime, { value: value, directionHint: directionHint });
	}), _defineProperty(_transforms, _tokenTypes.TOKEN_CONSTANT, function (token) {
	  var _token$value2 = token.value;
	  var value = _token$value2.value;
	  var power = _token$value2.power;
	
	  if (!value) return null;
	  if (power === 1) return value;
	  var powerEntity = _extends({}, _types.baseEntity, { quantity: power });
	  return _extends({}, _types.baseFunction, { name: _functions.FUNCTION_EXPONENT, args: [value, powerEntity] });
	}), _transforms);
	var transformTokens = (0, _fp.keys)(transforms);
	
	var remainingTokensTransform = {
	  pattern: new _patternMatcher.Pattern([new _patternMatcher.CaptureOptions(transformTokens).negate().lazy().any(), new _patternMatcher.Pattern([new _patternMatcher.CaptureOptions(transformTokens), new _patternMatcher.CaptureOptions(transformTokens).negate().lazy().any()]).oneOrMore()]),
	  transform: function transform(captureGroups, _transform) {
	    return _transform((0, _util.evenIndexElements)(captureGroups), function (segments) {
	      var remainingTokenSegments = (0, _util.mapUnlessNull)(function (element) {
	        var token = element[0];
	        return transforms[token.type](token);
	      }, (0, _util.oddIndexElements)(captureGroups));
	
	      if (!remainingTokenSegments) return null;
	
	      var remainingTokens = (0, _util.flatZip)(segments, remainingTokenSegments);
	      return (0, _util.uncastArray)(remainingTokens);
	    });
	  }
	};
	exports.default = remainingTokensTransform;

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_32__;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fp = __webpack_require__(1);
	
	var _patternMatcher = __webpack_require__(20);
	
	var _types = __webpack_require__(9);
	
	var nodes = _interopRequireWildcard(_types);
	
	var _tokenTypes = __webpack_require__(2);
	
	var _util = __webpack_require__(24);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var nodeTypes = (0, _fp.values)(nodes);
	
	var allowedTypes = [].concat(_toConsumableArray(nodeTypes), [_tokenTypes.TOKEN_NOOP]);
	
	var bracketTransform = {
	  pattern: new _patternMatcher.CaptureWildcard().oneOrMore().lazy(),
	  transform: function transform(captureGroups) {
	    var captureGroup = captureGroups[0];
	    var captureGroupTypes = (0, _fp.map)('type', captureGroup);
	    var extraneousTypes = (0, _fp.without)(allowedTypes, captureGroupTypes);
	
	    if (!(0, _fp.isEmpty)(extraneousTypes)) return null;
	
	    var value = (0, _fp.reject)({ type: _tokenTypes.TOKEN_NOOP }, captureGroup);
	
	    // compactMiscGroup will return null for empty values, but that will make the transformer
	    // incorrectly fail
	    if ((0, _fp.isEmpty)(value)) return [];
	
	    var miscGroup = { type: nodes.NODE_MISC_GROUP, value: value };
	    return (0, _util.compactMiscGroup)(miscGroup);
	  }
	};
	exports.default = bracketTransform;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _resolver = __webpack_require__(35);
	
	Object.defineProperty(exports, 'resolver', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_resolver).default;
	  }
	});
	
	var _resolverContext = __webpack_require__(58);
	
	Object.defineProperty(exports, 'defaultContext', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_resolverContext).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _fp = __webpack_require__(1);
	
	var _lodash = __webpack_require__(36);
	
	var _definitions = __webpack_require__(37);
	
	var _definitions2 = _interopRequireDefault(_definitions);
	
	var _types = __webpack_require__(9);
	
	var _miscGroup = __webpack_require__(54);
	
	var _conversion = __webpack_require__(55);
	
	var _dateTime = __webpack_require__(57);
	
	var _util = __webpack_require__(16);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var resolver = {
	  typedFunctionTrie: {},
	  variadicFunctions: {},
	  context: {},
	  setContext: function setContext(context) {
	    return (0, _fp.set)('context', context, this);
	  },
	  extendFunction: function extendFunction(functionName, types, fn) {
	    return (0, _fp.set)(['typedFunctionTrie', functionName].concat(_toConsumableArray(types), ['_fn']), fn, this);
	  },
	  resolve: function resolve(value) {
	    var _this = this;
	
	    if (!value) return null;
	    switch (value.type) {
	      case _types.NODE_BRACKETS:
	        {
	          var bracketsNode = value;
	          return this.resolve(bracketsNode.value);
	        }
	      case _types.NODE_FUNCTION:
	        {
	          var functionNode = value;
	          return this.executeFunction(functionNode);
	        }
	      case _types.NODE_MISC_GROUP:
	        {
	          var miscGroupNode = value;
	          var values = (0, _util.mapUnlessNull)(function (value) {
	            return _this.resolve(value);
	          }, miscGroupNode.value);
	          if (!values) return null;
	          return (0, _miscGroup.resolve)(this.context, values);
	        }
	      case _types.NODE_CONVERSION:
	        {
	          var context = this.context;
	
	          var conversionNode = value;
	
	          var resolvedValue = this.resolve(conversionNode.value);
	          if (!resolvedValue) return null;
	
	          return (0, _conversion.convert)(context, value, resolvedValue);
	        }
	      case _types.NODE_ASSIGNMENT:
	        {
	          var assignmentNode = value;
	
	          var _resolvedValue = this.resolve(assignmentNode.value);
	          if (!_resolvedValue) return null;
	
	          return _extends({}, _types.baseAssignment, { value: _resolvedValue, identifier: assignmentNode.identifier });
	        }
	      case _types.NODE_DATE_TIME:
	        return (0, _dateTime.resolveDefaults)(this.context, value);
	      case _types.NODE_ENTITY:
	      case _types.NODE_COMPOSITE_ENTITY:
	      case _types.NODE_PERCENTAGE:
	      case _types.NODE_COLOR:
	        return value;
	      default:
	        return null;
	    }
	  },
	  executeFunction: function executeFunction(fn) {
	    var _this2 = this;
	
	    var name = fn.name;
	    var unresolvedArgs = fn.args;
	
	
	    var args = (0, _util.mapUnlessNull)(function (arg) {
	      return _this2.resolve(arg);
	    }, unresolvedArgs);
	    if (!args) return null;
	
	    var triePath = (0, _fp.map)('type', args);
	    var func = (0, _fp.get)(['typedFunctionTrie', name].concat(_toConsumableArray(triePath), ['_fn']), this);
	    if (!func) func = (0, _fp.get)(['variadicFunctions', name], this);
	    if (!func) return null;
	
	    return func.apply(undefined, [this.context].concat(_toConsumableArray(args)));
	  }
	};
	
	(0, _fp.forEach)(function (_ref) {
	  var _ref2 = _slicedToArray(_ref, 3);
	
	  var functionName = _ref2[0];
	  var types = _ref2[1];
	  var fn = _ref2[2];
	
	  if (types) {
	    (0, _lodash.set)(resolver, ['typedFunctionTrie', functionName].concat(_toConsumableArray(types), ['_fn']), fn);
	  } else {
	    resolver.variadicFunctions[functionName] = fn;
	  }
	}, _definitions2.default);
	
	exports.default = resolver;

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_36__;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _color = __webpack_require__(38);
	
	var _color2 = _interopRequireDefault(_color);
	
	var _colorEntity = __webpack_require__(39);
	
	var _colorEntity2 = _interopRequireDefault(_colorEntity);
	
	var _colorPercentage = __webpack_require__(42);
	
	var _colorPercentage2 = _interopRequireDefault(_colorPercentage);
	
	var _constructors = __webpack_require__(43);
	
	var _constructors2 = _interopRequireDefault(_constructors);
	
	var _dateTime = __webpack_require__(44);
	
	var _dateTime2 = _interopRequireDefault(_dateTime);
	
	var _dateTimeEntity = __webpack_require__(47);
	
	var _dateTimeEntity2 = _interopRequireDefault(_dateTimeEntity);
	
	var _entity = __webpack_require__(48);
	
	var _entity2 = _interopRequireDefault(_entity);
	
	var _entityPercentage = __webpack_require__(53);
	
	var _entityPercentage2 = _interopRequireDefault(_entityPercentage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = [].concat(_color2.default, _colorEntity2.default, _colorPercentage2.default, _constructors2.default, _dateTime2.default, _dateTimeEntity2.default, _entity2.default, _entityPercentage2.default);

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.burn = exports.dodge = exports.overlay = exports.screen = exports.mix = exports.divide = exports.multiply = exports.subtract = exports.add = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _colorForge = __webpack_require__(32);
	
	var _colorForge2 = _interopRequireDefault(_colorForge);
	
	var _types = __webpack_require__(9);
	
	var _ = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var operationFactory = function operationFactory(operation) {
	  return function (context, left, right) {
	    var leftColor = new _colorForge2.default(left.values, left.alpha, left.space);
	    var rightColor = new _colorForge2.default(right.values, right.alpha, right.space);
	
	    var _leftColor$operation = leftColor[operation](rightColor);
	
	    var values = _leftColor$operation.values;
	    var alpha = _leftColor$operation.alpha;
	    var space = _leftColor$operation.space;
	
	    return _extends({}, _types.baseColor, { values: values, alpha: alpha, space: space });
	  };
	};
	
	var createMixer = function createMixer(fn) {
	  return function (context, left, right, valueNode) {
	    var leftColor = new _colorForge2.default(left.values, left.alpha, left.space);
	    var rightColor = new _colorForge2.default(right.values, right.alpha, right.space);
	
	    var _leftColor$mix = leftColor.mix(rightColor, fn(valueNode));
	
	    var values = _leftColor$mix.values;
	    var alpha = _leftColor$mix.alpha;
	    var space = _leftColor$mix.space;
	
	    return _extends({}, _types.baseColor, { values: values, alpha: alpha, space: space });
	  };
	};
	
	var add = exports.add = operationFactory('add');
	var subtract = exports.subtract = operationFactory('subtract');
	var multiply = exports.multiply = operationFactory('multiply');
	var divide = exports.divide = operationFactory('divide');
	var mix = exports.mix = operationFactory('mix');
	var screen = exports.screen = operationFactory('screen');
	var overlay = exports.overlay = operationFactory('overlay');
	var dodge = exports.dodge = operationFactory('dodge');
	var burn = exports.burn = operationFactory('burn');
	
	var mixEntity = createMixer(function (entity) {
	  return entity.quantity;
	});
	var mixPercentage = createMixer(function (percentage) {
	  return percentage.value / 100;
	});
	
	exports.default = [[_.FUNCTION_ADD, [_types.NODE_COLOR, _types.NODE_COLOR], add], [_.FUNCTION_SUBTRACT, [_types.NODE_COLOR, _types.NODE_COLOR], subtract], [_.FUNCTION_MULTIPLY, [_types.NODE_COLOR, _types.NODE_COLOR], multiply], [_.FUNCTION_DIVIDE, [_types.NODE_COLOR, _types.NODE_COLOR], divide], [_.FUNCTION_MIX, [_types.NODE_COLOR, _types.NODE_COLOR], mix], [_.FUNCTION_SCREEN, [_types.NODE_COLOR, _types.NODE_COLOR], screen], [_.FUNCTION_OVERLAY, [_types.NODE_COLOR, _types.NODE_COLOR], overlay], [_.FUNCTION_DODGE, [_types.NODE_COLOR, _types.NODE_COLOR], dodge], [_.FUNCTION_BURN, [_types.NODE_COLOR, _types.NODE_COLOR], burn], [_.FUNCTION_MIX, [_types.NODE_COLOR, _types.NODE_COLOR, _types.NODE_ENTITY], mixEntity], [_.FUNCTION_MIX, [_types.NODE_COLOR, _types.NODE_COLOR, _types.NODE_PERCENTAGE], mixPercentage]];

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.exponent = exports.divide = exports.multiply = exports.darken = exports.lighten = undefined;
	
	var _types = __webpack_require__(9);
	
	var _ = __webpack_require__(4);
	
	var _functions = __webpack_require__(40);
	
	var _color = __webpack_require__(41);
	
	var lightenDarkenFactory = function lightenDarkenFactory(fn) {
	  return (0, _color.evolveWhenUnitless)(function (color, entity) {
	    return fn(color, entity.quantity);
	  });
	}; // eslint-disable-line
	
	
	var multiplyDivideFactory = function multiplyDivideFactory(direction) {
	  return (0, _color.evolveWhenUnitless)(function (color, entity) {
	    return color.channelMultiply(Math.pow(entity.quantity, direction));
	  });
	};
	
	var exponentMath = (0, _color.evolveWhenUnitless)(function (color, entity) {
	  return color.exponent(entity.quantity);
	});
	
	var lightenMath = lightenDarkenFactory(_color.lighten);
	var darkenMath = lightenDarkenFactory(_color.darken);
	var multiplyMath = multiplyDivideFactory(1);
	var divideMath = multiplyDivideFactory(-1);
	
	exports.lighten = lightenMath;
	exports.darken = darkenMath;
	exports.multiply = multiplyMath;
	exports.divide = divideMath;
	exports.exponent = exponentMath;
	exports.default = [[_.FUNCTION_LIGHTEN, [_types.NODE_COLOR, _types.NODE_ENTITY], lightenMath], [_.FUNCTION_DARKEN, [_types.NODE_COLOR, _types.NODE_ENTITY], darkenMath], [_.FUNCTION_MULTIPLY, [_types.NODE_COLOR, _types.NODE_ENTITY], multiplyMath], [_.FUNCTION_DIVIDE, [_types.NODE_COLOR, _types.NODE_ENTITY], divideMath], [_.FUNCTION_EXPONENT, [_types.NODE_COLOR, _types.NODE_ENTITY], exponentMath], [_.FUNCTION_MULTIPLY, [_types.NODE_ENTITY, _types.NODE_COLOR], (0, _functions.flip2)(multiplyMath)]];

/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var flip2 = // eslint-disable-line
	exports.flip2 = function flip2(fn) {
	  return function (context, left, right) {
	    return fn(context, right, left);
	  };
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.darken = exports.lighten = exports.evolveWhenUnitless = exports.evolveColor = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _colorForge = __webpack_require__(32);
	
	var _colorForge2 = _interopRequireDefault(_colorForge);
	
	var _types = __webpack_require__(9);
	
	var _entity = __webpack_require__(29);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var evolveColor = exports.evolveColor = function evolveColor(node, evolve) {
	  var _evolve = evolve(new _colorForge2.default(node.values, node.alpha, node.space));
	
	  var values = _evolve.values;
	  var alpha = _evolve.alpha;
	  var space = _evolve.space;
	
	  return _extends({}, _types.baseColor, { values: values, alpha: alpha, space: space });
	};
	
	var evolveWhenUnitless = exports.evolveWhenUnitless = function evolveWhenUnitless(evolve) {
	  return function (context, left, right) {
	    return (0, _entity.isUnitless)(right) ? evolveColor(left, function (color) {
	      return evolve(color, right);
	    }) : null;
	  };
	};
	
	var lighten = exports.lighten = function lighten(node, value) {
	  return evolveColor(node, function (color) {
	    return color.lighten(value);
	  });
	};
	var darken = exports.darken = function darken(node, value) {
	  return evolveColor(node, function (color) {
	    return color.darken(value);
	  });
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.darken = exports.lighten = undefined;
	
	var _types = __webpack_require__(9);
	
	var _ = __webpack_require__(4);
	
	var _color = __webpack_require__(41);
	
	// eslint-disable-line
	var lightenDarkenFactory = function lightenDarkenFactory(fn) {
	  return function (context, left, right) {
	    return (0, _color.evolveColor)(left, function (color) {
	      return fn(color, right.value / 100);
	    });
	  };
	};
	
	
	var lightenMath = lightenDarkenFactory(_color.lighten);
	var darkenMath = lightenDarkenFactory(_color.darken);
	
	exports.lighten = lightenMath;
	exports.darken = darkenMath;
	exports.default = [[_.FUNCTION_LIGHTEN, [_types.NODE_COLOR, _types.NODE_PERCENTAGE], lightenMath], [_.FUNCTION_DARKEN, [_types.NODE_COLOR, _types.NODE_PERCENTAGE], darkenMath], [_.FUNCTION_ADD, [_types.NODE_COLOR, _types.NODE_PERCENTAGE], lightenMath], [_.FUNCTION_SUBTRACT, [_types.NODE_COLOR, _types.NODE_PERCENTAGE], darkenMath]];

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // eslint-disable-line
	
	
	var _fp = __webpack_require__(1);
	
	var _types = __webpack_require__(9);
	
	var _entity = __webpack_require__(29);
	
	var _ = __webpack_require__(4);
	
	var _util = __webpack_require__(16);
	
	var toX = function toX(value) {
	  return (0, _fp.curry)(function (context, node) {
	    if (!node) return null;
	
	    if (node.type === _types.NODE_ENTITY) {
	      var fundamental = (0, _entity.convertToFundamentalUnits)(context, node);
	      if (!fundamental) return null;
	      return (0, _fp.clamp)(0, value, node.quantity);
	    } else if (node.type === _types.NODE_PERCENTAGE) {
	      return value * node.value / 100;
	    }
	    return null;
	  });
	};
	
	var to360 = toX(360);
	var to255 = toX(255);
	var to100 = toX(100);
	var to1 = toX(1);
	
	var toDegrees = function toDegrees(context, node) {
	  if (node && node.type === _types.NODE_ENTITY) {
	    if ((0, _fp.isEqual)(node.units, { degree: 1 })) return node.quantity;
	    if ((0, _fp.isEqual)(node.units, { radian: 1 })) return 360 * node.quantity / (2 * Math.PI);
	  }
	  return to360(context, node);
	};
	
	var converter = function converter(space, transformers) {
	  return function (context, arg1, arg2, arg3, a) {
	    var values = (0, _util.mapUnlessNull)(function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 2);
	
	      var transformer = _ref2[0];
	      var value = _ref2[1];
	      return transformer(context, value);
	    }, (0, _fp.zip)(transformers, [arg1, arg2, arg3]));
	    if (!values) return null;
	
	    var alpha = a ? to1(context, a) : 1;
	    if (typeof alpha !== 'number') return null;
	
	    return _extends({}, _types.baseColor, { space: space, values: values, alpha: alpha });
	  };
	};
	
	var rgb = converter('rgb', [to255, to255, to255]);
	var hsl = converter('hsl', [toDegrees, to100, to100]);
	var hsv = converter('hsv', [toDegrees, to100, to100]);
	
	exports.default = [[_.FUNCTION_RGB, null, rgb], [_.FUNCTION_RGBA, null, rgb], [_.FUNCTION_HSL, null, hsl], [_.FUNCTION_HSLA, null, hsl], [_.FUNCTION_HSV, null, hsv], [_.FUNCTION_HSVA, null, hsv]];

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.subtract = exports.add = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _types = __webpack_require__(9);
	
	var _entity = __webpack_require__(29);
	
	var _date = __webpack_require__(45);
	
	var _ = __webpack_require__(4);
	
	var addSubtract = function addSubtract(context, left, right) {
	  var leftUtcUnix = (0, _date.dateTimeToUTCUnix)(left.value);
	  var rightUtcUnix = (0, _date.dateTimeToUTCUnix)(right.value);
	  var milliseconds = Math.abs(leftUtcUnix - rightUtcUnix);
	
	  var dateEntity = _extends({}, _types.baseEntity, {
	    quantity: milliseconds,
	    units: { millisecond: 1 }
	  });
	
	  if (milliseconds > 86400000) {
	    return (0, _entity.convertTo)(context, { day: 1 }, dateEntity);
	  } else if (milliseconds > 3600000) {
	    return (0, _entity.convertTo)(context, { hour: 1 }, dateEntity);
	  } else if (milliseconds > 60000) {
	    return (0, _entity.convertTo)(context, { minute: 1 }, dateEntity);
	  } else if (milliseconds > 1000) {
	    return (0, _entity.convertTo)(context, { second: 1 }, dateEntity);
	  }
	  return dateEntity;
	};
	
	exports.add = addSubtract;
	exports.subtract = addSubtract;
	exports.default = [[_.FUNCTION_ADD, [_types.NODE_DATE_TIME, _types.NODE_DATE_TIME], addSubtract], [_.FUNCTION_SUBTRACT, [_types.NODE_DATE_TIME, _types.NODE_DATE_TIME], addSubtract]];

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.unixTzToDateTime = exports.utcUnixToTz = exports.dateTimeToUTCUnix = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _loaded = __webpack_require__(46);
	
	var _loaded2 = _interopRequireDefault(_loaded);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var dateTimeToUTCUnix = exports.dateTimeToUTCUnix = function dateTimeToUTCUnix(dateTime) {
	  var year = dateTime.year;
	  var month = dateTime.month;
	  var date = dateTime.date;
	  var hour = dateTime.hour;
	  var minute = dateTime.minute;
	  var second = dateTime.second;
	  var timezone = dateTime.timezone;
	
	  return (0, _loaded2.default)(timezone)([year, month, date, hour, minute, second], 'UTC');
	};
	
	var utcUnixToTz = exports.utcUnixToTz = function utcUnixToTz(utcUnix, timezone) {
	  return (0, _loaded2.default)(utcUnix, timezone);
	};
	
	var unixTzToDateTime = exports.unixTzToDateTime = function unixTzToDateTime(unix, timezone) {
	  var formattedString = (0, _loaded2.default)(unix, '%Y %m %d %H %M %S');
	
	  var _map = (0, _fp.map)(Number, formattedString.split(' '));
	
	  var _map2 = _slicedToArray(_map, 6);
	
	  var year = _map2[0];
	  var month = _map2[1];
	  var date = _map2[2];
	  var hour = _map2[3];
	  var minute = _map2[4];
	  var second = _map2[5];
	
	  var dateTime = { year: year, month: month, date: date, hour: hour, minute: minute, second: second, timezone: timezone };
	  return dateTime;
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_46__;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.subtract = exports.add = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _types = __webpack_require__(9);
	
	var _entity = __webpack_require__(29);
	
	var _date = __webpack_require__(45);
	
	var _ = __webpack_require__(4);
	
	var _functions = __webpack_require__(40);
	
	var addSubtractFactory = function addSubtractFactory(direction) {
	  return function (context, left, right) {
	    var millisecondsEntity = (0, _entity.convertTo)(context, { millisecond: 1 }, right);
	    if (!millisecondsEntity) return null;
	
	    var utcUnix = (0, _date.dateTimeToUTCUnix)(left.value);
	    var offset = millisecondsEntity.quantity;
	    var newUtcUnix = utcUnix + offset * direction;
	    var newUnix = (0, _date.utcUnixToTz)(newUtcUnix, left.value.timezone);
	
	    var value = (0, _date.unixTzToDateTime)(newUnix, left.value.timezone);
	
	    return _extends({}, _types.baseDateTime, { value: value, directionHint: 1 });
	  };
	};
	
	var addMath = addSubtractFactory(1);
	var subtractMath = addSubtractFactory(-1);
	
	exports.add = addMath;
	exports.subtract = subtractMath;
	exports.default = [[_.FUNCTION_ADD, [_types.NODE_DATE_TIME, _types.NODE_ENTITY], addMath], [_.FUNCTION_SUBTRACT, [_types.NODE_DATE_TIME, _types.NODE_ENTITY], subtractMath], [_.FUNCTION_ADD, [_types.NODE_ENTITY, _types.NODE_DATE_TIME], (0, _functions.flip2)(addMath)]];

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _unary = __webpack_require__(49);
	
	Object.keys(_unary).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _unary[key];
	    }
	  });
	});
	
	var _bilinear = __webpack_require__(52);
	
	Object.keys(_bilinear).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _bilinear[key];
	    }
	  });
	});
	
	var _unary2 = _interopRequireDefault(_unary);
	
	var _bilinear2 = _interopRequireDefault(_bilinear);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = [].concat(_unary2.default, _bilinear2.default);

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.tanc = exports.cosc = exports.acoth = exports.acsch = exports.asech = exports.coth = exports.csch = exports.sech = exports.acot = exports.acsc = exports.asec = exports.cot = exports.csc = exports.sec = exports.sinc = exports.tanh = exports.sinh = exports.cosh = exports.atanh = exports.asinh = exports.acosh = exports.log2 = exports.log10 = exports.log1p = exports.log = exports.tan = exports.cos = exports.sin = exports.factorial = exports.clz32 = exports.sign = exports.trunc = exports.fround = exports.abs = exports.ceil = exports.floor = exports.round = exports.negate = exports.cbrt = exports.sqrt = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _fp = __webpack_require__(1);
	
	var _gamma = __webpack_require__(50);
	
	var _gamma2 = _interopRequireDefault(_gamma);
	
	var _mathp = __webpack_require__(51);
	
	var _mathp2 = _interopRequireDefault(_mathp);
	
	var _entity = __webpack_require__(29);
	
	var _types = __webpack_require__(9);
	
	var _ = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var unitlessFunction = function unitlessFunction(fn) {
	  return function (context, entity) {
	    var fundamental = (0, _entity.convertToFundamentalUnits)(context, entity);
	    return fundamental && (0, _entity.isUnitless)(fundamental) ? _extends({}, _types.baseEntity, { quantity: fn(fundamental.quantity) }) : null;
	  };
	};
	
	var quantityFn = function quantityFn(fn) {
	  return function (context, entity) {
	    return _extends({}, _types.baseEntity, {
	      quantity: fn(entity.quantity),
	      units: entity.units
	    });
	  };
	};
	
	var powerFn = function powerFn(power) {
	  return function (context, entity) {
	    return entity.quantity >= 0 ? _extends({}, _types.baseEntity, {
	      quantity: Math.pow(entity.quantity, 1 / power),
	      units: (0, _fp.mapValues)((0, _fp.multiply)(1 / power), entity.units)
	    }) : null;
	  };
	};
	
	var sqrt = exports.sqrt = powerFn(2);
	var cbrt = exports.cbrt = powerFn(3);
	
	var negate = exports.negate = quantityFn(function (x) {
	  return -x;
	});
	var round = exports.round = quantityFn(Math.round);
	var floor = exports.floor = quantityFn(Math.floor);
	var ceil = exports.ceil = quantityFn(Math.ceil);
	var abs = exports.abs = quantityFn(Math.abs);
	var fround = exports.fround = quantityFn(_mathp2.default.fround);
	var trunc = exports.trunc = quantityFn(_mathp2.default.trunc);
	var sign = exports.sign = quantityFn(_mathp2.default.sign);
	var clz32 = exports.clz32 = quantityFn(_mathp2.default.clz32);
	
	var factorial = exports.factorial = unitlessFunction(function (value) {
	  return (0, _gamma2.default)(value + 1);
	});
	
	// Fix annoying sin values
	var sin = exports.sin = unitlessFunction(function (x) {
	  return x % Math.PI !== 0 ? Math.sin(x) : 0;
	});
	var cos = exports.cos = unitlessFunction(Math.cos);
	var tan = exports.tan = unitlessFunction(Math.tan);
	var log = exports.log = unitlessFunction(Math.log);
	
	var log1p = exports.log1p = unitlessFunction(_mathp2.default.log1p);
	var log10 = exports.log10 = unitlessFunction(_mathp2.default.log10);
	var log2 = exports.log2 = unitlessFunction(_mathp2.default.log2);
	
	var acosh = exports.acosh = unitlessFunction(_mathp2.default.acosh);
	var asinh = exports.asinh = unitlessFunction(_mathp2.default.asinh);
	var atanh = exports.atanh = unitlessFunction(_mathp2.default.atanh);
	var cosh = exports.cosh = unitlessFunction(_mathp2.default.cosh);
	var sinh = exports.sinh = unitlessFunction(_mathp2.default.sinh);
	var tanh = exports.tanh = unitlessFunction(_mathp2.default.tanh);
	
	var sinc = exports.sinc = unitlessFunction(_mathp2.default.sinc);
	var sec = exports.sec = unitlessFunction(_mathp2.default.sec);
	var csc = exports.csc = unitlessFunction(_mathp2.default.csc);
	var cot = exports.cot = unitlessFunction(_mathp2.default.cot);
	var asec = exports.asec = unitlessFunction(_mathp2.default.asec);
	var acsc = exports.acsc = unitlessFunction(_mathp2.default.acsc);
	var acot = exports.acot = unitlessFunction(_mathp2.default.acot);
	var sech = exports.sech = unitlessFunction(_mathp2.default.sech);
	var csch = exports.csch = unitlessFunction(_mathp2.default.csch);
	var coth = exports.coth = unitlessFunction(_mathp2.default.coth);
	var asech = exports.asech = unitlessFunction(_mathp2.default.asech);
	var acsch = exports.acsch = unitlessFunction(_mathp2.default.acsch);
	var acoth = exports.acoth = unitlessFunction(_mathp2.default.acoth);
	
	var cosc = exports.cosc = unitlessFunction(function (x) {
	  return Math.cos(x) / x;
	});
	var tanc = exports.tanc = unitlessFunction(function (x) {
	  return x === 0 ? 1 : Math.tan(x) / x;
	});
	
	exports.default = [[_.FUNCTION_SQRT, [_types.NODE_ENTITY], sqrt], [_.FUNCTION_CBRT, [_types.NODE_ENTITY], cbrt], [_.FUNCTION_NEGATE, [_types.NODE_ENTITY], negate], [_.FUNCTION_ROUND, [_types.NODE_ENTITY], round], [_.FUNCTION_FLOOR, [_types.NODE_ENTITY], floor], [_.FUNCTION_CEIL, [_types.NODE_ENTITY], ceil], [_.FUNCTION_ABS, [_types.NODE_ENTITY], abs], [_.FUNCTION_FROUND, [_types.NODE_ENTITY], fround], [_.FUNCTION_TRUNC, [_types.NODE_ENTITY], trunc], [_.FUNCTION_SIGN, [_types.NODE_ENTITY], sign], [_.FUNCTION_CLZ32, [_types.NODE_ENTITY], clz32], [_.FUNCTION_FACTORIAL, [_types.NODE_ENTITY], factorial], [_.FUNCTION_SIN, [_types.NODE_ENTITY], sin], [_.FUNCTION_COS, [_types.NODE_ENTITY], cos], [_.FUNCTION_TAN, [_types.NODE_ENTITY], tan], [_.FUNCTION_LOG, [_types.NODE_ENTITY], log], [_.FUNCTION_LOG1P, [_types.NODE_ENTITY], log1p], [_.FUNCTION_LOG10, [_types.NODE_ENTITY], log10], [_.FUNCTION_LOG2, [_types.NODE_ENTITY], log2], [_.FUNCTION_ACOSH, [_types.NODE_ENTITY], acosh], [_.FUNCTION_ASINH, [_types.NODE_ENTITY], asinh], [_.FUNCTION_ATANH, [_types.NODE_ENTITY], atanh], [_.FUNCTION_COSH, [_types.NODE_ENTITY], cosh], [_.FUNCTION_SINH, [_types.NODE_ENTITY], sinh], [_.FUNCTION_TANH, [_types.NODE_ENTITY], tanh], [_.FUNCTION_SINC, [_types.NODE_ENTITY], sinc], [_.FUNCTION_SEC, [_types.NODE_ENTITY], sec], [_.FUNCTION_CSC, [_types.NODE_ENTITY], csc], [_.FUNCTION_COT, [_types.NODE_ENTITY], cot], [_.FUNCTION_ASEC, [_types.NODE_ENTITY], asec], [_.FUNCTION_ACSC, [_types.NODE_ENTITY], acsc], [_.FUNCTION_ACOT, [_types.NODE_ENTITY], acot], [_.FUNCTION_SECH, [_types.NODE_ENTITY], sech], [_.FUNCTION_CSCH, [_types.NODE_ENTITY], csch], [_.FUNCTION_COTH, [_types.NODE_ENTITY], coth], [_.FUNCTION_ASECH, [_types.NODE_ENTITY], asech], [_.FUNCTION_ACSCH, [_types.NODE_ENTITY], acsch], [_.FUNCTION_ACOTH, [_types.NODE_ENTITY], acoth], [_.FUNCTION_COSC, [_types.NODE_ENTITY], cosc], [_.FUNCTION_TANC, [_types.NODE_ENTITY], tanc]];

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_50__;

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_51__;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.exponent = exports.divide = exports.multiply = exports.subtract = exports.add = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _fp = __webpack_require__(1);
	
	var _entity = __webpack_require__(29);
	
	var _types = __webpack_require__(9);
	
	var _ = __webpack_require__(4);
	
	var isZero = (0, _fp.matchesProperty)('quantity', 0);
	var zeroEntity = _extends({}, _types.baseEntity, { quantity: 0 });
	
	var addSubtractFactory = function addSubtractFactory(direction) {
	  return function (context, left, right) {
	    if (!(0, _entity.unitsAreLinear)(context, left.units) || !(0, _entity.unitsAreLinear)(context, right.units)) return null;
	    if (isZero(right)) return left;
	    if (isZero(left)) return (0, _fp.update)('quantity', (0, _fp.multiply)(direction), right);
	
	    var rightWithLhsUnits = (0, _entity.convertTo)(context, left.units, right);
	    if (!rightWithLhsUnits) return null;
	
	    var quantity = left.quantity + rightWithLhsUnits.quantity * direction;
	    var units = left.units;
	    return _extends({}, _types.baseEntity, { quantity: quantity, units: units });
	  };
	};
	
	var multiplyDivideFactory = function multiplyDivideFactory(direction) {
	  return function (context, left, right) {
	    if (isZero(left)) return zeroEntity;
	    if (isZero(right)) return direction === 1 ? zeroEntity : null; // No division by zero
	
	    var rightEffectiveUnits = direction === 1 ? right.units : (0, _fp.mapValues)((0, _fp.multiply)(-1), right.units);
	
	    var quantity = left.quantity * Math.pow(right.quantity, direction);
	    var units = (0, _entity.combineUnits)(left.units, rightEffectiveUnits);
	
	    var entity = _extends({}, _types.baseEntity, { quantity: quantity, units: units });
	    entity = (0, _entity.simplifyUnits)(context, entity);
	
	    return entity;
	  };
	};
	
	var exponentMath = function exponentMath(context, left, right) {
	  var rightFundamentalUnits = right;
	
	  if (!(0, _entity.isUnitless)(right)) {
	    // Note: done for minor perf
	    rightFundamentalUnits = (0, _entity.convertToFundamentalUnits)(context, right);
	  }
	
	  if (!rightFundamentalUnits || !(0, _entity.isUnitless)(rightFundamentalUnits)) return null;
	
	  var quantity = Math.pow(left.quantity, rightFundamentalUnits.quantity);
	  var units = (0, _fp.mapValues)((0, _fp.multiply)(right.quantity), left.units);
	  return _extends({}, _types.baseEntity, { quantity: quantity, units: units });
	};
	
	var addMath = addSubtractFactory(1);
	var subtractMath = addSubtractFactory(-1);
	var multiplyMath = multiplyDivideFactory(1);
	var divideMath = multiplyDivideFactory(-1);
	
	exports.add = addMath;
	exports.subtract = subtractMath;
	exports.multiply = multiplyMath;
	exports.divide = divideMath;
	exports.exponent = exponentMath;
	exports.default = [[_.FUNCTION_ADD, [_types.NODE_ENTITY, _types.NODE_ENTITY], addMath], [_.FUNCTION_SUBTRACT, [_types.NODE_ENTITY, _types.NODE_ENTITY], subtractMath], [_.FUNCTION_MULTIPLY, [_types.NODE_ENTITY, _types.NODE_ENTITY], multiplyMath], [_.FUNCTION_DIVIDE, [_types.NODE_ENTITY, _types.NODE_ENTITY], divideMath], [_.FUNCTION_EXPONENT, [_types.NODE_ENTITY, _types.NODE_ENTITY], exponentMath]];

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.divide = exports.multiply = exports.subtract = exports.add = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // eslint-disable-line
	
	
	var _types = __webpack_require__(9);
	
	var _ = __webpack_require__(4);
	
	var _functions = __webpack_require__(40);
	
	var transform = function transform(_transform) {
	  return function (context, entity, percentage) {
	    return _extends({}, _types.baseEntity, {
	      quantity: _transform(entity.quantity, percentage.value),
	      units: entity.units
	    });
	  };
	};
	
	var addMath = transform(function (entityValue, percentageValue) {
	  return entityValue * ((100 + percentageValue) / 100);
	});
	
	var subtractMath = transform(function (entityValue, percentageValue) {
	  return entityValue * ((100 - percentageValue) / 100);
	});
	
	var multiplyMath = transform(function (entityValue, percentageValue) {
	  return entityValue * (percentageValue / 100);
	});
	
	var divideMath = transform(function (entityValue, percentageValue) {
	  return entityValue / (percentageValue / 100);
	});
	
	exports.add = addMath;
	exports.subtract = subtractMath;
	exports.multiply = multiplyMath;
	exports.divide = divideMath;
	exports.default = [[_.FUNCTION_ADD, [_types.NODE_ENTITY, _types.NODE_PERCENTAGE], addMath], [_.FUNCTION_SUBTRACT, [_types.NODE_ENTITY, _types.NODE_PERCENTAGE], subtractMath], [_.FUNCTION_MULTIPLY, [_types.NODE_ENTITY, _types.NODE_PERCENTAGE], multiplyMath], [_.FUNCTION_DIVIDE, [_types.NODE_ENTITY, _types.NODE_PERCENTAGE], divideMath], [_.FUNCTION_MULTIPLY, [_types.NODE_PERCENTAGE, _types.NODE_ENTITY], (0, _functions.flip2)(multiplyMath)]];

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resolve = undefined;
	
	var _fp = __webpack_require__(1);
	
	var _ = __webpack_require__(9);
	
	var _entity = __webpack_require__(29);
	
	var _entity2 = __webpack_require__(48);
	
	var entityOps = _interopRequireWildcard(_entity2);
	
	var _dateTime = __webpack_require__(44);
	
	var dateTimeOps = _interopRequireWildcard(_dateTime);
	
	var _dateTimeEntity = __webpack_require__(47);
	
	var dateTimeEntityOps = _interopRequireWildcard(_dateTimeEntity);
	
	var _entityPercentage = __webpack_require__(53);
	
	var entityPercentageOps = _interopRequireWildcard(_entityPercentage);
	
	var _util = __webpack_require__(16);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// eslint-disable-line
	var getUnitPowerForGroupedUnits = (0, _fp.curry)(function (units, unitGroup) {
	  return (0, _fp.reduce)(function (power, unitName) {
	    return power + units[unitName];
	  }, 0, unitGroup);
	});
	
	var pathsForGroupedUnits = function pathsForGroupedUnits(unitGroup) {
	  return (0, _fp.flow)(_fp.keys, (0, _fp.flatMap)(function (unitName) {
	    return (0, _fp.map)(function (unitPower) {
	      return [unitName, unitPower];
	    }, (0, _fp.keys)(unitGroup[unitName]));
	  }))(unitGroup);
	};
	
	var shouldDivide = function shouldDivide(context, leftUnits, rightUnits) {
	  /*
	  The logic for this is that you look for units that have the same dimensions on both the left and
	  right, and assume they want to divide. If they had { meter: 1 } and { yard: 1 }, they likely want
	  to divide. We only look for units that overlap, so { meter: 1 } and { yard: 1, GBP: -1 } will
	  still be a division.
	   If they have { liter: 1 } and { gallon: 1 }, they would want to divide. However, if they had
	  { liter: 1 } and { gallon: 1, mile: -1 }, they still want to divide, but if we did this based on
	  fundamental units only, they would not overlap.
	   To fix this, we get the fundamental unit powers for each unit. We map this to an object, so the
	  above would look like { meter: { 3: ['liter'] } } and { meter: { 3: ['gallon'] } }. We then look
	  at the powers for 'liter' and 'gallon' on each side, and if they are equal, we assume a division.
	   This is not perfect, because you'd want to divide { meter: 3 } and { gallon: 1 }. This should
	  probably be fixed at some point.
	  */
	  var resolveFundamentalPowers = function resolveFundamentalPowers(units) {
	    return (0, _fp.flow)((0, _entity.groupUnitsByFundamentalDimensions)(context), (0, _fp.mapValues)((0, _fp.mapValues)(getUnitPowerForGroupedUnits(units))))(units);
	  };
	
	  var leftGroupedUnits = resolveFundamentalPowers(leftUnits);
	  var rightGroupedUnits = resolveFundamentalPowers(rightUnits);
	
	  var leftPaths = pathsForGroupedUnits(leftGroupedUnits);
	  var rightPaths = pathsForGroupedUnits(rightGroupedUnits);
	
	  var overlappingPaths = (0, _fp.intersectionWith)(_fp.isEqual, leftPaths, rightPaths);
	
	  return overlappingPaths.length > 0 && (0, _fp.every)(function (path) {
	    return (0, _fp.get)(path, leftGroupedUnits) === (0, _fp.get)(path, rightGroupedUnits);
	  }, overlappingPaths);
	};
	
	var combineEntities = function combineEntities(context, left, right) {
	  var leftFundamentalUnits = (0, _entity.getFundamentalUnits)(context, left.units);
	  var rightFundamentalUnits = (0, _entity.getFundamentalUnits)(context, right.units);
	
	  if ((0, _fp.isEmpty)(leftFundamentalUnits) || (0, _fp.isEmpty)(rightFundamentalUnits)) {
	    return entityOps.multiply(context, left, right);
	  } else if ((0, _fp.isEqual)(leftFundamentalUnits, rightFundamentalUnits)) {
	    return entityOps.add(context, left, right);
	  } else if (shouldDivide(context, left.units, right.units)) {
	    return (0, _fp.size)(left.units) < (0, _fp.size)(right.units) ? entityOps.divide(context, left, right) : entityOps.divide(context, right, left);
	  }
	  return entityOps.multiply(context, left, right);
	};
	
	var combineDateTimeEntity = function combineDateTimeEntity(context, left, right) {
	  return left.directionHint === -1 ? dateTimeEntityOps.subtract(context, left, right) : dateTimeEntityOps.add(context, left, right);
	};
	
	var combineValues = function combineValues(context) {
	  return function (left, right) {
	    if (left.type === _.NODE_ENTITY && right.type === _.NODE_ENTITY) {
	      return combineEntities(context, left, right);
	    } else if (left.type === _.NODE_DATE_TIME && right.type === _.NODE_DATE_TIME) {
	      return dateTimeOps.add(context, left, right);
	    } else if (left.type === _.NODE_DATE_TIME && right.type === _.NODE_ENTITY) {
	      return combineDateTimeEntity(context, left, right);
	    } else if (left.type === _.NODE_ENTITY && right.type === _.NODE_DATE_TIME) {
	      return combineDateTimeEntity(context, right, left);
	    } else if (left.type === _.NODE_ENTITY && right.type === _.NODE_PERCENTAGE) {
	      return entityPercentageOps.multiply(context, left, right);
	    } else if (left.type === _.NODE_PERCENTAGE && right.type === _.NODE_ENTITY) {
	      return entityPercentageOps.multiply(context, right, left);
	    }
	    return null;
	  };
	};
	
	var resolve = exports.resolve = function resolve( // eslint-disable-line
	context, values) {
	  return (0, _fp.reduce)((0, _util.propagateNull)(combineValues(context)), (0, _fp.first)(values), (0, _fp.drop)(1, values));
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.convert = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _fp = __webpack_require__(1);
	
	var _ = __webpack_require__(9);
	
	var _entity = __webpack_require__(29);
	
	var _color = __webpack_require__(56);
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } // eslint-disable-line
	
	
	var convert = exports.convert = function convert( // eslint-disable-line
	context, conversion, value) {
	  if (value.type === _.NODE_ENTITY && !(0, _fp.isEmpty)(value.pseudoConversion)) return null;
	  if (value.type !== _.NODE_ENTITY && !(0, _fp.isEmpty)(value.entityConversion)) return null;
	
	  switch (value.type) {
	    case _.NODE_ENTITY:
	      {
	        var units = conversion.entityConversion;
	        var entity = value;
	
	        if (!(0, _fp.isEmpty)(units)) {
	          var _units = _toArray(units);
	
	          var firstUnit = _units[0];
	
	          var remainingUnits = _units.slice(1);
	
	          var allUnitsCompatable = !(0, _fp.isEmpty)(remainingUnits) && (0, _fp.every)((0, _entity.unitsAreCompatable)(context, firstUnit), remainingUnits);
	
	          entity = allUnitsCompatable ? (0, _entity.convertComposite)(context, units, entity) : (0, _entity.convertTo)(context, (0, _fp.reduce)(_entity.combineUnits, firstUnit, remainingUnits), entity);
	        }
	
	        if (!entity) return null;
	        entity = (0, _fp.set)('formatting', conversion.formatting, entity);
	
	        return entity;
	      }
	    case _.NODE_COLOR:
	      {
	        var conversionSpace = conversion.pseudoConversion;
	        var color = value;
	        var formatting = conversion.formatting;
	
	
	        if (conversionSpace) {
	          var hasAlphaComponent = (0, _fp.endsWith)('a', conversionSpace);
	          var targetColorSpace = hasAlphaComponent ? conversionSpace.slice(0, -1) : conversionSpace;
	
	          color = (0, _color.convertSpace)(context, targetColorSpace, color);
	          formatting = _extends({}, formatting, { asFunction: true, withAlpha: hasAlphaComponent });
	        }
	
	        color = (0, _fp.set)('formatting', formatting, color);
	
	        return color;
	      }
	    default:
	      return null;
	  }
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.convertSpace = undefined;
	
	var _color = __webpack_require__(41);
	
	var convertSpace = exports.convertSpace = function convertSpace( // eslint-disable-line
	context, targetColorSpace, color) {
	  return (0, _color.evolveColor)(color, function (color) {
	    return color.convert(targetColorSpace);
	  });
	}; // eslint-disable-line

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.resolveDefaults = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _fp = __webpack_require__(1);
	
	var _ = __webpack_require__(9);
	
	// eslint-disable-line
	
	/* eslint-disable import/prefer-default-export */
	var resolveDefaults = exports.resolveDefaults = function resolveDefaults(context, dateTime) {
	  return _extends({}, _.baseDateTime, {
	    value: (0, _fp.assignWith)(function (a, b) {
	      return a !== null ? a : b;
	    }, dateTime.value, context.date),
	    directionHint: dateTime.directionHint
	  });
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fp = __webpack_require__(1);
	
	var defaultContext = {
	  conversionDescriptors: {},
	  date: {
	    second: 0,
	    minute: 0,
	    hour: 0,
	    date: 1,
	    month: 1, // See note in ./types
	    year: 1970,
	    timezone: 'UTC'
	  },
	  setUnits: function setUnits(conversionDescriptors) {
	    return (0, _fp.set)('conversionDescriptors', conversionDescriptors, this);
	  },
	  setDate: function setDate(date) {
	    return (0, _fp.update)('date', (0, _fp.assign)(_fp.__, date), this);
	  }
	};
	exports.default = defaultContext;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fp = __webpack_require__(1);
	
	var _en = __webpack_require__(60);
	
	var _en2 = _interopRequireDefault(_en);
	
	var _defaultLocale = __webpack_require__(65);
	
	var _defaultLocale2 = _interopRequireDefault(_defaultLocale);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var localeFormatters = {
	  en: _en2.default
	};
	
	// Technically allows for composition of locales, so you could do en_GB, base_en, defaultLocale
	
	var formatter = {
	  locales: [_defaultLocale2.default],
	  setLocale: function setLocale(locale) {
	    return locale in localeFormatters ? (0, _fp.set)('locales', [localeFormatters[locale], _defaultLocale2.default], this) : (0, _fp.set)('locales', [_defaultLocale2.default], this);
	  },
	  format: function format(context, node) {
	    if (!node) return '';
	    var type = node.type;
	
	    var contextWithFormat = (0, _fp.set)('formatter', this, context);
	
	    return (0, _fp.reduce)(function (output, localeFormatter) {
	      if (output) {
	        return output;
	      } else if (type in localeFormatter) {
	        return localeFormatter[type](contextWithFormat, node);
	      }
	      return '';
	    }, '', this.locales);
	  }
	};
	exports.default = formatter;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _enFormatter;
	
	var _fp = __webpack_require__(1);
	
	var _types = __webpack_require__(9);
	
	var _entity = __webpack_require__(61);
	
	var _entity2 = _interopRequireDefault(_entity);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var formatZeros = (0, _fp.flow)(String, (0, _fp.padCharsStart)('0', 2));
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	var enFormatter = (_enFormatter = {}, _defineProperty(_enFormatter, _types.NODE_ENTITY, _entity2.default), _defineProperty(_enFormatter, _types.NODE_DATE_TIME, function (context, dateTime) {
	  var _dateTime$value = dateTime.value;
	  var year = _dateTime$value.year;
	  var month = _dateTime$value.month;
	  var date = _dateTime$value.date;
	  var hour = _dateTime$value.hour;
	  var minute = _dateTime$value.minute;
	  var timezone = _dateTime$value.timezone;
	
	  var day = days[new Date(year, month - 1, date).getDay()];
	  var time = formatZeros(hour) + ':' + formatZeros(minute);
	  var tz = timezone === 'UTC' ? '' : ' (' + timezone + ')';
	  return time + ' ' + day + ' ' + date + ' ' + months[month - 1] + ' ' + year + tz;
	}), _enFormatter);
	exports.default = enFormatter;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _entity = __webpack_require__(29);
	
	var _enUnitFormatting = __webpack_require__(62);
	
	var _enUnitFormatting2 = _interopRequireDefault(_enUnitFormatting);
	
	var _enUnitPlurals = __webpack_require__(63);
	
	var _enUnitPlurals2 = _interopRequireDefault(_enUnitPlurals);
	
	var _util = __webpack_require__(64);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint-disable quote-props */
	var baseNames = {
	  '2': '0b',
	  '8': '0o',
	  '10': '',
	  '16': '0x'
	};
	/* eslint-enable */
	
	var formatUnits = function formatUnits(value, entity) {
	  var isPlural = entity.quantity !== 1;
	  var formatPlural = isPlural ? function (unit) {
	    return (0, _fp.getOr)(unit, unit, _enUnitPlurals2.default);
	  } : function (unit) {
	    return unit;
	  };
	
	  return (0, _fp.reduce)(function (value, _ref) {
	    var _ref2 = _slicedToArray(_ref, 2);
	
	    var unit = _ref2[0];
	    var power = _ref2[1];
	
	    if (unit.power > 1) {
	      return value + ' ' + formatPlural(unit) + '^' + (0, _util.formatPower)(power);
	    } else if (unit.power < -1) {
	      return value + ' per ' + unit + '^' + (0, _util.formatPower)(power);
	    } else if (unit.power === -1) {
	      return value + ' per ' + unit;
	    }
	    // power is 1
	    if (unit in _enUnitFormatting2.default) {
	      var _unitFormatting$unit = _slicedToArray(_enUnitFormatting2.default[unit], 2);
	
	      var title = _unitFormatting$unit[0];
	      var position = _unitFormatting$unit[1];
	
	      return position === 'suffix' ? '' + value + title : '' + title + value;
	    }
	    return value + ' ' + formatPlural(unit);
	  }, value, (0, _fp.toPairs)(entity.units));
	};
	
	var isCurrency = function isCurrency(context, entity) {
	  return !entity.formatting.base && !entity.formatting.decimalPlaces && !entity.formatting.significantFigures && (0, _fp.isEqual)((0, _entity.getFundamentalUnits)(context, entity.units), { EUR: 1 });
	};
	
	var formatCurrency = function formatCurrency(context, entity) {
	  return formatUnits(entity.quantity.toFixed(2), entity);
	};
	
	var baseNumberFormatter = function baseNumberFormatter(entity) {
	  var _entity$formatting = entity.formatting;
	  var base = _entity$formatting.base;
	  var decimalPlaces = _entity$formatting.decimalPlaces;
	  var significantFigures = _entity$formatting.significantFigures;
	
	  // if (entity.quantity === 1 && !noSymbols(entity)) {
	  //   return '';
	  // } else
	
	  if (base !== undefined) {
	    var prefix = (0, _fp.getOr)('(base ' + base + ') ', base, baseNames);
	    return '' + prefix + entity.quantity.toString(base);
	  } else if (decimalPlaces !== undefined) {
	    return entity.quantity.toFixed(decimalPlaces);
	  }
	
	  var absValue = Math.abs(entity.quantity);
	
	  if (significantFigures !== undefined) {
	    return absValue !== 0 ? entity.quantity.toFixed(significantFigures - (0, _util.orderOfMagnitude)(absValue)) : '0';
	  } else if (absValue > 1E2 || absValue === 0) {
	    return entity.quantity.toFixed(0);
	  } else if (absValue > 1E-6) {
	    // Note bigger than zero, so no log 0
	    var magnitude = (0, _util.orderOfMagnitude)(absValue);
	
	    if (absValue - Math.floor(absValue) < Math.pow(10, magnitude) * 1E-3) {
	      // Last three numbers zero. i.e. 1,234,000
	      // Don't show decimal place
	      return entity.quantity.toFixed(0);
	    }
	    // Show two significant figures
	    return entity.quantity.toFixed(2 - magnitude);
	  }
	  return entity.quantity.toExponential(3);
	};
	
	var baseFormatter = function baseFormatter(context, entity) {
	  return formatUnits(baseNumberFormatter(entity), entity);
	};
	
	var entityFormatter = (0, _fp.cond)([[isCurrency, formatCurrency], [_fp.stubTrue, baseFormatter]]);
	exports.default = entityFormatter;

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = {
		"angstrom": [
			" Å",
			"suffix"
		],
		"Celsius": [
			"℃",
			"suffix"
		],
		"Fahrenheit": [
			"℉",
			"suffix"
		],
		"Kelvin": [
			" Kelvin",
			"suffix"
		],
		"gas mark": [
			"Gas mark ",
			"prefix"
		],
		"EUR": [
			"€",
			"prefix"
		],
		"GBP": [
			"£",
			"prefix"
		],
		"USD": [
			"$",
			"prefix"
		],
		"kilobyte": [
			"KB",
			"suffix"
		],
		"megabyte": [
			"MB",
			"suffix"
		],
		"gigabyte": [
			"GB",
			"suffix"
		],
		"terabyte": [
			"TB",
			"suffix"
		],
		"petabyte": [
			"PB",
			"suffix"
		],
		"kibibyte": [
			"KiB",
			"suffix"
		],
		"mebibyte": [
			"MiB",
			"suffix"
		],
		"gibibyte": [
			"GiB",
			"suffix"
		],
		"tebibyte": [
			"TiB",
			"suffix"
		],
		"pebibyte": [
			"PiB",
			"suffix"
		],
		"degree": [
			"°",
			"suffix"
		],
		"percent": [
			"%",
			"suffix"
		],
		"arcsecond": [
			"″",
			"suffix"
		],
		"arcminute": [
			"′",
			"suffix"
		]
	};

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = {
		"second": "seconds",
		"minute": "minutes",
		"hour": "hours",
		"day": "days",
		"weekday": "weekdays",
		"week": "weeks",
		"fortnight": "fortnights",
		"month": "months",
		"year": "years",
		"decade": "decades",
		"century": "centuries",
		"meter": "meters",
		"inch": "inches",
		"foot": "feet",
		"yard": "yards",
		"mile": "miles",
		"league": "leagues",
		"fathom": "fathoms",
		"furlong": "furlongs",
		"light year": "light years",
		"parsec": "parsecs",
		"nautical mile": "nautical miles",
		"gram": "grams",
		"tonne": "tonnes",
		"ounce": "ounces",
		"pound": "pounds",
		"stone": "stones",
		"acre": "acres",
		"hectare": "hectares",
		"liter": "liters",
		"gallon": "gallons",
		"us gallon": "us gallons",
		"quart": "quarts",
		"cup": "cups",
		"US cup": "US cups",
		"teaspoon": "teaspoons",
		"tablespoon": "tablespoons",
		"drop": "drops",
		"fluid ounce": "fluid ounces",
		"Joule": "Joules",
		"Calorie": "Calories",
		"electron volt": "electron volts",
		"BTU": "BTUS",
		"therm": "therms",
		"degrees Kelvin": "degrees Kelvins",
		"degrees Celsius": "degrees Celsiuses",
		"degrees Fahrenheit": "degrees Fahrenheits",
		"degrees Rankine": "degrees Rankines",
		"Watt": "Watts",
		"bit": "bits",
		"byte": "bytes",
		"AUD": "AUDS",
		"BGN": "BGNS",
		"BRL": "BRLS",
		"CAD": "CADS",
		"CHF": "CHFS",
		"CNY": "CNIES",
		"CZK": "CZKS",
		"DKK": "DKKS",
		"HKD": "HKDS",
		"HRK": "HRKS",
		"HUF": "HUFS",
		"IDR": "IDRS",
		"ILS": "ILS",
		"INR": "INRS",
		"JPY": "JPIES",
		"KRW": "KRWS",
		"MXN": "MXNS",
		"MYR": "MYRS",
		"NOK": "NOKS",
		"NZD": "NZDS",
		"PHP": "PHPS",
		"PLN": "PLNS",
		"RON": "RONS",
		"RUB": "RUBS",
		"SEK": "SEKS",
		"SGD": "SGDS",
		"THB": "THBS",
		"TRY": "TRIES",
		"ZAR": "ZARS",
		"femtosecond": "femtoseconds",
		"picosecond": "picoseconds",
		"nanosecond": "nanoseconds",
		"microsecond": "microseconds",
		"millisecond": "milliseconds",
		"femtometer": "femtometers",
		"picometer": "picometers",
		"nanometer": "nanometers",
		"micrometer": "micrometers",
		"millimeter": "millimeters",
		"centimeter": "centimeters",
		"kilometer": "kilometers",
		"megameter": "megameters",
		"gigameter": "gigameters",
		"terameter": "terameters",
		"petameter": "petameters",
		"femtogram": "femtograms",
		"picogram": "picograms",
		"nanogram": "nanograms",
		"microgram": "micrograms",
		"milligram": "milligrams",
		"kilogram": "kilograms",
		"megagram": "megagrams",
		"gigagram": "gigagrams",
		"teragram": "teragrams",
		"petagram": "petagrams",
		"milliliter": "milliliters",
		"centiliter": "centiliters",
		"femtojoule": "femtojoules",
		"picojoule": "picojoules",
		"nanojoule": "nanojoules",
		"microjoule": "microjoules",
		"millijoule": "millijoules",
		"centijoule": "centijoules",
		"kilojoule": "kilojoules",
		"megajoule": "megajoules",
		"gigajoule": "gigajoules",
		"terajoule": "terajoules",
		"petajoule": "petajoules",
		"femtowatt": "femtowatts",
		"picowatt": "picowatts",
		"nanowatt": "nanowatts",
		"microwatt": "microwatts",
		"milliwatt": "milliwatts",
		"kilowatt": "kilowatts",
		"megawatt": "megawatts",
		"gigawatt": "gigawatts",
		"terawatt": "terawatts",
		"petawatt": "petawatts",
		"kilobit": "kilobits",
		"megabit": "megabits",
		"gigabit": "gigabits",
		"terabit": "terabits",
		"petabit": "petabits",
		"kibibit": "kibibits",
		"mebibit": "mebibits",
		"gibibit": "gibibits",
		"tebibit": "tebibits",
		"pebibit": "pebibits",
		"radian": "radians"
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.orderOfMagnitude = exports.formatPower = undefined;
	
	var _fp = __webpack_require__(1);
	
	/* eslint-disable quote-props */
	var powers = {
	  '0': '⁰',
	  '1': '¹',
	  '2': '²',
	  '3': '³',
	  '4': '⁴',
	  '5': '⁵',
	  '6': '⁶',
	  '7': '⁷',
	  '8': '⁸',
	  '9': '⁹',
	  '.': ' ',
	  '-': '⁻'
	};
	/* eslint-enable */
	
	var formatPower = exports.formatPower = (0, _fp.flow)(String, (0, _fp.split)(''), (0, _fp.map)((0, _fp.propertyOf)(powers)), (0, _fp.join)(''));
	
	var orderOfMagnitude = exports.orderOfMagnitude = function orderOfMagnitude(value) {
	  return Math.floor(Math.log10(value));
	};

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _defaultFormatter;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _fp = __webpack_require__(1);
	
	var _colorForge = __webpack_require__(32);
	
	var _colorForge2 = _interopRequireDefault(_colorForge);
	
	var _date = __webpack_require__(45);
	
	var _types = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var hsxFormatter = function hsxFormatter(_ref) {
	  var _ref2 = _slicedToArray(_ref, 3);
	
	  var hue = _ref2[0];
	  var a = _ref2[1];
	  var b = _ref2[2];
	  return [hue, a + '%', b + '%'];
	};
	var colorFormatters = {
	  hsl: hsxFormatter,
	  hsv: hsxFormatter
	};
	
	var defaultFormatter = (_defaultFormatter = {}, _defineProperty(_defaultFormatter, _types.NODE_ASSIGNMENT, function (context, assignment) {
	  return assignment.identifier + ' = ' + context.formatter.format(context, assignment.value);
	}), _defineProperty(_defaultFormatter, _types.NODE_ENTITY, function (context, entity) {
	  var unitsString = (0, _fp.flow)(_fp.toPairs, (0, _fp.map)(function (_ref3) {
	    var _ref4 = _slicedToArray(_ref3, 2);
	
	    var unit = _ref4[0];
	    var power = _ref4[1];
	    return power === 1 ? unit : unit + '^' + power;
	  }), (0, _fp.join)(' '))(entity.units);
	  return entity.quantity + ' ' + unitsString;
	}), _defineProperty(_defaultFormatter, _types.NODE_COMPOSITE_ENTITY, function (context, compositeEntity) {
	  var formattedEntities = (0, _fp.map)(function (entity) {
	    return context.formatter.format(context, entity);
	  }, compositeEntity.value);
	  return formattedEntities.join(' ');
	}), _defineProperty(_defaultFormatter, _types.NODE_COLOR, function (context, color) {
	  var _color$formatting = color.formatting;
	  var asFunction = _color$formatting.asFunction;
	  var withAlpha = _color$formatting.withAlpha;
	
	  if (!asFunction) return new _colorForge2.default(color.values, color.alpha, color.space).toHex();
	
	  var space = color.space;
	  var values = color.values;
	  var alpha = color.alpha;
	
	
	  var functionName = '' + space + (withAlpha ? 'a' : '');
	  var args = (0, _fp.map)(Math.round, values);
	
	  if (space in colorFormatters) args = colorFormatters[space](args);
	  if (withAlpha) args = args.concat(Math.round(alpha) === alpha ? alpha : alpha.toFixed(2));
	
	  return functionName + '(' + args.join(', ') + ')';
	}), _defineProperty(_defaultFormatter, _types.NODE_DATE_TIME, function (context, dateTime) {
	  return new Date((0, _date.dateTimeToUTCUnix)(dateTime)).toISOString();
	}), _defaultFormatter);
	exports.default = defaultFormatter;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fp = __webpack_require__(1);
	
	var timeDimensions = { time: 1 };
	
	var lengthDimensions = { length: 1 };
	var massDimensions = { mass: 1 };
	var areaDimensions = { length: 2 };
	var volumeDimensions = { length: 3 };
	var energyDimensions = { mass: 1, length: 2, time: -2 };
	var powerDimensions = { mass: 1, length: 2, time: -3 };
	var memoryDimensions = { memory: 1 };
	var currencyDimensions = { currency: 1 };
	var absoluteTemperatureDimensions = { absoluteTemperature: 1 };
	var noDimensions = {};
	
	var gasMarkToK = [380.35, 394.25, 408.15, 421.95, 435.85, 453.15, 463.65, 477.55, 491.45, 505.35, 519.25];
	var kToGasMark = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	
	// TODO: Copy from https://github.com/gentooboontoo/js-quantities/blob/master/src/quantities.js
	
	/* eslint-disable quote-props, no-multi-spaces, indent, max-len */
	var conversionDescriptors = {
	  'second': [1, timeDimensions],
	  'minute': [60, timeDimensions],
	  'hour': [3600, timeDimensions],
	  'day': [86400, timeDimensions],
	  'weekday': [120960, timeDimensions],
	  'week': [604800, timeDimensions],
	  'fortnight': [1209600, timeDimensions],
	  'month': [2628000, timeDimensions],
	  'year': [31536000, timeDimensions],
	  'decade': [315360000, timeDimensions],
	  'century': [3155673600, timeDimensions],
	
	  'meter': [1, lengthDimensions],
	  'inch': [0.0254, lengthDimensions],
	  'foot': [0.3048, lengthDimensions],
	  'yard': [0.9144, lengthDimensions],
	  'mile': [1609, lengthDimensions],
	  'league': [4827, lengthDimensions],
	  'fathom': [1.8288, lengthDimensions],
	  'furlong': [201, lengthDimensions],
	  'light year': [9.4605284e15, lengthDimensions],
	  'parsec': [3.086e16, lengthDimensions],
	  'angstrom': [1e-10, lengthDimensions],
	  'nautical mile': [1852, lengthDimensions],
	
	  'gram': [1e-3, massDimensions],
	  'tonne': [1e3, massDimensions],
	  'ounce': [0.0283495, massDimensions],
	  'pound': [0.453592, massDimensions],
	  'stone': [6.35029, massDimensions],
	
	  'acre': [4047, areaDimensions],
	  'hectare': [1e4, areaDimensions],
	
	  'liter': [1e-3, volumeDimensions],
	  'gallon': [4.54609e-3, volumeDimensions],
	  'us gallon': [3.785e-3, volumeDimensions],
	  'quart': [9.464e-4, volumeDimensions],
	  'cup': [2.4e-4, volumeDimensions],
	  'US cup': [2.3559e-4, volumeDimensions],
	  'teaspoon': [4.929e-6, volumeDimensions],
	  'tablespoon': [1.479e-5, volumeDimensions],
	  'drop': [5e-8, volumeDimensions],
	  'fluid ounce': [2.8413e-5, volumeDimensions],
	
	  'Joule': [1, energyDimensions],
	  'Calorie': [4.184, energyDimensions],
	  'electron volt': [1.602e-19, energyDimensions],
	  'BTU': [1055, energyDimensions],
	  'therm': [1055000000, energyDimensions],
	
	  // We also have absolute temperatures below
	  'degrees Kelvin': [1.4e-23, energyDimensions],
	  'degrees Celsius': [1.4e-23, energyDimensions],
	  'degrees Fahrenheit': [7.7777777778e-23, energyDimensions],
	  'degrees Rankine': [7.7777777778e-23, energyDimensions],
	
	  'Watt': [1, powerDimensions],
	
	  'bit': [1, memoryDimensions],
	  'byte': [8, memoryDimensions],
	
	  'AUD': [1, currencyDimensions],
	  'BGN': [1, currencyDimensions],
	  'BRL': [1, currencyDimensions],
	  'CAD': [1, currencyDimensions],
	  'CHF': [1, currencyDimensions],
	  'CNY': [1, currencyDimensions],
	  'CZK': [1, currencyDimensions],
	  'DKK': [1, currencyDimensions],
	  'EUR': [1, currencyDimensions],
	  'GBP': [1, currencyDimensions],
	  'HKD': [1, currencyDimensions],
	  'HRK': [1, currencyDimensions],
	  'HUF': [1, currencyDimensions],
	  'IDR': [1, currencyDimensions],
	  'ILS': [1, currencyDimensions],
	  'INR': [1, currencyDimensions],
	  'JPY': [1, currencyDimensions],
	  'KRW': [1, currencyDimensions],
	  'MXN': [1, currencyDimensions],
	  'MYR': [1, currencyDimensions],
	  'NOK': [1, currencyDimensions],
	  'NZD': [1, currencyDimensions],
	  'PHP': [1, currencyDimensions],
	  'PLN': [1, currencyDimensions],
	  'RON': [1, currencyDimensions],
	  'RUB': [1, currencyDimensions],
	  'SEK': [1, currencyDimensions],
	  'SGD': [1, currencyDimensions],
	  'THB': [1, currencyDimensions],
	  'TRY': [1, currencyDimensions],
	  'USD': [1, currencyDimensions],
	  'ZAR': [1, currencyDimensions],
	
	  'femtosecond': [1e-15, timeDimensions],
	  'picosecond': [1e-12, timeDimensions],
	  'nanosecond': [1e-9, timeDimensions],
	  'microsecond': [1e-6, timeDimensions],
	  'millisecond': [1e-3, timeDimensions],
	
	  'femtometer': [1e-15, lengthDimensions],
	  'picometer': [1e-12, lengthDimensions],
	  'nanometer': [1e-9, lengthDimensions],
	  'micrometer': [1e-6, lengthDimensions],
	  'millimeter': [1e-3, lengthDimensions],
	  'centimeter': [1e-2, lengthDimensions],
	  'kilometer': [1e3, lengthDimensions],
	  'megameter': [1e6, lengthDimensions],
	  'gigameter': [1e9, lengthDimensions],
	  'terameter': [1e12, lengthDimensions],
	  'petameter': [1e15, lengthDimensions],
	
	  'femtogram': [1e-18, massDimensions],
	  'picogram': [1e-15, massDimensions],
	  'nanogram': [1e-12, massDimensions],
	  'microgram': [1e-9, massDimensions],
	  'milligram': [1e-6, massDimensions],
	  'kilogram': [1, massDimensions],
	  'megagram': [1e3, massDimensions],
	  'gigagram': [1e6, massDimensions],
	  'teragram': [1e9, massDimensions],
	  'petagram': [1e12, massDimensions],
	
	  'milliliter': [1e-6, volumeDimensions],
	  'centiliter': [1e-5, volumeDimensions],
	
	  'femtojoule': [1e-15, energyDimensions],
	  'picojoule': [1e-12, energyDimensions],
	  'nanojoule': [1e-9, energyDimensions],
	  'microjoule': [1e-6, energyDimensions],
	  'millijoule': [1e-3, energyDimensions],
	  'centijoule': [1e-2, energyDimensions],
	  'kilojoule': [1e3, energyDimensions],
	  'megajoule': [1e6, energyDimensions],
	  'gigajoule': [1e9, energyDimensions],
	  'terajoule': [1e12, energyDimensions],
	  'petajoule': [1e15, energyDimensions],
	
	  'femtowatt': [1e-15, powerDimensions],
	  'picowatt': [1e-12, powerDimensions],
	  'nanowatt': [1e-9, powerDimensions],
	  'microwatt': [1e-6, powerDimensions],
	  'milliwatt': [1, powerDimensions],
	  'kilowatt': [1e3, powerDimensions],
	  'megawatt': [1e6, powerDimensions],
	  'gigawatt': [1e9, powerDimensions],
	  'terawatt': [1e12, powerDimensions],
	  'petawatt': [1e15, powerDimensions],
	
	  'kilobit': [1e3, memoryDimensions],
	  'megabit': [1e6, memoryDimensions],
	  'gigabit': [1e9, memoryDimensions],
	  'terabit': [1e12, memoryDimensions],
	  'petabit': [1e15, memoryDimensions],
	  'kibibit': [1024, memoryDimensions],
	  'mebibit': [1048576, memoryDimensions],
	  'gibibit': [1073741824, memoryDimensions],
	  'tebibit': [1099511627776, memoryDimensions],
	  'pebibit': [1125899906842624, memoryDimensions],
	
	  'kilobyte': [8e3, memoryDimensions],
	  'megabyte': [8e6, memoryDimensions],
	  'gigabyte': [8e9, memoryDimensions],
	  'terabyte': [8e12, memoryDimensions],
	  'petabyte': [8e15, memoryDimensions],
	  'kibibyte': [8192, memoryDimensions],
	  'mebibyte': [8388608, memoryDimensions],
	  'gibibyte': [8589934592, memoryDimensions],
	  'tebibyte': [8796093022208, memoryDimensions],
	  'pebibyte': [9007199254740992, memoryDimensions],
	
	  // 'percent': [0.01,                          noDimensions],
	  'degree': [0.0174532925199432957692369, noDimensions],
	  'radian': [1, noDimensions],
	  'arcminute': [0.000290888208665721596153948, noDimensions],
	  'arcsecond': [4.848136811095359935899141e-6, noDimensions],
	
	  // TODO: Rankine
	  'Kelvin': [1, absoluteTemperatureDimensions],
	  'Celsius': [{
	    convertToBase: function convertToBase(value) {
	      return value - 273.15;
	    },
	    convertFromBase: function convertFromBase(value) {
	      return value + 273.15;
	    }
	  }, absoluteTemperatureDimensions],
	  'gas mark': [{
	    convertToBase: function convertToBase(value) {
	      return kToGasMark[(0, _fp.findIndex)(function (k) {
	        return k >= value;
	      }, gasMarkToK)] || (0, _fp.last)(kToGasMark);
	    },
	    convertFromBase: function convertFromBase(value) {
	      return gasMarkToK[(0, _fp.findIndex)(function (gasMark) {
	        return gasMark >= value;
	      }, kToGasMark)] || (0, _fp.last)(gasMarkToK);
	    }
	  }, absoluteTemperatureDimensions],
	  'Fahrenheit': [{
	    convertToBase: function convertToBase(value) {
	      return (value - 273.15) * 1.8 + 32;
	    },
	    convertFromBase: function convertFromBase(value) {
	      return (value - 32) / 1.8 + 273.15;
	    }
	  }, absoluteTemperatureDimensions]
	};
	/* eslint-enable */
	
	exports.default = conversionDescriptors;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map