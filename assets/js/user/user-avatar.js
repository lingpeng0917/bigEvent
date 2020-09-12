$(function() {
    /**
     * 1.基本使用步骤
     */
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 4 / 3,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮点击注册事件
    $('#files').click(function() {
        // 模拟点击
        $('#file').click()
    })

    // 为上传文件框注册change事件
    $('#file').change(function(e) {
        // console.log(e);
        if (e.target.files.length === 0) {
            return layui.layer.msg('请添加照片')
        }

        /**
         * 2.更换裁剪的图片
         */
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
            //  2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
            //  3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

        // 为确定按钮注册点击事件,将裁剪后的头像上传到服务器
        $('#sureBtn').click(function() {
            /**
             *  3.将裁剪后的图片，输出为 base64 格式的字符串
             */
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

            $.ajax({
                url: '/my/update/avatar',
                method: 'POST',
                data: {
                    avatar: dataURL
                },
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layui.layer.msg(res.message)
                    window.parent.getUserInfo()
                }
            })
        })


    })

})