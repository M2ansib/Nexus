// Transcrypt'ed from Python, 2021-05-07 22:02:45
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {LandingPage} from './views.landingPage.landingPageView.js';
import {gaid} from './main.appData.js';
import {theme} from './main.appTheme.js';
import {UserCtx} from './main.js';
import {fetch, spaRedirect} from './common.urlutils.js';
import {console, setTitle} from './common.jsutils.js';
import {SnackbarProvider, ThemeProvider} from './common.pymui.js';
import {useEffect, useState} from './common.pyreact.js';
import {ReactGA, createElement as el, render} from './common.pyreact.js';
var __name__ = '__main__';
ReactGA.initialize (gaid, dict ({'titleCase': false, 'debug': false, 'gaOptions': dict ({'siteSpeedSampleRate': 100})}));
export var App = function (props) {
	var title = props ['title'];
	var pathname = props ['pathname'];
	var __left0__ = useState ('');
	var user = __left0__ [0];
	var setUser = __left0__ [1];
	setTitle (title);
	var router = dict ({'/': LandingPage});
	var route_is_valid = __in__ (pathname, router);
	var isLoggedIn = len (user) > 0;
	var login = function (username) {
		setUser (username);
	};
	var logout = function () {
		setUser ('');
		fetch ('/api/logout', (function __lambda__ () {
			return spaRedirect ('/');
		}));
	};
	var validateSession = function () {
		var validated = function () {
			var _setuser = function (data) {
				login (data ['user']);
			};
			if (!(isLoggedIn)) {
				fetch ('/api/whoami', _setuser, __kwargtrans__ ({onError: console.error, redirect: false}));
			}
		};
		var notValidated = function (error) {
			if (len (user) > 0) {
				setUser ('');
			}
		};
		if (route_is_valid) {
			fetch ('/api/ping', validated, __kwargtrans__ ({onError: notValidated, redirect: false}));
		}
	};
	var user_ctx = dict ({'user': user, 'login': login, 'logout': logout, 'isLoggedIn': isLoggedIn});
	useEffect (validateSession, []);
	useEffect ((function __lambda__ () {
		return ReactGA.pageview (pathname);
	}), [pathname]);
	if (route_is_valid) {
		return el (ThemeProvider, dict ({'theme': theme}), el (SnackbarProvider, dict ({'maxSnack': 3}), el (UserCtx.Provider, dict ({'value': user_ctx}), el (router [pathname], props))));
	}
	else {
		console.error ('ERROR - Bad pathname for route: {}'.format (props ['pathname']));
		return el ('div', null, el ('h1', null, 'Page Not Found'), el ('p', null, 'Bad pathname: {}'.format (props ['pathname'])), el ('div', null, el ('a', dict ({'href': '/'}), 'Back to Home')));
	}
};
render (App, dict ({'title': 'Ascent LEAP'}), 'root');

//# sourceMappingURL=app.map