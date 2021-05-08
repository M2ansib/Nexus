// Transcrypt'ed from Python, 2021-05-07 22:02:45
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {LandingPageMenu} from './views.landingPage.landingPageMenu.js';
import {Login} from './main.loginModal.js';
import {appname} from './main.appData.js';
import {About} from './main.aboutModal.js';
import {Flexbox, FlexboxCenter} from './main.appTheme.js';
import {UserCtx} from './main.js';
import {Link, buildParams, fetch, spaRedirect} from './common.urlutils.js';
import {IconButton, MenuIcon} from './common.pymui.js';
import {Container, Paper, Typography, useSnackbar} from './common.pymui.js';
import {createElement as el, useContext, useEffect, useState} from './common.pyreact.js';
var __name__ = 'views.landingPage.landingPageView';
export var LandingPage = function (props) {
	var params = dict (props ['params']);
	var pathname = props ['pathname'];
	var show_login = params.py_get ('login', 'hide') == 'show';
	var uCtx = useContext (UserCtx);
	var isLoggedIn = uCtx ['isLoggedIn'];
	var login = uCtx ['login'];
	var __left0__ = useState (null);
	var mainMenu = __left0__ [0];
	var setMainMenu = __left0__ [1];
	var __left0__ = useState (false);
	var aboutShow = __left0__ [0];
	var setAboutShow = __left0__ [1];
	var __left0__ = useState (false);
	var loginModal = __left0__ [0];
	var setLoginModal = __left0__ [1];
	var __left0__ = useState ('');
	var username = __left0__ [0];
	var setUsername = __left0__ [1];
	var __left0__ = useState ('');
	var password = __left0__ [0];
	var setPassword = __left0__ [1];
	var snack = useSnackbar ();
	var doLogin = function () {
		var _login = function () {
			login (username);
			snack.enqueueSnackbar ('Login succeeded!', dict ({'variant': 'success'}));
			spaRedirect (redir);
		};
		var _loginFailed = function () {
			setLoginModal (true);
			snack.enqueueSnackbar ('Login failed, please try again', dict ({'variant': 'error'}));
		};
		var redir = params.py_get ('redir', '{}{}'.format (pathname, buildParams (params)));
		fetch ('/api/login', _login, __kwargtrans__ ({data: dict ({'username': username, 'password': password}), method: 'POST', onError: _loginFailed}));
		setLoginModal (false);
	};
	var clearUser = function () {
		if (loginModal) {
			setUsername ('');
			setPassword ('');
		}
	};
	var mainMenuOpen = function (event) {
		setMainMenu (event ['currentTarget']);
	};
	var mainMenuClose = function () {
		setMainMenu (null);
	};
	var aboutModalOpen = function () {
		setAboutShow (true);
	};
	useEffect ((function __lambda__ () {
		return setLoginModal (show_login);
	}), [show_login]);
	useEffect (clearUser, [loginModal]);
	return el (Container, dict ({'maxWidth': 'md'}), el (Paper, dict ({'style': dict ({'padding': '1rem'})}), el (Flexbox, dict ({'alignItems': 'center'}), el (IconButton, dict ({'edge': 'start', 'color': 'inherit', 'onClick': mainMenuOpen}), el (MenuIcon, null)), el (Typography, dict ({'variant': 'h5'}), appname))), el (LandingPageMenu, dict ({'mainMenu': mainMenu, 'mainMenuClose': mainMenuClose, 'aboutModalOpen': aboutModalOpen})), el (Paper, dict ({'style': dict ({'padding': '0.5rem', 'marginTop': '1rem'})}), el (FlexboxCenter, null, el (Typography, dict ({'variant': 'h5'}), el (Link, dict ({'to': '#', 'onClick': aboutModalOpen}), 'About'))), el (FlexboxCenter, null, (!(isLoggedIn) ? el (Typography, dict ({'variant': 'h5'}), el (Link, dict ({'to': '#', 'onClick': (function __lambda__ () {
		return setLoginModal (true);
	})}), 'Login')) : null))), el (Login, dict ({'onClose': (function __lambda__ () {
		return setLoginModal (false);
	}), 'onLogin': doLogin, 'password': password, 'username': username, 'setUsername': (function __lambda__ (usr) {
		return setUsername (usr);
	}), 'setPassword': (function __lambda__ (pwd) {
		return setPassword (pwd);
	}), 'modalState': loginModal})), el (About, dict ({'onClose': (function __lambda__ () {
		return setAboutShow (false);
	}), 'modalState': aboutShow})));
};

//# sourceMappingURL=views.landingPage.landingPageView.map