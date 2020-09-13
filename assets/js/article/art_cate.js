$(function() {
    var layer = layui.layer
    var form = layui.form
    var addindex = null
    var editindex = null
    getCateList()

    // 获取文章分类
    function getCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板字符串渲染数据
                var str = template('tpl', res)
                $('tbody').html(str)
            }
        })
    }

    // 为添加类别注册点击事件
    // 添加文章分类弹出框
    $('#btnAddCate').on('click', function() {
        addindex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#add').html()
        });

    })

    // 添加文章分类 使用事件委托
    $('body').on('submit', '#add_form', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 渲染到页面
                getCateList()
                    //关闭弹出框
                layer.close(addindex)
            }
        })
    })

    // 编辑文章分类 赋值到弹出框
    $('body').on('click', '.btn-edit', function() {

        editindex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#edit').html()
        });
        var id = $(this).attr('data-id')
            // 发起数据请求
        $.ajax({
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 快速赋值
                form.val('editForm', res.data)
            }
        })

    })

    // 编辑文章分类点击确认修改 使用事件委托
    $('body').on('submit', '#edit_form', function(e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                    // 渲染到页面
                getCateList()
                    // 关闭弹出框
                layer.close(editindex)
            }
        })
    })

    // 给删除按钮注册点击事件
    $('tbody').on('click', '#btn-del', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    getCateList()
                    layer.close(index)
                }
            })


        });
    })
})