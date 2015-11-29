mui.init();
var comment_submit_btn = document.getElementById('comment_submit_btn'),
	back_btn = document.getElementById('back_btn');
var text_ts = '评论内容';
var comment_text = document.getElementById('comment_text');
mui.plusReady(function() {
	back_btn.addEventListener('tap', function() {
		mui.back()
	}, false);
	var self = plus.webview.currentWebview()
	comment_submit_btn.addEventListener('tap', function() {
		ajaxAddComments(self.user_uuid, self.token, self.uuid)
	}, false)
});

//光标事件处理
comment_text.addEventListener('focus', function() {
	var text_value = Trim(this.value)
	if (text_value == text_ts) {
		this.value = ""
	}
}, false);
//失去光标处理
comment_text.addEventListener('blur', function() {
	var text_value = Trim(this.value)
	if (text_value == "") {
		this.value = text_ts
	}
}, false);


function ajaxAddComments(user_uuid, token, news_uuid) {
	var _comments = comment_text.value
	if (Trim(_comments) == "" || Trim(_comments) == text_ts) {
		mui.alert("内容不能为空", "摄影圈", function() {
			waiting.close()
		})
	} else {
		var waiting = plus.nativeUI.showWaiting()
		mui.ajax('http://sheying.development.mastergolf.cn/api/v1/article/comment.json', {
			data: {
				user_uuid: user_uuid,
				token: token,
				uuid: news_uuid,
				comments: _comments
			},
			type: "post",
			timeout: '5000',
			success: function(data) {
				waiting.close()
				var code = data.code;
				if (code == 10000) {
					mui.alert("添加评论成功", "摄影圈", function() {
						mui.back()
					})
				}
			}
		})
	}
}