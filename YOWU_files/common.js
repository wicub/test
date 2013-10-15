$(function(){
	currentMenu = $("#sub-menu-zone .active");

	$("#navigator-zone a")
	.mouseover(function(){
		$("#navigator-zone").stopTime("B");
		$("#sub-menu-zone .sub-menu").hide();
		this1 = $(this);
		overSubMenu = $("#sub-" + $(this).attr("id"));
		overSubMenu.show();
		overSubMenu.mouseover(function(){
			$("#navigator-zone").stopTime("B");
		});
		overSubMenu.mouseout(function(){
			$("#navigator-zone").oneTime("1s","B",function(){
				$("#sub-menu-zone .sub-menu").hide();
				currentMenu.show();
			});		
		});
	})
	.mouseout(function(){
		$("#navigator-zone").oneTime("1s","B",function(){
			$("#sub-menu-zone .sub-menu").hide();
			currentMenu.show();
		});		
	});
});
function toggleSubMenu(myObj,ifShow){
	currentMenu = $("#sub-menu-zone .current");
	myWidth = $(myObj).width();
	myLeft = $(myObj).offset().left;
	objSubMenu = $("#sub-"+myObj.id);
	subMenuWidth = objSubMenu.width();
	//alert(subMenuWidth);
	alert(myLeft+myWidth/2-subMenuWidth/2);
	//objSubMenu.css("left",myLeft+myWidth/2-subMenuWidth/2);
	if (ifShow)
	{
		$("#sub-menu-zone .sub-menu").hide();
		objSubMenu.show();
	}
	else{
		$("#sub-menu-purchase").hide();
	}

}


//ÅÐ¶Ïä¯ÀÀÆ÷
function brwsTester()
{
	return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;
}

//½«divÒÆ¶¯ÖÁ¾ÓÖÐÎ»ÖÃ
function moveToCenter(id)
{
	var scwidth  = $(window).width();
	var scheight = $(window).height();
	var tblwidth = $("#" + id).width();
	var tblheight = $("#" + id).height();
	//alert('ÆÁÄ»:' + screen.width + 'X' + screen.height + '\n´°¿Ú:'+scwidth+"X"+scheight+'\nµ¯´°:'+tblwidth+"X"+tblheight);
	//alert($("#dialog_container_" + id).offset().top);
	var top = brwsTester().scrollTop + (scheight - tblheight)/2;
	var left = brwsTester().scrollLeft + ((scwidth/2) - (tblwidth/2));
	$("#" + id).css({'top': top + 'px', 'left': left + 'px'});
}

//ÅÐ¶ÏÊÖ»úºÅÂë
function isMobile(str){
	var reg = /^13[0-9]{1}[0-9]{8}$|15[0189]{1}[0-9]{8}$|18[2689]{1}[0-9]{8}$/;
	return reg.test(str);
}

//ÅÐ¶Ïµç»°ºÅÂë
function isPhone(str){
	var reg = /^[\d|-]{7,}\d$/; 
	return reg.test(str);
}

//ÅÐ¶ÏÓÊÕþ±àÂë
function isZipcode(str){
	var reg = /^[0-9]{6}$/; 
	return reg.test(str);
}