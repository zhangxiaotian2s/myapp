mui.init({
	gestureConfig: {
		doubletap: true
	}
});
var nwaiting
var head_title = document.getElementById('head_title'),
	head_summary = document.getElementById('head_description'),
	news_title = document.getElementById('news_title'),
	news_time = document.getElementById('news_time'),
	news_author = document.getElementById('news_author'),
	addmyfavorites = document.getElementById('addmyfavorites'),
	favorites_star = document.getElementById('favorites_star'),
	favoritesnumber = document.getElementById('favoritesnumber'),
	addmyfavorites1 = document.getElementById('addmyfavorites1'),
	favorites_star1 = document.getElementById('favorites_star1'),
	favoritesnumber1 = document.getElementById('favoritesnumber1'),
	news_content = document.getElementById('news_content'),
	addmycomments = document.getElementById('addmycomments'),
	comments_ul = document.getElementById('comments_ul');
//	
//var shareMes={
//	href : "",
//	title : "",
//	content : "",
//	thumbs : ["http://augusta.oss-cn-beijing.aliyuncs.com/share/get_coupon_20151111.jpg"],
//	pictures : ["http://augusta.oss-cn-beijing.aliyuncs.com/share/get_coupon_20151111.jpg"]
//}

mui.plusReady(function() {
	nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框

	//分享
//	updateSerivces();
//	if (plus.os.name == "Android") {
//		Intent = plus.android.importClass("android.content.Intent");
//		File = plus.android.importClass("java.io.File");
//		Uri = plus.android.importClass("android.net.Uri");
//		main = plus.android.runtimeMainActivity();
//	}


	var self = plus.webview.currentWebview();
	var news_uuid = self.uuid;
	var user_uuid = self.user_uuid;
	var token = plus.storage.getItem('token');
	ajaxGetNewsContent(news_uuid, user_uuid)
		//收藏的点击
	addmyfavorites.addEventListener('tap', function() {
		addMyFavorites(news_uuid, token, user_uuid)
	}, false)
	addmyfavorites1.addEventListener('tap', function() {
			addMyFavorites(news_uuid, token, user_uuid)
		}, false)
		//点赞
	tapaddCommentsLikes(user_uuid, token)
		//评论
	addMyComments(user_uuid, token, news_uuid)

})



document.querySelector('header').addEventListener('doubletap', function() {
	mui.scrollTo(0, 100)
});


//获得文章全部信息
function ajaxGetNewsContent(news_uuid, user_uuid) {
	var url = 'http://sheying.development.mastergolf.cn/api/v1/article/item.json?uuid=' + news_uuid + '&user_uuid=' + user_uuid
	mui.ajax(url, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			//关闭显示框
			var code = data.code
			if (code == 10000) {
				nwaiting.close();
				newsBaseInfo(data.data)
				var content = data.data.content
					//图片放大查看插件

				//文本内容插入
				if (content.length < 1) {
					comments_ul.innerHTML = '<li><h6 class="mui-text-center">还没有评论内容</h6></li>'
				}
				for (i = 0; i < content.length; i++) {
					if (content[i].type == 'text') {
						insterNewsContent(content[i].content, 'text')
					} else {
						insterNewsContent(content[i].url, 'image')
					}
				}
				//插入评论内容
				var comments = data.data.comments
				for (i = 0; i < comments.length; i++) {
					insertComments(comments[i].image, comments[i].nickname, comments[i].time, comments[i].content, comments[i].ups, comments[i].has_up, comments[i].uuid)
				}
				// 分享的信息
//				getShareMes(data.data.share)
				//图片浏览
				mui.previewImage({
					title: data.data.title
				});
			}
			var loadnow = new loadimg();
			loadnow.scrolladd();
			document.body.ontouchmove = function() {
				loadnow.scrolladd();
			}
			window.onscroll = function() {
				loadnow.scrolladd();
			}
		},
		error: function() {
			nwaiting.close();
			mui.alert('内容获取失败', '摄影圈', function() {
				mui.back()
			})
		}
	})
}
//插入文章的基本信息
function newsBaseInfo(news) {
	news_title.innerText = news.title
	news_time.innerText = news.time
	news_author.innerText = news.author
	if (news.has_favorite == true) {
		changeFavoriteStar(true)
	}
	favoritesnumber.innerText = news.favorites
	favoritesnumber1.innerText = news.favorites
}
//插入文本内容
function insterNewsContent(content, type) {
	if (type == 'text') {
		var _html = '<p>' + content + '</p>'
		news_content.innerHTML += _html
	} else if (type == 'image') {
		var img = new Image;
		img.setAttribute('class', 'img-responsive  loadimg')
		img.src = '../images/zwf1.jpg'
		img.setAttribute('data-preview-src', '')
		img.setAttribute('data-preview-group', '1')
		img.onload = new function() {
			img.setAttribute('data-src', content)
			img.setAttribute('class', 'opacity-in img-responsive  loadimg')
		}
		news_content.appendChild(img)
	}
}
//文章收藏的状体处理
function changeFavoriteStar(isfavorites) {
	var _number = parseInt(favoritesnumber.innerText)
	if (isfavorites) {
		favorites_star.setAttribute('class', 'mui-icon mui-icon-star-filled color-red')
		favorites_star1.setAttribute('class', 'mui-icon mui-icon-star-filled color-red')
		_number++
		favoritesnumber.innerText = _number
		favoritesnumber1.innerText = _number
	} else {
		favorites_star.setAttribute('class', 'mui-icon mui-icon-star ')
		favorites_star1.setAttribute('class', 'mui-icon mui-icon-star ')
		_number--
		favoritesnumber.innerText = _number
		favoritesnumber1.innerText = _number
	}
}
///文章收藏的处理
function addMyFavorites(news_uuid, token, user_uuid) {
	nwaiting = plus.nativeUI.showWaiting();
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/article/favorite.json', {
		data: {
			uuid: news_uuid,
			token: token,
			user_uuid: user_uuid
		},
		type: 'post',
		timeout: 1000,
		success: function(data) {
			nwaiting.close()
			var code = data.code
			if (code == 10000) {
				mui.alert('收藏成功！', '摄影圈', function() {
					changeFavoriteStar(true)
				})
			}
		},
		error: function() {
			mui.alert('收藏成功！', '摄影圈', function() {})
		}
	})
}
//文章评论插入
function insertComments(image, nickname, time, content, ups, has_up, commen_uuid) {
	var _html = ''
	_html += '<li class="mui-row">';
	_html += '<div class="mui-col-xs-2 clearfix"><img src="' + image + '" ></div>';
	_html += '	<div class="mui-col-xs-10 clearfix">';
	_html += '<h3>' + nickname + '</h3>';
	_html += '<time>' + time + '</time>';
	if (has_up == true) {
		_html += '<div class="news-Likes"  comment_uuid="' + commen_uuid + '"><span class="iconfont icon-xin1 color-red"></span><i>' + ups + '</i></div> </div>';
	} else {
		_html += '<div class="news-Likes " comment_uuid="' + commen_uuid + '"><span class="iconfont icon-xin1 "></span><i>' + ups + '</i></div> </div>';
	}
	_html += '<p>' + content + '</p>';
	_html += '</li>';
	comments_ul.innerHTML += _html
}

function tapaddCommentsLikes(user_uuid, token) {
	mui('#comments_ul').on('tap', '.news-Likes', function() {
		var comment_uuid = this.getAttribute('comment_uuid')
		var icon_span = this.querySelectorAll('span')[0]
		if (icon_span.classList.contains('color-red')) {
			return
		} else {
			addCommentsLikes(icon_span, comment_uuid, user_uuid, token)
		}
	})

}


//评论点赞方法
function addCommentsLikes(e, comment_uuid, user_uuid, token) {
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/article/up.json', {
		data: {
			uuid: comment_uuid,
			token: token,
			user_uuid: user_uuid
		},
		type: 'post',
		success: function(data) {
			var code = data.code
			if (code == 10000) {
				changeCommentsLikesStyle(e)
			}
		},
		error: function() {

		}
	})
}
//点赞样式修改
function changeCommentsLikesStyle(element) {
	element.classList.add('color-red')
}


//文章评论跳转 
function addMyComments(user_uuid, token, news_uuid) {
	//	plus.webview.show('','slide-in-top')
	addmycomments.addEventListener('tap', function() {
		mui.openWindow({
			id: 'news_comment_add.html',
			url: 'news_comment_add.html',
			styles: {},
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: 'slide-in-bottom',
				duration: '300' //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			},
			extras: {
				user_uuid: user_uuid,
				token: token,
				uuid: news_uuid
			}

		})

	}, false)
}

////转发按钮
//document.getElementById('zhuanfa').addEventListener('tap', function() {
//			shareShow()
//}, false)
////朋友去
//document.getElementById('fxpyq').addEventListener('tap',function(){
//	shareAction('weixin','WXSceneTimeline')
//},false)
//document.getElementById('fxwxhy').addEventListener('tap',function(){
//	shareAction('weixin','WXSceneSession')
//},false)
//
//
//
//
//function getShareMes(share){
//	shareMes.href=share.url
//	shareMes.title=share.title
//	shareMes.content=share.summary
//	shareMes.thumbs=share.image
//}
//
//
//// 打开分享
//function shareShow() {
//	bhref = false;
//	var ids = [{
//			id: "weixin",
//			ex: "WXSceneSession"
//		}, {
//			id: "weixin",
//			ex: "WXSceneTimeline"
//		}],
//		bts = [{
//			title: "发送给微信好友"
//		}, {
//			title: "分享到微信朋友圈"
//		}];
//	plus.nativeUI.actionSheet({
//			cancel: "取消",
//			buttons: bts
//		},
//		function(e) {
//			var i = e.index;
//			if (i > 0) {
//				shareAction(ids[i - 1].id, ids[i - 1].ex);
//			}
//		}
//	);
//}
//
///**
// * 更新分享服务
// */
//function updateSerivces() {
//	plus.share.getServices(function(s) {
//		shares = {};
//		for (var i in s) {
//			var t = s[i];
//			shares[t.id] = t;
//		}
//	}, function(e) {
////		outSet("获取分享服务列表失败：" + e.message);
//	});
//}
///**
// * 分享操作
// * @param {String} id
// */
//function shareAction(id, ex) {
//	var s = null;
//	//				outSet("分享操作：");
//	if (!id || !(s = shares[id])) {
//		outLine("无效的分享服务！");
//		return;
//	}
//	if (s.authenticated) {
//		//					outLine("---已授权---");
//		shareMessage(s, ex);
//	} else {
//		//					outLine("---未授权---");
//		s.authorize(function() {
//			shareMessage(s, ex);
//		}, function(e) {
//			//						outLine("认证授权失败：" + e.code + " - " + e.message);
//		});
//	}
//}
///**
// * 发送分享消息
// * @param {plus.share.ShareService} s
// */
//function shareMessage(s, ex) {
//	var msg = {
//		content: "111",
//		extra: {
//			scene: ex
//		}
//	};
//	msg.href = shareMes.href;
//	msg.title = shareMes.title;
//	msg.content = shareMes.content;
//	msg.thumbs = [shareMes.thumbs]
//	msg.pictures =[shareMes.thumbs];
//	s.send(msg, function() {
//
//	}, function(e) {
//
//	});
//}