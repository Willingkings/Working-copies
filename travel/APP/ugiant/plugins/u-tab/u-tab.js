
function uTab(target,navItemClickCall){
	
	var temp = {
		target:target,
		elements:{
			parent:".u-tab",
			nav:".u-tab  ul.nav ",
			navItem:".u-tab  ul.nav li.item",
			bodyItem:".u-tab ul.body li.section"
		},
		init:function(){
			this.navEvent();
			this.styleAdjust();
		},
		styleAdjust:function(){
			var nav = this.target + this.elements.nav;
			var navItemElements = this.target + this.elements.navItem;

			var width = $(nav).width();
			var num = $(navItemElements).length;
			$(navItemElements).width(width / num - 10 );

		},
		navEvent:function(){
			/*导航点击*/
			var navItemElements = this.target + this.elements.navItem;
			var bodyItemElements = this.target + this.elements.bodyItem;

			$(navItemElements).on("touchstart",function(){
				//tab导航点击
				$(navItemElements).removeClass("active");
				$(this).addClass("active");

				//tab标签体显示
				var index = $(this).index();
				$(bodyItemElements).hide();
				$(bodyItemElements+":eq("+index+")").show();

				//点击回调
				if(typeof(eval(navItemClickCall))=="function") {
					var data = $(this).attr("data");
					navItemClickCall(index,data);
				}
				

			});
		}


	};//temp	

	return temp;
};//u-tab 标签切换