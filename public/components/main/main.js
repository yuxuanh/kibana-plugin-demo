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

const buttonColor=["primary", "secondary", "warning", "danger", "ghost", "text"];
const images = ['https://source.unsplash.com/400x200/?Nature', 'https://source.unsplash.com/400x200/?Water', 'https://source.unsplash.com/400x200/?City'];


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
        console.log('first: #{resp.data}')
        this.setState({ sex: resp.data._source.sex });
        this.setState({ birthYear: resp.data._source.birthYear });
        this.setState({ custSeg: resp.data._source.custSeg });
        this.setState({ hasDebitCard: resp.data._source.hasDebitCard });
        this.setState({ hasCreditCard: resp.data._source.hasCreditCard });
        this.setState({ hasInternetBanking: resp.data._source.hasInternetBanking }); 

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

      });//frist query end


      httpClient.get('../api/logon/'+query.text).then((resp) => {
        if(resp.data.hits.hits){
          const result=resp.data.hits.hits[0]._source;
          this.setState({ lastLogonTime: result.lastLogonTime });
          this.setState({ freqLogonChannel: result.freqLogonChannel });
          this.setState({ freqLogonTimePeriod: result.freqLogonTimePeriod });
          this.setState({ freqLogonLoc: result.freqLogonLoc });

          const tags=[result.user_logon_pre_tag_1, result.user_logon_pre_tag_2, result.user_logon_pre_tag_3]
          const buttonNodes = tags.map(function (item, index) {
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
          this.setState({ buttonNodes: buttonNodes });
        }else{
          this.setState({ lastLogonTime: '' });
          this.setState({ freqLogonChannel: '' });
          this.setState({ freqLogonTimePeriod: '' });
          this.setState({ freqLogonLoc: '' });
        }
    });
  }
}

  //this is after render
  componentDidMount() {
    const icons = ['none'];
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
    this.setState({ buttonNodes: buttonNodes });
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
    const value = { float:'right', marginRight: '150px'};
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
                      <h1 key={0}>Personal Attribute</h1>
                        <p>Sex: <div style={value}>{this.state.sex} </div> </p>
                        <p>birthYear: <div style={value}>{this.state.birthYear}</div></p>
                      <h1 key={0}>Banking Attribute</h1>
                        <p>CustSeg: <div style={value}>{this.state.custSeg}</div></p>
                        <p>HasDebitCard: <div style={value}>{this.state.hasDebitCard}</div></p>
                        <p>HasCreditCard: <div style={value}>{this.state.hasCreditCard}</div></p>
                        <p>HasInternetBanking: <div style={value}>{this.state.hasInternetBanking}</div></p>
                    </EuiText>
                  </div>
                </EuiFlexItem>{/*first column end*/}
                
                <EuiFlexItem grow={false} style={ITEM_STYLE1}>{/*second column start*/}
                  <EuiText grow={false} size="s">
                  <h1>Logon Attribute</h1>
                    <p>Last Logon Time: {this.state.lastLogonTime}</p>
                    <p>Freq Logon Time Period: <div style={value}>{this.state.freqLogonTimePeriod}</div></p>
                    <p>Freq Logon Location: <div style={value}>{this.state.freqLogonLoc}</div></p>
                    <p>Freq Logon Channel: <div style={value}>{this.state.freqLogonChannel}</div></p>
                  <h1>Transaction Attribute</h1>
                    <p>Hub Trans Notification:</p>
                      <ul>
                        <li>Max Amount:</li>
                        <li>Avg Amount:</li>
                      </ul>
                      <p>Credit Card Trans Notification:</p>
                      <ul>
                      <li>Max Amount:</li>
                      <li>Avg Amount:</li>
                      </ul>
                      <p>Moneymoney Count:</p>
                      <ul>
                      <li>Max Amount:</li>
                      <li>Avg Amount:</li>
                      </ul>
                  </EuiText>
                  <EuiSpacer size="l"/>
                  <EuiText grow={false} size="s">
                  <h1>Tags</h1>
                  </EuiText>
                  <EuiSpacer size="s"/>
                  <EuiFlexGroup direction="column">
                    {this.state.buttonNodes}
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
