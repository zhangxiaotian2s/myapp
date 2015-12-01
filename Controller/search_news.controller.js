mui.init({
	swipeBack: true //启用右滑关闭功能
});
var news_list = document.getElementById('news_list')
var seachinput = document.getElementById('search');
var searchbtn = document.getElementById('submit_btn')
mui.plusReady(function() {
		mui('#news_list').on('tap', 'li', function() {
			var news_uuid = this.getAttribute('id');
			var user_uuid = plus.storage.getItem('uuid')
			setNewsListTap(news_uuid, user_uuid)
		})
	})
	//语音识别完成事件
seachinput.addEventListener('recognized', function(e) {
	news_list.innerHTML = ""
	inserPageNewsList(e.detail.value)
});
searchbtn.addEventListener('tap', function() {
	news_list.innerHTML = ""
	var keyword = seachinput.value
	if (keyword == '') {
		return
	}
	inserPageNewsList(keyword)
})
seachinput.addEventListener('keydown', function(e) {
	var key = e.which
	if (key == 13) {
		var keyword = seachinput.value
		news_list.innerHTML = ""
		inserPageNewsList(keyword)
	}
})

function inserPageNewsList(keyword) {
	var waiting = plus.nativeUI.showWaiting()
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/article/search.json?key_word=' + keyword, {
		data: {
			key_word: keyword
		},
		type: 'get',
		timeout: '10000',
		success: function(data) {
			waiting.close()
			var code = data.code
			insertNewsList(data)
		},
		error: function() {}
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
///////////点击到内容页面的处理
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
			autoShow: false
		}
	});
}