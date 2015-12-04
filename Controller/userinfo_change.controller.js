mui.init();
var head_img = document.getElementById('head-img')
mui.plusReady(function() {
	setHeadImg()
		// 获取摄像头目录对象
	plus.io.resolveLocalFileSystemURL( "_doc/", function ( entry ) {
		entry.getDirectory( "camera", {create:true}, function ( dir ) {
			gentry = dir;
		}, function ( e ) {
//			outSet( "Get directory \"camera\" failed: "+e.message );
		} );
	}, function ( e ) {
//		outSet( "Resolve \"_doc/\" failed: "+e.message );
	} );
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
	if (url == "user_img") {
		shareShow()
	} else {
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
	}
});

function shareShow() {
	bhref = false;
	var ids = [{
			id: "camera",
			ex: "WXSceneSession"
		}, {
			id: "camera_img",
			ex: "WXSceneTimeline"
		}],
		bts = [{
			title: "拍照上传"
		}, {
			title: "相册选择"
		}];
	plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: bts
		},
		function(e) {
			var i = e.index;

			if (i == 1) {

				getImage()
			}
		}
	)
}

function getImage() {
//	outSet("开始拍照：");
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
//		outLine("成功：" + p);
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
//			createItem(entry);
    console.log(entry)
		}, function(e) {
//			outLine("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
//		outLine("失败：" + e.message);
	}, {
		filename: "_doc/camera/",
		index: 1
	});
}

