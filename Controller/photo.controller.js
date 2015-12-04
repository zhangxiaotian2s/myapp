mui.init({
	gestureConfig: {
		doubletap: true
	}
});


var head_title = document.getElementById('head_title'),
	news_title = document.getElementById('news_title'),
	news_time = document.getElementById('news_time'),
	news_author = document.getElementById('news_author'),
	addmyfavorites = document.getElementById('addmyfavorites'),
	news_content = document.getElementById('news_content');
	
var shareMes={
	href : "",
	title : "",
	content : "",
	thumbs : [],
	pictures : []
}	
	
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	var news_uuid = self.uuid;
	var user_uuid = self.user_uuid;
	var token = plus.storage.getItem('token');
	ajaxGetNewsContent(news_uuid, user_uuid, token)
})
document.querySelector('header').addEventListener('doubletap', function() {
	mui.scrollTo(0, 100)
});


//获得文章全部信息
function ajaxGetNewsContent(news_uuid, user_uuid, token) {
	var url = 'http://sheying.development.mastergolf.cn/api/v1/photograph/item.json?uuid=' + news_uuid + '&user_uuid=' + user_uuid
	mui.ajax(url, {
		dataType: 'json',
		type: 'get',
		timeout: 5000,
		success: function(data) {
			//关闭显示框
			var code = data.code
			if (code == 10000) {
			  document.getElementById('waiting').classList.add('mui-hidden')
				newsBaseInfo(data.data)
				insertPhotolist(data)
				//分享
//				getShareMes(data.data.share)
				//图片查看
				mui.previewImage({
					title: "等待调取",
					des: arrdes,
					bottom: true,
					like_hasup: data.data.has_up,
					like_url: 'http://sheying.development.mastergolf.cn/api/v1/photograph/up.json',
					uuid: news_uuid,
					user_uuid: user_uuid,
					token: token
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
//	news_title.innerText = news.title
//	news_time.innerText = news.time
//	news_author.innerText = news.author
}
var arrdes = new Array()

function insertPhotolist(data) {

	var arrimg = data.data.photoes
	var _html = ''
	for (i = 0; i < arrimg.length; i++) {
		arrdes.push(arrimg[i].desc)
		var img = new Image;
		img.setAttribute('class', 'img-responsive  loadimg')
		img.src = '../images/zwf1.jpg'
		img.setAttribute('data-preview-src', '')
		img.setAttribute('data-preview-group', '1')
		img.onload = new function() {
			img.setAttribute('data-src', arrimg[i].url)
			img.setAttribute('class', 'opacity-in img-responsive  loadimg')
		}
		news_content.appendChild(img)
		_html = '<p>' + arrimg[i].desc + '</p>'
		news_content.innerHTML += _html
	}
}


//function getShareMes(share){
//	shareMes.href=share.url
//	shareMes.title=share.title
//	shareMes.content=share.summary
//	shareMes.thumbs=share.image
//}
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
//		outSet("获取分享服务列表失败：" + e.message);
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
//		content: "",
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
