mui.init();
mui.plusReady(function() {

});
var pay_next_btn = document.getElementById("pay_next_btn");
pay_next_btn.addEventListener('tap', function() {
	mui.openWindow({
		url: 'pay_choice_list.html',
		id: 'pay_choice_list.html',
		styles: {
			top: '0px', //新页面顶部位置
			bottom: '0px', //新页面底部位置
			hardwareAccelerated: true
		},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: '300',
		}
	})
}, false);