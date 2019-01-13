import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import db from '../../database/fire';
import {
  Badge,
  Button,
  ButtonDropdown,
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
const ACCOUNT=['Sanjay', 'Jyoti', 'Devraj'];

class AssignGroup extends Component {
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

    // fetch(`http://localhost:4000/clients/add?formdatas=${JSON.stringify(formdata)}`, formdata)
    // .then(response => {
    //     response.json().then(response => {
    //       try{
    //         if(response.data){
    //           self.setState({alert: { type: alertConstants.SUCCESS, message: messageConstants.SUCCESSFULL_UPDATE_MESSAGE } })
    //           self.toggleModal(e);
    //         }
    //       }catch(e){
    //         self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
    //       }
    //   });
    // })
    // .catch(err => console.log(err))
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
  componentWillMount() {
  }
  componentDidMount() {
  }
  componentDidUpdate() {
  }
  render() {
    return (
      <Form onChange={(event) => this.handleChange(event)} onSubmit={(e) => this.toggleModal(e)}>
        <div className="animated fadeIn" >
          <Row>
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>Client Master</strong>
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
      </Form>
    );
  }
}

export default AssignGroup;
