var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var document = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$2
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.4.6',
  mode:  'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var functionToString = Function.toString;

var inspectSource = shared('inspectSource', function (it) {
  return functionToString.call(it);
});

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = new WeakMap$1();
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var nativeAssign = Object.assign;
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
var objectAssign = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$1 = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod$1(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod$1(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod$1(3)
};

var trim = stringTrim.trim;


var nativeParseFloat = global_1.parseFloat;
var FORCED = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
var _parseFloat = FORCED ? function parseFloat(string) {
  var trimmedString = trim(String(string));
  var result = nativeParseFloat(trimmedString);
  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
} : nativeParseFloat;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
_export({ global: true, forced: parseFloat != _parseFloat }, {
  parseFloat: _parseFloat
});

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var aFunction$1 = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var bindContext = function (fn, that, length) {
  aFunction$1(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var useSymbolAsUid = nativeSymbol
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol() == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod$2 = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = bindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod$2(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod$2(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod$2(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod$2(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod$2(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod$2(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod$2(6)
};

var sloppyArrayMethod = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var $forEach = arrayIteration.forEach;


// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
  } catch (error) {
    CollectionPrototype.forEach = arrayForEach;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys$1(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var SIZES = {
  DEFAULT: 'default',
  SMALL: 'sm',
  LARGE: 'lg'
};
var MENU_POSITIONS = {
  TOP: 'top',
  BOTTOM: 'bottom'
};

function isObject$1(val) {
  return val && val.constructor === Object;
}
function getOffsetSum(elem) {
  var top = 0;
  var left = 0;

  while (elem) {
    top = top + parseFloat(elem.offsetTop);
    left = left + parseFloat(elem.offsetLeft);
    elem = elem.offsetParent;
  }

  return {
    top: Math.round(top),
    left: Math.round(left)
  };
}
function scrollIfNeeded(element, container) {
  if (element.offsetTop < container.scrollTop) {
    container.scrollTop = element.offsetTop;
  } else {
    var offsetBottom = element.offsetTop + element.offsetHeight;
    var scrollBottom = container.scrollTop + container.offsetHeight;

    if (offsetBottom > scrollBottom) {
      container.scrollTop = offsetBottom - container.offsetHeight;
    }
  }
}
function mergeDeep(target, source) {
  var output = Object.assign({}, target);

  if (isObject$1(target) && isObject$1(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject$1(source[key])) {
        if (!(key in target)) {
          Object.assign(output, _defineProperty({}, key, source[key]));
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, _defineProperty({}, key, source[key]));
      }
    });
  }

  return output;
}
function outOfViewportGetFreePosition(elem) {
  var bounding = elem.getBoundingClientRect();
  return bounding.top < 0 ? MENU_POSITIONS.BOTTOM : bounding.bottom > window.innerHeight ? MENU_POSITIONS.TOP // default position
  : false;
}

var userAgent = getBuiltIn('navigator', 'userAgent') || '';

var process$1 = global_1.process;
var versions = process$1 && process$1.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var v8Version = version && +version;

var SPECIES$1 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return v8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var $filter = arrayIteration.filter;



var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = HAS_SPECIES_SUPPORT && !fails(function () {
  [].filter.call({ length: -1, 0: 1 }, function (it) { throw it; });
});

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var IE_PROTO = sharedKey('IE_PROTO');

var PROTOTYPE = 'prototype';
var Empty = function () { /* empty */ };

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var length = enumBugKeys.length;
  var lt = '<';
  var script = 'script';
  var gt = '>';
  var js = 'java' + script + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(js);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
  return createDict();
};

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

hiddenKeys[IE_PROTO] = true;

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  createNonEnumerableProperty(ArrayPrototype, UNSCOPABLES, objectCreate(null));
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var $find = arrayIteration.find;


var FIND = 'find';
var SKIPS_HOLES = true;

// Shouldn't skip holes
if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

// `Array.prototype.find` method
// https://tc39.github.io/ecma262/#sec-array.prototype.find
_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables(FIND);

var $includes = arrayIncludes.includes;


// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
_export({ target: 'Array', proto: true }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');

var eventsListeners = {
  onSelectByArrow: function onSelectByArrow(e) {
    var _this = this;

    e.preventDefault();
    if (this.disabled || this.readonly) return;
    this.showMenu();

    if (this.arrowsIndex === null) {
      // если arrowsIndex не был задан, то ставит из выбранного элемента или из -1 (не 0 чтобы когда вниз нажимаешь, то не выбирался второй элемент)
      this.arrowsIndex = this.selectedItemIndex || -1;
    }

    if (e.key === 'ArrowDown') {
      this.arrowsIndex++;
    }

    if (e.key === 'ArrowUp') {
      this.arrowsIndex--;
    } // Переход на противоположную сторону


    var end = this.itemsComputed.length - 1;

    if (this.arrowsIndex < 0) {
      this.arrowsIndex = end;
    }

    if (this.arrowsIndex > end) {
      this.arrowsIndex = 0;
    }

    var itemByArrowsIndex = this.itemsComputed[this.arrowsIndex];

    if (this.arrowsDisableInstantSelection) {
      // подсвечивает элемент
      this.selectedItemByArrows = itemByArrowsIndex;
    } else {
      // сразу выбирает элемент
      this.setSearchData('');
      this.selectedItem = itemByArrowsIndex;
      this.fireSelectEvent(this.selectedItem);
    }

    if (this.scrollToItemIfNeeded) {
      // Прокурутка к элементу
      this.$nextTick(function () {
        var selectedElement = _this.$refs.items[_this.arrowsIndex]; // на всякий случай (это не ожидаемое поведение)

        if (!selectedElement) return;
        scrollIfNeeded(selectedElement, _this.$refs['IZ-select__menu-items']);
      });
    }
  },
  onEnter: function onEnter(e) {
    if (this.hasMenu) {
      e.preventDefault();
      var needToResetSearch = false; // если не выбрано через стрелки, то выбирать первый элемент

      if (!this.arrowsIndex && !this.disableFirstItemSelectOnEnter) {
        var firstItem = this.itemsComputed[0];
        if (!firstItem) return;
        this.fireSelectEvent(this.selectedItem = firstItem);
        needToResetSearch = true;
      } // если arrowsDisableInstantSelection и выбран элемент через стрелки (подсвечен), то сделать его выбранным


      if (this.arrowsDisableInstantSelection && this.selectedItemByArrows) {
        this.fireSelectEvent(this.selectedItem = this.selectedItemByArrows);
        needToResetSearch = true;
      }

      if (needToResetSearch) this.setSearchData('');
    } // show / hide menu


    this.hasMenu ? this.hideMenu() : this.showMenu();
  },
  onClick: function onClick() {
    if (this.disabled || this.readonly) return;
    this.setFocused();
    this.showMenu();
  },
  // on click on item
  onClickSelectItem: function onClickSelectItem(item) {
    // this.focused = false
    this.selectedItem = item;
    this.setSearchData('');
    this.setInputFocused();
    this.hideMenu();
    this.fireSelectEvent(item);
  },
  onSearchKeyDown: function onSearchKeyDown(e) {
    if (this.disabled || this.readonly) return; // ignore special keys

    if (['Enter', 'ArrowDown', 'ArrowUp', 'Tab'].includes(e.key)) return; // key === 'Delete' ||
    // !!! Эта часть важна когда используешь слот "selection"

    if (!e.target.value && e.key === 'Backspace') {
      this.selectedItem = null;
      this.arrowsIndex = null;
    } // this.setFocused()


    this.showMenu();
    this.$emit('keydown', e);
  },
  onSearchKeyUp: function onSearchKeyUp(e) {
    if (this.disabled || this.readonly) return;
    this.$emit('keyup', e);
  },
  onSearch: function onSearch(e) {
    if (this.disabled || this.readonly) return;
    this.selectedItemByArrows = this.selectedItem = this.arrowsIndex = null; // e.inputType: "deleteContentBackward"
    // if (!this.focused) this.focused = true
    // console.log(e.target.value)
    // if (!e.target.value) {
    //   this.selectedItem = null
    // }

    this.setSearchData(e.target.value);
    this.$emit('search', this.getSearchData());
  },
  onScroll: function onScroll(event) {
    this.$emit('scroll', event);
    if (this.scrollItemsLimitCurrent >= this.itemsComputed.length) return;
    var content = event.target;
    var showMoreItems = content.scrollHeight - (content.scrollTop + content.clientHeight) < 200; // если проскролил вниз то показать больше итемов

    if (showMoreItems) {
      this.scrollItemsLimitCurrent += this.scrollItemsLimitAddAfterScroll;
    }
  }
};

var $indexOf = arrayIncludes.indexOf;


var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
var defineProperty$1 = objectDefineProperty.f;
var trim$1 = stringTrim.trim;

var NUMBER = 'Number';
var NativeNumber = global_1[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim$1(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys$1.length > j; j++) {
    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
      defineProperty$1(NumberWrapper, key, getOwnPropertyDescriptor$2(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global_1, NUMBER, NumberWrapper);
}

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!toStringTagSupport) {
  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
}

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

var props = {
  value: {
    type: [Array, Object, String, Number, Boolean],
    // TODO set to null (any type) after issue fix
    default: function _default() {
      return null;
    },
    note: 'value for "v-model".'
  },
  items: {
    type: [Array, String],
    required: false,
    note: 'array of suggestions (data fetched from backend, etc).'
  },
  itemText: {
    type: String,
    default: null,
    // 'text',
    // required: true,
    note: 'property in item for text.'
  },
  itemValue: {
    type: String,
    default: null,
    // значит вернуть весь объект, 'value'
    note: 'property in item for value.'
  },
  placeholder: {
    type: String,
    default: null,
    note: 'placeholder for input.'
  },
  loading: {
    type: Boolean,
    default: false,
    note: 'display the loading indicator.'
  },
  disabled: {
    type: Boolean,
    default: false,
    note: 'disable the select.'
  },
  readonly: {
    type: Boolean,
    default: false,
    note: 'readonly state.'
  },
  filter: {
    type: Function,
    default: function _default(item, queryText, itemText) {
      var hasValue = function hasValue(val) {
        return val != null ? val : '';
      };

      var text = hasValue(itemText);
      var query = hasValue(queryText);
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1;
    },
    note: 'filter function for search.'
  },
  searchText: {
    type: String,
    default: '',
    note: 'search string for input, you can use this with ".sync" modifier.'
  },
  inputElCustomAttributes: {
    type: Object,
    default: function _default() {
      return {};
    },
    note: 'you can pass your attributes to the input element. Note: the attributes that are used by the component itself inside are not available, for example, "style".'
  },
  disableSearch: {
    type: Boolean,
    default: false,
    note: 'disable search input element.'
  },
  disableFilteringBySearch: {
    type: Boolean,
    default: false,
    note: 'disable filtering by search (you can use search for manually getting items).'
  },
  resetSearchOnBlur: {
    type: Boolean,
    default: true,
    note: 'reset search on blur event.'
  },
  allowMobileScroll: {
    type: Boolean,
    default: true,
    note: 'allow scrolling to an item on mobile devices.'
  },
  arrowsDisableInstantSelection: {
    type: Boolean,
    default: true,
    note: 'disable auto select when up or down with key arrow.'
  },
  menuItemsMaxHeight: {
    type: String,
    default: '300px',
    note: 'max menu height (any css value).'
  },
  eventEmitter: {
    type: Object,
    note: 'Observer pattern, helps manage events from parent to child.'
  },
  scrollItemsLimit: {
    type: Number,
    default: 20,
    note: 'the initial limit of the displayed items to scroll. So that there are not many elements in the scrolling at the beginning. Also see scrollItemsLimitAddAfterScroll prop.'
  },
  scrollItemsLimitAddAfterScroll: {
    type: Number,
    default: 10,
    note: 'the number of items added to the scrollItemsLimit prop after scrolling to the end of the scroll. Also see scrollItemsLimitAddAfterScroll prop.'
  },
  disableFirstItemSelectOnEnter: {
    type: Boolean,
    default: false,
    note: 'disable the selection of the first item from the list of items in menu when to press enter (when no item is selected).'
  },
  scrollToItemIfNeeded: {
    type: Boolean,
    default: true,
    note: 'to scroll to an item if it has moved beyond the scroll bar.'
  },
  inputStyles: {
    type: Object,
    default: function _default() {
      return {};
    },
    note: 'custom styles for the input field. You can specify dynamic styles.'
  },
  inputForTextClass: {
    type: [Array, String, Object],
    default: function _default() {
      return '';
    },
    note: 'custom "class" attribute for the input field. You can specify dynamic class.'
  },
  errorMessage: {
    type: String,
    default: null
  },
  successful: {
    type: Boolean,
    default: false,
    note: 'does the component have a successful state. If true, then apply green colors.'
  },
  size: {
    type: String,
    default: SIZES.DEFAULT,
    note: 'sets size'
  },
  menuDefaultPosition: {
    type: String,
    default: MENU_POSITIONS.BOTTOM,
    note: 'sets menu\'s default position'
  },
  menuDynamicPosition: {
    type: Boolean,
    default: true,
    note: 'sets the dynamic position behavior for the menu (based on viewport)'
  },
  selectTextOnFocus: {
    type: Boolean,
    default: false,
    note: 'if true, fully select a chosen item on focus so the user can instantly search for a new item.'
  },
  simpleInput: {
    type: Boolean,
    default: false,
    note: 'works as simple input (no menu)'
  }
};

var computed = {
  itemsComputed: function itemsComputed() {
    var items = this.items;

    if (typeof this.items === 'string') {
      items = JSON.parse(this.items);
    }

    return this.filteredBySearchItems(items);
  },
  inputValue: function inputValue() {
    // если указан слот selection, то не надо отображать текст в инпуте, он только мешает
    if (this.$scopedSlots.selection && this.getSearchData() === '') return ''; // если есть строка поиска, то пусть она там будет

    if (this.getSearchData() !== '') return this.getSearchData(); // иначе пусть будет текст элемента или его значение

    return this.getItemText(this.selectedItem) || this.currentItemValue;
  },
  currentItemValue: function currentItemValue() {
    return this.getItemValue(this.selectedItem);
  },
  showSelectionSlot: function showSelectionSlot() {
    return this.$scopedSlots.selection && this.selectedItem && !this.getSearchData();
  },
  inputForTextStyles: function inputForTextStyles() {
    var styles = {};

    if (this.inputElCustomAttributes && this.inputElCustomAttributes.style) {
      styles = _objectSpread2({}, styles, {}, this.inputElCustomAttributes.style);
    }

    return styles;
  },
  hasMenu: function hasMenu() {
    return !this.simpleInput && this.wishShowMenu && !this.loading; // this.focused && !this.loading
  },
  hasError: function hasError() {
    return !!this.errorMessage;
  },
  isMobile: function isMobile() {
    if (process.server) return false; // return window.innerWidth + window.innerHeight <= 1800

    return window.innerWidth <= 900 && window.innerHeight <= 900;
  },
  // get item index from arr
  selectedItemIndex: function selectedItemIndex() {
    for (var itemKey in this.itemsComputed) {
      if (this.selectedItem === this.itemsComputed[itemKey] && this.itemsComputed.hasOwnProperty(itemKey)) {
        return itemKey;
      }
    }

    return null;
  }
};

var script = {
  name: "VueSelect",
  // introduction: 'an amazing select',
  description: "\n  This `select` is amazing, you should _check_ it out \uD83D\uDE0A.\n  ",
  token: "<cool-select v-model=\"selected\" :items=\"items\" />",
  props: props,
  data: function data() {
    var _this = this;

    return {
      MENU_POSITIONS: MENU_POSITIONS,
      SIZES: SIZES,
      wishShowMenu: false,
      arrowsIndex: null,
      focused: false,
      selectedItem: null,
      selectedItemByArrows: null,
      // readonly
      searchData: "",
      scrollItemsLimitCurrent: this.scrollItemsLimit,
      // addEventListener identifier
      listeners: {
        mousedown: function mousedown(_ref) {
          var target = _ref.target;
          var select = _this.$refs["IZ-select"];

          if (_this.focused && select && !select.contains(target)) {
            _this.setBlured();
          }
        },
        scroll: this.menuCalculatePos,
        resize: this.menuCalculatePos
      },
      menuCurrentPosition: this.menuDefaultPosition,
      lastMenuDynamicStyles: null,
      // чтобы не вызывался input из-за selectedItem (в created вызывается setSelectedItemByValue)
      ignoreFirstInputEvent: true
    };
  },
  computed: computed,
  watch: _defineProperty({
    searchText: function searchText(val) {
      this.setSearchData(val);
    },
    value: function value() {
      this.setSelectedItemByValue();
    },
    items: function items() {
      this.setSelectedItemByValue();
      this.$nextTick(function () {//				this.hideMenu();
        //				this.showMenu();
      });
    },
    selectedItem: function selectedItem() {
      if (this.ignoreFirstInputEvent) {
        this.ignoreFirstInputEvent = false;
        return;
      }

      this.selectedItemByArrows = null;
      this.$emit("input", this.currentItemValue);
    },
    itemsComputed: function itemsComputed(items) {
      var _this2 = this;

      this.$emit("change-displayed-items", items);
      this.$nextTick(function () {
        return _this2.menuCalculatePos();
      });
    }
  }, "itemsComputed", function itemsComputed(items) {
    this.$emit('change-displayed-items', items);
  }),
  created: function created() {
    if (this.eventEmitter) {
      this.eventEmitter.on('set-search', this.setSearchData);
    } // TODO возможно стоит убрать чтобы не вызывался лишний setSelectedItemByValue


    this.setSelectedItemByValue();
  },
  mounted: function mounted() {
    // listener for window (see removeEventListener on beforeDestroy hook)
    window.addEventListener('mousedown', this.listeners.mousedown);

    if (this.menuDynamicPosition) {
      window.addEventListener('scroll', this.listeners.scroll);
      window.addEventListener('resize', this.listeners.resize);
    }
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('mousedown', this.listeners.mousedown);

    if (this.menuDynamicPosition) {
      window.removeEventListener('scroll', this.listeners.scroll);
      window.removeEventListener('resize', this.listeners.resize);
    }
  },
  methods: _objectSpread2({}, eventsListeners, {
    getMenuDynamicStyles: function getMenuDynamicStyles(menuPos) {
      var isCurrentMenu = this.menuCurrentPosition === menuPos && this.hasMenu;
      var obj = {
        visibility: isCurrentMenu ? 'visible' : 'hidden',
        opacity: +isCurrentMenu
      }; // возвращать старую позицию если нет меню, чтобы стили не дёргались

      if (!this.hasMenu) return _objectSpread2({}, this.lastMenuDynamicStyles, {}, obj);
      var input = this.$refs['IZ-select__input']; // ширина и смещение слева такие же как и у поля ввода

      obj.width = input.offsetWidth + 'px';
      obj.left = input.offsetLeft + 'px';

      if (menuPos === MENU_POSITIONS.BOTTOM) {
        /*
        obj.top = input.offsetTop + input.offsetHeight + "px";
        if (this.disableSearch) {
        obj.top = input.offsetTop + "px";
        }
        */
        obj.top = '100%';
      } else if (menuPos === MENU_POSITIONS.TOP) {
        obj.bottom = '100%';

        if (this.disableSearch) {
          obj.bottom = 0;
        }
      }

      this.lastMenuDynamicStyles = obj;
      return obj;
    },
    // динамически позиционирует меню чтобы не выходило за границу viewport
    menuCalculatePos: function menuCalculatePos() {
      if (!this.menuDynamicPosition) return;

      if (this.hasMenu) {
        var newPosTop = outOfViewportGetFreePosition(this.$refs['IZ-select__menu-' + MENU_POSITIONS.TOP][0]);
        var newPosBottom = outOfViewportGetFreePosition(this.$refs['IZ-select__menu-' + MENU_POSITIONS.BOTTOM][0]);

        if (!newPosTop && !newPosBottom) {
          this.menuCurrentPosition = this.menuDefaultPosition;
        } else {
          this.menuCurrentPosition = newPosTop || newPosBottom;
        }
      }
    },
    getSearchData: function getSearchData() {
      return this.searchData;
    },
    setSearchData: function setSearchData(val) {
      this.searchData = val;
      this.$emit('update:search-text', val);
    },
    setInputFocused: function setInputFocused() {
      this.$refs['IZ-select__input-for-text'].focus();
    },
    setInputSelected: function setInputSelected() {
      var _this3 = this;

      setTimeout(function () {
        // Вроде не нужно https://stackoverflow.com/a/5001669/5286034
        // if (isTextSelected(this.$refs['IZ-select__input-for-text'])) return
        _this3.$refs['IZ-select__input-for-text'].select();
      }, 100);
    },
    setFocused: function setFocused() {
      var byInput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.focused || this.disabled || this.readonly) return; // if search enabled

      if (!this.disableSearch && !byInput) {
        // focus text input
        this.setInputFocused();
      }

      if (window.scrollTo && this.allowMobileScroll && this.isMobile) {
        var _getOffsetSum = getOffsetSum(this.$refs['IZ-select__input']),
            top = _getOffsetSum.top; // scroll to component input el


        window.scrollTo({
          // this.$refs['IZ-select__input'].offsetTop - 8
          // (bug with position: relative; https://github.com/iliyaZelenko/vue-cool-select/issues/10)
          top: top - 8,
          behavior: 'smooth'
        });
      }

      if (this.selectTextOnFocus) this.setInputSelected();
      this.focused = true;
      this.showMenu();
      this.$emit('focus');
    },
    // TODO правильнее blurred!
    setBlured: function setBlured() {
      if (this.resetSearchOnBlur) {
        this.setSearchData('');
      }

      this.focused = false;
      this.hideMenu();
      this.$refs['IZ-select__input-for-text'].blur();
      this.$emit('blur');
    },
    // TODO вызывать только в watch, в остальных местах убрать, там проверять если !== null, то вызывать
    fireSelectEvent: function fireSelectEvent(item) {
      var _this4 = this;

      this.selectedItemByArrows = null;
      this.$nextTick(function () {
        _this4.$emit('select', item);
      });
    },
    getItemText: function getItemText(item) {
      if (!item) return null;
      if (this.itemText) return item[this.itemText];

      if (isObject$1(item)) {
        var keys = Object.keys(item);

        if (keys.length === 1) {
          return item[keys[0]];
        }

        return item;
      }

      return item;
    },
    getItemValue: function getItemValue(item) {
      // if null or undefined
      if (item == null) return null;
      if (this.itemValue) return item[this.itemValue];

      if (isObject$1(item)) {
        var keys = Object.keys(item);

        if (keys.length === 1) {
          return item[keys[0]];
        }

        return item;
      }

      return item;
    },
    // ставит выбраный элемент по значению
    setSelectedItemByValue: function setSelectedItemByValue() {
      var _this5 = this;

      if (!this.items.length) {
        this.selectedItem = null;
        return;
      }

      this.selectedItem = this.itemsComputed.find(function (i) {
        // TODO вынести получение this.value в computed (оно только в этом методе пока)
        // сделать тут такую првоерку return this.getItemValue(i) === this.computedValue()
        // если "{}" (не массив, не функция, не null...)
        if (isObject$1(_this5.value)) {
          // значение из объекта this.value
          var valFromObjVal = _this5.getItemValue(_this5.value);

          return _this5.getItemValue(i) === valFromObjVal;
        }

        return _this5.getItemValue(i) === _this5.value;
      });
    },
    // возвращает отфильтрованные итемы
    filteredBySearchItems: function filteredBySearchItems(items) {
      var _this6 = this;

      if (!this.getSearchData() || this.disableFilteringBySearch) return items;
      return items.filter(function (i) {
        return _this6.filter(i, _this6.getSearchData(), _this6.getItemText(i));
      });
    },
    isItemSelected: function isItemSelected(item) {
      return item === this.selectedItemByArrows || item === this.selectedItem && !this.selectedItemByArrows;
    },
    showMenu: function showMenu() {
      var _this7 = this;

      if (this.hasMenu) return;
      this.wishShowMenu = true;
      this.$nextTick(function () {
        return _this7.menuCalculatePos();
      });
    },
    hideMenu: function hideMenu() {
      if (!this.hasMenu) return;
      this.wishShowMenu = false;
    }
  })
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
var _obj;
var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"IZ-select",class:Object.assign({}, {'IZ-select': true,
	  'IZ-select--with-value': _vm.inputValue},
	  // ставит класс размера если prop size не дефолтное
	  (_vm.size === _vm.SIZES.DEFAULT
		? null
		: (( _obj = {}, _obj['IZ-select--' + _vm.size] = true, _obj ))
	  )),attrs:{"tabindex":_vm.disableSearch ? 0 : -1},on:{"keydown":[function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"up",38,$event.key,["Up","ArrowUp"])){ return null; }return _vm.onSelectByArrow($event)},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"down",40,$event.key,["Down","ArrowDown"])){ return null; }return _vm.onSelectByArrow($event)},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter")){ return null; }return _vm.onEnter($event)},function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"tab",9,$event.key,"Tab")&&_vm._k($event.keyCode,"esc",27,$event.key,["Esc","Escape"])){ return null; }return _vm.setBlured($event)}],"mousedown":_vm.onClick,"focus":_vm.setFocused}},[_c('div',{staticClass:"IZ-select__input-wrap"},[_vm._t("input-before"),_vm._v(" "),_c('div',{ref:"IZ-select__input",class:{
		  'IZ-select__input': true,
		  'IZ-select__input--focused': _vm.focused,
		  'IZ-select__input--has-menu': _vm.hasMenu,
		  'IZ-select__input--has-error': _vm.hasError,
		  'IZ-select__input--successful': _vm.successful,
		  'IZ-select__input--selection-slot': _vm.showSelectionSlot,
		  'IZ-select__input--disabled': _vm.disabled,
		  'IZ-select__input--readonly': _vm.readonly
		},style:(_vm.inputStyles)},[_vm._t("input-start"),_vm._v(" "),(_vm.showSelectionSlot)?_vm._t("selection",null,{"item":_vm.selectedItem}):_vm._e(),_vm._v(" "),(_vm.simpleInput)?_c('input',_vm._b({ref:"IZ-select__input-for-text",on:{"keyup":_vm.onSearchKeyUp,"keydown":_vm.onSearchKeyDown,"input":function($event){return _vm.$emit('input', $event.target.value)},"mousedown":_vm.onClick,"focus":function($event){return _vm.setFocused(true)}}},'input',Object.assign({}, {value: _vm.value,
			placeholder: _vm.placeholder,
			class: _vm.inputForTextClass,
			disabled: _vm.disabled,
			readonly: _vm.readonly,
			tabindex: 0,
			type: 'text',
			autocomplete: 'new-password'},
			_vm.inputElCustomAttributes,
			{style: _vm.inputForTextStyles}),false)):_c('input',_vm._b({ref:"IZ-select__input-for-text",on:{"keyup":_vm.onSearchKeyUp,"keydown":_vm.onSearchKeyDown,"input":_vm.onSearch,"mousedown":_vm.onClick,"focus":function($event){return _vm.setFocused(true)}}},'input',Object.assign({}, {value: _vm.inputValue,
			placeholder: _vm.placeholder,
			class: _vm.inputForTextClass,
			disabled: _vm.disableSearch || _vm.disabled,
			readonly: _vm.readonly,
			tabindex: _vm.disableSearch ? -1 : 0,
			type: 'text',
			role: 'combobox',
			autocomplete: 'new-password'},
			_vm.inputElCustomAttributes,
			{style: _vm.inputForTextStyles}),false)),_vm._v(" "),_vm._t("input-end")],2),_vm._v(" "),_vm._t("input-after")],2),_vm._v(" "),(!_vm.simpleInput)?_vm._l(([_vm.MENU_POSITIONS.TOP, _vm.MENU_POSITIONS.BOTTOM]),function(menuPos){
		  var _obj;
return _c('div',{key:'menu-position-' + menuPos,ref:'IZ-select__menu-' + menuPos,refInFor:true,class:( _obj = {}, _obj[("IZ-select__menu IZ-select__menu--at-" + menuPos)] = true, _obj['IZ-select__menu--disable-search'] =  _vm.disableSearch, _obj ),style:(Object.assign({}, {'pointer-events': _vm.hasMenu ? 'auto' : 'none'},
		  _vm.getMenuDynamicStyles(menuPos)))},[_vm._t("before-items-fixed"),_vm._v(" "),_c('div',{ref:"IZ-select__menu-items",refInFor:true,staticClass:"IZ-select__menu-items",style:({
			'max-height': _vm.menuItemsMaxHeight
		  }),on:{"scroll":_vm.onScroll}},[_vm._t("before-items",[_c('div')]),_vm._v(" "),_vm._l((_vm.itemsComputed),function(item,i){return _c('div',{directives:[{name:"show",rawName:"v-show",value:(i < _vm.scrollItemsLimitCurrent || (_vm.arrowsIndex && i <= _vm.arrowsIndex)),expression:"i < scrollItemsLimitCurrent || (arrowsIndex && i <= arrowsIndex)"}],key:'IZ-item-' + i,ref:"items",refInFor:true,class:{
			  'IZ-select__item': true,
			  'IZ-select__item--selected': _vm.isItemSelected(item)
			},on:{"click":function($event){return _vm.onClickSelectItem(item)}}},[_vm._t("item",[_c('span',[_vm._v(_vm._s(_vm.getItemText(item)))])],{"item":item})],2)}),_vm._v(" "),(!_vm.itemsComputed.length && !_vm.loading)?_c('div',{staticClass:"IZ-select__no-data"},[_vm._t("no-data",[_vm._v(_vm._s(_vm.$coolSelect.options.text.noData))])],2):_vm._e(),_vm._v(" "),_vm._t("after-items",[_c('div')])],2),_vm._v(" "),_vm._t("after-items-fixed"),_vm._v(" "),_c('div',{staticStyle:{"position":"absolute","top":"0","left":"0","right":"0"}},[_vm._t("before-items-fixed-absolute")],2),_vm._v(" "),_c('div',{staticStyle:{"position":"absolute","bottom":"0","left":"0","right":"0"}},[_vm._t("after-items-fixed-absolute")],2)],2)}):_vm._e(),_vm._v(" "),_c('transition',{attrs:{"name":"fade"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.errorMessage),expression:"errorMessage"}],staticClass:"IZ-select__error"},[_vm._t("error",[_vm._v(_vm._s(_vm.errorMessage))],{"errorMessage":_vm.errorMessage})],2)])],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var CoolSelect = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

// pattern Module
function Observer() {
  var listeners = {};

  function addListener(event, listener) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(listener);
  }

  return {
    on: addListener,
    onOnce: function onOnce(event, listener) {
      listener.once = true;
      addListener(event, listener);
    },
    emit: function emit(event, data) {
      for (var index in listeners[event]) {
        var listener = listeners[event][index];
        listener(data);

        if (listener.once) {
          delete listeners[event][index];
        }
      }
    }
  };
}

var CoolSelectPlugin = new Singleton();

function Singleton() {
  return {
    install: function install(Vue) {
      var optionsInput = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var optionsDefault = {
        text: {
          noData: 'No data available'
        }
      };
      var options = mergeDeep(optionsDefault, optionsInput);
      Vue.prototype.$coolSelect = {
        options: options
      };
    }
  };
}

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  // Automatic installation if Vue has been added to the global scope.
  GlobalVue.use(CoolSelectPlugin);
  GlobalVue.component('cool-select', CoolSelect);
  GlobalVue.component('vue-cool-select', CoolSelect);
}

export { CoolSelect, CoolSelectPlugin, Observer as EventEmitter, CoolSelect as VueCoolSelect, CoolSelect as component };
