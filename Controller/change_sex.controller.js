mui.init();
var submit_btn = document.getElementById('submit_btn');
var sexvalue = document.getElementsByName('sex')
mui.plusReady(function() {
	submit_btn.addEventListener('tap', function() {
		var _sexvalue = plus.storage.getItem('sex')
		var _newsexvalue = sexValue()
		if (_sexvalue == _newsexvalue || _sexvalue == "") {
			mui.back()
		} else {
			ajaxChangeSex(_newsexvalue)
		}
	}, false)
})

function sexValue() {
	for (var i = 0; i < sexvalue.length; i++) {
		if (sexvalue[i].checked == true) {
			return sexvalue[i].value
		}
	}
}

function ajaxChangeSex(newsexvalue) {
	var nativeWaiting = plus.nativeUI.showWaiting()
	var uuid = plus.storage.getItem('uuid')
	var token = plus.storage.getItem('token')
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/gender.json', {
		data: {
			uuid: uuid,
			token: token,
			gender: newsexvalue
		},
		timeout: 10000,
		type: 'put',
		success: function(data) {
			var code = data.code
			nativeWaiting.close()
			if (code == 10000) {
				mui.alert('设置成功！', '摄影圈', function() {
					mui.back()
				})
			}
		},
		error: function(xhr) {
			nativeWaiting.close()
			mui.alert('设置失败！', '摄影圈', function() {})
		}
	})
}