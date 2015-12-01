mui.init({
	swipeBack: true //启用右滑关闭功能
});
var photo_list = document.getElementById('photo_list')
var seachinput = document.getElementById('search');
var searchbtn = document.getElementById('submit_btn')
	//语音识别完成事件
seachinput.addEventListener('recognized', function(e) {
	photo_list.innerHTML = ""
	ajaxPhotoList(e.detail.value)
});
searchbtn.addEventListener('tap', function() {
	photo_list.innerHTML = ""
	var keyword = seachinput.value
	if (keyword == '') {
		return
	}
	ajaxPhotoList(keyword)

})
seachinput.addEventListener('keydown', function(e) {
	var key = e.which
	if (key == 13) {
		var keyword = seachinput.value
		photo_list.innerHTML = ""
		ajaxPhotoList(keyword)

	}
})

function ajaxPhotoList(keyword) {
	var waiting = plus.nativeUI.showWaiting()
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/photograph/search.json?key_word=' + keyword, {
		data: {
			key_word: keyword
		},
		type: 'get',
		timeout: '5000',
		success: function(data) {
			waiting.close()
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
	if (type == "common") {
		var webview_style = {
			popGesture: "close",
			blockNetworkImage: true,
			scrollsToTop: true
		};
		mui.openWindow({
			id: 'photo.html',
			url: 'photo.html',
			styles: {
				hardwareAccelerated: true,
				scrollsToTop: true,
			},
			show: {
				autoShow: true,
				duration: 300
			},
			extras: {
				uuid: uuid
			},
			createNew: false,
			waiting: {
				autoShow: false
			}
		});
	}
});