/*
* @Author: Administrator
* @Date:   2018-07-01 19:32:34
* @Last Modified by:   Administrator
* @Last Modified time: 2018-07-01 19:32:48
*/
var _mm                  = require('util/mm.js');
var _cities              = require('util/cities/index.js');
var _address             = require('service/address-service.js');
var templateAddressModal = require('./address-modal.string');

var addressModal = {
    // 地址编辑和添加弹窗的显示
    show : function(option){
        // option的绑定, 根据出入option判断，如果为对象，则this.option为对象，如果option为数组，则this.option为数组    
        this.option      = option;
        this.option.data = option.data || {};
        this.$modalWrap  = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    bindEvent : function(){
        var _this = this;
        // 省份和城市的二级联动
        this.$modalWrap.find('#receiver-province').change(function(){
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        // 提交收货地址
        this.$modalWrap.find('.address-btn').click(function(){
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate     = _this.option.isUpdate;
            // 使用新地址，且验证通过
            if(!isUpdate && receiverInfo.status){
                _address.save(receiverInfo.data, function(res){
                    _mm.successTips('地址添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                })
            }
            // 更新收件人，并且验证通过
            else if(isUpdate && receiverInfo.status){
                _address.update(receiverInfo.data, function(res){
                    _mm.successTips('地址修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function' && _this.option.onSuccess(res);
                }, function(errMsg){
                    _mm.errorTips(errMsg);
                })
            }
            // 验证不通过 
            else {
                _mm.errorTips(receiverInfo.errMsg || '好像哪里不对了');
            }
        });
        // 保证点击modal内容区的时候，不关闭弹窗   阻止事件冒泡
        this.$modalWrap.find('.modal-container').click(function(e){
            e.stopPropagation();
        });
        // 点击叉叉或者蒙蔽区域，关闭弹窗
        this.$modalWrap.find('.close').click(function(){
            _this.hide();
        });
    },
    loadModal : function(){
        // console.log('isUpdate',this.option.isUpdate);
        // isUpdate对应于address-modal.string，如果isUpdate为true,则编辑地址，如果isUpdate为false,则使用新地址
        var addressModalHtml = _mm.renderHtml(templateAddressModal, {
            isUpdate : this.option.isUpdate,
            data     : this.option.data
        });
        this.$modalWrap.html(addressModalHtml);
        // 加载省份
        this.loadProvince();
    },
    // 加载省份信息
    loadProvince : function(){
        var provinces        = _cities.getProvinces() || [],
            $provinceSelect  = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
        // 如果是更新地址，并且有省份信息，做省份的回填   receiverProvince为省份
        if(this.option.isUpdate && this.option.data.receiverProvince){
            $provinceSelect.val(this.option.data.receiverProvince);
            this.loadCities(this.option.data.receiverProvince);
        }
    },
    // 加载城市信息
    loadCities : function(provinceName){
        var cities       = _cities.getCities(provinceName) || [],
            $citySelect  = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        // 如果是更新地址，并且有城市信息，做城市的回填
        if(this.option.isUpdate && this.option.data.receiverCity){
            $citySelect.val(this.option.data.receiverCity);
        }
    },
    // 获取表单里收件人的信息，并做表单验证
    getReceiverInfo : function(){
        var receiverInfo    = {},
            result          = {
                status : false,
            };
        receiverInfo.receiverName     = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity     = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress  = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone    = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip      = $.trim(this.$modalWrap.find('#receiver-zip').val());

        if(this.option.isUpdate){
            receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
        }

        //  表单验证
        if(!receiverInfo.receiverName){
            result.errMsg = "请输入收件人姓名";
        } else if (!receiverInfo.receiverProvince){
            result.errMsg = "请输入收件人所在省份";
        } else if (!receiverInfo.receiverCity){
            result.errMsg = "请输入收件人所在城市";
        } else if (!receiverInfo.receiverAddress){
            result.errMsg = "请输入收件人所在的详细地址";
        } else if (!receiverInfo.receiverPhone){
            result.errMsg = "请输入收件人手机号码";
        } 
        // 所有验证都通过了
        else {
            result.status = true;
            result.data   = receiverInfo;
        }
        return result;
    },
    // 获取select框的选项，输入：array，输出：HTML
    getSelectOption : function(optionArray){
        var html = '<option value="">请选择</option>';
        for(var i = 0, length = optionArray.length; i< length; i++){
            html += '<option value="' + optionArray[i] + '">' + optionArray[i] + '</option>';
        }
        return html;
    },
    // 关闭弹窗
    hide : function(){
        this.$modalWrap.empty();
    },
};

module.exports = addressModal;