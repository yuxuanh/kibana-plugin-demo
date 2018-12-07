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
  EuiButton,
  EuiFieldSearch
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

const buttonColor=["primary", "secondary", "warning", "danger", "primary", "secondary"];

const initialQuery = EuiSearchBar.Query.MATCH_ALL;
//wealth bar chart option start
var posList = [
    'left', 'right', 'top', 'bottom',
    'inside',
    'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
    'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
];

 var configParameters = {
    rotate: {
        min: -90,
        max: 90
    },
    align: {
        options: {
            left: 'left',
            center: 'center',
            right: 'right'
        }
    },
    verticalAlign: {
        options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom'
        }
    },
    position: {
        options: echarts.util.reduce(posList, function (map, pos) {
            map[pos] = pos;
            return map;
        }, {})
    },
    distance: {
        min: 0,
        max: 100
    }
};

var config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,
    onChange: function () {
        var labelOption = {
            normal: {
                rotate: app.config.rotate,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                position: app.config.position,
                distance: app.config.distance
            }
        };
        myChart.setOption({
            series: [{
                label: labelOption
            }, {
                label: labelOption
            }, {
                label: labelOption
            }, {
                label: labelOption
            }]
        });
    }
};


var labelOption = {
    normal: {
        show: false,
        position: config.position,
        distance: config.distance,
        align: config.align,
        verticalAlign: config.verticalAlign,
        rotate: config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
            name: {
                textBorderColor: '#fff'
            }
        }
    }
};
//wealth bar chart option end

export class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = ({ query, error }) => {
    const { httpClient } = this.props;
    httpClient.get('../api/test/'+query.text).then((resp) => {
      //console.log(resp)
      this.setState({ sex: resp.data._source.sex });
      this.setState({ birthYear: resp.data._source.birthYear });
      var custSegDetail;
      if('MAS'==resp.data._source.custSeg){
        custSegDetail='Mass';
      }else if('PMR'==resp.data._source.custSeg){
        custSegDetail='Premier';
      }else if('ADV'==resp.data._source.custSeg){
        custSegDetail='Advance';
      }
      this.setState({ custSeg: custSegDetail });
      this.setState({ hasDebitCard: resp.data._source.hasDebitCard });
      this.setState({ hasCreditCard: resp.data._source.hasCreditCard });
      this.setState({ hasInternetBanking: resp.data._source.hasInternetBanking }); 
      this.setState({ imgUrl: resp.data._source.imgUrl }); 
    });//frist query end


    httpClient.get('../api/logon/'+query.text).then((resp) => {
      if(resp.data.hits.hits.length!=0){
        const result=resp.data.hits.hits[0]._source;
        this.setState({ lastLogonTime: result.lastLogonTime.substring(0,10)});
        var freqLogonChannel=result.freqLogonChannel;
        if(freqLogonChannel && freqLogonChannel.toLowerCase().search('wechat')!=-1){
          freqLogonChannel='WeChat';
        }
        this.setState({ freqLogonChannel: freqLogonChannel });
        this.setState({ freqLogonTimePeriod: result.freqLogonTimePeriod });
        this.setState({ freqLogonLoc: result.freqLogonLoc });
        this.setState({ pointTotal1: result.pointTotal1 });
        this.setState({ creditLimit: result.creditLimit });
        this.setState({ debitBalance: result.debitBalance });

        const tags=[result.user_logon_pre_tag_1,result.user_logon_pre_tag_2,result.user_logon_pre_tag_3,result.user_logon_pre_tag_4,result.user_logon_pre_tag_5];
        console.log(tags);
        this.setState({ tag1: tags });
        
        // barchart
        var barchart = echarts.init(document.getElementById('barchart'));
        barchart.setOption({
            title: { text: 'Channel Logon Count' },
            tooltip: {},
            xAxis: {
                data: ['GSP', 'Mobile', 'WeChat']
            },
            yAxis: {
              type: 'value',
              minInterval: 1
            },
            series: [{
                name: 'count',
                type: 'bar',
                data: [result.gspCount, result.mobileZCount, result.wechatCount]
            }]
        });

        const data2=[];
        const nameArray=[];
        const data1=[
            {value:result.cashInstallInquiryCount, name:'cash installment'},
            {value:result.viewCount, name:'reward register'},
            {value:result.statementCount, name:'query statement'},
            {value:result.rewardCount, name:'query reward'},
            {value:result.preBindingCount, name:'prebinding'},
            {value:result.limitCount, name:'query limit'},
            {value:result.balanceCount, name:'query balance'},
            {value:result.getInstallmentCount, name:'get installment'},
            {value:result.transferCount, name:'transfer'},
            {value:result.openAccountCount, name:'open account'},
            {value:result.onlinefxCount, name:'onlinefx'},
            {value:result.timeDepositCount, name:'TD'},
            {value:result.fundCount, name:'fund'},
            {value:result.stepupTmdAoCount, name:'buy setup tmd'},
            {value:result.opencdCount, name:'open cd'}
        ];
        data1.forEach(function (x, i) {
          //console.log(x+' '+i)
          if(x.value!=0){
            data2.push(x);
            console.log(nameArray.length);
            if(nameArray.length<12){
              nameArray.push(x.name);
            }
          }
        });
        //piechart
        var piechart = echarts.init(document.getElementById('piechart'));
        piechart.setOption({
            title : {
                text: 'User Behaviour Percentage',
                x:'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                data:nameArray,
                left:'630px'
            },
            series : [
                {
                    name: 'Behaviour',
                    type: 'pie',
                    radius : '80%',
                    center: ['50%', '50%'],
                    data:data2,
                    label: {
                      normal: {
                          show: true,
                          position: 'inside',
                          formatter: '{d}%  '
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '30',
                              fontWeight: 'bold'
                          }
                      }
                    },
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

      }else{
        this.setState({ lastLogonTime: '' });
        this.setState({ freqLogonChannel: '' });
        this.setState({ freqLogonTimePeriod: '' });
        this.setState({ freqLogonLoc: '' });
        this.noPieResultChart();
        this.noBarResultChart();
      }
  });
  
  httpClient.get('../api/trans/'+query.text).then((resp) => {
    if(resp.data.hits.hits.length!=0){
      const result=resp.data.hits.hits[0]._source;
      console.log('trans function');
      this.setState({ hubTransMaxAmt: result.hub_trans_max_amount_in_cny });
      this.setState({ hubTransTotalAmt: result.hub_trans_total_amount_in_cny });
      this.setState({ ccMaxAmt: result.cupd_trans_max_amount });
      this.setState({ ccTotalAmt: result.cupd_trans_total_amount });
      this.setState({ mmMaxAmt: result.movemoney_max_amount_in_cny });
      this.setState({ mmTotalAmt: result.movemoney_total_amount_in_cny });
      this.setState({ movemoney_pre_channel: result.movemoney_pre_channel });
      this.setState({ hubTransCount: result.hub_trans_count });
      this.setState({ ccCount: result.cupd_trans_count });
      this.setState({ mmCount: result.movemoney_count });
      this.setState({ tdCount: result.td_count });
      this.setState({ tdMaxAmt: result.td_max_amount });
      this.setState({ tdTotalAmt: result.td_total_amount });
      this.setState({ qrCount: result.qr_pay_count });
      this.setState({ qrMaxAmt: result.qr_pay_max_amount });
      this.setState({ qrTotalAmt: result.qr_pay_total_amount });
      this.setState({ wealth_sub_pre_tag: result.wealth_sub_pre_tag });
      this.setState({ wealth_sub_pre_amount: result.wealth_sub_pre_amount });
      this.setState({ td_pred_prob: result.td_pred_prob });
      this.setState({ wealth_pred_prob: result.wealth_pred_prob });
      setTimeout(() => {
        console.log(this.state.tag1);
        const tags=[this.state.tag1[0],this.state.tag1[1],this.state.tag1[2],this.state.tag1[3],this.state.tag1[4],result.user_trans_pre_tag_1,result.user_trans_pre_tag_2,result.user_trans_pre_tag_3];
        console.log(tags);
        const label_style = { maxWidth: '130px', maxHeight: '30px' };
        const buttonNodes = tags.map(function (item, index) {
          console.log('tags function')
          if('N/A'!={item}.item && index<3){
            console.log({item}.item)
            return (
              <EuiFlexItem key={index} grow={5} style={label_style}>
                <EuiButton
                    size="s"
                    fill
                    color={buttonColor[index]}
                  >
                    {item}
                </EuiButton>
              </EuiFlexItem>
            );
          }else if('N/A'!={item}.item && index>=3){
            console.log({item}.item)
            return (
              <EuiFlexItem key={index} grow={5} style={label_style}>
                <EuiButton
                    size="s"
                    color={buttonColor[index]}
                  >
                    {item}
                </EuiButton>
              </EuiFlexItem>
            );
          }
        });
        this.setState({ buttonNodes: buttonNodes });
      }, 0)
      //wealthBarchart
      var wealthBarchart = echarts.init(document.getElementById('wealthBarchart'));
      wealthBarchart.setOption({
        title : {
            text: 'View vs  Purchase Wealth Products',
            x:'center'
        },
        color: ['#003366', '#e5323e'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
          orient: 'horizontal',
          top: 'bottom',
          data: ['View', 'Subscription']
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                data: ['QDII', 'CPI', 'MRF']
            }
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1
            }
        ],
        series: [
            {
                name: 'View',
                type: 'bar',
                barGap: 0,
                label: labelOption,
                data: [result.qdii_count, result.cpi_count, result.mrf_count]
            },
            {
                name: 'Subscription',
                type: 'bar',
                label: labelOption,
                data: [result.qdii_sub_count, result.cpi_cfm_count, result.mrf_cfm_count]
            }
        ]
      });
    }else{
      this.setState({ hubTransMaxAmt: '' });
      this.setState({ hubTransAvgAmt: '' });
      this.setState({ ccMaxAmt: '' });
      this.setState({ ccAvgAmt: '' });
      this.setState({ mmMaxAmt: ''  });
      this.setState({ mmAvgAmt: ''  });
      this.setState({ hubTransCount: '' });
      this.setState({ ccCount: '' });
      this.setState({ mmCount: '' });
      this.setState({ tdCount: '' });
      this.setState({ tdMaxAmt: '' });
      this.setState({ tdAvgAmt: ''});
      this.setState({ qrCount: '' });
      this.setState({ qrMaxAmt: '' });
      this.setState({ qrAvgAmt: '' });
      this.setState({ wealth_sub_pre_tag: '' });
      this.setState({ wealth_sub_pre_amount: '' });
      this.noLableResultChart();
      this.noWealthBarResultChart();
    }
  });
}

  noLableResultChart(){
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
  }

  noPieResultChart(){
    //pie chart 
    var piechart = echarts.init(document.getElementById('piechart'));
    piechart.setOption({
        title : {
            text: 'User Behaviour Percentage',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br////>{b} : {c} ({d}%)"
        },
        series : [
            {
                name: 'Behaviour',
                type: 'pie',
                radius : '30%',
                center: ['50%', '50%'],
                data:[
                    {value:1, name:'none'}
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
  }

  noBarResultChart(){
    //bar chart
    var barchart = echarts.init(document.getElementById('barchart'));
    barchart.setOption({
        title: { text: 'Channel Logon Count', x:'center' },
        tooltip: {},
        xAxis: {
            data: ['GSP', 'Mobile', 'WeChat']
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [{
            name: 'count',
            type: 'bar',
            data: [0,0,0]
        }]
    });
  }

  noWealthBarResultChart(){
    //wealthBarchart
    var wealthBarchart = echarts.init(document.getElementById('wealthBarchart'));
    wealthBarchart.setOption({
      title : {
          text: 'View vs  Purchase Wealth Products',
          x:'center'
      },
      color: ['#003366', '#e5323e'],
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {
        orient: 'horizontal',
        top: 'bottom',
        data: ['View', 'Subscription']
      },
      toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
      },
      calculable: true,
      xAxis: [
          {
              type: 'category',
              axisTick: {show: false},
              data: ['QDII', 'CPI', 'MRF']
          }
      ],
      yAxis: [
          {
            type: 'value',
            minInterval: 1
          }
      ],
      series: [
          {
              name: 'View',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: [0, 0, 0]
          },
          {
              name: 'Subscription',
              type: 'bar',
              label: labelOption,
              data: [0, 0, 0]
          }
      ]
    });

  }

  //this is after render
  componentDidMount() {
    this.noLableResultChart();
    this.noPieResultChart();
    this.noBarResultChart();
    this.noWealthBarResultChart();
  }


  render() {
    const { title } = this.props;
    const ITEM_STYLE = { width: '30%', marginLeft:'30px', marginTop:'30px'};
    const ITEM_STYLE1 = { width: '30%', marginLeft:'10px', marginTop:'30px'};
    const tag_STYLE1 = { width: 500};
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
                      <img src="../bundles/weixin.jpg"></img>
                    </div>
                    <EuiSpacer size="l"/>
                    <EuiText grow={false} size="s">
                      <h1 key={0}>Personal Attribute</h1>
                        <p>Gender: <div style={value}>{this.state.sex} </div> </p>
                        <p>birthYear: <div style={value}>{this.state.birthYear}</div></p>
                      <h1 key={0}>Banking Attribute</h1>
                        <p>CustSeg: <div style={value}>{this.state.custSeg}</div></p>
                        <p>HasDebitCard: <div style={value}>{this.state.hasDebitCard}</div></p>
                        <p>HasCreditCard: <div style={value}>{this.state.hasCreditCard}</div></p>
                        <p>HasInternetBanking: <div style={value}>{this.state.hasInternetBanking}</div></p>
                    </EuiText>
                    <EuiSpacer size="l"/>
                    <EuiText grow={false} size="s">
                      <h1>Card Attribute</h1>
                      <p>Debit Card Balance: <div style={value}>{this.state.debitBalance}</div></p>
                      <p>Credit Card Limit : <div style={value}>{this.state.creditLimit}</div></p>
                      <p>Credit Card Point : <div style={value}>{this.state.pointTotal1}</div></p>
                    </EuiText>
                    <EuiSpacer size="l"/>
                    <EuiText grow={false} size="s">
                      <h1>Purchase Prediction</h1>
                      <p>Term Deposit Probability: <div style={value}>{this.state.td_pred_prob}</div></p>
                      <p>Wealth Purchase Probability: <div style={value}>{this.state.wealth_pred_prob}</div></p>
                    </EuiText>
                  </div>
                </EuiFlexItem>{/*first column end*/}
                
                <EuiFlexItem grow={false} style={ITEM_STYLE1}>{/*second column start*/}
                  <EuiText grow={false} size="s">
                    <h1>Logon Attribute</h1>
                    <p>Last Logon Time: <div style={value}>{this.state.lastLogonTime}</div></p>
                    <p>Freq Logon Time Period: <div style={value}>{this.state.freqLogonTimePeriod}</div></p>
                    <p>Freq Logon Location: <div style={value}>{this.state.freqLogonLoc}</div></p>
                    <p>Freq Logon Channel: <div style={value}>{this.state.freqLogonChannel}</div></p>
                  </EuiText>
                  <EuiSpacer size="m"/>
                  <EuiText grow={false} size="s">
                  <h1>Transaction Attribute</h1>
                    <p>Debit Card Trans Count: <div style={value}>{this.state.hubTransCount}</div></p>
                      <ul>
                        <li>Max Amount: <div style={value}>{this.state.hubTransMaxAmt} RMB</div></li>
                        <li>Total Amount: <div style={value}>{this.state.hubTransTotalAmt} RMB</div></li>
                      </ul>
                      <p>Credit Card Trans Count: <div style={value}>{this.state.ccCount}</div></p>
                      <ul>
                      <li>Max Amount: <div style={value}>{this.state.ccMaxAmt} RMB</div></li>
                      <li>Total Amount: <div style={value}>{this.state.ccTotalAmt} RMB</div></li>
                      </ul>
                      <p>Money Transfer Out Count: <div style={value}>{this.state.mmCount}</div></p>
                      <ul>
                      <li>Max Amount: <div style={value}>{this.state.mmMaxAmt} RMB</div></li>
                      <li>Total Amount: <div style={value}>{this.state.mmTotalAmt} RMB</div></li>
                      <li>Pref Channel: <div style={value}>{this.state.movemoney_pre_channel}</div></li>
                      </ul>
                      <p>Term Deposit Count: <div style={value}>{this.state.tdCount}</div></p>
                      <ul>
                      <li>Max Amount: <div style={value}>{this.state.tdMaxAmt} RMB</div></li>
                      <li>Total Amount: <div style={value}>{this.state.tdTotalAmt} RMB</div></li>
                      </ul>

                      {/*comment below part*/}
                      {/* <p>QR payment Count: <div style={value}>{this.state.qrCount}</div></p>
                      <ul>
                      <li>Max Amount: <div style={value}>{this.state.qrMaxAmt} RMB</div></li>
                      <li>Total Amount: <div style={value}>{this.state.qrTotalAmt} RMB</div></li>
                      </ul> */}

                      <p>Wealth</p>
                      <ul>
                      <li>Prefer Product: <div style={value}>{this.state.wealth_sub_pre_tag}</div></li>
                      <li>Amount: <div style={value}>{this.state.wealth_sub_pre_amount} RMB</div></li>
                      </ul>
                  </EuiText>
                  <EuiSpacer size="l"/>
                  <EuiText grow={false} size="s">
                  <h1>Label</h1>
                  </EuiText>
                  <EuiFlexGroup style={tag_STYLE1} direction="column" wrap>
                    {this.state.buttonNodes}
                  </EuiFlexGroup>
                </EuiFlexItem>{/*second column*/}

                <EuiFlexItem grow={false} style={ITEM_STYLE}>{/*third column start*/}
                  <div id="piechart" style={{ width: '900px', height: '50%', left:'-280px'}}></div>
                  <EuiSpacer size="l"/>
                  <div id="barchart" style={{ width: '80%', height: '40%', marginLeft:'30px' }}></div>
                  <EuiSpacer size="l"/>
                  <div id="wealthBarchart" style={{ width: '80%', height: '40%', marginLeft:'30px' }}></div>
                </EuiFlexItem>{/*third column*/}

              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
  
};
