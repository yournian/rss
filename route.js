const {RSS} = require('./consts');

const feed = ctx => {
    let {id} = ctx.request.query;
    if(!RSS[id]){
        ctx.response.body = '';
    }else{
        ctx.response.type = 'text/xml';
        ctx.response.body = getRss(id);
    }
}

function getRss(id){
    return `<rss version="2.0">
    <channel>
    <title>香山网 - 珠海生活</title>
    <link>http://www.x3cn.com/forum-67-1.html</link>
    <description>Latest 20 threads of 珠海生活</description>
    <copyright>Copyright(C) 香山网</copyright>
    <generator>Discuz! Board by Comsenz Inc.</generator>
    <lastBuildDate>Wed, 24 Jun 2020 10:47:57 +0000</lastBuildDate>
    <ttl>30</ttl>
    <image>
    <url>http://www.x3cn.com/static/image/common/logo_88_31.gif</url>
    <title>香山网</title>
    <link>http://www.x3cn.com/</link>
    </image>
    <item>
    <title>前山中学</title>
    <link>http://www.x3cn.com/thread-1224091-1-1.html</link>
    <description>
    <![CDATA[ 前山寨城墙 明末城垣今校墙， 沧桑岁月绿砖藏。 壁残难掩好风景， 百年树下读书郎。 [video=https://pic1.x3cn.com/pic/20200624/159299382604774_863.jpg]https://pic1.x3cn.com/video/20200624/1592993798942925_538.mp4[/video] ]]>
    </description>
    <category>珠海生活</category>
    <author>沙发上的土豆</author>
    <pubDate>Wed, 24 Jun 2020 10:17:09 +0000</pubDate>
    </item>
    <item>
    <title>练摊儿街边卖艺惜惺惺，父老乡亲倾</title>
    <link>http://www.x3cn.com/thread-1224090-1-1.html</link>
    <description>
    <![CDATA[ 练摊儿 街边卖艺惜惺惺， 父老乡亲倾耳听。 此曲只应天上有， 多多打赏莫稍停。 [video=https://pic1.x3cn.com/pic/20200624/1592993711937660_741.jpg]https://pic1.x3cn.com/video/20200624/1592993698002110_474.mp4[/video] ]]>
    </description>
    <category>珠海生活</category>
    <author>沙发上的土豆</author>
    <pubDate>Wed, 24 Jun 2020 10:15:17 +0000</pubDate>
    </item>
    <item>
    <title>纪念一下人生中包的第一个粽子！快夸我</title>
    <link>http://www.x3cn.com/thread-1224089-1-1.html</link>
    <description>
    <![CDATA[ 第一个虽然不好看，但是成就感满满的。接下来的就越包越有感觉啦 ]]>
    </description>
    <category>珠海生活</category>
    <author>九月的小螃蟹</author>
    <pubDate>Wed, 24 Jun 2020 10:08:41 +0000</pubDate>
    </item>
    <item>
    <title>屌丝长安爱插队，粤C813R2跨实线变道插队。</title>
    <link>http://www.x3cn.com/thread-1224086-1-1.html</link>
    <description>
    <![CDATA[ 时间：2020.06.24上午08:39 车牌：粤C813R2跨实线变道。 地点：翠微西路，珠海市第十中学往暨南大学红绿灯。 @珠海交警 ]]>
    </description>
    <category>珠海生活</category>
    <author>云雾之间</author>
    <pubDate>Wed, 24 Jun 2020 09:50:01 +0000</pubDate>
    </item>
    <item>
    <title>总有出租车的士想害朕……粤C871U8跨实线插队。</title>
    <link>http://www.x3cn.com/thread-1224082-1-1.html</link>
    <description>
    <![CDATA[ 时间：2020.06.24上午08:44 车牌：出租车粤C871U8跨实线插队。 地点：柠溪路，前山往柠溪下穿隧道入口。 ]]>
    </description>
    <category>珠海生活</category>
    <author>云雾之间</author>
    <pubDate>Wed, 24 Jun 2020 09:46:31 +0000</pubDate>
    </item>
    <item>
    <title>体验板樟山人行隧道</title>
    <link>http://www.x3cn.com/thread-1224081-1-1.html</link>
    <description>
    <![CDATA[ 据说这是国内第一条，那么、必须去实地体验一下了。 下午2点、俺坐公交车到隧道南巴士站下车。走到面对板樟山右侧那一道、体温检测合格，开始了俺的拍照记录。 ]]>
    </description>
    <category>珠海生活</category>
    <author>满满姥爷</author>
    <pubDate>Wed, 24 Jun 2020 09:33:21 +0000</pubDate>
    </item>
    <item>
    <title>恭喜板樟山隧道开通啦，大家都可以提前到兰浦来堵车看美女啦</title>
    <link>http://www.x3cn.com/thread-1224080-1-1.html</link>
    <description>
    <![CDATA[ 恭喜板樟山隧道开通啦，大家都可以提前到兰浦来堵车看美女啦 ]]>
    </description>
    <category>珠海生活</category>
    <author>特朗普</author>
    <pubDate>Wed, 24 Jun 2020 09:22:43 +0000</pubDate>
    </item>
    <item>
    <title>平沙开肯德基了</title>
    <link>http://www.x3cn.com/thread-1224079-1-1.html</link>
    <description>
    <![CDATA[ 今天，珠海平沙肯德基餐厅（平沙钰海国际广场一楼）盛大开业[鼓掌][鼓掌][鼓掌]，欢迎大家有空到餐厅做客，祝餐厅开业大吉，生意兴隆！[玫瑰][玫瑰][玫瑰] ]]>
    </description>
    <category>珠海生活</category>
    <author>Tyts</author>
    <pubDate>Wed, 24 Jun 2020 09:22:35 +0000</pubDate>
    </item>
    <item>
    <title>曾经合作过的经理失踪了？珠海公安民警跨市抓捕！</title>
    <link>http://www.x3cn.com/thread-1224075-1-1.html</link>
    <description>
    <![CDATA[ 6月11日，香洲公安分局翠香派出所民警在江门市新会区将犯罪嫌疑人朱某鸿（男，45岁）抓获。朱某鸿以前是江门某家具公司的一名经理，被抓的原因是涉嫌诈骗罪。 2019年下半年，珠海居民孔小姐想购置一些家具，便联系了之前有过家具交易往来的朱经理。经过 ... ]]>
    </description>
    <category>珠海生活</category>
    <author>香山网-瑞秋</author>
    <pubDate>Wed, 24 Jun 2020 09:22:06 +0000</pubDate>
    </item>
    <item>
    <title>夏天真愁人！家里的卫生间出现小虫子</title>
    <link>http://www.x3cn.com/thread-1224076-1-1.html</link>
    <description>
    <![CDATA[ ]]>
    </description>
    <category>珠海生活</category>
    <author>阳光未必暖人心</author>
    <pubDate>Wed, 24 Jun 2020 09:18:28 +0000</pubDate>
    </item>
    <item>
    <title>下午4点半，湖心路口大塞车</title>
    <link>http://www.x3cn.com/thread-1224073-1-1.html</link>
    <description>
    <![CDATA[ 堵好久了…这么早就开始堵 ]]>
    </description>
    <category>珠海生活</category>
    <author>猪年转运</author>
    <pubDate>Wed, 24 Jun 2020 08:43:20 +0000</pubDate>
    </item>
    <item>
    <title>可怜的交警叔叔大热天推车上桥</title>
    <link>http://www.x3cn.com/thread-1224072-1-1.html</link>
    <description>
    <![CDATA[ 我就纳闷了，怎么才四点就开始堵上了？？ 慢慢走到前面才发现了这一幕，可怜的交警叔叔，辛苦了，这么热的天，推车得多辛苦！ ]]>
    </description>
    <category>珠海生活</category>
    <author>八月流霜</author>
    <pubDate>Wed, 24 Jun 2020 08:37:33 +0000</pubDate>
    </item>
    <item>
    <title>土豪们，上燕窝</title>
    <link>http://www.x3cn.com/thread-1224071-1-1.html</link>
    <description>
    <![CDATA[ 抬头一望，如此密集的燕窝。旧时王谢堂前燕，飞入寻常百姓家。这就是土豪们吃的燕窝么，哈哈 ]]>
    </description>
    <category>珠海生活</category>
    <author>归宿</author>
    <pubDate>Wed, 24 Jun 2020 08:36:16 +0000</pubDate>
    </item>
    <item>
    <title>刚刚，国家卫健委发布重要通知！事关高考！</title>
    <link>http://www.x3cn.com/thread-1224066-1-1.html</link>
    <description>
    <![CDATA[ 桃红柳绿，新荷青青高考进入倒计时 一年一度的高考即将在7月7、8日拉开帷幕▼ 今年高考如何防疫？如何应对高温呢？6月24日国家卫健委官网发布《2020年高考防疫关键措施10条》考生家长注意啦！ 以下为全文↓↓2020年高考防疫关键措施10条 一是人员的健康监测。对参 ... ]]>
    </description>
    <category>珠海生活</category>
    <author>泰芒</author>
    <pubDate>Wed, 24 Jun 2020 07:26:12 +0000</pubDate>
    </item>
    <item>
    <title>无聊的四天假期</title>
    <link>http://www.x3cn.com/thread-1224065-1-1.html</link>
    <description>
    <![CDATA[ 四天后再战 ]]>
    </description>
    <category>珠海生活</category>
    <author>最爱小标</author>
    <pubDate>Wed, 24 Jun 2020 07:17:00 +0000</pubDate>
    </item>
    <item>
    <title>感冒了，好怕被抓去隔离</title>
    <link>http://www.x3cn.com/thread-1224064-1-1.html</link>
    <description>
    <![CDATA[ 早几天晒被子，晚上忘记收了，空调开25，连续两天被冷醒，半夜想抓被子都抓不到 然后咽喉开始不舒服，流鼻水，鼻塞，偶尔咳两下，还好体温正常 好怕被抓去隔离呀 ]]>
    </description>
    <category>珠海生活</category>
    <author>Jimmy仔</author>
    <pubDate>Wed, 24 Jun 2020 07:15:51 +0000</pubDate>
    </item>
    <item>
    <title>连接珠海大道与尖峰大道的双湖路几时可以建成通车啊？</title>
    <link>http://www.x3cn.com/thread-1224061-1-1.html</link>
    <description>
    <![CDATA[ 连接珠海大道与尖峰大道的双湖路（平行于湖心路的）几时可以建成通车啊？ ]]>
    </description>
    <category>珠海生活</category>
    <author>大唐总理</author>
    <pubDate>Wed, 24 Jun 2020 07:02:07 +0000</pubDate>
    </item>
    <item>
    <title>请问这家公立幼儿园好不好？</title>
    <link>http://www.x3cn.com/thread-1224059-1-1.html</link>
    <description>
    <![CDATA[ 抽中了一个启雅幼儿园，现在家里人吵起来了，老头老太太非让去华发那个私立的， 老婆说公立也不错，谁知道？上网查了一下也一般般。 ]]>
    </description>
    <category>珠海生活</category>
    <author>新火柴妞的</author>
    <pubDate>Wed, 24 Jun 2020 06:20:27 +0000</pubDate>
    </item>
    <item>
    <title>珠海超110亿项目签约动工！珠海这个区发展再提速！</title>
    <link>http://www.x3cn.com/thread-1224058-1-1.html</link>
    <description>
    <![CDATA[ 千亿级斗门智能制造产业园发展再提速！ 今天，斗门智能制造产业园项目集中签约动工！12家先进制造企业签约，总投资超110亿元；6个产业项目及2个园区配套工程破土动工，总投资27.1亿元！ 6月24日上午，斗门智能制造产业园项目签约暨动工仪式举行，吹响斗门新一轮 ... ]]>
    </description>
    <category>珠海生活</category>
    <author>泰芒</author>
    <pubDate>Wed, 24 Jun 2020 06:16:25 +0000</pubDate>
    </item>
    <item>
    <title>听说新款飞度快上市了，上个月买了致炫的朋友说悔死了</title>
    <link>http://www.x3cn.com/thread-1224053-1-1.html</link>
    <description>
    <![CDATA[ 朋友上个月刚把家里的老雪铁龙置换买了丰田致炫，今天他看到新飞度要上市了，说教后悔死了。本来也想买的，只不过国五卖光了，国六又没出来，现在新款就要上了，我也觉得他买早了，哈哈哈，所以说好饭不怕晚哇，买车也不要太着急啊 ]]>
    </description>
    <category>珠海生活</category>
    <author>雾时之森</author>
    <pubDate>Wed, 24 Jun 2020 05:49:51 +0000</pubDate>
    </item>
    </channel>
    </rss>
    `;

    // let feed = new Feed();
    // let result = await feed.readFromFile(id + '.xml');
    // if (!result) {
    //     return 'Not Found';
    // }else{
    //     return result;
    // }


}


module.exports = {
    feed
}