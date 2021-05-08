// Transcrypt'ed from Python, 2021-05-07 22:02:45
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'common.pyreact';
export var React = require ('react');
export var ReactDOM = require ('react-dom');
export var ReactGA = require ('react-ga');
export var Modal = require ('react-modal');
export var createElement = React.createElement;
export var useState = React.useState;
export var useEffect = React.useEffect;
export var createContext = React.createContext;
export var useContext = React.useContext;
export var Fragment = React.Fragment;
export var render = function (root_component, props, container) {
	var main = function () {
		var querystring = window.location.search;
		var params = new window.URLSearchParams (querystring).entries ();
		var new_props = dict ({'pathname': window.location.pathname, 'params': (function () {
			var __accu0__ = [];
			for (var p of params) {
				if (p) {
					__accu0__.append ([p [0], p [1]]);
				}
			}
			return dict (__accu0__);
		}) ()});
		new_props.py_update (props);
		ReactDOM.render (React.createElement (root_component, new_props), document.getElementById (container));
	};
	document.addEventListener ('DOMContentLoaded', main);
	window.addEventListener ('popstate', main);
};

//# sourceMappingURL=common.pyreact.map