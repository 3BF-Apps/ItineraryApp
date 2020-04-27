import React from 'react';
import { connect } from 'react-redux';

import { Accordion, Card, InputGroup, FormControl, Form, ButtonGroup, Button, Radio } from 'react-bootstrap';

import EventResults from './EventResults.jsx';

import axios from 'axios';
//var _ = require('lodash');
import lodash from 'lodash';

class FindEventMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      search: "",
      location: "",
      free: false
    }

    this.debouncedSearch = lodash.debounce(function () {
      this.getEvents(this.state.search, this.state.location);
    }, 200);
  }


  getEvents = (text, location) => {

    const searchText = text.trim();
    const locationText = location.trim();

    let categoryQuery = searchText ? `&categories=${searchText}` : '';
    let locationQuery = locationText ? `&location=${locationText}` : ''
    let freeQuery = this.state.free ? `&is_free=${this.state.free.toString()}` : '';
    let startDate = Math.floor(Date.now() / 1000)
    // let endDate = startDate + 604800 //one week after start
    // let endDate = startDate + 86400 //one day after start



    let queryString = `/yelp/events?limit=5${categoryQuery}${locationQuery}${freeQuery}&start_date=${startDate}`;
    //let queryString = `/yelp/events?limit=5&categories=music,film`;

    if (searchText || locationText) {
      axios.get(queryString)
        .then(result => {
          this.setState({
            events: result.data.events
          });
        })
        .catch(err => console.log(err))
    }

    console.log(this.state.events);
  }


  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.debouncedSearch();
    });
    //console.log(this.state[event.target.name]);
  }

  freeToggleChange = event => {
    this.setState({
      free: event.target.checked
    }, () => {
      this.debouncedSearch();
    })
  }

  render() {
    return (
      <div id='find-events-menu-container'>
        <Accordion defaultActiveKey="0">
          <Card className="find-card">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1"><i className="fas fa-search" /> </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Search activites & events"
                aria-label="search"
                aria-describedby="basic-addon1"
                name="search"
                onChange={this.onChange}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1"><i className="fas fa-map-marker-alt" /> </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Add location"
                aria-label="location"
                aria-describedby="basic-addon1"
                name="location"
                onChange={this.onChange}
              />
            </InputGroup>

            <Accordion.Toggle as={Card.Header} eventKey="0">
              Sorting & Filters
                        </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>


                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                      Type of Activity
                                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                      <Card.Body>
                        <Form>
                          <div key={`inline-checkbox`} className="mb-3 ">
                            <Form.Check inline label="Art" type='checkbox' />
                            <Form.Check inline label="Food" type='checkbox' />
                          </div>
                          <div key={`inline-checkbox`} className="mb-3 ">
                            <Form.Check inline label="Causes" type='checkbox' />
                            <Form.Check inline label="Games" type='checkbox' />
                          </div>
                          <div key={`inline-checkbox`} className="mb-3 ">
                            <Form.Check inline label="Comedy" type='checkbox' />
                            <Form.Check inline label="Literature" type='checkbox' />
                          </div>
                        </Form>

                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                      Price
                                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                      <Card.Body>

                        <ButtonGroup className="center" size="sm">
                          <Form>
                            <Form.Check
                              type="switch"
                              id="free-switch"
                              label="Free only"
                              onChange={this.freeToggleChange}
                            />
                          </Form>
                        </ButtonGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="3">
                      Distance
                                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="3">
                      <Card.Body>
                        <div key={`inline-checkbox`} className="mb-3 ">
                          <Form.Check inline label="Bird's Eye View" type='checkbox' />
                          <Form.Check inline label="Driving" type='checkbox' />
                        </div>
                        <div key={`inline-checkbox`} className="mb-3 ">
                          <Form.Check inline label="Biking" type='checkbox' />
                          <Form.Check inline label="Walking" type='checkbox' />
                        </div>
                        <div key={`inline-checkbox`} className="mb-3 ">
                          <Form.Check inline label="Within 4 blocks" type='checkbox' />
                        </div>

                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="4">
                      Source
                                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="4">
                      <Card.Body>
                        <div key={`inline-checkbox`} className="mb-3 ">
                          <Form.Check inline label="Facebook Event" type='checkbox' />
                          <Form.Check inline label="Yelp" type='checkbox' />
                        </div>
                        <div key={`inline-checkbox`} className="mb-3 ">
                          <Form.Check inline label="Ticketmaster" type='checkbox' />
                          <Form.Check inline label="AXS" type='checkbox' />
                        </div>
                        <div key={`inline-checkbox`} className="mb-3 ">
                          <Form.Check inline label="Stubhub" type='checkbox' />
                        </div>

                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>


              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <EventResults events={this.state.events} />


      </div>
    )
  }
}

export default FindEventMenu;


