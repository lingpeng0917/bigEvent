$(function() {
    // 点击注册按钮
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        // 点击登录按钮
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    //自定义表单验证规则
    //通过layui获取form
    var form = layui.form
        //通过form.verify()函数自定义校验规则
    form.verify({
        // 校验密码的规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
                // 判断两次输入框的值是否一致
            if (value !== pwd) {
                return '两次密码输入不一致'
            }
        }
    })
})