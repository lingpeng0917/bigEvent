$(function() {
    var layer = layui.layer
    var form = layui.form
        // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 获取文章类别
    $.ajax({
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }

            var str = template('tpl-pub', res)
            $('#form-pub [name="cate_id"]').html(str)
            form.render()
        }
    })


    //图片上传
    $('#selectImage').on('click', function() {
        $('#file').click()
    })

    // 获取上传后的图片并替换
    $('#file').on('change', function(e) {
        // 监听 File 的 change 事件，获取用户选择的文件列表
        var files = e.target.files
        if (files.length === 0) {
            return layer.msg(res.message)
        }
        var file = e.target.files[0]
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 处理上传需要的数据
    var art_state = '已发布'
    $('#saveBtn2').on('click', function() {
        art_state = '存为草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
            // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
            // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
            // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 发表文章函数
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                location.href = '/article/art_list.html'
            }

        })
    }
})