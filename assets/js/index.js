$(function() {
    getUserInfo()
    var layer = layui.layer
        // 获取用户信息
    function getUserInfo() {
        $.ajax({
            url: '/my/userinfo',

            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // console.log(res);
                renderAvatar(res.data)
            }

        })
    }

    // 渲染头像信息以及用户名

    function renderAvatar(user) {
        //   获取用户名
        var name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
            // 按需渲染用户的头像
        if ((user.user_pic) !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 让用户名的第一个字母大写在text-avatar中显示
            var first = name[0].toUpperCase()
            $('.text-avatar').html(first).show()
            $('.layui-nav-img').hide()
        }

    }

    // 实现退出功能
    $('#btnOut').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清空token值
            localStorage.removeItem('token')
                // 跳转到登录界面 
            location.href = '/login.html'

            layer.close(index);
        });
    })
})