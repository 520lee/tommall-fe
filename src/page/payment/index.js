/*
* @Author: Administrator
* @Date:   2018-07-01 19:38:07
* @Last Modified by:   Administrator
* @Last Modified time: 2018-07-02 14:24:57
*/
require('./index.css')
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm             = require('util/mm.js');
var _payment          = require('service/payment-service.js');
var templateIndex   = require('./index.string');

//page逻辑部分
var page = {
    data:{
        orderNo : _mm.getUrlParam('orderNo'),
    },
    init:function(){
        this.onLoad();
    },
    onLoad : function(){
        // 加载payment数据
        this.loadPaymentInfo();
    },
    loadPaymentInfo : function(){
        var _this           = this,
            paymentHtml     = '',
            $pageWrap       = $('.page-wrap');
        $pageWrap.html('<div class="loading"></div>');
        _payment.getPaymentInfo(this.data.orderNo, function(res){
            // 渲染html
            paymentHtml = _mm.renderHtml(templateIndex, res);
            $pageWrap.html(paymentHtml);
            _this.listenOrderStatus();
        }, function(errMsg){
            $pageWrap.html('<p class="err-tip">' + errMsg + '</p>')
        });
    },
    // 监听订单状态
    listenOrderStatus : function(){
        var _this = this;
        this.paymentTimer = window.setInterval(function(){
            _payment.getPaymentStatus(_this.data.orderNo, function(res){
                if(res == true){
                    window.location.href = './result.html?type=payment&orderNo=' + _this.data.orderNo;
                }
            })
        },5e3)
    }
};
$(function(){
    page.init();
});