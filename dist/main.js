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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyMDZhNjg4OWQ0OWM0MTRkOTIwMCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2lzQ29tcGF0aWJsZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REEsNENBQTRDO0FBQXBDLGtEQUFZO0FBQ3BCLHlDQUFzQztBQUE5Qix5Q0FBUzs7Ozs7Ozs7OztBQ0NqQixvQkFBb0IsS0FBYyxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBUTtJQUNqRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEtB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b24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJ0eXBsZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1widHlwbGVyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDIwNmE2ODg5ZDQ5YzQxNGQ5MjAwIiwiZXhwb3J0IHtpc0NvbXBhdGlibGV9IGZyb20gJy4vaXNDb21wYXRpYmxlJztcclxuZXhwb3J0IHtwYXJzZVR5cGV9IGZyb20gJy4vcGFyc2VUeXBlJztcclxuZXhwb3J0IHtJVHlwZX0gZnJvbSAnLi9JVHlwZSc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC50cyIsImltcG9ydCB7SVR5cGV9IGZyb20gJy4vSVR5cGUnO1xyXG5cclxuZnVuY3Rpb24gZmluZEluVHlwZSh0eXBlczogSVR5cGVbXSwge3R5cGUsIG9mfTogSVR5cGUpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0eXBlcy5zb21lKHZhbHVlID0+IHtcclxuICAgICAgICBpZiAodmFsdWUudHlwZSAhPT0gdHlwZSB8fCAoISF2YWx1ZS5vZiAmJiAhb2YpIHx8ICghdmFsdWUub2YgJiYgISFvZikpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAob2YgJiYgdmFsdWUub2YpXHJcbiAgICAgICAgICAgIHJldHVybiBvZi5zb21lKG9mVmFsdWUgPT4gZmluZEluVHlwZSh2YWx1ZS5vZiwgb2ZWYWx1ZSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wYXRpYmxlKHR5cGVzOiBJVHlwZVtdLCB0YXJnZXRzOiBJVHlwZVtdKSB7XHJcbiAgICByZXR1cm4gdGFyZ2V0cy5zb21lKHRhcmdldCA9PiBmaW5kSW5UeXBlKHR5cGVzLCB0YXJnZXQpKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaXNDb21wYXRpYmxlLnRzIiwiY29uc3QgcGFyc2VycyA9IFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAndHlwZW5hbWUnLFxyXG4gICAgICAgIGxlbmd0aDogLTEsXHJcbiAgICAgICAgdGVzdDogKGNoYXI6IHN0cmluZywgbGFzdENoYXI6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gL1tePD58XS9pLnRlc3QoY2hhcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnb2YnLFxyXG4gICAgICAgIGxlbmd0aDogMSxcclxuICAgICAgICB0ZXN0OiAoY2hhcjogc3RyaW5nLCBsYXN0Q2hhcjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjaGFyID09PSAnPCcpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsYXN0Q2hhciA9PT0gJzwnKSB0aHJvdyBuZXcgRXJyb3IoJ0R1cGxpY2F0ZSBcIjxcIicpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RDaGFyID09PSAnPicpIHRocm93IG5ldyBFcnJvcignTm8gcmVhc29uIGZvciBcIjxcIiBhZnRlciBcIj5cIicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdvZkVuZCcsXHJcbiAgICAgICAgbGVuZ3RoOiAxLFxyXG4gICAgICAgIHRlc3Q6IChjaGFyOiBzdHJpbmcpID0+IGNoYXIgPT09ICc+JyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ29yJyxcclxuICAgICAgICBsZW5ndGg6IDEsXHJcbiAgICAgICAgdGVzdDogKGNoYXI6IHN0cmluZywgbGFzdENoYXI6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2hhciA9PT0gJ3wnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdENoYXIgPT09ICd8JykgdGhyb3cgbmV3IEVycm9yKCdEdXBsaWNhdGUgXCJ8XCInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbl07XHJcblxyXG5mdW5jdGlvbiB0b2tlbml6ZShzb3VyY2U6IHN0cmluZykge1xyXG4gICAgY29uc3QgdHJpbWVkU291cmNlID0gc291cmNlLnJlcGxhY2UoL1xccy9naSwgJycpO1xyXG4gICAgY29uc3QgdG9rZW5zOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGxldCBsYXN0VG9rZW47XHJcbiAgICBsZXQgbGFzdENoYXI6IHN0cmluZztcclxuICAgIGxldCBjaGFyOiBzdHJpbmc7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHRyaW1lZFNvdXJjZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNoYXIgPSB0cmltZWRTb3VyY2VbaV07XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGNoYXIsIGxhc3RDaGFyKTtcclxuICAgICAgICBwYXJzZXJzLnNvbWUoKHBhcnNlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAocGFyc2VyLnRlc3QoY2hhciwgbGFzdENoYXIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5zLmxlbmd0aCAhPT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0ubmFtZSA9PT0gcGFyc2VyLm5hbWUgJiZcclxuICAgICAgICAgICAgICAgICAgICAocGFyc2VyLmxlbmd0aCA9PT0gLTEgfHwgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS52YWx1ZS5sZW5ndGggPCBwYXJzZXIubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXS52YWx1ZSArPSBjaGFyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFyc2VyLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjaGFyLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYXN0Q2hhciA9IGNoYXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRva2VucztcclxufVxyXG5cclxuZnVuY3Rpb24gYnVpbGRUeXBlKHRva2Vuczoge25hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZ31bXSkge1xyXG4gICAgY29uc3QgdHJlZTogYW55W10gPSBbe31dO1xyXG4gICAgbGV0IGxldmVsID0gdHJlZTtcclxuICAgIGxldCBsZXZlbHM6IGFueVtdID0gW107XHJcbiAgICBsZXQgc2NvcGUgPSB0cmVlWzBdO1xyXG5cclxuICAgIHRva2Vucy5mb3JFYWNoKCh7bmFtZSwgdmFsdWV9KSA9PiB7XHJcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3R5cGVuYW1lJzoge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjb3BlLnR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsLnB1c2goc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2NvcGUudHlwZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2FzZSAnb2YnOiB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5vZiA9IHNjb3BlLm9mIHx8IFt7fV07XHJcbiAgICAgICAgICAgICAgICBsZXZlbHMucHVzaChsZXZlbCk7XHJcbiAgICAgICAgICAgICAgICBsZXZlbCA9IHNjb3BlLm9mO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUgPSBzY29wZS5vZltzY29wZS5vZi5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgJ29mRW5kJzoge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwgPSBsZXZlbHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlICdvcic6IHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRyZWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVR5cGUodHlwZTogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gYnVpbGRUeXBlKHRva2VuaXplKHR5cGUpKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFyc2VUeXBlLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==