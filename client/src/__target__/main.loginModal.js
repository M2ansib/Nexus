// Transcrypt'ed from Python, 2021-05-07 22:02:45
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {Flexbox, FlexboxCenter, modalStyles} from './main.appTheme.js';
import {appname} from './main.appData.js';
import {CloseIcon, IconButton} from './common.pymui.js';
import {Box, Button, Paper, TextField, Typography} from './common.pymui.js';
import {Modal, createElement as el} from './common.pyreact.js';
var __name__ = 'main.loginModal';
export var Login = function (props) {
	var onClose = props ['onClose'];
	var onLogin = props ['onLogin'];
	var username = props ['username'];
	var password = props ['password'];
	var setUsername = props ['setUsername'];
	var setPassword = props ['setPassword'];
	var modalState = props ['modalState'];
	var login = function (event) {
		event.preventDefault ();
		onLogin ();
	};
	var handleUsernameChange = function (event) {
		var target = event ['target'];
		setUsername (target ['value']);
	};
	var handlePasswordChange = function (event) {
		var target = event ['target'];
		setPassword (target ['value']);
	};
	return el (Modal, dict ({'isOpen': modalState, 'onRequestClose': onClose, 'style': modalStyles, 'ariaHideApp': false}), el (FlexboxCenter, dict ({'maxWidth': '300px'}), el (Box, null, el (Flexbox, dict ({'justifyContent': 'space-between', 'alignItems': 'center'}), el (Typography, dict ({'variant': 'h6', 'width': '40%', 'color': 'primary'}), appname), el (IconButton, dict ({'edge': 'end', 'color': 'primary', 'onClick': onClose}), el (CloseIcon, null))), el (Paper, dict ({'elevation': 2, 'style': dict ({'padding': '1rem'})}), el ('form', dict ({'onSubmit': login}), el (TextField, dict ({'label': 'Login Name', 'variant': 'outlined', 'fullWidth': true, 'value': username, 'onChange': handleUsernameChange, 'autoFocus': true, 'placeholder': 'admin'})), el (TextField, dict ({'label': 'Password', 'variant': 'outlined', 'fullWidth': true, 'type': 'password', 'value': password, 'onChange': handlePasswordChange, 'placeholder': '123'})), el (Button, dict ({'type': 'submit', 'fullWidth': true, 'style': dict ({'minWidth': '10rem', 'marginRight': '1rem', 'marginTop': '1rem'})}), 'Login'))))));
};

//# sourceMappingURL=main.loginModal.map