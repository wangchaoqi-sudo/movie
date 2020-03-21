layui.use(['form','layer','layedit','laydate','upload','element'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        laypage = layui.laypage,
        upload = layui.upload,
        layedit = layui.layedit,
        laydate = layui.laydate,
        $ = layui.jquery,
     element = layui.element;


   //时间选择器回调
    var time;
    laydate.render({
        elem:'.releasetime',
        done:function (value, date, endDate) {
             time = value
        }
    })

    //上传缩略图
    upload.render({
        elem: '.thumbBox',
        url: '/admin/upload',
        field: 'movie',
        //此处是为了演示之用，实际使用中请将此删除，默认用post方式提交
        done: function(res, index, upload){
            if (res.code == 0){
                $('.thumbImg').attr('src',res.data.src);
            }

        },
        progress: function(n, elem){
            var percent = n + '%' //获取进度百分比
            element.progress('demo', percent);
        }
    });
    


    form.on("submit(addmovies)",function(data){
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
       // 实际使用时的提交信息
        var movieid='';
        for (var a=0;a<7;a++){
            movieid +=Math.round(Math.random()*10).toString();
        }
        $.post("/admin/insert",{
            movieid : movieid,
            moviename : data.field.moviename,
            releasetime :time,
            director : $(".director").val(),
            leadactors :$(".leadactors").val(),
            description :  $(".description").val(),
            picture : $(".thumbImg").attr("src"),  //缩略图
        },function(res){

        })
        setTimeout(function(){
            top.layer.close(index);
            top.layer.msg("电影上架成功！");
            layer.closeAll("iframe");
            //刷新父页面
            parent.location.reload();
        },500);
        return false;
    })



})