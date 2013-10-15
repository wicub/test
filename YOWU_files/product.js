var _nowChoose = '';
var _scrTop = getCookie('manageIndex_scrolltop');
var _minPrice = '';
// 取字符串长度
function getViewLength(str){
    var strLength = str.length;
    var viewLength = 0;
    var charCode = '';
    for(var i = 0; i < strLength; i++) {
        charCode = str.charCodeAt(i);
        if(charCode > 128){
            viewLength += 2;
        }
        else if(charCode>=65 && charCode<=90){
            viewLength += 1.5;
        }
        else{
            viewLength += 1;
        }
    }
    return viewLength;
}
// 选择头部标签
function chooseSelectType(type){
    $('#select_type').val(type);
    $('#form1').submit();
}
// 得到单件商品信息
function getOneProduct(obj,type) {
    _msgalertshow();
    var id = parseInt($(obj).parent().parent().attr('id'),10);
	$.get(_url+'/lstOneInfo', { id:id,type:type } ,function(ret){
        _msgalerthide();
        if(type == 1) {
            $('#edit_sku').text(id);
            $('#my_edit_div').html(ret);
            boxShow('bc01');
        } else if(type == 2) {
            $('#view_sku').text(id);
            $('#my_view_div').html(ret);
            boxShow('bc03');
        };
    });
}
//得到单件商品的尽码信息
function setOneMeasures(obj) {
    _msgalertshow();
    var id = parseInt($(obj).parent().parent().attr('salesId'),10);
    $.get(_url+'/lstOneMeasures', { id:id } ,function(ret){
        _msgalerthide();
		$('#e_sales_id').text(id);
		$('#edit_size_div').html(ret);
		boxShow('bc02');
    });
}
// 弹出 特价设置 div
function oSetTypeDiv(obj) {
    _msgalertshow();
    var id = parseInt($(obj).parent().parent().attr('salesId'),10);
    $.get(_url+'/salesTypePage', { id:id } ,function(ret) {
		_msgalerthide();
        $('#my_edit_type').html(ret);
        boxShow('bc05');
    });
}
// 将商品设为特价
function setProductType(salesId,obj){
    var price = parseFloat($('#e_special_price').val(),10);
    var newest_cost = parseInt($('#e_newest_cost').attr('newest_cost'),10);
    var sales_price = parseInt($('#e_sales_price').attr('sales_price'),10);
    var dis;
    if(!isNumber(price)){
        msgBoxText('特卖价格不是数字',2,null);
        return false;
    }
    if(isEmpty(price)){
        msgBoxText('特卖价格不能为空',2,null);
        return false;
    }
    if(price > sales_price){
        msgBoxText('特卖价格大于正常销售价',2,null);
        return false;
    }
    dis = Math.round(100 - newest_cost / price * 100);
	/*
	//销售价过低时的提醒
	if(dis <= 0){
        if(confirm('当前设置的特卖价格过低（ 利润率:'+dis+'% ），是否要重新设置价格？')){
            msgBoxText('重新设置价格',2,null);
            return false;
        }
    }
	*/
    $(obj).attr('disabled','disabled');
    $("#rack_case13").show();
    $.post(_url+'/setSpecialProduct',{ id:salesId,price:price },function(ret){
        switch(ret){
            case '1':
                msgBoxText('处理成功',1,function(){ location.reload(); });
                break;
            case '0':
                msgBoxText('处理失败',2,null);
                break;
            case '-1':
                msgBoxText('商品价格异常',2,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
        $(obj).attr('disabled','');
    });
    return false;
}
// 取消特卖
function cancelSpecial(obj){
    if(!confirm('是否要将此商品设置为正常销售？')) return false;
    _msgalertshow();
    var id = parseInt($(obj).parent().parent().attr('salesId'),10);
    $.post(_url+'/cancelSpecial',{ id:id },function(ret){
		_msgalerthide();
        switch(ret){
            case '1':
                msgBoxText('处理成功',1,function(){ location.reload(); });
                break;
            case '0':
                msgBoxText('处理失败',2,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
    });
}
//通过代销商查到可代销的品牌
function getTheBrand(supplier_id) {
	_msgalertshow();
	$.get(_url+'/getTheBrand', { id : supplier_id }, function(ret) {
		_msgalerthide();
		var brands = eval('('+ret+')');
		var shtml = '<select id="brand_id" style="pri_select">';
		shtml += '<option value="">-请选择-</option>';
		for(var i in brands) {
			shtml += '<option value="' + brands[i].id + '">' + brands[i].ename + '</option>';
		}
		shtml += '</select>';
		$('#n_brands').html(shtml);
    });
}
// 数据验证
function verify(Post){
    if(isEmpty(Post.supplier_id)){
        msgBoxText('请选择代销商',2,null);
        return false;
    }
    if(isEmpty(Post.brand_id)){
        msgBoxText('请选择品牌',2,null);
        return false;
    }
    if(isEmpty(Post.category_id)){
        msgBoxText('请选择分类',2,null);
        return false;
    }
    if(isEmpty(Post.fit_person)){
        msgBoxText('请选择适合性别',2,null);
        return false;
    }
    if(isEmpty(Post.item_number)){
        msgBoxText('请填写原厂货号',2,null);
        return false;
    }
    return true;
}
// 发送修改命令
function postProduct(Post){
	_msgalertshow();
    $.post(_url+'/setProduct',Post,function(ret) {
		_msgalerthide();
		var str = eval('(' + ret + ')');
        ret = parseInt(str.ret);
        switch(ret){
            case 1:
                msgBoxText('处理成功',1,function(){ location.reload(); });
                break;
            case 0:
                msgBoxText('处理失败',2,null);
                break;
            case -1:
                msgBoxText('商品重复，重复sku号为' + str.sku, 2, null);
                break;
            case -11:
                msgBoxText('原场货号为空',2,null);
                break;
            case -12:
                msgBoxText('代销商名为空',2,null);
                break;
            case -13:
                msgBoxText('适合性别为空',2,null);
                break;
            case -14:
                msgBoxText('销售价格为空',2,null);
                break;
            case -16:
                msgBoxText('品牌为空',2,null);
                break;
            case -17:
                msgBoxText('分类为空',2,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
    });
}
// 新增尺寸明细
function addSize(obj){
    var a = $(obj).parent().prev().clone(true);
    $(a).find("input:hidden").val("");
    $(a).find("input:text").val("");
    $(obj).parent().prev().after(a);
}
// 删除尺寸明细
function delSize(obj){
    $this = $(obj);
    if ($this.parent().parent().find("div").length > 3){
        $this.parent().remove();
    }else{
        alert("至少需要一个数量 !")
    }
}
// 添加商品
function addProduct(){
    var Post = {
        supplier_id  : $('#n_supplier_id').val(),
        brand_id     : $('#n_brand_id').val(),
        category_id  : $('#n_category_id').val(),
        fit_person   : $('#n_fit_person').val(),
        product_code : $.trim($('#n_product_code').val()),
        item_number  : $.trim($('#n_item_number').val()),
        _type        : 1
    };
    if(verify(Post)) postProduct(Post);
    return false;
}
// 整合规格信息
function formatSize() {
    var quantitys ='', size = '', search_size = '', number = '';
    $('#n_quantitys').find('.num-div').each(function(){
        qid = $.trim($(this).find('input:hidden').eq(0).val());	//尺码ID
        size = $.trim($(this).find('input:text').eq(0).val());	//尺码
		//if(size == '') return '';
        search_size = $.trim($(this).find('.search_size option:selected').text());	//搜索码
        number = parseInt($.trim($(this).find('input:text').eq(1).val()));	//数量
        if(!isNumber(number)) number = 0;
        quantitys += qid + '#' + size + '#' + search_size + '#' + number + '|';
    });
    return quantitys;
}

//设置产品尺码
function subMeasures() {
	var sales_id = $('#e_sales_id').html();
	var quantitys = formatSize();
    var Post = {
		sales_id : sales_id,
		quantitys  : quantitys
    };
	_msgalertshow();
	$.post(_url+'/subMeasures',Post,function(ret) {
		_msgalerthide();
        ret = parseInt(ret);
        switch(ret){
            case 1:
                msgBoxText('处理成功',1,function(){ location.reload(); });
                break;
            case 0:
                msgBoxText('处理失败',2,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
	});
    return false;
}
// 修改市场价
function setPublicPrice(obj,staticPrice){
    var id = parseInt($(obj).parent().parent().attr('id'),10); //product_id
    var objtd = $("#edit_price").parent();//输入框的上级标记
    var inputVal = $("#edit_price").val();//输入框内的内容
    var inputPrice = parseInt(inputVal,10); //当前输入价格
    if(inputVal=='' || staticPrice==inputPrice) {
        $("#edit_price").blur();
        return false;
    }
    var salesPrice = parseInt(objtd.attr('salesPrice'),10); //销市场价
    if(!isNumber(inputPrice)){
        msgBoxText('输入的价格不是数字',2,null);
        $("#edit_price").focus().select();
        return false;
    }
    if(inputVal == ''){
        msgBoxText('输入价格不能为空',2,null);
        $("#edit_price").focus().select();
        return false;
    }
    if(inputPrice!=0 && inputPrice<salesPrice){
        msgBoxText('当前输入的市场价不能小于销售价',2,null);
        $("#edit_price").focus().select();
        return false;
    }
	_msgalertshow();
    $.post(_url+'/setPublicPrice',{ product_id:id,price:inputPrice },function(ret){
		_msgalerthide();
        try {
            var jsonStr = eval('('+ret+')');
        }catch (e){
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        if(typeof(jsonStr) !== 'object'){
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        var waitTime = (jsonStr.status==1) ? 1 : 2;
        msgBoxText(jsonStr.info,waitTime,function(){
            if(jsonStr.status==1){
                setCookie('manageIndex_scrolltop', document.documentElement.scrollTop, 1);
                location.reload();
            }
        });
    });
}
// 修改销售价
function setSalesPrice(obj,staticPrice,minPrice){
    var id = parseInt($(obj).parent().parent().attr('salesId'),10); //sales_id
    var objtd = $("#edit_price").parent();//输入框的上级标记
    var inputVal = $("#edit_price").val();//输入框内的内容
    var inputPrice = parseFloat(inputVal,10); //当前输入价格
    if(inputVal=='' || staticPrice==inputPrice){
        $("#edit_price").blur();
        return false;
    }
    var meiciPrice = parseInt(objtd.attr('meiciPrice'),10); //优物价
    var salesType = parseInt(objtd.attr('salesType'),10); //商品销售状态
    if(!isNumber(inputPrice)){
        msgBoxText('价格不是数字',2,null);
        $("#edit_price").focus().select();
        return false;
    }
    if(isEmpty(inputPrice)){
        msgBoxText('价格不能为空',2,null);
        $("#edit_price").focus().select();
        return false;
    }
    if(salesType!=1 && meiciPrice<inputPrice){
        msgBoxText('特卖价格大于正常销售价',2,null);
        $("#edit_price").focus().select();
        return false;
    }
    if(inputPrice < 500){
        msgBoxText('暂无法销售500元以内的商品',2,null);
        $("#edit_price").focus().select();
        return false;
    }
    if(inputPrice < minPrice){
        if(!confirm('您现在修改的价格低于近14天出售的最低价，可能会产生价格纠纷，确定修改吗？')){
            $("#edit_price").val(staticPrice);
            $("#edit_price").focus().select();
            msgBoxText('重新设置价格',2,null);
            return false;
        }
    }
	_msgalertshow();
    $.post(_url+'/setSalesPrice',{ id:id,price:inputPrice },function(ret) {
		_msgalerthide();
        var jsonStr = eval('('+ret+')');
		try {
            var jsonStr = eval('('+ret+')');
        }catch (e){
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        if(typeof(jsonStr) !== 'object'){
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        var waitTime = (jsonStr.status==1) ? 1 : 2;
        msgBoxText(jsonStr.info,waitTime,function(){
            if(jsonStr.status==1){
                setCookie('manageIndex_scrolltop', document.documentElement.scrollTop, 1);
                location.reload();
            }
        });
    });
}
// 修改价格的效果
function showPriceInput(obj,type){
    var staticPrice = parseInt($(obj).parent().attr('staticPrice'),10); //修改前的价格
    $(obj).hide();
    $(obj).prev().hide();
    $(obj).parent().prepend("<input class='edit_price' id='edit_price' type='text' value='"+staticPrice+"' />");
    $("#edit_price").focus().select();
    $("#edit_price").blur(function(){
        $(this).next().show().next().show();
        $(this).detach();
        $('#tip').hide();
    });
    $("#edit_price").keyup(function(e){
        if(e.which == '13') {
            if(type == 'salesPrice'){
                _minPrice = parseInt(_minPrice,10);
                setSalesPrice(obj,staticPrice,_minPrice);
                $('#tip').hide();
            }else if(type == 'publicPrice'){
                setPublicPrice(obj,staticPrice);
            }
        }
        else if(e.which == '27') {
            $(this).blur();
        }
    });
}
//商品上下架
function setStatus(val, id) {
    if(!confirm('是否要执行本操作？')) return false;
    if(id != '') {
		ids = id;
	} else if(_nowChoose != '') {
		ids = _nowChoose;
    } else {
        alert('请先选择商品！');
        return false;
	}
    _msgalertshow();
    $.post(_url+'/setStatus', { ids: ids, status:val }, function(ret) {
		_msgalerthide();
        try {
            var jsonStr = eval('(' + ret + ')');
        } catch (e) {
            msgBoxText('发生未知错误', 2, null);
            return false;
        }
        if(typeof(jsonStr) !== 'object') {
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        var flg = parseInt(jsonStr._flag, 10);
        switch(flg){
            case 1:
                msgBoxText('处理成功',1,function(){ location.reload(); });
                break;
            case 0:
                msgBoxText('处理失败',2,null);
                break;
            case -1:
                msgBoxText('选择的商品异常',2,null);
                break;
            case -2:
                msgBoxText(jsonStr.info,3,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
    });
    return false;
}
//商品刷新至最前
function refreshProduct(id){
    if(!confirm('是否要执行本操作？')) return false;
    _msgalertshow();
    $.post(_url+'/refreshProduct',{ sales_id:id },function(ret) {
		_msgalerthide();
        try {
            var jsonStr = eval('('+ret+')');
        }catch (e){
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        if(typeof(jsonStr) !== 'object'){
            msgBoxText('发生未知错误',2,null);
            return false;
        }
        var waitTime = (jsonStr.status == 1) ? 1 : 2;
        msgBoxText(jsonStr.info,waitTime,null);
    });
    return false;
}
//更新送拍状态，by wolf
function uptStatus(id, val) {
	if(isEmpty(id)){
		msgBoxText('数据有错误，程序被中止！',2,null);
		return false;
	}
	var Post = { id : id, val : val };
	_msgalertshow();
	$.post(_url+'/uptStatus', Post, function(ret) {
		_msgalerthide();
        ret = parseInt(ret);
        switch(ret){
            case 1:
				msgBoxText('状态已修改！',2, function(){ location.reload(); });
                break;
            case 0:
                msgBoxText('处理失败',2,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
	});
	return false;
}
//撤消送拍申请，by wolf
function delSongpai(id) {
	if(isEmpty(id)){
		msgBoxText('数据有错误，程序被中止！',2,null);
		return false;
	}
	_msgalertshow();
	$.get(_url+'/delSongpai', { id : id}, function(ret) {
		_msgalerthide();
        ret = parseInt(ret);
        switch(ret){
            case 1:
				msgBoxText('送拍申请已撤消！',2, function(){ location.reload(); });
                break;
            case 0:
                msgBoxText('处理失败',2,null);
                break;
            default:
                msgBoxText('发生未知错误',2,null);
        }
	});
	return false;
}
//送拍，by wolf
function songpaiDeal(val) {
    if(!confirm('是否要执行本操作？')) return false;
	if(val != '') _nowChoose = val;
    if(_nowChoose == ''){
        alert('请先选择商品！');
        return false;
    }
	_msgalertshow();
    $.post(_url+'/songpaiDeal',{ ids:_nowChoose }, function(ret){
		_msgalerthide();
        switch(ret){
            case '0':
                msgBoxText('处理失败',2,null);
                break;
            default:
				getSongpai(ret);
        }
	});
	return false;
}
//送拍，by wolf
function getSongpai(songpai_id) {
	_msgalertshow();
    $.get(_url+'/getSongpai',{ songpai_id : songpai_id }, function(ret) {
		_msgalerthide();
        switch(ret){
            case '0':
                msgBoxText('处理失败',2,null);
                break;
            default:
				$('#songpai_id').html(songpai_id);
                $('#my_songpai').html(ret);
				boxShow('bc01');
				break;
        }
	});
	return false;
}
function uptSendType(id, val) {
	$.post(_url+'/uptSongpai',{ id : id, send_type : val });
}
function uptExpressNo(id, val) {
	$.post(_url+'/uptSongpai',{ id : id, express_no : val });
}
function uptBackType(id, val) {
	$.post(_url+'/uptSongpai',{ id : id, back_type : val });
}
function uptBackNo(id, val) {
	$.post(_url+'/uptSongpai',{ id : id, back_no : val });
}
function subRemark(id, val) {
	_msgalertshow();
	$.post(_url+'/subRemark',{ id : id, val : val }, function(ret){
		_msgalerthide();
		switch(ret){
            case '0':
                //msgBoxText('处理失败',2,null);
                break;
            default:
				getSongpai(id);
				break;
        }
	});
}
//多选框全选、全不选
function checkAll(obj){
    _nowChoose = '';
    var tb = $(obj).parent().parent().parent();
    if($(obj).attr('checked')){
        tb.find('input:checkbox').each(function(){
            $(this).attr('checked','checked');
            if($(this).val() != 'all') _nowChoose += $(this).val()+',';
        });
    }else{
        tb.find('input:checkbox').attr('checked','');
        _nowChoose = '';
    }
    if(_nowChoose != '')
        $('#sup,#sdown,#spush,#sre').attr('disabled','');
    else
        $('#sup,#sdown,#spush,#sre').attr('disabled','disabled');
}
//多选框单个点击
function checkOne(obj){
    var tb = $(obj).parent().parent().parent();
    var checkFlag = true;
    var choseId = $(obj).val()+',';
    if($(obj).attr('checked')){
        tb.find('input:checkbox').each(function(){
            if($(this).val() != 'all'){
                if(!$(this).attr('checked')){
                    checkFlag = false;
                }
            }
        });
        if(checkFlag) tb.find('input:checkbox').eq(0).attr('checked','checked');
        _nowChoose += choseId;
    }else{
        tb.find('input:checkbox').eq(0).attr('checked','');
        _nowChoose = _nowChoose.replace(choseId, '');
    }
    if(_nowChoose != '')
        $('#sup,#sdown,#spush,#sre').attr('disabled','');
    else
        $('#sup,#sdown,#spush,#sre').attr('disabled','disabled');
}
// 设为特价内的价格设置是的利润率的连动
function setSpecialPrice(oldDis,val){
    var dis;
    if(isNumber(val) && !isEmpty(val)){
        dis = Math.round(100 - $('#e_newest_cost').attr('newest_cost') / val * 100);
    }else{
        $('#e_special_price').val('0');
        dis = oldDis;
    }
    $('#e_dis').text(dis+'%');
}
//显示该Sales_id的上下架记录
function showStatusLog(salesId){
    _msgalertshow();
    $.post(_url+'/showStatusLog',{ salesId:salesId },function(ret){
         _msgalerthide();
        $('#product_opear_div').html(ret);
        boxShow('bc04');
    })
}
//Ajax取得该商品最近2周的销售情况
function showSalesPrice(salesId,obj) {
    $.post(_url+'/getSalesPrice', { salesId:salesId } ,function(ret) {
        var str = '',ret_status = 1;
        try {
            var jsonStr = eval('('+ret+')');
        }catch (e){
            ret_status = 0;
            str = '发生未知错误';
        }
        if(typeof(jsonStr) !== 'object'){
            ret_status = 0;
            str = '发生未知错误';
        }
        if(ret_status == 1){
            if(jsonStr.status != 1){
                str = jsonStr.info;
            }else{
                var data = jsonStr.data;
                if(data == null){
                    _minPrice = 0;
                    str = '近14天该商品没有被出售过';
                }else{
                    for(var k in data){
                        if(k == 0){
                            str += "当天以" ;
                        }else{
                            str += k + '天前以';
                        }
                        for(var kk in data[k]){
                            if(kk < _minPrice || _minPrice == 0){
                                _minPrice = kk;
                            }
                            str += kk + '卖出';
                            for(var kkk in data[k][kk]){
                                str += data[k][kk][kkk]+"件<br/>";
                            }
                        }
                    }
                }
            }
        }
        $('#tip .tip').html(str);
        var objTop = parseInt($(obj).parent().offset().top,10)-20;
        var objLeft	= parseInt($(obj).parent().offset().left,10)+ 20;
        $("#tip").css({"left":objLeft,"top":objTop});
        $('#tip').show();
    });
}
$(function(){
    if(_scrTop){
        document.documentElement.scrollTop = _scrTop;
        delCookie('manageIndex_scrolltop');
    }
    $("#pur_date1,#pur_date2").click(function(){
        WdatePicker();
    }).addClass('Wdate');
    $('input:checkbox').attr('checked','');
    $('#form1').find('input,select').keyup(function(e){
        if(e.which == 13){
            $('#form1').submit();
        }
    });
    $('#product_id').focus(function(){
        $(this).select();
    })
});