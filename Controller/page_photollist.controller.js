var aniShow = "pop-in";
//只有ios支持的功能需要在Android平台隐藏；
if (mui.os.android) {
	var list = document.querySelectorAll('.ios-only');
	if (list) {
		for (var i = 0; i < list.length; i++) {
			list[i].style.display = 'none';
		}
	}
	//Android平台暂时使用slide-in-right动画
	if (parseFloat(mui.os.version) < 4.4) {
		aniShow = "slide-in-right";
	}
}
 var photopages=mui.preload({
 	url:'mypages/photo.html',
 	id:'mypages/photo.html'
 })


//初始化，并预加载webview模式的选项卡			
function preload() {}
//两个判断是否关闭启动页的条件
var canclose = false
var pagesnumber = 1
mui.plusReady(function() {

	//读取本地存储，检查是否为首次启动
	//	var showGuide = plus.storage.getItem("lauchFlag");
	if (plus.runtime.launcher == 'shortcut') {
		// ...
		var cmd = JSON.parse(plus.runtime.arguments);
		console.log("Shortcut-plus.runtime.arguments: " + plus.runtime.arguments)
		var type = cmd && cmd.type;
		switch (type) {
			case 'share':
				// 用户点击了‘share'菜单项
				break;
			case 'about':
				// 用户点击了’about'菜单项
				break;
			default:
				break;
		}
	}
	var showGuide = true
	if (showGuide) {
		//有值，说明已经显示过了，无需显示；
		//关闭splash页面；

		//填入文章列表
		ajaxPhotoList(pagesnumber)
			//预加载
		preload();
	} else {
		//显示启动欢迎界面
		mui.openWindow({
			id: 'guide',
			url: 'mypages/guide.html',
			show: {
				aniShow: 'none'
			},
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//预加载
			preload();
		}, 200);
	}
});
var index = null; //主页面
function openMenu() {
	!index && (index = mui.currentWebview.parent());
	mui.fire(index, "menu:open");
}
//在android4.4.2中的swipe事件，需要preventDefault一下，否则触发不正常
window.addEventListener('dragstart', function(e) {
	mui.gestures.touch.lockDirection = true; //锁定方向
	mui.gestures.touch.startDirection = e.detail.direction;
});
window.addEventListener('dragright', function(e) {
	if (!mui.isScrolling) {
		e.detail.gesture.preventDefault();
	}
});
mui.init({
	statusBarBackground: '#FFFFFF',
	pullRefresh: {
		container: "#refreshContainerArticalList", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentdown: "正在加载...", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			callback: function() {
					var _this = this
					pagesnumber++
					if (pagesnumber > 10) {
						setTimeout(function() {
							_this.endPullupToRefresh(true);
						}, 200)
					} else {
						ajaxPhotoList(pagesnumber)
						_this.endPullupToRefresh(false);
					}
				} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

function ajaxPhotoList(page) {
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/photograph/list.json?page=' + page, {
		data: {
			page: page
		},
		type: 'get',
		dataType: 'json',
		timeout: '5000',
		success: function(data) {
			setTimeout(function() {
				plus.navigator.closeSplashscreen();
				plus.navigator.setFullscreen(false);
			}, 1000)
			var photolist = data.data.photoes;
			for (i = 0; i < photolist.length; i++) {
				insertPhotoList(photolist[i].images, photolist[i].uuid, photolist[i].title, photolist[i].author, photolist[i].comments, photolist[i].favorites)
			}
		},
		error: function() {}
	})
}
var photo_list = document.getElementById('photo_list')

function insertPhotoList(imgsrc, uuid, title, author, comments, favorites) {
	var _li = document.createElement('li');
	_li.setAttribute('class', 'mui-table-view-cell');
	_li.setAttribute('open-type', 'common');
	_li.setAttribute('data-uuid', uuid);
	var _div = document.createElement('div')
	_div.setAttribute('class', 'img-box')
	var _h2 = document.createElement('h2')
	_h2.innerText = ' 《' + title + '》';
	var _p = document.createElement('p')
	_p.innerText = '创作者:' + author;
	var _img = new Image;
	_img.src = imgsrc
	_div.appendChild(_img);
	_img.setAttribute('class', 'opacity-in')
	_li.appendChild(_div);
	_li.appendChild(_h2);
	_li.appendChild(_p);
	var _html_img_number = '<div class="img-number"><span class="iconfont  icon-tupian"></span>' + comments + '</div>';
	var _html_img_xihuan = '<div class="img-xihuan"><span class="iconfont  icon-xin"></span>' + favorites + '</div>';
	_li.innerHTML += _html_img_number;
	_li.innerHTML += _html_img_xihuan;
	photo_list.appendChild(_li);
}
//	主列表点击事件
mui('#photo_list').on('tap', 'li', function() {
	var type = this.getAttribute("open-type");
	var uuid = this.getAttribute('data-uuid');
	//不使用父子模板方案的页面
		mui.openWindow({
			id: 'mypages/photo.html',
			url: 'mypages/photo.html',
			styles: {
				hardwareAccelerated: true,
				scrollsToTop: true,
			},
			show: {
//				autoShow: true,
//				duration: 300
			},
			waiting:{
				autoShow:false
			},
			extras: {
				uuid: uuid
			}
		});

});