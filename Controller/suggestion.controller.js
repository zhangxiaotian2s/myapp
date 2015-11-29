mui.init();
var text_ts = '请写下您的反馈意见，我们将不断为您改进!';
var suggestion_text = document.getElementById('suggestion_text')
var subimtbtn = document.getElementById('submit_btn')
mui.plusReady(function() {
	var user_uuid = plus.storage.getItem('uuid');
	var token = plus.storage.getItem('token');
	submit_btn.addEventListener('tap', function() {
		var content = suggestion_text.value
		if (Trim(content) == "" ||content == text_ts) {
			return
		}
		submitSuggestion(user_uuid, token, content)
	}, false)

});
suggestion_text.addEventListener('focus', function() {
	var text_value = Trim(this.value)
	if (text_value == text_ts) {
		this.value = "";
	}
}, false);
suggestion_text.addEventListener('blur', function() {
	var text_value = Trim(this.value)
	if (text_value == "") {
		this.value = text_ts;
	}
}, false);


function submitSuggestion(uuid, token, content) {
	var waiting = plus.nativeUI.showWaiting()
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/feedback.json', {
		data: {
			user_uuid: uuid,
			token: token,
			content: content
		},
		type: 'post',
		timeout: '5000',
		success: function(data) {
			var code = data.code
			waiting.close()
			if (code == 10000) {
				mui.alert("感谢您的建议，我们会持续努力更新", "摄影圈", function() {
					mui.back()
				})
			}
		}


	})

}