mui.init();
var phone = document.getElementById('phone');
var password = document.getElementById('password');
var errorts = document.getElementById('error_ts');
var loginbtn = document.getElementById('loginbtn');
mui.plusReady(function() {
	//插入
	autoInsterPhoneNumber();
});

//登录按钮事件
loginbtn.addEventListener('tap', function() {
	var valite = valitehone();
	if (valite == true) {
		ajaxSubmitLogin()
	}
}, false);
//手机号验证方法
function valitehone() {
	var reg = new RegExp("^[1][0-9]{10}$")
	var phone_val = phone.value,
		passowrd_val = password.value
	if (phone_val == '' && passowrd_val == '') {
		innerError("请输入手机号和登录密码")
		return false
	} else if (passowrd_val == "") {
		innerError("请输入密码")
		return false
	} else if (!reg.test(phone_val)) {
		innerError("请重新输入正确的手机号码")
		return false
	} else {
		errorts.style.visibility = "hidden"
		return true
	}
};
//错误信息显示
function innerError(text) {
	errorts.innerHTML = text;
	errorts.style.visibility = "visible"
};
//AJAX提交注册信息方法
function ajaxSubmitLogin() {
	nwaiting = plus.nativeUI.showWaiting();
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/login.json', {
		data: {
			phone: phone.value,
			password_md5: password.value
		},
		type: 'post',
		success: function(data) {
			nwaiting.close()
			var userData = data.data
			var code = data.code
				//存储用户信息到本地
			plus.storage.setItem('islogin', 'true')
			if (code == "10000") {
				mui.alert('登陆成功', '摄影圈', function() {
					var presoncenter = plus.webview.getWebviewById('page_personalcenter.html');
					plus.storage.setItem('uuid', userData.uuid)
					plus.storage.setItem('token', userData.token)
					plus.storage.setItem('nickname', userData.nickname)
					plus.storage.setItem('is_member', (userData.is_membership).toString())
					plus.storage.setItem('favorites', (userData.favorites).toString())
					plus.storage.setItem('headimg', userData.image)
					presoncenter.evalJS('checklogin()')
					presoncenter.evalJS('setUserMes()')
					mui.back()
				})
			}
		}
	})
};

//点击注册按钮事件
mui('.login-register-header').on('tap', '#register', function() {
	mui.openWindow({
		id: 'register.html',
		url: 'register.html',
		styles: {
			top: '0px',
			bottom: '0px'
		}
	})
});
//如果本地存储中已经有用户用于注册的电话号码，那么自动填充注册的电话号码
function autoInsterPhoneNumber() {
	var register_phone = plus.storage.getItem('register_phone')
	if (register_phone != null) {
		phone.value = register_phone
	}
};