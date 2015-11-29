mui.init();
var head_img = document.getElementById('head-img')
mui.plusReady(function() {
	setHeadImg()
});

function setHeadImg() {
	var _headimg = plus.storage.getItem('headimg')
	head_img.src = _headimg
	setHeadImgStyle()
};

function setHeadImgStyle() {
	var _w = head_img.width;
	var _h = head_img.height;
	head_img.style.width = '50px'
	if (head_img.height < 50) {
		head_img.style.height = '100px'
		head_img.style.width = (_w / _h) * 50 + 'px'
	}
};
mui('#changelist').on('tap', 'li', function() {
	var url = this.getAttribute('id')
	mui.openWindow({
		id: url,
		url: url,
		styles: {
			top: '0px', //新页面顶部位置
			bottom: '0px', //新页面底部位置
		},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: '300',
		}
	})
});