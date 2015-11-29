mui.init()
var person_head = document.getElementById('person_head');
var head_img = document.getElementById('head_img');
var nickname = document.getElementById('person_nickname');
var articals_collection_number = document.getElementById('articals_collection_number')
var login_out = document.getElementById("login_out")
var islogin;
mui.plusReady(function() {
	islogin = checklogin()
		//如果已经登陆获取登录信息
	if (islogin) {
		setUserMes()
	}
	setHeadImgStyle()
		//延时预加载
	setTimeout(function() {
		setPreload()
	}, 200)


})

function setPreload() {
	mui.preload({
		url: 'mypages/news_favorites.html',
		id: 'mypages/news_favorites.html'
	})
	mui.preload({
		url: 'mypages/about.html',
		id: 'mypages/about.html'
	})
}

//预加载我的收藏
function checklogin() {
	var _islogin = plus.storage.getItem('islogin');
	if (_islogin == undefined || _islogin == "") {
		return islogin = false
	} else {
		return islogin = true
	}
}
//已经登录的设置用户的头像和用户名已经收藏文章数
function setUserMes() {
	var _nickname = plus.storage.getItem('nickname')
	var _imgsrc = plus.storage.getItem('headimg')
	var _ismember = plus.storage.getItem('is_member')
	var _favorites = plus.storage.getItem('favorites')
	head_img.src = _imgsrc
	if (_ismember == 'true') {
		nickname.innerText = "会员 | " + _nickname
	} else {
		nickname.innerText = _nickname
	}
	articals_collection_number.innerText = _favorites
	login_out.style.display = "block"
}
//控制头像尺寸
function setHeadImgStyle() {
	var _w = head_img.width;
	var _h = head_img.height;
	head_img.style.width = '100px'
	if (head_img.height < 100) {
		head_img.style.height = '100px'
		head_img.style.width = (_w / _h) * 100 + 'px'
	}
}
//个人中心各种点击的处理
//打开登陆页面方法
function openLogin() {
	mui.openWindow({
		url: 'mypages/login.html',
		id: 'mypages/login.html',
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
}
//已经登陆的情况下的 列表部分的点击走向处理
function personOpenWindow(url) {
	mui.openWindow({
		url: url,
		id: url,
		stryle: {
			top: '0px', //新页面顶部位置
			bottom: '0px', //新页面底部位置
		},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: '300',
		}
	})
}
//头部信息的点击处理
person_head.addEventListener('tap', function() {
		personHeadTap()
	}, false)
	//头部信息的点击处理
function personHeadTap() {
	if (islogin) {
		//已经存储登陆信息的时候
		plus.navigator.setStatusBarBackground("#ffffff")
		mui.openWindow({
			url: 'mypages/useinfo_change.html',
			id: 'mypages/useinfo_change.html',
			stryle: {
				top: '0px', //新页面顶部位置
				bottom: '0px', //新页面底部位置
			},
			show: {
				autoShow: true,
				aniShow: 'slide-in-right',
				duration: '300',
			}
		})
	} else {
		openLogin()
	}
}
//列表按钮的点击处理
mui('#person_btn_list').on('tap', 'li', function() {
	var url = this.getAttribute('id')
	var type = this.getAttribute('data-type')
	if (islogin) {
		//设置setStatusBarBackground
		plus.navigator.setStatusBarBackground("#ffffff")
			//我的收藏与关于的页面的单独处理该页面使用预加载
		if (type == 'ispreload') {
			plus.webview.show(url, 'slide-in-right', 300)
		} else {
			personOpenWindow(url)
		}
	} else {
		openLogin()
	}
});
//退出登录
login_out.addEventListener('tap', function() {
	var btnArray = ['取消', '退出'];
	mui.confirm("您是否选择退出", "摄影圈", btnArray, function(e) {
		if (e.index == 1) {
			plus.storage.removeItem('islogin')
			checklogin()
			if (!islogin) {
				person_nickname.innerText = "登陆/注册"
					//重设头像标准
				setHeadImgStyle()
			}
		}
	})
}, false)