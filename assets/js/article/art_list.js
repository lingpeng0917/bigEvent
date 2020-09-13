$(function() {
    var layer = layui.layer
    var form = layui.form
        // 声明查询参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }


    //通过 template.defaults.imports 定义过滤器：
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 获取文章列表数据
    initTable()

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl', res)
                $('tbody').html(str)
            }
        })
    }

    // 渲染所有分类 
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                var str = template('tpl-cate', res)
                $('.layui-form [name="cate_id"]').html(str)
                    // 通知layui渲染到页面
                form.render()
            }
        })
    }

    // 筛选
    $('#shaixuan').on('submit', function(e) {
        e.preventDefault()
        var newCateId = $('.layui-form [name="cate_id"]').val()
        var newState = $('.layui-form [name="state"]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = newCateId
        q.state = newState
            // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
})