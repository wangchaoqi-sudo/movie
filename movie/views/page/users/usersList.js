layui.use(['form','layer','laydate','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#newsList',
        url : '/admin/selectuser',
        cellMinWidth : 95,
        page : true,
        limit : 25,
        limits : [10,15,20,25],
        id : "newsListTable",
        cols : [[
            // {type: "checkbox", fixed:"left", width:50},
            {field: 'userid', title: 'ID', width:60, align:"center"},
            {field: 'username', title: '姓名', width:150},
            {field: 'password', title: '密码', align:'center',templet:function (d) {
                    return '*****'
                }},
            {field: 'phone', title: '手机',  align:'center',templet:"#newsStatus"},
            {field: 'role', title: '角色', align:'center'},
            {field: 'status', title: '状态', height:150, align:'center', templet:function(d){
                return d.status == '0'?'正常':'禁用';
            }},
            {title: '操作', width:170,fixed:"right",align:"center",templet:function (d) {
                    var st=d.status == 0?'checked':'';
                    return 	' <input type="checkbox" name="zzz" lay-filter="refuse"' + st + ' lay-skin="switch" lay-text="开启|禁用">'
                }}
        ]]
    });


    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("newsListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    key: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            layer.msg("请输入搜索的内容");
        }
    });



    form.on('switch(refuse)', function(data){
        var id = data.othis.parents('tr').find("td :first").text()  //根据相对位置取
        var status =data.elem.checked == true ?0:1;
        if (status == '1'){
            layer.confirm('确定禁用此用户？',{icon:3, title:'提示信息'},function(index){
                $.post("/admin/updatestatus",{
                    userid:id,
                    status : status
                },function(data){

                    tableIns.reload();
                    layer.close(index);
                })
            });
        }else {
            layer.confirm('确定启用此用户？',{icon:3, title:'提示信息'},function(index){
                $.post("/admin/updatestatus",{
                    userid:id,
                    status : status
                },function(data){

                    tableIns.reload();
                    layer.close(index);
                })
            });

        }

    });

})