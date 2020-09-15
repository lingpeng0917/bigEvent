$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 声明查询参数
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
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
                    // 调用分页出来函数
                renderPage(res.total)
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

    // 分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置被默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // jump - 切换分页的回调
            // 触发jump函数的方式有两种
            // 初始化的时候  调用renderPage()会出现死循环
            // 点击页码的时候
            jump: function(obj, first) {
                // 把最新的页码值赋值到q查询参数
                q.pagenum = obj.curr
                    // 把最新的每页显示几条数据赋值给q查询参数对象
                q.pagesize = obj.limit
                    // first有两个返回值
                    // 返回值为true是调用renderPage()
                    // 返回值是undefinded 是点击页面
                if (!first) {
                    initTable()
                }

            }
        });
    }

    // 删除功能
    $('body').on('click', '.btn-del', function() {
        // 通过id删除数据
        var id = $(this).attr('data-id')
            // 获取删除按钮个数
        var len = $('.btn-del').length
        console.log(len);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                        // 通过删除按钮判断页面的页码数 
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            })

        });

    })
})