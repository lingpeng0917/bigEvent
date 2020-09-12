$(function() {
    var form = layui.form
        // 定义昵称验证规则
    form.verify({
            nickname: function(value) {
                if (value.length > 6) {
                    return '用户昵称只能1-6个字符'
                }
            }
        })
        // 获取用户的基本信息
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //通过form.val()方法 快速获取表单内的值,在赋值给页面
                console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置按钮
    $('#resetBtn').on('click', function(e) {
        e.preventDefault()
        initUserInfo()
    })

    // 修改用户资料点击提交修改
    $('#changeUserInfo').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                //    调用父级元素的方法
                window.parent.getUserInfo()
            }
        })
    })
})