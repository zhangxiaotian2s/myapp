mui.init();
mui.plusReady(function() {
getPayMemberInfo()
});
var pay_memenr_info=document.getElementById('pay_memenr_info')
var pay_next_btn = document.getElementById("pay_next_btn");
pay_next_btn.addEventListener('tap', function() {
	mui.openWindow({
		url: 'pay_choice_list.html',
		id: 'pay_choice_list.html',
		styles: {
			top: '0px', //新页面顶部位置
			bottom: '0px', //新页面底部位置
			hardwareAccelerated: true
		},
		show: {
			autoShow: true,
			aniShow: 'slide-in-right',
			duration: '300',
		}
	})
}, false);

function getPayMemberInfo(){
	var wating=plus.nativeUI.showWaiting()
	mui.ajax('http://sheying.development.mastergolf.cn/api/v1/user/member_info.json',{
		type:'get',
	    success:function(data){
             wating.close()
             var code=data.code
            if(code==10000){
             	pay_memenr_info.innerHTML=data.data.content
             }
	    }
	   
	})
	
	
}
