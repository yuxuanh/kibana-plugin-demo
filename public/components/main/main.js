import React from "react";
import {
  EuiPage,
  EuiPageHeader,
  EuiTitle,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentBody,
  EuiText,
  EuiSpacer,
  EuiSearchBar,
  EuiCard,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiAvatar,
  EuiButton
} from "@elastic/eui";
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
require('./mystyle.css');


const once = ['once']
const icons = ['土豪', '小鲜肉', 'premier'];
const buttonColor=["primary", "secondary", "warning", "danger", "ghost", "text"];
const images = ['https://source.unsplash.com/400x200/?Nature', 'https://source.unsplash.com/400x200/?Water', 'https://source.unsplash.com/400x200/?City'];
const text1 = [<h1 key={0}>Personal Attribute</h1>,<p>Sex: Male</p>,<p>Age: 32</p>,<p>Job: Engineer</p>,<h1 key={0}>Banking Attribute</h1>,<p>CustSeg: PMR</p>,<p>hasDebitCard: Y</p>,<p>hasCreditCard: Y</p>];
const text = [
  <h1 key={0}>This is Heading One</h1>,

  <p key={1}>
    Far out in the uncharted backwaters of the unfashionable end of
    the western spiral arm of the Galaxy lies a small unregarded
    yellow sun.
  </p>,

  <h2 key={0.5}>This is Heading Two</h2>,

  <p key={2}>
    Orbiting this at a distance of roughly ninety-two million miles
    is an utterly insignificant little blue green planet whose ape-
    descended life forms are so amazingly primitive that they still
    think digital watches are a pretty neat idea.
  </p>,

  <ul key={3}>
    <li>List item one</li>
    <li>List item two</li>
    <li>Dolphins</li>
  </ul>,
];
const buttonNodes = icons.map(function (item, index) {
  return (
    <EuiFlexItem key={index} grow={5}>
      <EuiButton
          size="s"
          fill
          color={buttonColor[index]}
        >
          {item}
      </EuiButton>
    </EuiFlexItem>
  );
});

const initialQuery = EuiSearchBar.Query.MATCH_ALL;
const data=[5, 20, 36, 10, 10, 20];


export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = ({ query, error }) => {
    const { httpClient } = this.props;
    this.setState({qstr: 'initial'});
    if (error) {
      this.setState({ qstr:'error' });
    } else {
      //const esQueryDsl = EuiSearchBar.Query.toESQuery(query);
      //console.log('query: #{query} + #{esQueryDsl}');
      this.setState({ qstr: query.text});
      httpClient.get('../api/test/'+query.text).then((resp) => {
        this.setState({ time: resp.data._source.custSeg });
        this.setState({ hasDebitCard: resp.data._source.hasDebitCard });
        console.log('wealthAmount: #{resp.data._source.wealthAmount}')
        // barchart
        var barchart = echarts.init(document.getElementById('barchart'));
        barchart.setOption({
            title: { text: 'Channel Logon Count' },
            tooltip: {},
            xAxis: {
                data: ['gsp', 'mobile', 'wechat']
            },
            yAxis: {},
            series: [{
                name: 'count',
                type: 'bar',
                data: [resp.data._source.gspLogonAmount, resp.data._source.mobileLogonAmount, resp.data._source.wechatLogonAmount]
            }]
        });

        //piechart
        var piechart = echarts.init(document.getElementById('piechart'));
        piechart.setOption({
            title : {
                text: '某站点用户访问来源',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br////>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });

      });//end
    }
  };

  //this is after render
  componentDidMount() {
    //pie chart 
    var piechart = echarts.init(document.getElementById('piechart'));
    piechart.setOption({
        title : {
            text: '某站点用户访问来源',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br////>{b} : {c} ({d}%)"
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    //bar chart
    var barchart = echarts.init(document.getElementById('barchart'));
    barchart.setOption({
        title: { text: 'Channel Logon Count', x:'center' },
        tooltip: {},
        xAxis: {
            data: ['gsp', 'mobile', 'wechat']
        },
        yAxis: {},
        series: [{
            name: 'count',
            type: 'bar',
            data: [1,2,3]
        }]
    });
  }


  render() {
    const { title } = this.props;
    const ITEM_STYLE = { width: '30%', marginLeft:'30px', marginTop:'30px'};
    const ITEM_STYLE1 = { width: '30%', marginLeft:'10px', marginTop:'30px'};
    return (
      <EuiPage>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
              <EuiSearchBar
                  box={{
                    placeholder: 'e.g. custid'
                  }}
                  onChange={this.onChange}
                />
              <EuiSpacer size="l"/>
              <EuiFlexGroup direction="column">

                <EuiFlexItem grow={false} style={ITEM_STYLE}>{/*first column start*/}
                  <div className="div1">
                    <div className="div1-img">
                      <img src="https://source.unsplash.com/400x200/?Nature"/>
                    </div>
                    <EuiSpacer size="l"/>
                    <EuiText grow={false} size="s">
                      {text1}
                    </EuiText>
                  </div>
                </EuiFlexItem>{/*first column end*/}
                
                <EuiFlexItem grow={false} style={ITEM_STYLE1}>{/*second column start*/}
                  <EuiText grow={false} size="s">
                    {text1}
                  </EuiText>
                  <EuiSpacer size="l"/>
                  <EuiText grow={false} size="s">
                  <h1>Tags</h1>
                  </EuiText>
                  <EuiSpacer size="s"/>
                  <EuiFlexGroup direction="column">
                    {buttonNodes}
                  </EuiFlexGroup>
                </EuiFlexItem>{/*second column*/}

                <EuiFlexItem grow={false} style={ITEM_STYLE}>{/*third column start*/}
                  <div id="piechart" style={{ width: '80%', height: '50%' }}></div>
                  <EuiSpacer size="l"/>
                  <div id="barchart" style={{ width: '80%', height: '50%', marginLeft:'30px' }}></div>
                </EuiFlexItem>{/*third column*/}

              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
  
};
