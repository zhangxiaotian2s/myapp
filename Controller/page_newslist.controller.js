var newslist = document.getElementById('news_list')
var pagenumber=1
mui.init({
	
	pullRefresh: {
		container: "#pagenewslist-refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentdown: "正在加载...", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			callback: function() {
				var _this = this
				pagenumber++;
				if (pagenumber > 5) {
					setTimeout(function() {
						_this.endPullupToRefresh(true);
					}, 200)

				} else {
					inserPageNewsList(pagenumber)
					this.endPullupToRefresh(false);
				}

			}
		}
	}
});
mui.plusReady(function() {
	inserPageNewsList(1)
	mui('#news_list').on('tap', 'li', function() {
		var news_uuid = this.getAttribute('id');
		var user_uuid = plus.storage.getItem('uuid')
		setNewsListTap(news_uuid, user_uuid)
	})
	mui('#slider_loop_box').on('tap', 'div', function() {
		var news_uuid = this.getAttribute('id');
		var user_uuid = plus.storage.getItem('uuid')
		setNewsListTap(news_uuid, user_uuid)
	})

})

function inserPageNewsList(page) {
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/article/list.json=' + page, {
		data: {
			page: page
		},
		type: 'get',
		timeout: '10000',
		success: function(data) {
			var code = data.code
			if (page == 1) {
				insertBanner(data)
			}
			insertNewsList(data)

		},
		error: function() {}

	})
}

function insertBanner(data) {
	var slider_loop_box = document.getElementById('slider_loop_box');
	var banner = data.data.banners
	var first_img = '	<div class="mui-slider-item mui-slider-item-duplicate" id="' + banner[0].uuid + '"><a href="#">	<img src="' + banner[0].image + '"></a></div>'
	slider_loop_box.innerHTML += first_img
	var loop_banner = ""
	for (i = 0; i < banner.length; i++) {
		loop_banner += '<div class="mui-slider-item"  id="' + banner[i].uuid + '"><a href="#"><img src="' + banner[i].image + '"></a></div>'
	}
	slider_loop_box.innerHTML += loop_banner
	var end_img = '<div class="mui-slider-item mui-slider-item-duplicate" id="' + banner[banner.length - 1].uuid + '"><a href="#"><img src="' + banner[banner.length - 1].image + '"></a></div>'
	slider_loop_box.innerHTML += end_img;
	var slider_loop_btn_box = document.getElementById('slider_loop_btn_box')
	var slider_loop_btn = ''
	for (i = 0; i < banner.length; i++) {
		var _active = ''
		if (i == 0) {
			_active = "mui-active"
		}
		slider_loop_btn += '<div class="mui-indicator ' + _active + '"></div>'
	}
	slider_loop_btn_box.innerHTML += slider_loop_btn
	var slider = mui("#slider");
	slider.slider({
		interval: 2000
	})
}

function insertNewsList(data) {
	var _news = data.data.articles
	for (i = 0; i < _news.length; i++) {
		setNewsListType(_news[i].uuid, _news[i].title, _news[i].images, _news[i].author, _news[i].comments, _news[i].favorites)
	}
}

function setNewsListType(uuid, title, arrimg, author, comments, favorites) {
	var type = arrimg.length;
	var _html = '';
	var hiddeClass = ""
	if (comments == 0 || comments == "") {
		hiddeClass = "mui-hidden"
	}
	if (type == 0) {
		_html += '<li class="img_zero_news mui-row" id="' + uuid + '" ><div class="mui-col-xs-12"><h2>' + title + '</h2></div><p>' + author + '</p><div class="news-shoucang"><span class="mui-icon mui-icon-star"></span>' + favorites + '</div><div class="news-huifu"><span class="mui-icon mui-icon-chat ' + hiddeClass + '"></span>' + comments + '</div></li>'
	} else if (type < 3) {
		_html += '<li class="img_one_news" id="' + uuid + '"><div class="mui-row"><div class="mui-col-xs-8"><h2>' + title + '</h2></div><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[0] + '" class="img-responsive"></div></div><p>' + author + '</p><div class="news-shoucang"><span class="mui-icon mui-icon-star"></span>' + favorites + '</div><div class="news-huifu"><span class="mui-icon mui-icon-chat ' + hiddeClass + ' "></span>' + comments + '</div></li>'
	} else if (type >= 3) {
		_html += '<li class="img_three_news" id="' + uuid + '"><h2>' + title + '</h2><div class="img_list mui-row"><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[0] + '" class="img-responsive"></div><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[1] + '" class="img-responsive"></div><div class="mui-col-xs-4 list-img-box"><img src="' + arrimg[2] + '" class="img-responsive"></div></div><p>' + author + '</p><div class="news-shoucang"><span class="mui-icon mui-icon-star"></span>' + favorites + '</div><div class="news-huifu"><span class="mui-icon mui-icon-chat ' + hiddeClass + ' "></span>' + comments + '</div></li>'
	}
	news_list.innerHTML += _html
}

//////////////////////////////////////////////////点击到内容页面的处理
function setNewsListTap(news_uuid, user_uuid) {
	mui.openWindow({
		id: 'news.html',
		url: 'mypages/news.html',
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
			autoShow: false
		}
	});
}