(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["typler"] = factory();
	else
		root["typler"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var isCompatible_1 = __webpack_require__(1);
exports.isCompatible = isCompatible_1.isCompatible;
var parseType_1 = __webpack_require__(2);
exports.parseType = parseType_1.parseType;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function findInType(types, { type, of }) {
    return types.some(value => {
        if (value.type !== type || (!!value.of && !of) || (!value.of && !!of))
            return false;
        if (of && value.of)
            return of.some(ofValue => findInType(value.of, ofValue));
        return true;
    });
}
function isCompatible(types, targets) {
    return targets.some(target => findInType(types, target));
}
exports.isCompatible = isCompatible;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const parsers = [
    {
        name: 'typename',
        length: -1,
        test: (char, lastChar) => {
            return /[^<>|]/i.test(char);
        }
    },
    {
        name: 'of',
        length: 1,
        test: (char, lastChar) => {
            if (char === '<') {
                if (lastChar === '<')
                    throw new Error('Duplicate "<"');
                if (lastChar === '>')
                    throw new Error('No reason for "<" after ">"');
                return true;
            }
        }
    },
    {
        name: 'ofEnd',
        length: 1,
        test: (char) => char === '>',
    },
    {
        name: 'or',
        length: 1,
        test: (char, lastChar) => {
            if (char === '|') {
                if (lastChar === '|')
                    throw new Error('Duplicate "|"');
            }
            return true;
        }
    }
];
function tokenize(source) {
    const trimedSource = source.replace(/\s/gi, '');
    const tokens = [];
    let lastToken;
    let lastChar;
    let char;
    for (let i = 0, length = trimedSource.length; i < length; i++) {
        char = trimedSource[i];
        // console.log(char, lastChar);
        parsers.some((parser) => {
            if (parser.test(char, lastChar)) {
                if (tokens.length !== 0 &&
                    tokens[tokens.length - 1].name === parser.name &&
                    (parser.length === -1 || tokens[tokens.length - 1].value.length < parser.length)) {
                    tokens[tokens.length - 1].value += char;
                }
                else {
                    tokens.push({
                        name: parser.name,
                        value: char,
                    });
                }
                return true;
            }
            return false;
        });
        lastChar = char;
    }
    return tokens;
}
function buildType(tokens) {
    const tree = [{}];
    let level = tree;
    let levels = [];
    let scope = tree[0];
    tokens.forEach(({ name, value }) => {
        switch (name) {
            case 'typename': {
                if (scope.type) {
                    scope = {};
                    level.push(scope);
                }
                scope.type = value;
                break;
            }
            case 'of': {
                scope.of = scope.of || [{}];
                levels.push(level);
                level = scope.of;
                scope = scope.of[scope.of.length - 1];
                break;
            }
            case 'ofEnd': {
                level = levels.pop();
                break;
            }
            case 'or': {
                break;
            }
        }
    });
    return tree;
}
function parseType(type) {
    return buildType(tokenize(type));
}
exports.parseType = parseType;


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxNDNjMDg5NmI4NDU3MDQwZTU4NyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lzQ29tcGF0aWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REEsNENBQTRDO0FBQXBDLGtEQUFZO0FBQ3BCLHlDQUFzQztBQUE5Qix5Q0FBUzs7Ozs7Ozs7OztBQ0NqQixvQkFBb0IsS0FBYyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBUTtJQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEtB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dGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInR5cGxlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJ0eXBsZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTQzYzA4OTZiODQ1NzA0MGU1ODciLCJleHBvcnQge2lzQ29tcGF0aWJsZX0gZnJvbSAnLi9pc0NvbXBhdGlibGUnO1xuZXhwb3J0IHtwYXJzZVR5cGV9IGZyb20gJy4vcGFyc2VUeXBlJztcbmV4cG9ydCB7SVR5cGV9IGZyb20gJy4vSVR5cGUnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LnRzIiwiaW1wb3J0IHtJVHlwZX0gZnJvbSAnLi9JVHlwZSc7XHJcblxyXG5mdW5jdGlvbiBmaW5kSW5UeXBlKHR5cGVzOiBJVHlwZVtdLCB7dHlwZSwgb2Z9OiBJVHlwZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHR5cGVzLnNvbWUodmFsdWUgPT4ge1xyXG4gICAgICAgIGlmICh2YWx1ZS50eXBlICE9PSB0eXBlIHx8ICghIXZhbHVlLm9mICYmICFvZikgfHwgKCF2YWx1ZS5vZiAmJiAhIW9mKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmIChvZiAmJiB2YWx1ZS5vZilcclxuICAgICAgICAgICAgcmV0dXJuIG9mLnNvbWUob2ZWYWx1ZSA9PiBmaW5kSW5UeXBlKHZhbHVlLm9mLCBvZlZhbHVlKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0NvbXBhdGlibGUodHlwZXM6IElUeXBlW10sIHRhcmdldHM6IElUeXBlW10pIHtcclxuICAgIHJldHVybiB0YXJnZXRzLnNvbWUodGFyZ2V0ID0+IGZpbmRJblR5cGUodHlwZXMsIHRhcmdldCkpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pc0NvbXBhdGlibGUudHMiLCJjb25zdCBwYXJzZXJzID0gW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICd0eXBlbmFtZScsXHJcbiAgICAgICAgbGVuZ3RoOiAtMSxcclxuICAgICAgICB0ZXN0OiAoY2hhcjogc3RyaW5nLCBsYXN0Q2hhcjogc3RyaW5nKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAvW148PnxdL2kudGVzdChjaGFyKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdvZicsXHJcbiAgICAgICAgbGVuZ3RoOiAxLFxyXG4gICAgICAgIHRlc3Q6IChjaGFyOiBzdHJpbmcsIGxhc3RDaGFyOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNoYXIgPT09ICc8Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RDaGFyID09PSAnPCcpIHRocm93IG5ldyBFcnJvcignRHVwbGljYXRlIFwiPFwiJyk7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdENoYXIgPT09ICc+JykgdGhyb3cgbmV3IEVycm9yKCdObyByZWFzb24gZm9yIFwiPFwiIGFmdGVyIFwiPlwiJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ29mRW5kJyxcclxuICAgICAgICBsZW5ndGg6IDEsXHJcbiAgICAgICAgdGVzdDogKGNoYXI6IHN0cmluZykgPT4gY2hhciA9PT0gJz4nLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnb3InLFxyXG4gICAgICAgIGxlbmd0aDogMSxcclxuICAgICAgICB0ZXN0OiAoY2hhcjogc3RyaW5nLCBsYXN0Q2hhcjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjaGFyID09PSAnfCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXN0Q2hhciA9PT0gJ3wnKSB0aHJvdyBuZXcgRXJyb3IoJ0R1cGxpY2F0ZSBcInxcIicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXTtcclxuXHJcbmZ1bmN0aW9uIHRva2VuaXplKHNvdXJjZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB0cmltZWRTb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXFxzL2dpLCAnJyk7XHJcbiAgICBjb25zdCB0b2tlbnM6IGFueVtdID0gW107XHJcblxyXG4gICAgbGV0IGxhc3RUb2tlbjtcclxuICAgIGxldCBsYXN0Q2hhcjogc3RyaW5nO1xyXG4gICAgbGV0IGNoYXI6IHN0cmluZztcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gdHJpbWVkU291cmNlLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2hhciA9IHRyaW1lZFNvdXJjZVtpXTtcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coY2hhciwgbGFzdENoYXIpO1xyXG4gICAgICAgIHBhcnNlcnMuc29tZSgocGFyc2VyKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChwYXJzZXIudGVzdChjaGFyLCBsYXN0Q2hhcikpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbnMubGVuZ3RoICE9PSAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS5uYW1lID09PSBwYXJzZXIubmFtZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChwYXJzZXIubGVuZ3RoID09PSAtMSB8fCB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLnZhbHVlLmxlbmd0aCA8IHBhcnNlci5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdLnZhbHVlICs9IGNoYXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwYXJzZXIubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNoYXIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxhc3RDaGFyID0gY2hhcjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdG9rZW5zO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFR5cGUodG9rZW5zOiB7bmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nfVtdKSB7XHJcbiAgICBjb25zdCB0cmVlOiBhbnlbXSA9IFt7fV07XHJcbiAgICBsZXQgbGV2ZWwgPSB0cmVlO1xyXG4gICAgbGV0IGxldmVsczogYW55W10gPSBbXTtcclxuICAgIGxldCBzY29wZSA9IHRyZWVbMF07XHJcblxyXG4gICAgdG9rZW5zLmZvckVhY2goKHtuYW1lLCB2YWx1ZX0pID0+IHtcclxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgY2FzZSAndHlwZW5hbWUnOiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NvcGUudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWwucHVzaChzY29wZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzY29wZS50eXBlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlICdvZic6IHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm9mID0gc2NvcGUub2YgfHwgW3t9XTtcclxuICAgICAgICAgICAgICAgIGxldmVscy5wdXNoKGxldmVsKTtcclxuICAgICAgICAgICAgICAgIGxldmVsID0gc2NvcGUub2Y7XHJcbiAgICAgICAgICAgICAgICBzY29wZSA9IHNjb3BlLm9mW3Njb3BlLm9mLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAnb2ZFbmQnOiB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbCA9IGxldmVscy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ29yJzoge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdHJlZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHlwZSh0eXBlOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiBidWlsZFR5cGUodG9rZW5pemUodHlwZSkpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYXJzZVR5cGUudHMiXSwic291cmNlUm9vdCI6IiJ9