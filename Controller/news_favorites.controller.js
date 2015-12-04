var pagenumber = 1;
var news_favorites_list = document.getElementById('news_favorites_list');
mui.init({
	pullRefresh: {
		container: "#news-favorites-refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentdown: "正在加载...", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			callback: function() {
					var _this = this
					pagenumber++;
					if (pagenumber < 5) {
						setTimeout(function() {
							ajaxGetFavoritesNewsList(pagenumber)
							_this.endPullupToRefresh(false);
						}, 200)
					} else {
						this.endPullupToRefresh(true);
					}
				} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});
mui.plusReady(function() {
	ajaxGetFavoritesNewsList(pagenumber)
	plus.webview.currentWebview().setStyle({
		'popGesture': 'hide'
	})
})

function ajaxGetFavoritesNewsList(pagenumber) {
	if (!pagenumber || pagenumber < 1) {
		pagenumber = 1
	}
	var uuid = plus.storage.getItem('uuid')
	var token = plus.storage.getItem('token')
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/article/favorites.json' + '?token=' + token + '&user_uuid=' + uuid + '&page=' + pagenumber, {
		dataType: 'json',
		type: 'get',
		timeout: '5000',
		success: function(data) {
			var code = data.code
			var articallist = data.data.articles
			if (code == 10000) {
				for (i = 0; i < articallist.length; i++) {
					setNewsListType(articallist[i].uuid, articallist[i].title, articallist[i].images)
				}
			}
		}
	})
}

function setNewsListType(uuid, title, arrimg) {
	var type = arrimg.length;
	var _html = '';
	if (type == 0) {
		_html += '<li class="img_zero_news mui-row" id="' + uuid + '" ><div class="mui-col-xs-12"><h2>' + title + '</h2></div></li>'
	} else if (type < 3) {
		_html += '<li class="img_one_news" id="' + uuid + '"><div class="mui-row"><div class="mui-col-xs-8"><h2>' + title + '</h2></div><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[0] + '" class="img-responsive"></div></div></li>'
	} else if (type >= 3) {
		_html += '<li class="img_three_news" id="' + uuid + '"><h2>' + title + '</h2><div class="img_list mui-row"><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[0] + '" class="img-responsive"></div><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[1] + '" class="img-responsive"></div><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[2] + '" class="img-responsive"></div></div></li>'
	}
	news_favorites_list.innerHTML += _html
}
//////////////////////////////////////////////////点击到内容页面的处理
function setNewsListTap(news_uuid, user_uuid) {
	mui.openWindow({
		id: 'news.html',
		url: 'news.html',
		styles: {
			top: '0px',
			bottom: '0px',
			scrollsToTop: true,
		},
		show: {
			duration: 300
		},
		extras: {
			uuid: news_uuid,
			user_uuid: user_uuid
		},
		waiting: {
			autoShow: true
		}
	});
}
mui('#news_favorites_list').on('tap', 'li', function() {
	var news_uuid = this.getAttribute('id');
	var user_uuid = plus.storage.getItem('uuid')
	setNewsListTap(news_uuid, user_uuid)
})