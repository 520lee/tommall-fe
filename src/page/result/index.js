/*
* @Author: King
* @Date:   2017-05-19 21:52:46
* @Last Modified by:   Administrator
* @Last Modified time: 2018-07-02 14:22:22
*/
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');

$(function(){
        var type    = _mm.getUrlParam('type') || 'default',
        $element    = $('.' + type + '-success'),
        orderNo     = _mm.getUrlParam('orderNo');
        if (type === 'payment') {
        var $orderNo = $element.find('.orderNo');
        $orderNo.attr('href', $orderNo.attr('href') + orderNo);
    }
    // 显示对应的提示元素
    $element.show();
})