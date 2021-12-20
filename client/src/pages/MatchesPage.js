import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

import { getMatchSearch, getMatch } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;


class MatchesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            awayQuery: "",
            homeQuery: "",
            matchesResults: [],
            selectedMatchId: window.location.search ? window.location.search.substring(1).split('=')[1] : 0,
            selectedMatchDetails: null

        }

        this.handleAwayQueryChange = this.handleAwayQueryChange.bind(this)
        this.handleHomeQueryChange = this.handleHomeQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.goToMatch = this.goToMatch.bind(this)

    }



    handleAwayQueryChange(event) {
        this.setState({ awayQuery: event.target.value })
    }

    handleHomeQueryChange(event) {
        // update state variables.
        this.setState({ homeQuery: event.target.value })

    }
    goToMatch(matchId) {
        window.location = `/matches?id=${matchId}`
    }

    updateSearchResults() {
        //call getMatchSearch and update matchesResults in state. 
        getMatchSearch(this.state.homeQuery, this.state.awayQuery, null, null).then(res => {
            this.setState({ matchesResults: res.results })
        })

    }

    componentDidMount() {
        getMatchSearch(this.state.homeQuery, this.state.awayQuery, null, null).then(res => {
            this.setState({ matchesResults: res.results })
        })

        getMatch(this.state.selectedMatchId).then(res => {
            this.setState({ selectedMatchDetails: res.results[0] })
        })




    }

    render() {
        return (
            <div>
                <MenuBar />
                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Home Team</label>
                            <FormInput placeholder="Home Team" value={this.state.homeQuery} onChange={this.handleHomeQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Away Team</label>
                            <FormInput placeholder="Away Team" value={this.state.awayQuery} onChange={this.handleAwayQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>

                    </Row>


                </Form>
                <Divider />
                
                <Table onRow={(record, rowIndex) => {
            return {
            onClick: event => {this.goToMatch(record.MatchId)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
            };
        }} dataSource={this.state.matchesResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                    <ColumnGroup title="Teams">
                    
                    <Column title="Home" dataIndex="Home" key="Home" sorter= {(a, b) => a.Home.localeCompare(b.Home)}/>
                    <Column title="Away" dataIndex="Away" key="Away" sorter= {(a, b) => a.Away.localeCompare(b.Away)}/> 
                    </ColumnGroup>
                    <ColumnGroup title="Goals">
                 
                    <Column title="HomeGoals" dataIndex="HomeGoals" key="HomeGoals" sorter= {(a, b) => a.HomeGoal - b.HomeGoal}/>
                    <Column title="AwayGoals" dataIndex="AwayGoals" key="AwayGoals" sorter= {(a, b) => a.AwayGoal- b.AwayGoal }/> 
                    </ColumnGroup>
                    
                    <Column title="Date" dataIndex="Date" key="Date" />
                    <Column title="Time" dataIndex="Time" key="Time" /> 
                </Table>
                
                <Divider />
                {this.state.selectedMatchDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Card>
                        <CardBody>


                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={2} style={{ textAlign: 'left' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Home}</CardTitle>

                                </Col>
                                <Col flex={2} style={{ textAlign: 'center' }}>
                                    {this.state.selectedMatchDetails.Date} at {this.state.selectedMatchDetails.Time}
                                </Col>
                                
                                <Col flex={2} style={{ textAlign: 'right' }}>
                                    <CardTitle>{this.state.selectedMatchDetails.Away}</CardTitle>

                                </Col>
                        
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedMatchDetails.HomeGoals}</h3>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals
                                </Col >
                                {/* TASK 14: Add a column with span = 9, and text alignment = right to display the # of goals the away team scored - similar 1 in this row */}
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h3>{this.state.selectedMatchDetails.AwayGoals}</h3>
                                </Col >

                    
                            </Row>
                            
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.HTHomeGoals}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Goals At Half Time
                                </Col >
                                
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.HTAwayGoals}</h5>
                                </Col >

                    
                            </Row>

                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                <Progress value={this.state.selectedMatchDetails.ShotsOnTargetHome * 100 / this.state.selectedMatchDetails.ShotsHome}>{this.state.selectedMatchDetails.ShotsOnTargetHome} / {this.state.selectedMatchDetails.ShotsHome}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Shot Accuracy
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    {/* add a progress bar to display the shot accuracy for the away team */}
                                    
                                <Progress value={this.state.selectedMatchDetails.ShotsOnTargetAway * 100 / this.state.selectedMatchDetails.ShotsAway}>{this.state.selectedMatchDetails.ShotsOnTargetAway} / {this.state.selectedMatchDetails.ShotsAway}</Progress>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Corners
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.CornersAway}</h5>
                                </Col>
                            </Row>
                            
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Fouls Cards 
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.FoulsAway}</h5>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.RCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Red Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.RCAway}</h5>
                                </Col>
                            </Row>
                            
                            <Row gutter='30' align='middle' justify='center'>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h5>{this.state.selectedMatchDetails.YCHome}</h5>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' }}>
                                    Yellow Cards
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                    <h5>{this.state.selectedMatchDetails.YCAway}</h5>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                    
                </div> : null}
                <Divider />

            </div>
        )
    }
}

export default MatchesPage

