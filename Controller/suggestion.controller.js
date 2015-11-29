mui.init();
var text_ts = '请写下您的反馈意见，我们将不断为您改进!';
var suggestion_text = document.getElementById('suggestion_text')
mui.plusReady(function() {

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