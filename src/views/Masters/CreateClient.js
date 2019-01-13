import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import db from '../../database/fire';
import {
  Badge,
  Button,
  ButtonDropdown,
  Table,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row, Modal, ModalBody, ModalFooter
} from 'reactstrap';
import { AvForm, AvField, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { clientActions } from '../../actions/client.actions';
import { alertConstants, messageConstants } from '../../constants/alert.constants';
import { customErrorConst } from '../../constants/error.constants';
import { _global } from '../../helpers/global';

const formdata = {
  "firmname": "",
  "filenumber": "",
  "filetype": "",
  "account": "",
  "createdby": localStorage.getItem('userdata'),
  "clientinfo": 0
}
const ACCOUNT = ['Sanjay', 'Jyoti', 'Devraj'];

class ClientMaster extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      ...formdata,
      submitted: false,
      collapse: true,
      fadeIn: true,
      success: false,
      model: false,
      clients: [],
      groupfirms: [0],
      account: ACCOUNT,
      alert: { type: null, message: null }
    };
    this.clientRef = db.database().ref('ClientMaster');
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value.trimLeft() });
  }


  generateaccount = (props) => {
    if (props.length > 0) {
      return props.map((accountname, index) => {
        return (
          <option key={`accountname${index}`} value={accountname}>
            {accountname}
          </option>
        )
      })
    }
  }
  createClients = (e, formdata) => {
    let self = this;
    clientActions.create(formdata).then(response => {
      try {
        self.toggleModal(e);
        if (response.type === alertConstants.SUCCESS) {
          self.setState({ alert: { type: alertConstants.SUCCESS, message: messageConstants.SUCCESSFULL_CREATE_MESSAGE } })
        } else {
          self.setState({ alert: { type: alertConstants.ERROR, message: response.message } });
        }
      } catch (e) {
        self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
      }
    })
      .catch(err => console.log(err))
  }

  submitForm(e) {
    e.preventDefault();
    let formdata = this.formdata();
    if (formdata) {
      this.createClients(e, formdata);
    }
  }

  formdata() {
    const { submitted } = this.state;
    this.setState({ submitted: !submitted, alert: { type: null, message: null } });

    if (1 == 1) {
      const allowed = Object.keys(formdata);
      const filtered = Object.keys(this.state)
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: this.state[key]
          };
        }, {});
      return filtered;
    }
    return false;
  }

  toggleSuccess() {
    this.setState({
      success: !this.state.success,
    });
  }
  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }
  toggleModal(e) {
    e.preventDefault()
    this.setState({
      modal: !this.state.modal
    });
  }
  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }

  getClients = () => {
    let self = this;
    let currentuser = localStorage.getItem("userdata");
    clientActions.getAllClients()
      .then(response => {
        try {
          if (response) {
            var clients = response.message.data;
            self.setState({ clients });
          }
        } catch (e) {
          self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
        }
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getClients();
  }

  getClientInfo = (e) => {
    if (e.target.selectedIndex > 0) {
      let filenumber = this.state.clients[e.target.selectedIndex - 1].filenumber;
      let self = this;
      clientActions.getClientInfo(filenumber)
        .then(response => {
          try {
            if (response) {
              let clientInfoData = response.message.data;
              clientActions.getClientFee(filenumber)
                .then(response => {
                  try {
                    if (response) {
                      var efileRowData = response.message.data;
                      self.setState({ ...clientInfoData[0], rows: efileRowData });
                    } else {
                      self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
                    }
                  } catch (e) {
                    self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
                  }
                })
            }
          } catch (e) {
            self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
          }
        })
        .catch(err => console.log(err))
    }
  }

  generateClients = (props) => {
    if (props.length > 0) {
      return props.map(client => {
        return (
          <option key={client.filenumber} value={client.filenumber}>
            {client.filenumber}
          </option>
        )
      })
    }
  }
  render() {
    return (
      <Form onChange={(event) => this.handleChange(event)} onSubmit={(e) => this.toggleModal(e)}>
        <div className="animated fadeIn" >
          <Row>
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>Client Information</strong>
                </CardHeader>
                <CardBody>
                  {
                    this.state.alert.message &&
                    <div id="alert-messgae" className={`alert alert-${this.state.alert.type}`}>
                      {this.state.alert.message}
                      <button type="button" className="close" onClick={() => { this.setState({ alert: { type: null, message: null } }) }} id="closeButton" ><span>&times;</span></button>
                    </div>
                  }
                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="filenumber">File Number</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="filenumber" id="filenumber" placeholder="File Number" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="firmname">Client Name</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="firmname" id="firmname" placeholder="Client Name" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4"><FormGroup>
                      <Label htmlFor="filetype">File Type</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="select" name="filetype" id="filetype" required defaultValue="">
                        <option value="" disabled>--Select--</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Regular">Regular</option>
                        <option value="Self">Self</option>
                      </Input></FormGroup></Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="4"><FormGroup>
                      <Label htmlFor="acounttype">Account</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="select" name="account" id="account" required defaultValue="">
                        <option value="--Select--">--Select--</option>
                        {this.state.account &&
                          this.generateaccount(this.state.account)
                        }
                      </Input></FormGroup></Col>



                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="createdby">Created By</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="createdby" id="createdby" value={this.state["createdby"]} disabled />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalBody>
                      Are you sure to submit the data?
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={this.submitForm}>Yes</Button>{' '}
                      <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </CardBody>

              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <strong>Group Firms</strong>
                  <i onClick={(e) => this.addRow(e)} className="fa fa-plus-square" style={{ cursor: "pointer", backgroundColor: "green", fontSize: "x-large" }}></i>

                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" sm="4">

                      <Table hover bordered striped responsive size="sm">
                        <thead>
                          <tr>
                            <th>File Number</th>
                            <th>Firm/Trade Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {this.state.groupfirms.map((client, index) => {
                            return (<tr className="row-hover" id={`${'client_'}${index}`} key={index}>
                              <td><FormGroup>
                                <Label htmlFor="filenumber">File Number</Label>
                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                <Input type="select" name="filenumber" id="firmname" onChange={(e) => this.getClientInfo(e)}>
                                  <option value="--Select--">--Select--</option>
                                  {this.state.clients.length &&
                                    this.generateClients(this.state.clients)
                                  }
                                </Input>
                              </FormGroup></td>
                              <td><FormGroup>
                                <Label htmlFor="firmname">Firm Name</Label>
                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                <Input type="text" id="firmname" value={this.state.firmname} disabled />
                              </FormGroup></td>
                            </tr>)
                          })} */}

                          <tr className="row-hover" id='client_0'>
                            <td><FormGroup>
                              <Label htmlFor="filenumber_a">File Number</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="filenumber_a" id="filenumber_a" onChange={(e) => this.getClientInfo(e)}>
                                <option value="--Select--">--Select--</option>
                                {this.state.clients.length &&
                                  this.generateClients(this.state.clients)
                                }
                              </Input>
                            </FormGroup></td>
                            <td><FormGroup>
                              <Label htmlFor="firmname_a">Firm Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" id="firmname_a" value={this.state.firmname[0]} disabled />
                            </FormGroup></td>
                          </tr>
                          <tr className="row-hover" id='client_1'>
                            <td><FormGroup>
                              <Label htmlFor="filenumber_b">File Number</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="filenumber_b" id="filenumber_b" onChange={(e) => this.getClientInfo(e)}>
                                <option value="--Select--">--Select--</option>
                                {this.state.clients.length &&
                                  this.generateClients(this.state.clients)
                                }
                              </Input>
                            </FormGroup></td>
                            <td><FormGroup>
                              <Label htmlFor="firmname_b">Firm Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" id="firmname_b" value={this.state.firmname[1]} disabled />
                            </FormGroup></td>
                          </tr>
                          <tr className="row-hover" id='client_2'>
                            <td><FormGroup>
                              <Label htmlFor="filenumber">File Number</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="filenumber" id="firmname" onChange={(e) => this.getClientInfo(e)}>
                                <option value="--Select--">--Select--</option>
                                {this.state.clients.length &&
                                  this.generateClients(this.state.clients)
                                }
                              </Input>
                            </FormGroup></td>
                            <td><FormGroup>
                              <Label htmlFor="firmname">Firm Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" id="firmname" value={this.state.firmname[2]} disabled />
                            </FormGroup></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>

                  </Row>
                </CardBody>
                <CardFooter>
                  <Row>
                    <Col xs="12" sm="4"></Col>
                    <Col xs="12" sm="4"></Col>
                    <Col xs="12" sm="4">
                      <Row>
                        <Col xs="6" sm="4">
                          <Button color="success" onClick={this.toggleSuccess} className="mr-1"><i className="icon-pie-chart"></i> Report</Button>
                        </Col>
                        <Col xs="6" sm="4">
                          <Button color="danger" className="mr-1"><i className="fa fa-ban"></i> Reset</Button>
                        </Col>
                        <Col xs="6" sm="4">
                          <Button type="submit" size="m" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </Form >
    );
  }
}

export default ClientMaster;
