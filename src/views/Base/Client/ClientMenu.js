import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react'
import db from '../../../database/fire';
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row, Modal, ModalBody, ModalFooter, ModalHeader,
  PaginationItem,
  PaginationLink,
  Table,
  Pagination
} from 'reactstrap';
import { clientActions } from '../../../actions/client.actions';
import { alertConstants, messageConstants } from '../../../constants/alert.constants';
import { customErrorConst } from '../../../constants/error.constants';
import { _global } from '../../../helpers/global';
import './clientMenu.css';

const formdata = {
  "filenumber": "",
  "firmname": "",
  "groupfirms": "",
  "groupname": "",
  "businessconstitution": "",
  "directornames": "",
  "citystation": "",
  "clientaddress": "",
  "postaladdress": "",
  "branchaddressa": "",
  "branchaddressb": "",
  "tinnumber": "",
  "gstinnumber": "",
  "gstPortalmailid": "",
  "gstPortalmobileno": "",
  "jurisdictionstate": "",
  "ward": "",
  "nameauth": "",
  "businesstype": "",
  "businessnature": "",
  "companyemail": "",
  "directoremail": "",
  "authemail": "",
  "accountantemail": "",
  "accountantcontact": "",
  "personcontacta": "",
  "personcontactb": "",
  "personcontactc": "",
  "landlinenumber": "",
  "whatsappnumbera": "",
  "whatsappnumberb": "",
  "datevatliabilitya": "",
  "datevatliabilityb": "",
  "dategstliabilitya": "",
  "dategstliabilityb": "",
  "cafirmname": "",
  "caname": "",
  "cacontact": "",
  "accountantinfoname": "",
  "accountantinfocontact": "",
  "gstusername": "",
  "gstpassword": "",
  "vatusername": "",
  "vatpassword": "",
  "auditcase": "",
  "currfinturnover": "",
  "prevfinturnover": "",
  "qrtrlymnthlycurrfiscal": "",
  "qrtrlymnthlyprevfiscal": "",
  "dealexempted": "",
  "dealsupply": "",
  "schemehvat": "",
  "schemegst": "",
  "taxreversal": "",
  "gstreturnfee": "",
  "assessmentfee": "",
  "assessmentfeefree": "",
  "returnsexpensesfree": "",
  "feestype": "",
  "impdealer": "",
  "sensitivedealer": "",
  "othercomments": "",
  "rangezone": "",
  "personcontactba": "",
  "personcontactca": "",
  "personcontactaa": "",
  "whatsappnumberan": "",
  "whatsappnumberbn": "",
  "exmpsupply": "",
  "createdby": localStorage.getItem('userdata')
}

class ClientMenu extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      ...formdata,
      clients: [],
      selectedClient: {},
      submitted: false,
      collapse: true,
      fadeIn: true,
      success: false,
      model: false,
      openForm: false,
      alert: { type: null, message: null }
    };
    this.clientRef = db.database().ref('ClientDetails');
    this.fetchclientRef = db.database().ref('ClientMaster');
    this.dbRef = db.database();
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }


  handleChange = (event) => {
    const { name, value } = event.target;
    if(name==='accountantinfoname' && value==='N/A'){
      document.getElementById('accountantinfocontact').disabled=true;
    }else{
      document.getElementById('accountantinfocontact').disabled=false;
    }
    this.setState({ [name]: value.trimLeft() });
  }

  getClients = () => {
    let self = this;
    let currentuser = localStorage.getItem("userdata");
    clientActions.getClients(currentuser, false) //fetch(`http://localhost:4000/clients?createdby=${currentuser}`)
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
    let self = this;
    let clients = [];
    this.getClients();
  }
  submitForm_bk(e) {
    e.preventDefault();
    e.stopPropagation();
    let self = this;
    let formdata = this.formdata();
    if (formdata) {
      try {
        this.clientRef.push(formdata).then(function () {
          var updateClientMaster = self.fetchclientRef.orderByChild("file-number").equalTo(formdata["file-number"]);
          updateClientMaster.once("child_added", function (snapshot) {
            snapshot.ref.update({ "client-created": true });
          });
          //self.fetchclientRef.child(formdata["file-number"]).set({"client-created": true});
          self.setState({ saveEnable: false, alert: { type: alertConstants.SUCCESS, message: messageConstants.SUCCESSFULL_UPDATE_MESSAGE } })
          self.toggleModal(e);
          self.toggleForm(e, true);

          var filtered = -1;
          for (let i = 0; i < self.state.clients.length; i++) {
            if (self.state.clients[i]["file-number"] === self.state.selectedClient["file-number"]) {
              filtered = i;
              break;
            };
          }
          if (filtered > -1) {
            let clnts = self.state.clients;
            clnts.splice(filtered, 1);
            self.setState({ clients: clnts });
          }
        });
      } catch (e) {
        self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
      }
    }
  }


  submitForm(e) {
    e.preventDefault();
    e.stopPropagation();
    let formdata = this.formdata();
    if (formdata) {
      let self = this;
      clientActions.createClientInfo(formdata).then(response => {
        try {
          if (response.type === alertConstants.SUCCESS) {
            let clientInfo = { filenumber: self.state.selectedClient["filenumber"] }
            clientActions.updateClientInfo(clientInfo).then(response => {
              try {
                self.toggleModal(e);
                self.toggleForm(e, true);
                if (response.type === alertConstants.SUCCESS) {
                  var filtered = -1;
                  for (let i = 0; i < self.state.clients.length; i++) {
                    if (self.state.clients[i]["filenumber"] === self.state.selectedClient["filenumber"]) {
                      filtered = i;
                      break;
                    };
                  }
                  if (filtered > -1) {
                    let clnts = self.state.clients;
                    clnts.splice(filtered, 1);
                    self.setState({ clients: clnts });
                  }
                  self.setState({ alert: { type: alertConstants.SUCCESS, message: messageConstants.SUCCESSFULL_CREATE_MESSAGE } })
                } else {
                  self.setState({ alert: { type: alertConstants.ERROR, message: response.message } });
                }
              } catch (e) {
                self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
              }
            }).catch(err => console.log(err))
          } else {
            self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
          }
        } catch (e) {
          self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
        }
      })
        .catch(err => console.log(err))
    }
  }

  formdata() {
    const { submitted } = this.state;
    this.setState({ submitted: !submitted, alert: { type: null, message: null } });
    const allowed = Object.keys(formdata);
    const filtered = Object.keys(this.state)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: this.state[key]
        };
      }, {});
    return Object.keys(filtered).length > 0 ? { ...filtered } : false;
  }


  toggleForm = (e, toggle) => {
    let ModalState = {};
    if (toggle || e.target.nodeName !== "TH") {
      if (!this.state.openForm) {
        var selectedRow = e.target.parentElement.id.split("_")[1];
        let currentClient = this.state.clients[selectedRow];
        ModalState = { selectedClient: currentClient, filenumber: currentClient.filenumber, firmname: currentClient.firmname, openForm: !this.state.openForm };
      } else {
        ModalState = { openForm: !this.state.openForm };
      }
      this.setState(ModalState);
    } else if (toggle) {
      ModalState = { openForm: !this.state.openForm };
      this.setState(ModalState);
    }

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
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {

    return (
      <div>
        <Card>
          <CardHeader>
            <strong id="clients">Clients</strong>
          </CardHeader>
          <CardBody>
            {
              this.state.alert.message &&
              <div id="alert-messgae" className={`alert alert-${this.state.alert.type}`}>
                {this.state.alert.message}
                <button type="button" className="close" onClick={() => { this.setState({ alert: { type: null, message: null } }) }} id="closeButton" ><span>&times;</span></button>
              </div>
            }
            <Table hover bordered striped responsive size="sm" onClick={(e) => this.toggleForm(e)}>
              <thead>
                <tr>
                  <th>File Number</th>
                  <th>Firm/Trade Name</th>
                  <th>Type</th>
                  <th>Cancellation w.e.f</th>
                  <th>Account</th>
                  
                </tr>
              </thead>
              <tbody>
                {this.state.clients.map((client, index) => {
                  return (<tr className="row-hover" id={`${'client_'}${index}`} key={index}>
                    <td>{client["filenumber"]}</td>
                    <td>{client["firmname"]}</td>
                    
                    <td>{client["filetype"]}</td>
                    <td>{'20/09/2018'}</td>
                    <td>
                      <Badge color="success">Active</Badge>
                    </td>
                  </tr>)
                })}

              </tbody>
            </Table>
            <Pagination>
              <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
              <PaginationItem active>
                <PaginationLink tag="button">1</PaginationLink>
              </PaginationItem>
              <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
            </Pagination>
          </CardBody>
        </Card>
        <Modal isOpen={this.state.openForm} toggle={this.toggleForm} style={{ maxWidth: "90%" }}
          className={'modal-success ' + this.props.className}>
          <ModalHeader toggle={this.toggleForm}>Client Data</ModalHeader>
          <ModalBody>
            <Form onChange={(event) => this.handleChange(event)} onSubmit={(e) => this.toggleModal(e)}>
              <div className="animated fadeIn" >
                <Row>
                  <Col xs="12" sm="12">
                    <Card>
                      <CardHeader>
                        <Row>
                          <Col xs="12" sm="2">
                            <strong id="firmname">{this.state.selectedClient["firmname"]}</strong>
                          </Col>
                          <Col xs="12" sm="2">
                            <strong id="filenumber">{this.state.selectedClient["filenumber"]}</strong>
                          </Col>
                          <Col xs="12" sm="2">
                            <strong id="filetype">{this.state.selectedClient["filetype"]}</strong>
                          </Col>
                          <Col xs="12" sm="2">
                            <strong id="accountname">Mr. Sanjay</strong>
                          </Col>
                          <Col xs="12" sm="4">
                            <strong id="accountname">Cancellation w.e.f {'20/09/2018'}</strong>
                          </Col>
                         
                        </Row>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="groupfirms">Group Firms</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="textarea" name="groupfirms" rows="1" id="groupfirms" value={'20-ABC group, 80-XYZ group, 100-MNL group'} disabled
                               />

                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="groupname">Name of Group</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="groupname" id="groupname" placeholder="Name of Group" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4"><FormGroup>
                            <Label htmlFor="businessconstitution">Constitution of Business</Label>
                            <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                            <Input type="select" name="businessconstitution" id="businessconstitution" required defaultValue="">
                              <option value="" disabled>--Select--</option>
                              <option value="Pvt. Ltd. Company">Pvt. Ltd. Company</option>
                              <option value="Limited Company">Limited Company</option>
                              <option value="Proprietorship">Proprietorship</option>
                              <option value="Partnerhsip">Partnerhsip</option>
                              <option value="LLP">LLP</option>
                              <option value="Karta">Karta</option>
                            </Input></FormGroup></Col>

                        </Row>
                        <Row>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="directornames">Prop./Partners/Directors (Names)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="textarea" name="directornames" id="directornames" rows="1"
                                placeholder="Names separeted by comma..." /></FormGroup>
                          </Col>

                          <Col xs="12" sm="4"><FormGroup>
                            <Label htmlFor="citystation">City/Station</Label>
                            <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                            <Input type="select" name="citystation" id="citystation" required defaultValue="">
                              <option value="" disabled>--Select--</option>
                              <option value="Hisar">Hisar</option>
                              <option value="Rohtak">Rohtak</option>
                            </Input></FormGroup></Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="clientaddress">Address</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="clientaddress" id="clientaddress" placeholder="Address" />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="postaladdress">Address (Postal)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="postaladdress" id="postaladdress" placeholder="Address" />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="branchaddressa">Branch Address (1)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="branchaddressa" id="branchaddressa" placeholder="Branch Address" />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="branchaddressb">Branch Address (2)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="branchaddressb" id="branchaddressb" placeholder="Branch Address" />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="tinnumber">TIN Number </Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="tinnumber" id="tinnumber" placeholder="TIN Number" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="gstinnumber">GSTIN</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="gstinnumber" id="gstinnumber" placeholder="GSTIN" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="gstPortalmailid">Mail Id with GST Portal</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="gstPortalmailid" id="gstPortalmailid" placeholder="xyz@abc.com" required />
                            </FormGroup>
                          </Col>

                        </Row>


                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="gstPortalmobileno">Mobile No with GST Portal</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="gstPortalmobileno" id="gstPortalmobileno" placeholder="Mobile No" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="jurisdictionstate">Jurisdiction (State/Centre)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="jurisdictionstate" id="jurisdictionstate" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Banglore">Banglore</option>
                                <option value="Pune">Pune</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="ward">Ward</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="ward" id="ward" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Ward-1">Ward-1</option>
                                <option value="Ward-2">Ward-2</option>
                              </Input></FormGroup>
                          </Col>
                        </Row>
                        <Row><Col xs="12" sm="4">
                          <FormGroup>
                            <Label htmlFor="rangezone">Range</Label>
                            <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                            <Input type="select" name="rangezone" id="rangezone" required defaultValue="">
                              <option value="" disabled>--Select--</option>
                              <option value="Ward-1">Range-1</option>
                              <option value="Ward-2">Range-2</option>
                            </Input></FormGroup>
                        </Col></Row>

                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="nameauth">Name of Auth .Sig __Prop,/Partner/Director</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="nameauth" id="nameauth" placeholder="Name" />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="businesstype">Type of Business</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="businesstype" id="businesstype" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Mfg.">Mfg.</option>
                                <option value="Trading">Trading</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="businessnature">Nature of Business</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="businessnature" id="businessnature" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Nature of Business-1">Nature of Business-1</option>
                                <option value="Nature of Business-2">Nature of Business-2</option>
                              </Input></FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="companyemail">Email ID of Company/Firm</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="email" name="companyemail" id="companyemail" placeholder="jane.doe@example.com" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="directoremail">Email ID (Prop./Partner /Director)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="email" id="directoremail" name="directoremail" placeholder="jane.doe@example.com" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="authemail">Email ID (Authorized Signatory)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="email" name="authemail" id="authemail" placeholder="jane.doe@example.com" required />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="accountantemail">Email ID (Accountant)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="email" name="accountantemail" id="accountantemail" placeholder="jane.doe@example.com" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="accountantcontact">Contact No. (Firm)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="accountantcontact" id="accountantcontact" placeholder="jContact number (firm)" required />
                            </FormGroup>
                          </Col>

                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="personcontactba">Contact Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="personcontactb" id="personcontactb" placeholder="Contact number or name" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="personcontactb">Contact No.</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="personcontactb" id="personcontactb" placeholder="Contact number or name" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="personcontactca">Contact Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="personcontactc" id="personcontactc" placeholder="Contact number or name" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="personcontactc">Contact No.</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="personcontactc" id="personcontactc" placeholder="Contact number or name" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="personcontactaa">Contact Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="personcontactc" id="personcontactc" placeholder="Contact number or name" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="personcontacta">Contact No.</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="personcontacta" id="personcontacta" placeholder="Contact number or name" required />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>


                          

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="landlinenumber">Land Line No. </Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="landlinenumber" id="landlinenumber" placeholder="Land Line No." required />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="whatsappnumbera">Whatsapp Name 1</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="whatsappnumbera" id="whatsappnumbera" placeholder="Whatsapp No. (Name)" required />

                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="whatsappnumberan">Whatsapp No.</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="whatsappnumberan" id="whatsappnumberan" placeholder="Whatsapp No. (Name 1)" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="whatsappnumberb">Whatsapp Name 2</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="whatsappnumberb" id="whatsappnumberb" placeholder="Whatsapp No. (Name)" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="whatsappnumberbn">Whatsapp No.</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="whatsappnumberbn" id="whatsappnumberbn" placeholder="Whatsapp No. (Name 2)" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="datevatliabilitya">Date of Liabilty (VAT) </Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="date" id="datevatliabilitya" name="datevatliabilitya" placeholder="date" />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="datevatliabilityb">Date of Validity (VAT) </Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="date" id="datevatliabilityb" name="datevatliabilityb" placeholder="date" />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="dategstliabilitya">Date of Liabilty (GST)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="date" id="dategstliabilitya" name="dategstliabilitya" placeholder="date" />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="dategstliabilityb">Date of Validity (GST)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="date" id="dategstliabilityb" name="dategstliabilityb" placeholder="date" />
                            </FormGroup>
                          </Col>
                        </Row><Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="cafirmname">CA. Firm Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="cafirmname" id="cafirmname" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Firm Name-1">Firm Name-1</option>
                                <option value="Firm Name-2">Firm Name-2</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="caname">Name of CA</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="caname" id="caname" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="CA Name-1">CA Name-1</option>
                                <option value="CA Name-2">CA Name-2</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="cacontact">CA Contact Number</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="cacontact" id="cacontact" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="CA Number-1">CA Number-1</option>
                                <option value="CA Number-2">CA Number-2</option>
                              </Input></FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="accountantinfoname">Accountant Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="accountantinfoname" id="accountantinfoname" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Name-1"> Name-1</option>
                                <option value="Name-2"> Name-2</option>
                                <option value="N/A"> N/A</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="accountantinfocontact">Accountant Contact No.</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                             <Input type="text" name="accountantinfocontact" id="accountantinfocontact" placeholder="Accountant Contact No." required />
                              </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="gstusername">GST User Name </Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="gstusername" id="gstusername" placeholder="GST User name" required />
                            </FormGroup>
                          </Col>
                        </Row>


                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="gstpassword">GST Password</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="gstpassword" id="gstpassword" placeholder="GST Password" required />
                            </FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="vatusername">VAT User Name</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="vatusername" id="vatusername" placeholder="VAT User Name" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="vatpassword">VAT Password</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="text" name="vatpassword" id="vatpassword" placeholder="VAT Password" required />
                            </FormGroup>
                          </Col>
                        </Row>


                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="auditcase">Audit Case</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="auditcase" id="auditcase" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="currfinturnover">Turnover in Preceding Fiscal Year (2018-19)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="number" name="currfinturnover" id="currfinturnover" placeholder="Turnover" required />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="prevfinturnover">Turnover in Pre-Preceding Fiscal Year (2017-18)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="number" name="prevfinturnover" id="prevfinturnover" placeholder="Turnover" required /></FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="qrtrlymnthlycurrfiscal">Quarterly/Monthly in Current Year(2018-19)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="qrtrlymnthlycurrfiscal" id="qrtrlymnthlycurrfiscal" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Quarterly</option>
                                <option value="No"> Monthly</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="quartrlyprevturnover">Quarterly/Monthly in Previous Year(2017-18)</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="quartrlyprevturnover" id="quartrlyprevturnover" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="2017-18"> Quarterly</option>
                                <option value="2016-17"> Monthly</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="dealexempted">Deals in purely exempted supplies</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="dealexempted" id="dealexempted" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                        </Row>

                        <Row>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="dealsupply">Deals in almost unregd. supplies</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="dealsupply" id="dealsupply" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="exmpsupply">Deals mostly in exempted and unregd supplies</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="exmpsupply" id="exmpsupply" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="schemehvat">Composition scheme HVAT </Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="schemehvat" id="schemehvat" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="schemegst">Composition scheme GST</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="schemegst" id="schemegst" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                        </Row>

                        <Row>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="taxreversal">Reversal of Input Tax</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="taxreversal" id="taxreversal" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>

                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="gstreturnfee">GST Return Fees Structure</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="gstreturnfee" id="gstreturnfee" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="500"> 500</option>
                                <option value="750"> 750</option>
                                <option value="1000"> 1000</option>
                                <option value="1500"> 1500</option>
                                <option value="2000"> 2000</option>
                                <option value="2500"> 2500</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="assessmentfee">Assessment Fees Structure</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="assessmentfee" id="assessmentfee" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="500"> 500</option>
                                <option value="750"> 750</option>
                                <option value="1000"> 1000</option>
                              </Input></FormGroup>
                          </Col>

                        </Row>

                        <Row>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="assessmentfeefree">Assessment Fees Free</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="assessmentfeefree" id="assessmentfeefree" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="returnsexpensesfree">Returns Expenses free</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="returnsexpensesfree" id="returnsexpensesfree" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="feestype">Fees</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="feestype" id="feestype" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Bills"> Bills</option>
                                <option value="Regular"> Regular</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="impdealer">Important Dealer</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="impdealer" id="impdealer" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                          <Col xs="12" sm="4">
                            <FormGroup>
                              <Label htmlFor="sensitivedealer">Is Return of Dealer Sensitive</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="select" name="sensitivedealer" id="sensitivedealer" required defaultValue="">
                                <option value="" disabled>--Select--</option>
                                <option value="Yes"> Yes</option>
                                <option value="No"> No</option>
                              </Input></FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs="12" sm="12">
                            <FormGroup>
                              <Label htmlFor="othercomments">Other comments</Label>
                              <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                              <Input type="textarea" id="othercomments" name="othercomments" placeholder="Comments" />
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
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default ClientMenu;
