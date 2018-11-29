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
const icons = ['土豪', '小鲜肉', 'premier'];
const images = ['https://source.unsplash.com/400x200/?Nature', 'https://source.unsplash.com/400x200/?Water', 'https://source.unsplash.com/400x200/?City'];

const cardNodes = icons.map(function (item, index) {
  return (
    <EuiFlexItem key={index}>
      <EuiCard
        icon={<EuiIcon size="xxs"/>}
        title={`${item}`}
        image={images[index]}
        onClick={() => window.alert('Card clicked')}
      />
    </EuiFlexItem>
  );
});

const initialQuery = EuiSearchBar.Query.MATCH_ALL;


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
      });
    }
  };

  componentDidMount() {
    /* 
       FOR EXAMPLE PURPOSES ONLY.  There are much better ways to
       manage state and update your UI than this.
    */
     
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
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    );
  }
  
};
