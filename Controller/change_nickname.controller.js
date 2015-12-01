mui.init();
var submit_btn = document.getElementById('submit_btn');
var nickname_input = document.getElementById('nickname_input');
mui.plusReady(function() {
	var nickname = plus.storage.getItem('nickname');
	nickname_input.setAttribute('placeholder', nickname)
	submit_btn.addEventListener('tap', function() {
		var new_nickname = Trim(nickname_input.value)
		if (nickname == new_nickname || new_nickname == "") {
			mui.back()
		} else {
			ajaxChangeNickname(new_nickname)
		}
	}, false)
})

function ajaxChangeNickname(newname) {
	var nativeWaiting = plus.nativeUI.showWaiting()
	var uuid = plus.storage.getItem('uuid')
	var token = plus.storage.getItem('token')
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/nickname.json', {
		data: {
			uuid: uuid,
			token: token,
			nickname: newname
		},
		timeout: 10000,
		type: 'put',
		success: function(data) {
			var code = data.code
			nativeWaiting.close()
			if (code == 10000) {
				mui.alert('修改成功！', '摄影圈', function() {
					mui.back()
				})
			}
		},
		error: function(xhr) {
			nativeWaiting.close()
			mui.alert('修改失败！', '摄影圈', function() {})
		}
	})
}