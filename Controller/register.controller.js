mui.init()
var phone = document.getElementById('phone');
var password = document.getElementById('password');
var errorts = document.getElementById('error_ts');
var capcha = document.getElementById('capcha');
var loginbtn = document.getElementById('loginbtn');
//手机号验证方法
function valitemes() {
	var reg = new RegExp("^[1][0-9]{10}$")
	var phone_val = phone.value,
		passowrd_val = password.value,
		capcha_val = capcha.value
	if (phone_val == '' && passowrd_val == '') {
		innerError("请输入手机号或登录密码")
		return false
	} else if (capcha_val == "") {
		innerError("请输入验证码")
	} else if (!reg.test(phone_val)) {
		innerError("请输入正确的手机号码")
		return false
	} else if (passowrd_val.length < 6 || passowrd_val.length > 13) {
		innerError("请设置范围在6-12位的密码")
	} else {
		errorts.style.visibility = "hidden"
		return true
	}
}

function innerError(text) {
	errorts.innerHTML = text;
	errorts.style.visibility = "visible"
}
var cantap = true;
//获得短信验证码
function getCapCha() {
	var reg = new RegExp("^[1][0-9]{10}$")
	var phone_val = phone.value
	if (!reg.test(phone_val)) {
		innerError("请输入正确的手机号码")
		return false
	} else {
		errorts.style.visibility = "hidden"
	}
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/send_capcha.json', {
		data: {
			phone: phone.value
		},
		type: 'post',
		success: function(data) {
			cantap = false
			var seconds = 60
			var timmer = setInterval(function() {
				seconds--;
				get_capcha_btn.innerHTML = seconds + "s";
				get_capcha_btn.style.backgroundColor = "#deb9bc";
				if (seconds <= 0) {
					cantap = true;
					get_capcha_btn.style.backgroundColor = "#f9bbc0";
					get_capcha_btn.innerHTML = "获取验证码";
					clearInterval(timmer);
				}
			}, 1000)
			return true
		},
		error: function() {
			mui.alert('获取失败请检查网络', '摄影圈', function() {
				get_capcha_btn.innerHTML = "重新获取";
			});
			return false;
		}
	})
}
var get_capcha_btn = document.getElementById('get_capcha')
get_capcha_btn.addEventListener('tap', function() {
	if (cantap) {
		getCapCha();
	}
}, false)
mui.plusReady(function() {
	//点击注册

	loginbtn.addEventListener('tap', function() {
		var valite = valitemes();
		if (valite) {
			cantap = false
			var nativWaiting = plus.nativeUI.showWaiting()
			mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/register.json', {
				data: {
					phone: phone.value,
					password_md5: password.value,
					captcha: capcha.value
				},
				type: 'post',
				success: function(data) {
					var code = data.code;
					nativWaiting.close()
					if (code == 10000) {
						mui.alert('注册成功', '摄影圈', function() {
							plus.storage.setItem('register_phone', phone.value)
								//延时返回登陆页
							var loginpage = plus.webview.getWebviewById('mypages/login.html');
							setTimeout(function() {
								loginpage.evalJS('autoInsterPhoneNumber()');
								mui.back();
							}, 300)
						});
					} else {
						cantap = true;
						mui.alert('注册失败', '摄影圈');
					}
				},
				error: function() {
					cantap = true;
					mui.alert('信息提交失败', '摄影圈');
				}
			})
		}
	}, false);
})