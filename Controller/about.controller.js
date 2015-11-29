mui.init();
mui.plusReady(function() {
	//获取版本号
	mui.getJSON("../manifest.json", null, function(data) {
		document.getElementById('version').innerText = data.version.name
	});
	plus.webview.currentWebview().setStyle({
		'popGesture': 'hide'
	})
});