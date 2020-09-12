$(function() {
    var form = layui.form
    var layer = layui.layer
        //   定义密码验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samepwd: function(value) {
            if (value === $('.layui-form [name = "oldPwd"]').val()) {
                return '新旧密码不能一致'
            }
        },
        repwd: function(value) {
            if (value !== $('.layui-form [name = "newPwd"]').val()) {
                return '两次密码不一致'
            }
        }
    })

    // 修改密码操作
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/updatepwd',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 先将jq转化成dom，再用dom方法重置表单 
                $('.layui-form')[0].reset()
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        })
    })
})