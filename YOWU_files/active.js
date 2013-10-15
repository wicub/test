//写cookies
function setCookie(name,value,life,path){
    var life = arguments[2] ? arguments[2] : 365;
    var path = arguments[3] ? arguments[3] : false;
	var date = new Date();
	date.setTime(date.getTime() + life * 86400000);
	document.cookie = name + "=" + escape(value) + ";expires=" + date.toGMTString() + ((path) ? ";path=" + path : '');
}
//读取cookies的值
function getCookie(name){
	var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg)){
		return unescape(arr[2]);
	}else{
		return false;
	}
}
//删除cookies的值
function delCookie(name,path){
    var path = arguments[1] ? arguments[1] : false;
    var exp = new Date();
    exp.setTime (exp.getTime() - 1);
    document.cookie = name + "=''" + "; expires=" + exp.toGMTString() + ((path) ? ";path=" + path : '');
}
//格式化数字（php number_format）number传进来的数,fix保留的小数位,默认保留两位小数,fh为整数位间隔符号,默认为空格,jg为整数位每几位间隔,默认为3位一隔
function number_format(number, fix, fh, jg){
    var fix = arguments[1] ? arguments[1] : 2;
    var fh = arguments[2] ? arguments[2] : ' ';
    var jg = arguments[3] ? arguments[3] : 3;
    var str = '';
    var sign;
    sign = number >= 0 ? '' : '-';  //记下正负数
    number = parseFloat(Math.abs(number), 10).toFixed(fix);
    number = number.toString();
    var zsw = number.split('.')[0]; //整数位
    var xsw = number.split('.')[1]; //小数位
    var zswarr = zsw.split('');   //将整数位逐位放进数组
    for(var i=1; i<=zswarr.length; i++){
        str = zswarr[zswarr.length - i] + str;
        if((i % jg) == 0){
            str = fh + str; //每隔jg位前面加指定符号
        }
    }
    str = ((zsw.length % jg) == 0) ? str.substr(1) : str; //如果整数位长度是jg的的倍数,去掉最左边的fh
    zsw = str + '.' + xsw; //重新连接整数和小数位
    return sign.toString() + zsw.toString();
}
//类似与php中的str_pad方法(input, pad_length, pad_string, pad_type)
function str_pad(str, len, chr, dir){
    str = str.toString();
    len = (typeof len == 'number') ? len : 0;
    chr = (typeof chr == 'string') ? chr : ' ';
    dir = (/left|right|both/i).test(dir) ? dir : 'right';
    var repeat = function(c, l) { // inner "character" and "length"
        var repeat = '';
        while (repeat.length < l) {
            repeat += c;
        }
        return repeat.substr(0, l);
    }
    var diff = len - str.length;
    if (diff > 0) {
        switch (dir) {
            case 'left':
                str = '' + repeat(chr, diff) + str;
                break;
            case 'both':
                var half = repeat(chr, Math.ceil(diff / 2));
                str = (half + str + half).substr(1, len);
                break;
            default: // and "right"
                str = '' + str + repeat(chr, diff);
        }
    }
    return str;
}
//格式化时间戳
function getData(nS) {
    var day2 = new Date(nS * 1000);
    return day2.getFullYear()+"-"+(day2.getMonth()+1)+"-"+day2.getDate()+" "+day2.getHours()+":"+day2.getMinutes()+":"+day2.getSeconds();
}
function boxShow(boxID,z_index){
    var z_index = arguments[1] ? arguments[1] : 99;
    if(boxID == 'bundefined' || boxID == undefined) return false;
    var m_z_index = (z_index == 99) ? 90 : (z_index - 5);
    var d_z_index = (z_index == 99) ? 99 : z_index;
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();
    var relLeft = ($(window).width() - $("#" + boxID).width())/2;
    var relTop = ($(window).height() - $("#" + boxID).height())/2;
    var msk_id = boxID+'_msg_mask';
    if($('#'+msk_id).length < 1){
        $('body').prepend('<div class="mask" id="'+msk_id+'"></div>');
    }
    $('#'+msk_id).css({height:maskHeight, width:maskWidth, zIndex:m_z_index}).show();
    $("#" + boxID).css({zIndex:d_z_index, top:$(window).scrollTop() + relTop + 'px', left:$(window).scrollLeft() + relLeft + 'px'}).show();
}
//公用tip
function tipsShow(obj){
    var b = $(obj).find('.tip_str').html();
	var $tip=$('<div id="tip_r"><div class="t_box"><div class="tip_msg">'+ b +'<s class="s1"><i class="i1"></i></s></div></div></div>');
    $('body').append($tip);
    $('#tip_r').show('fast');
	$('.tip_r').mouseout(function(){
	  $('#tip_r').remove();
	}).mousemove(function(e){
	  $('#tip_r').css({"top":(e.pageY-20)+"px","left":(e.pageX+30)+"px"})
	}).mousedown(function(){
	  $('#tip_r').remove();
	})
}
$(function(){
	$(".t_data_list tr:even").css("background-color","#fafafa");

	function maskMove(){
		thisID = "b" + $(this).attr("cval")
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
		relLeft = ($(window).width() - $("#" + thisID).width())/2;
		relTop = ($(window).height() - $("#" + thisID).height())/2;
		$('.mask').css({height:maskHeight, width:maskWidth}).show();
		$("#" + thisID).css({top:$(window).scrollTop() + relTop + 'px', left:$(window).scrollLeft() + relLeft + 'px'});
	}

	$(".btn_drag").click(function(){
		var btnCval = $(this).attr("cval");
		var boxID = "b" + btnCval;
        boxShow(boxID);
	});
	$(".rack_title").unbind("dblclick",maskMove).bind("dblclick",maskMove).dblclick(function(){
		var btnCval = $(this).attr("cval");
		var boxID = "b" + btnCval;
		$("#" + boxID).show();
	});
	$(".close_btn").click(function(){
        $(this).parents('.ac_box').hide();
        var boxID = $(this).parents('.ac_box').attr('id');
        $('#'+boxID+'_msg_mask').hide();
    });


	//nav
	var original = $(".active-item");
	$(".active-item span").show();

	function navP(e){
		$("ul#topnav li.active-item").removeClass("active-item").find("span").hide();
		original.removeClass("active-item").find("span").hide();
		$(e).addClass("active-item").find("span").show();

		var winWidth = $(window).width();
		var Nspan = $(e).children(".sub_nav")
		var offset = Nspan.offset()
		var Nmain = Nspan.width() + offset.left
		if(Nmain > winWidth){
			Nspan.css({left:winWidth-Nmain+"px"})
		}
	}


	$("#topnav li:not(:first)").bind("click",function(){navP(this);})

    $(".pageInput").keyup(function(e){
        if(e.which==13){
            $(this).parent().find('.edit_button').click();
        }
    })

	//拖动
    try {
        if($(".ac_box").length>0 && $(".ac_box h3").length>0) {
            $('.ac_box').drag(function( ev, dd ){
                $( this ).css({
                    top: dd.offsetY,
                    left: dd.offsetX
                });
            },{handle:".ac_box h3"});
        }
    }catch (e){}
});

//分页跳转
function jumpPage(obj,totalPages){
    var page = parseInt($(obj).parent().find('input').val(),10);
    if(isNaN(page) || page == 0){
        alert("请填写正确的跳转页码");
        return false;
    }else{
        if(page > totalPages){
            alert("当前只有"+totalPages+"页");
        }else{
            var url = $(obj).parent().parent().find('a').eq(0).attr('href');
            var urlArray= url.split('/p/')
            window.location = urlArray[0]+'/p/' + page
        }
    }
}
