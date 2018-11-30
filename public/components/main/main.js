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
  EuiFlexItem
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

const icons = ['土豪', '小鲜肉', 'premier'];
const images = ['https://source.unsplash.com/400x200/?Nature', 'https://source.unsplash.com/400x200/?Water', 'https://source.unsplash.com/400x200/?City'];


const cardNodes = icons.map(function (item, index) {
  return (
    <EuiFlexItem key={index}>
      <EuiCard
        icon={<EuiIcon size="s"/>}
        title={`${item}`}
        image={images[index]}
        description=''
        onClick={() => window.alert('Card clicked')}
      />
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
                subtext: '纯属虚构',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
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

  }


  render() {
    const { title } = this.props;
    return (
      <EuiPage>
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>{title}</h1>
          </EuiTitle>
        </EuiPageHeader>
        <EuiPageBody>
          <EuiPageContent>
            <EuiPageContentBody>
            <EuiSearchBar
              box={{
                placeholder: 'e.g. custid'
              }}
              onChange={this.onChange}
            />
            <EuiSpacer size="s"/>
            <EuiText>
              <p>query string: {this.state.qstr}</p>
              <p>custSeg: {this.state.time || 'no result'}</p>
              <p>hasDebitCard: {this.state.hasDebitCard || 'no result'}</p>
            </EuiText>
            </EuiPageContentBody>

            <EuiPageContentBody>
              <EuiSpacer size="l"/>
              <EuiFlexGroup gutterSize="l">
                {cardNodes}
              </EuiFlexGroup>

              <EuiSpacer size="xxl"/>
              <EuiFlexGroup gutterSize="l">
                <div id="barchart" style={{ width: 400, height: 400 }}></div>
                <div id="piechart" style={{ width: 400, height: 400, marginLeft: 20 }}></div>
              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
  
};
