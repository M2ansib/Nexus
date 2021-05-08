// Transcrypt'ed from Python, 2021-05-07 22:02:45
var time = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {console} from './common.jsutils.js';
import {Link as MuiLink} from './common.pymui.js';
import {ReactGA, createElement as el} from './common.pyreact.js';
import * as __module_time__ from './time.js';
__nest__ (time, '', __module_time__);
var __name__ = 'common.urlutils';
export var polyfill = require ('@babel/polyfill');
export var fetch = async function (url, callback) {
	if (typeof callback == 'undefined' || (callback != null && callback.hasOwnProperty ("__kwargtrans__"))) {;
		var callback = null;
	};
	var kwargs = dict ();
	if (arguments.length) {
		var __ilastarg0__ = arguments.length - 1;
		if (arguments [__ilastarg0__] && arguments [__ilastarg0__].hasOwnProperty ("__kwargtrans__")) {
			var __allkwargs0__ = arguments [__ilastarg0__--];
			for (var __attrib0__ in __allkwargs0__) {
				switch (__attrib0__) {
					case 'url': var url = __allkwargs0__ [__attrib0__]; break;
					case 'callback': var callback = __allkwargs0__ [__attrib0__]; break;
					default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
				}
			}
			delete kwargs.__kwargtrans__;
		}
	}
	else {
	}
	ReactGA.event (dict ({'category': 'api', 'action': 'request', 'label': url}));
	var t_start = time.time ();
	var on_error = kwargs.py_pop ('onError', null);
	var redirect = kwargs.py_pop ('redirect', true);
	var method = kwargs.py_pop ('method', 'GET');
	try {
		if (method == 'POST' || method == 'DELETE') {
			var data = kwargs.py_pop ('data', null);
			var headers = {'Content-Type': 'application/json;'};
			var response = await window.fetch (url, dict ({'method': method, 'headers': headers, 'body': JSON.stringify (data)}));
		}
		else {
			var kw_params = kwargs.py_pop ('params', dict ({}));
			var params = buildParams (kw_params);
			var response = await window.fetch ('{}{}'.format (url, params));
		}
		if (response.status == 401) {
			console.error ('401 - Session Expired');
			if (redirect) {
				redirToLoginPage ();
			}
			var __except0__ = Exception ('Unauthorized');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else if (response.status != 200) {
			console.error ('Fetch error - Status Code: ' + response.status);
			if (on_error) {
				on_error ();
			}
		}
		else {
			var json_data = await response.json ();
			var t_elapsed = time.time () - t_start;
			ReactGA.timing (dict ({'category': 'API', 'variable': 'fetch', 'value': int (t_elapsed * 1000), 'label': url}));
			var error = dict (json_data).py_get ('error', null);
			if (error) {
				var __except0__ = Exception (error);
				__except0__.__cause__ = null;
				throw __except0__;
			}
			else {
				var result = dict (json_data).py_get ('success', null);
				if (callback) {
					callback (result);
				}
			}
		}
	}
	catch (__except0__) {
		if (isinstance (__except0__, object)) {
			var e = __except0__;
			console.error (str (e));
			if (on_error) {
				on_error ();
			}
		}
		else {
			throw __except0__;
		}
	}
};
export var buildParams = function (param_dict) {
	var param_list = (function () {
		var __accu0__ = [];
		for (var [key, val] of param_dict.py_items ()) {
			if (val) {
				__accu0__.append ('&{}={}'.format (key, window.encodeURIComponent (val)));
			}
		}
		return __accu0__;
	}) ();
	var params = ''.join (param_list);
	return (len (params) > 0 ? '?{}'.format (params.__getslice__ (1, null, 1)) : '');
};
export var spaRedirect = function (url) {
	window.history.pushState (null, '', url);
	window.dispatchEvent (new window.PopStateEvent ('popstate'));
};
export var redirToLoginPage = function () {
	var params = new window.URLSearchParams (window.location.search).entries ();
	var param_dict = (function () {
		var __accu0__ = [];
		for (var p of params) {
			if (p) {
				__accu0__.append ([p [0], p [1]]);
			}
		}
		return dict (__accu0__);
	}) ();
	var redir = param_dict.py_get ('redir', null);
	if (redir) {
		var hrefNew = '/?login=show&redir={}'.format (window.encodeURIComponent (redir));
	}
	else {
		var hrefCurrent = window.location.href;
		if (hrefCurrent) {
			var encoded_href = window.encodeURIComponent (hrefCurrent);
			var hrefNew = '/?login=show&redir={}'.format (encoded_href);
		}
		else {
			var hrefNew = '/?login=show';
		}
	}
	window.location.href = hrefNew;
};
export var Link = function (props) {
	var onClick = function (event) {
		event.preventDefault ();
		spaRedirect (props ['to']);
	};
	var onClickAlt = function (event) {
		event.preventDefault ();
		props ['onClick'] ();
	};
	if (props ['onClick']) {
		return el (MuiLink, dict ({'href': props ['to'], 'onClick': onClickAlt}), props ['children']);
	}
	else {
		return el (MuiLink, dict ({'href': props ['to'], 'onClick': onClick}), props ['children']);
	}
};

//# sourceMappingURL=common.urlutils.map