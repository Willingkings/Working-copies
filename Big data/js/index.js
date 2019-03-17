
(function($,undefined){
    var index = {
        init:function(){
            sessionStorage.clear();
            this.getCurDate();
            this.getMpa();
            this.accounted();
            this.incomeTrend();
            this.userTrend();
            /*                                         ** H **                                         */
            this.Method();                  // 方法
            this.DataPort();                // 接口
            this.getAssetsData();           // 数字滚动
            this.getCylindricalityData();   // 柱形图
            this.UserEvents();              // 用户触发事件
            /*                                         ** * **                                         */
            // 自动刷新
            this.setInterval();


        },
        // 获取当前日期
        getCurDate:function(){

            var that = this;
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var strDate = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            if(month>=1 && month<=9){
                month ="0"+month;
            }
            if(strDate>=1 &&strDate<=9){
                strDate = "0"+strDate;
            }
            if(hours>=0 && hours<=9){
                hours = "0"+hours;
            }
            if(minutes>=0 && minutes<=9){
                minutes = "0"+minutes;
            }
            if(seconds>=0 && seconds<=9){
                seconds = "0"+seconds;
            }
            var currentDate = year+"年"+month+"月"+strDate+"日"+" "+hours+":"+minutes+":"+seconds;
            var curTime = document.getElementById("curTime");
            curTime.innerText = currentDate;
            setTimeout(function(){
                that.getCurDate()
            },1000);
        },
        // 收入趋势
        incomeTrend:function(){
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/income',
                type:'get',
                dataType:'json',
                success:function(data){

                    var Arr = [];
                    for (var i = 0; i < data.data.num.length; i ++) {
                        Arr.push(Math.round(data.data.num[i]/1000)/10);
                    }
                    data.data.num= Arr;
                    var incomeTrendData = data.data;
                    var incomeOption = {
                        title: {
                            text: '收入趋势（每月）',
                            textStyle: {
                                color: "#0eefeb",
                                fontSize: 18
                            }
                        },
                        grid: [{x: "15%",y: "25%",width: "75%",height: "60%", show: false,}],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#283b56'
                                }
                            },
                            formatter: '{a0}: {c0}<br />{a1}: {c1}%'
                        },
                        legend: {
                            top: 30,
                            itemWidth: 20,
                            itemHeight: 8,
                            textStyle: {
                                color: '#676767',
                                fontSize:12
                            },
                            data: ['收入金额','增长率']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisLine:{
                                    show: false,
                                    lineStyle: {color: "#fff"}
                                },
                                axisTick:{show: false},
                                interval: 6,
                                boundaryGap: true,
                                data: incomeTrendData.time,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                        ],
                        yAxis: [
                            {
                                splitLine:{show: false},// 是否显示
                                name: '金额（万元）',
                                type: 'value',
                                scale: true,
                                axisLine:{
                                    show: false,
                                    lineStyle: {color: "#fff"}
                                },
                                axisTick:{show: false},
                                max: Math.ceil(Math.max.apply(null, incomeTrendData.num) + 50),
                                interval: Math.ceil(Math.max.apply(null, incomeTrendData.num) + 50)/5,
                                min: 0,
                            },
                            {
                                splitLine:{show: false},// 是否显示
                                type: 'value',
                                scale: true,
                                axisLine:{
                                    show: false,
                                    lineStyle: {color: "#fff"}
                                },
                                axisTick:{show: false},
                                max: 100,
                                min: -60,
                                interval: 20,
                            }
                        ],
                        series : [
                            {
                                name:'收入金额',
                                type:'bar',
                                label: {
                                    show: true,
                                    position: 'insideTop',
                                    formatter: '{c}',
                                    color: "#fff"
                                },
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [
                                                {offset: 0, color: '#2ee2fd'},
                                                {offset: 1, color: '#2050fc'}
                                            ]
                                        )
                                    },
                                    emphasis: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [
                                                {offset: 0, color: '#2ee2fd'},
                                                {offset: 1, color: '#2050fc'}
                                            ]
                                        )
                                    }
                                },
                                data:incomeTrendData.num
                            },
                            {
                                name:'增长率',
                                type:'line',
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}%',
                                    color: "#fff"
                                },
                                yAxisIndex: 1,
                                itemStyle:{
                                    color: "#59b7f5"
                                },
                                lineStyle: {
                                    color: "#59b7f5"
                                },
                                data:incomeTrendData.growth
                            },
                        ]
                    };
                    var income = echarts.init(document.getElementById("income"));
                    income.setOption(incomeOption);
                }
            });
        },
        // 用户趋势
        userTrend:function(){
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/user',
                type:'get',
                dataType:'json',
                success:function(data){
                    var userOption = {
                        title: {
                            text: '用户趋势（每月）',
                            textStyle: {
                                color: "#0eefeb",
                                fontSize: 18
                            }
                        },
                        grid: [{x: "15%",y: "25%",width: "75%",height: "60%", show: false}],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#283b56'
                                }
                            },
                        },
                        // color: ['#0db3d9','#f29422', '#f2cb04', '#d93d4a', '#0367a5','#15bd50'],
                        xAxis: [
                            {
                                type: 'category',
                                axisLine:{
                                    show: false,
                                    lineStyle: {color: "#fff"}
                                },
                                axisTick:{show: false},
                                interval: 6,
                                boundaryGap: true,
                                data: data.data.time,
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                scale: true,
                                axisLine:{
                                    show: false,
                                    lineStyle: {color: "#fff"}
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: "#3c5068",
                                        type: 'dashed',
                                    }
                                },
                                axisTick:{show: false},
                                max: 100,
                                min: -60,
                                interval: 20,
                            }
                        ],
                        series : [
                            {
                                name:'增长率',
                                type:'line',
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}%',
                                    color: "#fff"
                                },
                                itemStyle:{
                                    color: "#0bb3da"
                                },
                                lineStyle: {
                                    color: "#51afec"
                                },
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'rgba(33,124,117,1)'
                                        }, {
                                            offset: 0.5, color: 'rgba(19,108,148,1)'
                                        }, {
                                            offset: 1, color: 'rgba(12,100,163,1)'
                                        }]
                                    }
                                },
                                data:data.data.growth
                            },
                        ]
                    };
                    var user = echarts.init(document.getElementById("user"));
                    user.setOption(userOption);
                }
            });
        },
        // 地图
        getMpa:function(){
            //计算运营天数
            var offsetDays = commonJS.getOffsetDays(Date.now(),(new Date(2017,7,19)).getTime());
            $("#operationDays").text(offsetDays);

            var arrayList = [
                {name:'凤鸣停车场',value: 600},
                {name:'遇龙河' , value: 700},
                {name:'C', value: 300},
                {name:'A', value: 400},
                {name:'D', value: 500},
                {name:'B', value: 600},
                {name:'雁山区',symbolSize: 25, value: 1000}
            ];
            $.get('json/guilin.json',function(data){
                echarts.registerMap('guilin',data);
                var chart = echarts.init(document.getElementById('map'));
                var geoCoordMap = {
                    "凤鸣停车场":[110.49729,24.761719],
                    "遇龙河":[110.394381,24.826767],
                    "临桂区":[110.27435,25.361638],
                    "雁山区":[110.297934,25.097054],
                };
                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push(geoCoord.concat(data[i].value));
                        }
                    }
                    return res;
                };
                var option = {
                    title: {
                        text: '地域覆盖能力',
                        textStyle: {
                            color: "#0eefeb",
                            fontSize: 18,
                        },
                        top: "8%",
                        left: "35%"
                    },
                    layoutCenter: ['50%', '55%'],
                    layoutSize: "85%",
                    visualMap: {
                        type: 'continuous',
                        min: 0,
                        max: 1000,
                        show:false,
                        itemWidth: 10,
                        itemHeight: 70,
                        text:['High','Low'],
                        textStyle:{
                            color: "#ffffff"
                        },
                        color: ['#8af163','yellow','lightskyblue']
                    },
                    geo: {
                        map: 'guilin',
                        roam: false,
                        label:{
                            show: false,
                        },
                        emphasis: {
                            label: {show:false}
                        }
                    },
                    series:[
                    {
                        type:'map',
                        map:'guilin',
                        roam: false,
                        label: {
                            normal:{
                                show:true,
                                textStyle:{
                                    color:'#fff',
                                    fontSize:'12px'
                                }
                            },
                            emphasis: {
                                show: false,
                                textStyle:{color:"#fff"}
                            }
                        },
                        itemStyle:{
                            normal:{
                                borderColor:'#fff',
                                areaColor:'#2552df'
                            },
                            emphasis: {
                                show:false,
                                borderWidth: 4,
                                borderColor: 'rgba(250, 80, 133, 0.7)',
                                areaColor:"#e6004f"
                            },
                        },
                        data: [
                            {
                                name:'阳朔县',
                                selected: true,
                                label:{

                                    normal:{
                                        show:true,
                                        textStyle:{
                                            color:'#fff',
                                            fontSize:'12px'
                                        },
                                    }
                                }
                            },
                            {name:'雁山区',selected: true},
                            {name:'平乐县',selected: true}]
                    },
                    {
                        type:'effectScatter',
                        map:'guilin',
                        coordinateSystem: 'geo',
                        symbolSize: function (val) {
                            return val[2] / 40;
                        },
                        data: convertData(arrayList)
                    }
                ]
                };
                chart.setOption(option);
            })
        },
        // 占比
        accounted:function(){
            // option
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/proportion',
                type:'get',
                dataType:'json',
                success:function(data){
                    var businessOption = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        color: ['#0db3d9','#37f1cc', '#0367a5', '#d93d4a', '#f4b80e','#15bd50'],
                        legend: {
                            orient: 'vertical',
                            left: 210,
                            align: 'left',
                            top: 20,
                            itemWidth: 20,
                            itemHeight: 10,
                            itemGap: 5,
                            textStyle: {
                                color: '#fff',
                                fontSize:12
                            },
                            data: ['公共交通','景区门票','景区直通车','停车服务','运游联票']
                        },
                        series : [
                            {
                                name: '业务占比',
                                type: 'pie',
                                radius : '70%',
                                center: ['30%', '40%'],
                                label: {
                                    position: 'inside',
                                    formatter: '{d}%',
                                    align: 'center'
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.data.business,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    var districtOption = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        color: ['#f4b80e', '#0367a5','#15bd50'],
                        legend: {
                            orient: 'vertical',
                            left: 210,
                            align: 'left',
                            top: 40,
                            itemWidth: 20,
                            itemHeight: 10,
                            itemGap: 5,
                            textStyle: {
                                color: '#fff',
                            },
                            data: ['阳朔','市区','平乐']
                        },
                        series : [
                            {
                                name: '区域占比',
                                type: 'pie',
                                radius : '70%',
                                center: ['30%', '40%'],
                                label: {
                                    position: 'inside',
                                    formatter: '{d}%',
                                    align: 'center'
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.data.area,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    var channelOption = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        color: ['#0367a5', '#f4b80e', '#d93d4a', '#37f1cc','#15bd50'],
                        legend: {
                            orient: 'vertical',
                            left: 210,
                            align: 'left',
                            top: 20,
                            itemWidth: 20,
                            itemHeight: 10,
                            itemGap: 5,
                            textStyle: {
                                color: '#fff',
                            },
                            data: ['APP','微信端','自助终端','窗口售票','人工']
                        },
                        series : [
                            {
                                name: '渠道占比',
                                type: 'pie',
                                radius : '70%',
                                center: ['30%', '40%'],
                                label: {
                                    position: 'inside',
                                    formatter: '{d}%',
                                    align: 'center'
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.data.channel,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    }
                    // 业务占比
                    var business = echarts.init(document.getElementById("business"));
                    business.setOption(businessOption);
                    // 区域占比
                    var district = echarts.init(document.getElementById("district"));
                    district.setOption(districtOption);
                    // 渠道占比
                    var channel = echarts.init(document.getElementById("channel"));
                    channel.setOption(channelOption);
                }
            });
        },

        FOR: function (dataList) {
            var Arr = [];
            for (var i = 0; i < dataList.Value.length; i ++) {
                Arr.push(Math.round(dataList.Value[i]/1000)/10);
            }
            dataList.Value = Arr;
        },
        /*                                         ** H **                                         */
        // 方法
        Method: function () {
            // 为全局函数创建另一个命名空间；//f1和f2成为myPlugin对象的方法，而
            jQuery.myPlugin = {
                // 填入数据（obj：对象，number：数字）
                numberData:function (obj, number) {
                    var Newobj = $(obj);
                    var Arr = number.toString().split("");
                    var NewHtml = "";
                    for(var i = 0; i < Arr.length; i++) {
                        NewHtml += "<li><ul></ul></li>";
                        if(i == Arr.length -1) {
                            Newobj.html(NewHtml);
                            var NewHtml2 = obj + " > li > ul"
                            // 填入数据（obj：对象，number：数字）
                            function numberData(obj2, number) {
                                var Arr = number.toString().split("");
                                var Obj1Html = "";
                                var Text = '<li>-</li>';
                                var NewHtml = "";
                                for(var i = 0; i < Arr.length; i++) {
                                    for(var j = 0; j < parseInt(Arr[i]) + 1; j++) {
                                        Text += '<li>' + j +'</li>';
                                        if(j == parseInt(Arr[i])) {
                                            NewHtml = Text;
                                            Text = '<li>-</li>';
                                            obj2[i].innerHTML = NewHtml;
                                        }
                                    }
                                }
                            }
                            numberData($(NewHtml2),number)
                        }
                    }
                },
                // 启动方法（obj：对象，number：数字）
                DisplacementDistance: function (obj,time) {
                    // .numBorderMoney > li > ul
                    var NewObj = $(obj + " > li > ul")
                    var NewObj1 = $(obj + " > li > ul > li")
                    for(var i = 0; i < NewObj.length; i++) {
                        var NewDistance = ((NewObj[i].innerHTML.split('</li>')).length - 2) * NewObj1[i].getBoundingClientRect().height.toFixed(2)
                        // 向上位移方法（obj: 位移对象,distance：位移距离,time: 位移时间,type: 过渡类型）
                        function upwardDisplacement(obj, distance, time, type) {
                            obj[i].style.transform = "translateY(-" + distance + ")";
                            obj[i].style.transition = "all " + time + " " + type;
                        }
                        upwardDisplacement($(obj + " > li > ul"), NewDistance + "px", time + "s", "linear")
                    }
                },
                // obj: 载入对象 , numericalData: 柱形数据, Xtext: X轴文字, gradualColor: 柱形渐变颜色,title:标题(title[0]:标题名,title[1]):坐标,title[2]):大小,title[3]):颜色),titlePosition:标题坐标,gridPosition: grid坐标
                Cylindricality: function (obj,numericalData,Xtext,gradualColor,title,gridPosition,title2) {
                    var dom = document.getElementById(obj);
                    var myChart = echarts.init(dom);
                    var app = {};
                    var option = null;
                    // 柱形数据
                    var data = numericalData;
                    var yMax = 10;
                    var dataShadow = [];
                    for (var i = 0; i < data.length; i++) {
                        dataShadow.push(yMax);
                    }
                    option = {
                        //------------- 标题区域  ----------------
                        title: {
                            text: title[0],                       // 主标题
                            // 主标题内容样式
                            textStyle: {
                                color: title[3],                   // 主标题文字颜色
                                fontSize: title[2], // 让字体变大
                            },
                            subtext: '',                    // 副标题
                            padding: title[1]         // 标题定位
                        },
                        //------------- 提示框区域  ----------------
                        tooltip: {
                            width: 600,
                            trigger: 'item',
                            backgroundColor:'rgba(255,255,255,0.8)',    //通过设置rgba调节背景颜色与透明度
                            borderWidth:'1',        // 提示边框厚度
                            borderColor:'gray',     // 提示边框颜色
                            padding: 10,
                        },
                        //-------------  grid区域  ----------------
                        grid: {
                            left: gridPosition[0],                      //组件离容器左侧的距离,百分比字符串或整型数字
                            top: gridPosition[1],                          //组件离容器上侧的距离，百分比字符串或整型数字
                            right: gridPosition[2],                    //组件离容器右侧的距离,百分比字符串或整型数字
                            bottom: gridPosition[3],                   //组件离容器下侧的距离,百分比字符串或整型数字
                            borderWidth: 1,
                            show: false,                // 是否显示直角坐标系网格
                            containLabel: false,       // grid 区域是否包含坐标轴的刻度标签
                            // 鼠标焦点放在图形上，产生的提示框
                            tooltip: {
                                show: true,
                                trigger: 'item',        // 触发类型
                                textStyle: {
                                    color: '#666',
                                },
                            }
                        },
                        // X轴
                        xAxis: [
                            {
                                show: true,                     // 是否显示
                                position: 'bottom',         // x轴位置
                                offset: 0,                  // x轴相对于默认位置的偏移
                                type: 'category',// 轴类型，默认'category
                                name: '',// 轴名称
                                nameLocation: 'end',// 轴名称相对位置
                                nameGap: 50,//---坐标轴名称与轴线之间的距离
                                data: Xtext,// X轴下文字
                                // 刻度
                                axisTick: {
                                    show: false,                //---是否显示
                                },
                                // X轴线样式
                                axisLine: {
                                    lineStyle: {
                                        color: "#375270"
                                    }
                                },
                                // X轴文字样式
                                axisLabel: {
                                    interval: 0,
                                    show: true,                  //---是否显示
                                    inside: false,               //---是否朝内
                                    rotate: 0,                   //---旋转角度

                                    textStyle:{
                                        fontSize: 10, // 让字体变大
                                        color:'#fff',//的颜色
                                    }
                                },
                            }
                        ],
                        // Y轴
                        yAxis: {
                            splitLine:{show: false},// 是否显示
                            show: true,
                            min: 0,
                            max: Math.ceil(Math.max.apply(null, data) + Math.max.apply(null, data)/10),
                            interval: Math.ceil(Math.max.apply(null, data) + Math.max.apply(null, data)/10)/5,
                            // 轴名称// y轴的字体样式
                            name:title2,
                            nameTextStyle:{
                                color:"#fff",
                                fontSize:10
                            },
                            type: 'value',
                            scale: true,
                            axisLine:{
                                show: false,
                                lineStyle: {color: "#fff"}
                            },
                            // 坐标轴 刻度
                            axisTick: {
                                show:false,                  //---是否显示
                            },
                            //---坐标轴 标签
                            axisLabel: {
                                padding: [-0, 0, 0, 0],
                                show: true,                  //---是否显示
                                inside:false,               //---是否朝内
                                rotate:0,                   //---旋转角度
                                formatter:"{value}",
                                //color:'red',              //---默认取轴线的颜色
                                textStyle: {
                                    fontSize: 9, // 让字体变大
                                    color: '#fff'
                                }
                            }
                        },
                        series: [
                            {
                                name: '销量',                           //---系列名称
                                type: 'bar',                            //---类型
                                legendHoverLink: true,       //---是否启用图例 hover 时的联动高亮
                                barGap: '-100%',
                                barWidth: '25',                           //---柱形宽度
                                animation: false,
                                itemStyle: {                 //---图形形状
                                    // 默认状态
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [
                                                {offset: gradualColor[3], color: gradualColor[0]},
                                                {offset: gradualColor[4], color: gradualColor[1]},
                                                {offset: gradualColor[5], color: gradualColor[2]}
                                            ]
                                        )
                                    },
                                    // 高亮状态
                                    emphasis: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [
                                                {offset: 0, color: '#2378f7'},
                                                {offset: 0.7, color: '#2378f7'},
                                                {offset: 1, color: '#83bff6'}
                                            ]
                                        )
                                    }
                                },
                                label: {                     //---图形上的文本标签
                                    show: true,
                                    position: 'top',   //---相对位置
                                    color: '#eee',
                                    formatter: "{c}",

                                },
                                data: data
                            }
                        ]
                    };
                    // Enable data zoom when user click bar(当用户单击ba时启用数据缩放).
                    var zoomSize = 6;
                    myChart.on('click', function (params) {
                        myChart.dispatchAction({
                            type: 'dataZoom',
                            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                            endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                        });
                    });
                    if (option && typeof option === "object") {
                        myChart.setOption(option, true);
                    }
                    myChart.setOption(option);
                    //根据窗口的大小变动图表 --- 重点
                    window.onresize = function(){
                        myChart.resize();
                        //myChart.resize();    //若有多个图表变动，可多写

                    }
            }

            }
        },
        // 数据接口
        DataPort: function () {
            var that = this;
            var aDatas = {};
            // 景区直通车
            $.ajax({
                url:'http://pc.ticket.glchuxingwang.com/TicketAPI/BigData/GetMonthStatistics',
                type:'get',
                dataType:'json',
                success:function(data){
                    that.FOR(data.GGBS.OrderNumber);
                    that.FOR(data.GGBS.OrderCount);
                    that.FOR(data.GGBS.OrderTotalPrice);
                    that.FOR(data.JQMP.OrderNumber);
                    that.FOR(data.JQMP.OrderCount);
                    that.FOR(data.JQMP.OrderTotalPrice);
                    aDatas.AOrderCountData = data.GGBS.OrderCount.Value.reverse();
                    aDatas.AOrderCountDate = data.GGBS.OrderCount.Time.reverse();
                    aDatas.AOrderNumberData = data.GGBS.OrderNumber.Value.reverse();
                    aDatas.AOrderNumberDate  = data.GGBS.OrderNumber.Time.reverse();
                    aDatas.AOrderTotalPriceData = data.GGBS.OrderTotalPrice.Value.reverse();
                    aDatas.AOrderTotalPriceDate  = data.GGBS.OrderTotalPrice.Time.reverse();
                    aDatas.AProductCountData = data.GGBS.ProductCount.Value.reverse();
                    aDatas.AProductCountDate = data.GGBS.ProductCount.Time.reverse();

                    aDatas.BOrderCountData = data.JQMP.OrderCount.Value.reverse();
                    aDatas.BOrderCountDate = data.JQMP.OrderCount.Time.reverse();
                    aDatas.BOrderNumberData = data.JQMP.OrderNumber.Value.reverse();
                    aDatas.BOrderNumberDate  = data.JQMP.OrderNumber.Time.reverse();
                    aDatas.BOrderTotalPriceData = data.JQMP.OrderTotalPrice.Value.reverse();
                    aDatas.BOrderTotalPriceDate  = data.JQMP.OrderTotalPrice.Time.reverse();
                    aDatas.BProductCountData = data.JQMP.ProductCount.Value.reverse()
                    aDatas.BProductCountDate = data.JQMP.ProductCount.Time.reverse();
                    aDatas.sceniCthroughData = data.GGBS;
                    aDatas.sceniTicketsData = data.JQMP;
                    $("#Titele32").text(Math.round(aDatas.sceniCthroughData.OrderCount.AllValue/1000)/10);
                    $("#Titele31").text(Math.round(aDatas.sceniCthroughData.OrderNumber.AllValue/1000)/10);
                    $("#Titele33").text(Math.round(aDatas.sceniCthroughData.OrderTotalPrice.AllValue/1000)/10);
                    $("#Titele34").text(aDatas.sceniCthroughData.ProductCount.AllValue)
                    $("#Titele42").text(Math.round(aDatas.sceniTicketsData.OrderCount.AllValue/1000)/10);
                    $("#Titele41").text(Math.round(aDatas.sceniTicketsData.OrderNumber.AllValue/1000)/10);
                    $("#Titele43").text(Math.round(aDatas.sceniTicketsData.OrderTotalPrice.AllValue/1000)/10);
                    $("#Titele44").text(aDatas.sceniTicketsData.ProductCount.AllValue)
                }
            });
            // 公共交通
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/publicTrafficCount',
                type:'get',
                dataType:'json',
                success:function(data){
                    aDatas.trafficCCM = [data.data.CCM.num, data.data.CCM.time];
                    aDatas.trafficCGGJ = [data.data.CGGJ.num, data.data.CGGJ.time];
                    aDatas.trafficCOUNT = [data.data.COUNT.num, data.data.COUNT.time];
                    aDatas.trafficDZGJ = [data.data.DZGJ.num, data.data.DZGJ.time];
                    aDatas.trafficTFM = [data.data.TFM.num, data.data.TFM.time];
                }

            });
            // 停车服务
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/tcService',
                type:'get',
                dataType:'json',
                success:function(data){
                    function vvv(data) {
                        var Arr = [];
                        for (var i = 0; i < data.value.length; i ++) {
                            Arr.push(Math.round(data.value[i]/1000)/10);
                        }
                        data.value = Arr;
                    }
                    vvv(data.data.serviceNum);
                    vvv(data.data.orderNum);
                    vvv(data.data.totalRevenue);
                    aDatas.parkCooperate_num = [data.data.serviceNum.value, data.data.serviceNum.time];
                    aDatas.order_num = [data.data.orderNum.value, data.data.orderNum.time];
                    aDatas.parkTotal_revenue = [data.data.cooperateNum.value, data.data.cooperateNum.time];
                    aDatas.parkService_number = [data.data.totalRevenue.value, data.data.totalRevenue.time];

                }
            });
            // 联票
            $.ajax({
                url:'http://pc.ticket.glchuxingwang.com/TicketAPI/BigData/GetMonthStatistics',
                type:'get',
                dataType:'json',
                success:function(data){
                    that.FOR(data.TP.OrderCount);
                    that.FOR(data.TP.OrderNumber);
                    that.FOR(data.TP.OrderTotalPrice);
                    aDatas.transportedOrderCount = [data.TP.OrderCount.Value.reverse(), data.TP.OrderCount.Time.reverse()];
                    aDatas.transportedOrderNumber = [data.TP.OrderNumber.Value.reverse(), data.TP.OrderNumber.Time.reverse()];
                    aDatas.transportedOrderTotalPrice = [data.TP.OrderTotalPrice.Value.reverse(), data.TP.OrderTotalPrice.Time.reverse()];
                    aDatas.transportedProductCount = [data.TP.ProductCount.Value.reverse(), data.TP.ProductCount.Time.reverse()];
                }
            });
            jQuery.dataPort = {
                // 公共交通数据
                trafficData: function (index) {
                    var Data = [];
                    var Date = [];
                    var title = "";
                    var colors = [];
                    if(index == 0) {
                        Data = aDatas.trafficTFM[0];
                        Date = aDatas.trafficTFM[1];
                        title = "服务（万人）";
                    } else if(index == 1) {
                        Data = aDatas.trafficCOUNT[0];
                        Date = aDatas.trafficCOUNT[1];
                        title = "通付码（万单）";
                    } else if(index == 2) {
                        Data = aDatas.trafficCCM[0];
                        Date = aDatas.trafficCCM[1];
                        title = "乘车码（万单）";
                    } else if(index == 3) {
                        Data = aDatas.trafficDZGJ[0];
                        Date = aDatas.trafficDZGJ[1];
                        title = "金额（万元）";
                    } else if(index == 4) {
                        Data = aDatas.trafficCGGJ[0];
                        Date = aDatas.trafficCGGJ[1];
                        title = "金额（万元）";
                    }
                    $.myPlugin.Cylindricality("container",Data,Date,['#2CD6FE','#2061FB','#2061FB',0,0.7,1],["公共交通",[11,10,0,20],18,"#27E4DE"] ,["13%","58%","16%","12%"],title);
                },
                // 停车服务数据
                parkData: function (index) {
                    var Data = [];
                    var Date = [];
                    var title = "";
                    if(index == 5) {
                        Data = aDatas.order_num[0];
                        Date = aDatas.order_num[1];
                        title = "服务（万人）";
                    } else if(index == 6) {
                        Data = aDatas.parkCooperate_num[0];
                        Date = aDatas.parkCooperate_num[1];
                        title = "订单（万单）";
                    } else if(index == 7) {
                        Data = aDatas.parkService_number[0];
                        Date = aDatas.parkService_number[1];
                        title = "金额（万元）";
                    } else if(index == 8) {
                        Data = aDatas.parkTotal_revenue[0];
                        Date = aDatas.parkTotal_revenue[1];
                        title = "合作点（个）";
                    }
                    $.myPlugin.Cylindricality("container1",Data,Date,['#FB4B60','#F48E54','#F48E54',0,0.7,1],["停车服务",[11,10,0,20],18,"#27E4DE"] ,["13%","58%","16%","14%"],title);

                },
                // 运游数据
                transportedData: function (index) {
                    var Data = [];
                    var Date = [];
                    var colors = [];
                    var title = "";
                    if(index == 9) {
                        Data = aDatas.transportedOrderCount[0];
                        Date = aDatas.transportedOrderCount[1];
                        title = "服务（万人）";
                    } else if(index == 10) {
                        Data = aDatas.transportedOrderNumber[0];
                        Date = aDatas.transportedOrderNumber[1];
                        title = "订单（万单）";
                    } else if(index == 11) {
                        Data = aDatas.transportedOrderTotalPrice[0];
                        Date = aDatas.transportedOrderTotalPrice[1];
                        title = "金额（万元）";
                    } else if(index == 12) {
                        Data = aDatas.transportedProductCount[0];
                        Date = aDatas.transportedProductCount[1];
                        title = "产品数（个）";
                    }
                    $.myPlugin.Cylindricality("container2",Data,Date,['#2EB596','#108EDB','#108EDB',0,0.7,1],["运游联票",[11,10,0,20],18,"#27E4DE"]  ,["13%","58%","16%","14%"],title);
                },
                // 景区直通车
                sceniCthroughData: function (index) {
                    var Data = [];
                    var Date = [];
                    var colors = [];
                    var title = "";
                    if(index == 0) {
                        Data = aDatas.AOrderCountData;
                        Date = aDatas.AOrderCountDate;
                        colors = ['#FBA133','#F77B35','#F25737',0,0.7,1];
                        title = "人数（万人）";
                    } else if(index == 1) {
                        Data = aDatas.AOrderNumberData;
                        Date = aDatas.AOrderNumberDate;
                        colors = ['#D8E426','#7FCF7B','#3EC0B8',0,0.7,1];
                        title = "订单（万单）";
                    } else if(index == 2) {
                        Data = aDatas.AOrderTotalPriceData;
                        Date = aDatas.AOrderTotalPriceDate;
                        colors = ['#2AD5F2','#389AF0','#436BEF',0,0.7,1];
                        title = "金额（万元）";
                    } else if(index == 3) {
                        Data = aDatas.AProductCountData;
                        Date = aDatas.AProductCountDate;
                        colors = ['#C135E9','#8037F2','#4739F9',0,0.7,1];
                        title = "产品（个）";
                    }
                    $.myPlugin.Cylindricality("container3",Data,Date,colors,["景区直通车",[5,0,5,100],20,"#27E4DE"]  ,["18%","57%","16%","10%"],title);
                },
                // 景区门票
                sceniTicketsData: function (index) {
                    var Data = [];
                    var Date = [];
                    var colors = [];
                    var title = "";
                    if(index == 4) {
                        Data = aDatas.BOrderCountData;
                        Date = aDatas.BOrderCountDate;
                        colors = ['#FBA133','#F77B35','#F25737',0,0.7,1]
                        title = "人数（万人）";
                    } else if(index == 5) {
                        Data = aDatas.BOrderNumberData;
                        Date = aDatas.BOrderNumberDate;
                        colors = ['#D8E426','#7FCF7B','#3EC0B8',0,0.7,1];
                        title = "订单（万单）";
                    } else if(index == 6) {
                        Data = aDatas.BOrderTotalPriceData;
                        Date = aDatas.BOrderTotalPriceDate;
                        colors = ['#2AD5F2','#389AF0','#436BEF',0,0.7,1]
                        title = "金额（万元）";
                    } else if(index == 7) {
                        Data = aDatas.BProductCountData;
                        Date = aDatas.BProductCountDate;
                        colors = ['#C135E9','#8037F2','#4739F9',0,0.7,1]
                        title = "产品（个）";
                    }
                    $.myPlugin.Cylindricality("container4",Data,Date,colors,["景区门票",[5,0,5,100],20,"#27E4DE"]  ,["18%","57%","16%","10%"],title);
                },

            }
        },
        // 资产运营效益
        getAssetsData: function(){
            var _this = this;
            $.ajax({
            	url:"http://adviser.guilinchuxingwang.com/bigdata/operate",
            	dataType:"json",
            	type:"get",
            	success:function(res){
                    if(sessionStorage.getItem('numBorderMoney') != res.data.total_income) {
                        // 总收益
                        $.myPlugin.numberData(".numBorderMoney",res.data.total_income);
                        $.myPlugin.DisplacementDistance(".numBorderMoney",4);
                    }
                    sessionStorage.setItem('numBorderMoney', res.data.total_income);

                    setTimeout(function () {
                        if(sessionStorage.getItem('numBorderVisitTimes') != res.data.total_income) {
                            // 访问量
                            $.myPlugin.numberData(".numBorderVisitTimes",res.data.page_view)
                            // $.myPlugin.numberData(".numBorderVisitTimes",Math.ceil(1000.2516);

                            $.myPlugin.DisplacementDistance(".numBorderVisitTimes",4);
                        }
                        sessionStorage.setItem('numBorderVisitTimes', res.data.page_view);
                    },4000);

                    setTimeout(function () {
                        if(sessionStorage.getItem('numBorderUserNumber') != res.data.total_income) {
                            // 用户数
                            $.myPlugin.numberData(".numBorderUserNumber",res.data.users);
                            $.myPlugin.DisplacementDistance(".numBorderUserNumber",4);
                        }
                        sessionStorage.setItem('numBorderUserNumber', res.data.users);
                    },8000);
            	}
            })



        },
        // 载入柱形图
        getCylindricalityData: function () {
            var that = this
            $.ajax({
                url:'http://pc.ticket.glchuxingwang.com/TicketAPI/BigData/GetMonthStatistics',
                type:'get',
                dataType:'json',
                success:function(data){
                    that.FOR(data.GGBS.OrderNumber);
                    that.FOR(data.JQMP.OrderNumber);
                    // 景区直通车
                    $.myPlugin.Cylindricality("container3",data.GGBS.OrderNumber.Value.reverse(),data.GGBS.OrderNumber.Time.reverse(),['#FBA133','#F77B35','#F25737',0,0.7,1],["景区直通车",[5,0,5,100],20,"#27E4DE"]  ,["18%","57%","16%","10%"],"服务（万人）");
                    // 景区门票
                    $.myPlugin.Cylindricality("container4",data.JQMP.OrderNumber.Value.reverse(),data.JQMP.OrderNumber.Time.reverse(),['#FBA133','#F77B35','#F25737',0,0.7,1],["景区门票",[5,0,5,100],20,"#27E4DE"]  ,["18%","57%","16%","10%"],"服务（万人）");
                }
            });
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/publicTrafficCount',
                type:'get',
                dataType:'json',
                success:function(data){
                    $(".Titele > div:nth-of-type(1) span").text(data.data.COUNT.total + "万人");
                    $(".Titele > div:nth-of-type(2) span").text(data.data.TFM.total + "万单");
                    $(".Titele > div:nth-of-type(3) span").text(data.data.CCM.total + "万单");
                    $(".Titele > div:nth-of-type(4) span").text(data.data.DZGJ.total + "万元");
                    $(".Titele > div:nth-of-type(5) span").text(data.data.CGGJ.total + "万元");
                    // 交通工具
                    $.myPlugin.Cylindricality("container",data.data.COUNT.num,data.data.COUNT.time,['#2CD6FE','#2061FB','#2061FB',0,0.7,1],["公共交通",[11,10,0,20],18,"#27E4DE"] ,["13%","58%","16%","12%"],"服务（万人）");
                }
            });
            $.ajax({
                url:'http://adviser.guilinchuxingwang.com/bigdata/tcService',
                type:'get',
                dataType:'json',
                success:function(data){
                    $(".Titele1 > div:nth-of-type(1) span").text(Math.round(data.data.serviceNum.total/1000)/10 + "万人");
                    $(".Titele1 > div:nth-of-type(2) span").text(Math.round(data.data.orderNum.total/1000)/10 + "万单");
                    $(".Titele1 > div:nth-of-type(3) span").text(Math.round(data.data.totalRevenue.total/1000)/10 + "万元");
                    $(".Titele1 > div:nth-of-type(4) span").text(data.data.cooperateNum.total + "个");

                    // 停车服务
                    $.myPlugin.Cylindricality("container1",data.data.serviceNum.value,data.data.serviceNum.time,['#FB4B60','#F48E54','#F48E54',0,0.7,1],["停车服务",[11,10,0,20],18,"#27E4DE"] ,["13%","58%","16%","14%"],"服务（万人）");

                }
            });
            $.ajax({
                url:'http://pc.ticket.glchuxingwang.com/TicketAPI/BigData/GetMonthStatistics',
                type:'get',
                dataType:'json',
                success:function(data){
                    $(".Titele2 > div:nth-of-type(2) span").text(Math.round(data.TP.OrderCount.AllValue/1000)/10 + "万单");
                    $(".Titele2 > div:nth-of-type(1) span").text(Math.round(data.TP.OrderNumber.AllValue/1000)/10 + "万人");
                    $(".Titele2 > div:nth-of-type(3) span").text(Math.round(data.TP.OrderTotalPrice.AllValue/1000)/10 + "万元");
                    $(".Titele2 > div:nth-of-type(4) span").text(data.TP.ProductCount.AllValue + "个");

                    // 运游联票
                    $.myPlugin.Cylindricality("container2",data.TP.OrderCount.Value.reverse(),data.TP.OrderCount.Time.reverse(),['#2EB596','#108EDB','#108EDB',0,0.7,1],["运游联票",[11,10,0,20],18,"#27E4DE"]  ,["13%","58%","16%","14%"],"服务（万人）");

                }
            });
        },
        // 用户交互事件
        UserEvents: function () {
            // 总收益
            $.myPlugin.DisplacementDistance(".numBorderMoney",5);
            // 访问量
            $.myPlugin.DisplacementDistance(".numBorderVisitTimes",2);
            // 用户数
            $.myPlugin.DisplacementDistance(".numBorderUserNumber",1);
            // 持卡数
            $.myPlugin.DisplacementDistance(".numBorderCardNumber",4);
            // 公共交通,停车服务,运游联票
            $('.cylindricalityBoy').find('img').each(function(index, element) {
                var Img = $(this).attr("src");
                var ImgSrc = $(this).attr("ImgSrc");
                // 用户移入图标时
                $(this).mouseenter(function() {
                    $(this).attr('src',ImgSrc); // 改变图标
                    // 提取数据
                    if(index < 5) { // 公共交通数据
                        // 交通工具
                        $.dataPort.trafficData(index)
                    } else if(index < 9){   // 停车服务数据
                        $.dataPort.parkData(index)
                    } else if(index < 13) { // 运游联票数据
                        $.dataPort.transportedData(index)
                    }
                });
                // 用户移出图标时
                $(this).mouseleave (function() {
                    $(this).attr('src',Img);    // 改变图标
                });
            });
            // 景区
            $('.scenicAreaBox').find('img').each(function(index, element) {
                var Img = $(this).attr("src");
                var ImgSrc = $(this).attr("ImgSrc");
                $(this).mouseenter(function() {
                    $(this).attr('src',ImgSrc);
                    // 提取数据
                    if(index < 4) { // 景区直通车数据
                        // 交通工具
                        $.dataPort.sceniCthroughData(index)
                    } else {   // 景区门票数据
                        $.dataPort.sceniTicketsData(index)
                    }
                });
                $(this).mouseleave (function() {
                    $(this).attr('src',Img);
                });
            });

            // 公共交通
            $('.Titele > div').each(function(index, element) {
                $(this).mouseenter(function() {
                    $(".Titele img.select").attr('src',localStorage.getItem("Img"));

                });
            });
            // 公共交通
            $('.Titele1 > div').each(function(index, element) {
                $(this).mouseenter(function() {
                    $(".Titele1 img.select").attr('src',localStorage.getItem("Img1"));

                });
            });
            // 公共交通
            $('.Titele2 > div').each(function(index, element) {
                $(this).mouseenter(function() {
                    $(".Titele2 img.select").attr('src',localStorage.getItem("Img2"));

                });
            });
            // 公共交通
            $('.Titele3 > div').each(function(index, element) {
                $(this).mouseenter(function() {
                    $(".Titele3 img.select").attr('src',localStorage.getItem("Img3"));

                });
            });
            // 公共交通
            $('.Titele4 > div').each(function(index, element) {
                $(this).mouseenter(function() {
                    $(".Titele4 img.select").attr('src',localStorage.getItem("Img4"));

                });
            });


            // speed: 速度
            function timer(speed) {
                var i = 0;
                var Img = "";
                var ImgSrc = "";
                var t = setInterval(fun,speed)  //fun是你的函数
                var fun = function(){
                    // 将上一个清除选中还原图片
                    $(".Titele img.select").attr('src',Img);
                    // 清除全部选中class
                    $(".Titele img").each(function(){
                        $(this).removeClass("select");
                    });
                    $.dataPort.trafficData(i)
                    // 添加选中class
                    $(".Titele img")[i].className = "select";
                    // 保存当前图片
                    Img = $(".Titele img.select").attr("src");
                    localStorage.setItem("Img", $(".Titele img.select").attr("src"));
                    ImgSrc = $(".Titele img.select").attr("ImgSrc");
                    // 替换选中图片
                    $(".Titele img.select").attr('src',ImgSrc);
                    i++;
                    if(i == 5) {
                        i = 0;
                    }
                }
                t = setInterval(fun,speed)//重新开始定时器

                // 用户移入图标时
                $(".Titele div").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $(".Titele div").mouseleave (function() {
                    t = setInterval(fun,speed)//重新开始定时器
                });
                // 用户移入图标时
                $("#container").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $("#container").mouseleave (function() {
                    t = setInterval(fun,speed)//重新开始定时器
                });
            }
            timer(5000);
            // speed: 速度
            function timer1(speed) {
                var i = 0;
                var Img = "";
                var ImgSrc = "";
                var t = setInterval(fun1,speed)  //fun1是你的函数
                var fun1 = function(){
                    // 将上一个清除选中还原图片
                    $(".Titele1 img.select").attr('src',Img);
                    // 清除全部选中class
                    $(".Titele1 img").each(function(){
                        $(this).removeClass("select");
                    });
                    $.dataPort.parkData(i + 5);
                    // 添加选中class
                    $(".Titele1 img")[i].className = "select";
                    // 保存当前图片
                    Img = $(".Titele1 img.select").attr("src");
                    localStorage.setItem("Img1", $(".Titele1 img.select").attr("src"));
                    ImgSrc = $(".Titele1 img.select").attr("ImgSrc");
                    // 替换选中图片
                    $(".Titele1 img.select").attr('src',ImgSrc);
                    i++;
                    if(i == 4) {
                        i = 0;
                    }
                }

                // 用户移入图标时
                $(".Titele1 div").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $(".Titele1 div").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
                t = setInterval(fun1,speed)//重新开始定时器
                // 用户移入图标时
                $("#container1").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $("#container1").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
            }
            timer1(5000);
            // // speed: 速度
            function timer2(speed) {
                var i = 0;
                var Img = "";
                var ImgSrc = "";
                var t = setInterval(fun1,speed)  //fun1是你的函数
                var fun1 = function(){
                    // 将上一个清除选中还原图片
                    $(".Titele2 img.select").attr('src',Img);
                    // 清除全部选中class
                    $(".Titele2 img").each(function(){
                        $(this).removeClass("select");
                    });
                    $.dataPort.transportedData(i + 9)
                    // 添加选中class
                    $(".Titele2 img")[i].className = "select";
                    // 保存当前图片
                    Img = $(".Titele2 img.select").attr("src");
                    localStorage.setItem("Img2", $(".Titele2 img.select").attr("src"));
                    ImgSrc = $(".Titele2 img.select").attr("ImgSrc");
                    // 替换选中图片
                    $(".Titele2 img.select").attr('src',ImgSrc);
                    i++;
                    if(i == 4) {
                        i = 0;
                    }
                }
                t = setInterval(fun1,speed)//重新开始定时器

                // 用户移入图标时
                $(".Titele2 div").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $(".Titele2 div").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
                // 用户移入图标时
                $("#container2").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $("#container2").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
            }
            timer2(5000);
            function timer3(speed) {
                var i = 0;
                var Img = "";
                var ImgSrc = "";
                var t = setInterval(fun1,speed)  //fun1是你的函数
                var fun1 = function(){
                    // 将上一个清除选中还原图片
                    $(".Titele3 img.select").attr('src',Img);
                    // 清除全部选中class
                    $(".Titele3 img").each(function(){
                        $(this).removeClass("select");
                    });
                    $.dataPort.sceniCthroughData(i)
                    // 添加选中class
                    $(".Titele3 img")[i].className = "select";
                    // 保存当前图片
                    Img = $(".Titele3 img.select").attr("src");
                    localStorage.setItem("Img3", $(".Titele3 img.select").attr("src"));
                    ImgSrc = $(".Titele3 img.select").attr("ImgSrc");
                    // 替换选中图片
                    $(".Titele3 img.select").attr('src',ImgSrc);
                    i++;
                    if(i == 4) {
                        i = 0;
                    }
                }
                t = setInterval(fun1,speed)//重新开始定时器

                // 用户移入图标时
                $(".Titele3 div").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $(".Titele3 div").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
                // 用户移入图标时
                $("#container3").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $("#container3").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
            }
            timer3(5000);
            function timer4(speed) {
                var i = 0;
                var Img = "";
                var ImgSrc = "";
                var t = setInterval(fun1,speed)  //fun1是你的函数
                var fun1 = function(){
                    // 将上一个清除选中还原图片
                    $(".Titele4 img.select").attr('src',Img);
                    // 清除全部选中class
                    $(".Titele4 img").each(function(){
                        $(this).removeClass("select");
                    });
                    $.dataPort.sceniTicketsData(i + 4)
                    // 添加选中class
                    $(".Titele4 img")[i].className = "select";
                    // 保存当前图片
                    Img = $(".Titele4 img.select").attr("src");
                    localStorage.setItem("Img4", $(".Titele4 img.select").attr("src"));
                    ImgSrc = $(".Titele4 img.select").attr("ImgSrc");
                    // 替换选中图片
                    $(".Titele4 img.select").attr('src',ImgSrc);
                    i++;
                    if(i == 4) {
                        i = 0;
                    }
                }
                t = setInterval(fun1,speed)//重新开始定时器

                // 用户移入图标时
                $(".Titele4 div").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $(".Titele4 div").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
                // 用户移入图标时
                $("#container4").mouseenter(function() {
                    clearInterval(t)//清除定时器
                });
                // 用户移出图标时
                $("#container4").mouseleave (function() {
                    t = setInterval(fun1,speed)//重新开始定时器
                });
            }
            timer4(5000);
        },

        /*                                         ** * **                                         */
        // 计时器
        setInterval: function () {
            var _this = this;
            // 收入趋势
            setInterval(function(){ _this.incomeTrend() }, 60000 );
            // 用户趋势
            setInterval(function(){ _this.userTrend()}, 60000);
            // 占比
            setInterval(function(){ _this.accounted()}, 60000);
            // 数据接口
            setInterval(function(){ _this.DataPort()}, 60000 );
            // 载入柱形图
            setInterval(function(){ _this.getCylindricalityData()}, 60000);
            // 运营效益
            setInterval(function(){ _this.getAssetsData() }, 25000 );
        },

    };
    index.init();
})(jQuery);
