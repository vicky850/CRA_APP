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
  Row, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import { clientActions } from '../../../actions/client.actions';
import { alertConstants, messageConstants } from '../../../constants/alert.constants';
import { customErrorConst } from '../../../constants/error.constants';
import { _global } from '../../../helpers/global';

class ClientMaster extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      submitted: false,
      collapse: true,
      fadeIn: true,
      timeout: 300,
      success: false,
      form: {},
      rFilenumber: "",
      snumber: '',
      model: false
    };
    this.init_snumber = 1000;
    this.init_rFilenumber = "CA-18-" + this.init_snumber;
    this.clientRef = db.database().ref('ClientDetails');
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }
  disableCtrl = () => {
    document.getElementById("cFilenumber").disabled = true;
    document.getElementById("cancelationwef").disabled = true;
  }
  enableCtrl = () => {
    document.getElementById("cFilenumber").disabled = false;
    document.getElementById("cancelationwef").disabled = false;
  }
  handleChange = (event) => {
    if (event.target.id == "filetype") {
      if (event.target.value == "Cancel") {
        //this.enableCtrl();
      } else {
        //this.disableCtrl();
      }
    }
    const { name, value } = event.target;
    this.setState({ [name]: value.trimLeft() });
  }
  handleSubmit() {
    this.setState({
      modal: !this.state.modal
    });
  }

  submitForm(e) {
    let self = this;
    e.preventDefault();
    let formdata = this.formdata();
    if (formdata) {
      try {
        this.clientRef.push(formdata).then(function () {
          self.setState({ saveEnable: false, alert: { type: alertConstants.SUCCESS, message: messageConstants.SUCCESSFULL_UPDATE_MESSAGE } })
          self.toggleModal();
        });
      } catch (e) {
        self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
      }
    }
  }

  formdata() {
    const {
      submitted
    } = this.state;
    console.log(this.state);
    this.setState({ submitted: !submitted, alert: { type: null, message: null } });

    if (1 == 1) {
      const jsonAccessPoint = {
        clientname: "vikas", ...this.state
      };
      return jsonAccessPoint;
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
  toggleModal() {
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
    // this.disableCtrl();
    let self = this;
    // this.clientRef.orderByKey().limitToLast(1).on("child_added", function (data) {
    //   let rFilenumber = self.init_rFilenumber;
    //   if (data.val()["rFilenumber"]) {
    //     let oldfile = data.val().rFilenumber;
    //     let splitoldfile = oldfile.split("-");
    //     let newfile = parseInt(splitoldfile[2]) + 1;
    //     rFilenumber = splitoldfile[0] + "-" + splitoldfile[1] + "-" + newfile;
    //   }
    //   let snumber = self.init_snumber;
    //   if (data.val()["snumber"]) {
    //     snumber = parseInt(data.val().snumber) + 1;
    //   }
    //   self.setState({ snumber: snumber, rFilenumber: rFilenumber });
    //   //self.disableCtrl();
    // });
    // this.clientRef.startAt(db.database().ServerValue.TIMESTAMP).on("child_added", function (data) {
    //   let oldfile = data.val().rFilenumber;
    //   let splitoldfile = oldfile.split("-");
    //   let newfile = parseInt(splitoldfile[2]) + 1;
    //   let rFilenumber = splitoldfile[0] + "-" + splitoldfile[1] + "-" + newfile;
    //   self.setState({ snumber: (data.val().snumber + 1), rFilenumber: rFilenumber });
    // });
  }
  componentDidUpdate() {
    //this.disableCtrl();
  }
  render() {

    return (
      <Form onChange={(event) => this.handleChange(event)}>
        <div className="animated fadeIn" >

          <Row>
            <Col xs="12" sm="12">
              <Card>
                <CardHeader>
                  <strong>New Client</strong>
                  <small></small>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="filetype">Type of File</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="filetype" id="filetype">
                          <option value="20">--Select--</option>
                          <option value="Regular">Regular</option>
                          <option value="Self">Self</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="rFilenumber">File Number</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="rFilenumber" id="rFilenumber" value={this.state.rFilenumber} required />
                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="cFilenumber">Modify File Number</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="cFilenumber" id="cFilenumber">
                          <option value="1">All Inactive Files</option>
                          <option value="CA-18-73651">73651</option>
                          <option value="CA-18-73652">73652</option>
                          <option value="CA-18-73653">SF-73653</option>
                          <option value="CA-18-73654">CA-73651</option>
                          <option value="CA-18-73655">CA-18-73655</option>
                        </Input>
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Col xs="12" sm="4"><FormGroup>
                      <Label htmlFor="group-firms">Group Firms</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="select" name="group-firms" id="group-firms">
                        <option value="20">--Select--</option>
                        <option value="20">20 --- ABC group</option>
                        <option value="80">80 --- XYZ group</option>
                        <option value="100">100 --- MNL group</option>
                      </Input>
                    </FormGroup></Col>
                    <Col xs="12" sm="4"><FormGroup>
                      <Label htmlFor="group-firms">File Assigned to</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="select" name="file-assigned" id="file-assigned">
                        <option value="20">--Select--</option>
                        <option value="20">Mr. Sanjay</option>
                        <option value="80">Ms. Jyoti</option>

                      </Input>
                    </FormGroup></Col>
                  </Row>


                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="group-name">Name of Group</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="group-name" id="group-name" placeholder="Name of Group" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="firm-name">Firm/Trade Name</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="firm-name" id="firm-name" placeholder="Firm /Trade Name" />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4"><FormGroup>
                      <Label htmlFor="business">Constitution of Business</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="select" name="business" id="business">
                        <option value="20">--Select--</option>
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
                        <Label htmlFor="dirnames">Prop./Partners/Directors (Names)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="textarea" name="dirnames" id="dirnames" rows="1"
                          placeholder="Names separeted by comma..." /></FormGroup>
                    </Col>

                    <Col xs="12" sm="4"><FormGroup>
                      <Label htmlFor="city-station">City/Station</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="select" name="city-station" id="city-station">
                        <option value="20">--Select--</option>
                        <option value="Hisar">Hisar</option>
                        <option value="Rohtak">Rohtak</option>
                      </Input></FormGroup></Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="address">Address</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="address" id="address" placeholder="Address" />
                      </FormGroup>
                    </Col>
                  </Row>



                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="postal-address">Address (Postal)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="postal-address" id="postal-address" placeholder="Address" />
                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="branch-address">Branch Address (1)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="branch-address-1" id="branch-address" placeholder="Branch Address" />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="branch-address-2">Branch Address (2)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="branch-address-2" id="branch-address-2" placeholder="Branch Address" />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="tin-number">TIN Number </Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="tin-number" id="tin-number" placeholder="TIN Number" />
                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="gstin-number">GSTIN</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="gstin-number" id="gstin-number" placeholder="GSTIN" />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="jurisdiction-state">Jurisdiction (State/Centre)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="jurisdiction-state" id="jurisdiction-state">
                          <option value="Banglore">Banglore</option>
                          <option value="Pune">Pune</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>


                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="ward">Ward</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="ward" id="ward">
                          <option value="20">--Select--</option>
                          <option value="Ward-1">Ward-1</option>
                          <option value="Ward-2">Ward-2</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="name-auth">Name of Auth .Sig __Prop,/Partner/Director</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="name-auth" id="name-auth" placeholder="Name" />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="business-type">Type of Business</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="business-type" id="business-type">
                          <option value="20">--Select--</option>
                          <option value="Mfg.">Mfg.</option>
                          <option value="Trading">Trading</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="business-nature">Nature of Business</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="business-nature" id="business-nature">
                          <option value="20">--Select--</option>
                          <option value="Nature of Business-1">Nature of Business-1</option>
                          <option value="Nature of Business-2">Nature of Business-2</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="company-email">Email ID of Company/Firm</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="email" name="company-email" id="company-email" placeholder="jane.doe@example.com" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="director-email">Email ID (Prop./Partner /Director)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="email" id="director-email" name="director-email" placeholder="jane.doe@example.com" required />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="auth-email">Email ID (Authorized Signatory)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="email" name="auth-email" id="auth-email" placeholder="jane.doe@example.com" required />
                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="accountant-email">Email ID (Accountant)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="email" name="accountant-email" id="accountant-email" placeholder="jane.doe@example.com" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="person-contact-1">Contact No.(Name)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="person-contact-1" id="person-contact-1" placeholder="Contact number or name" required />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="person-contact-2">Contact No.(Name)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="person-contact-2" id="person-contact-2" placeholder="Contact number or name" required />

                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="person-contact-3">Contact No.(Name)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="person-contact-3" id="person-contact-3" placeholder="Contact number or name" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="landline-number">Land Line No. </Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="number" name="landline-number" id="landline-number" placeholder="Land Line No." required />
                      </FormGroup>
                    </Col>
                  </Row>


                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="whatsapp-number-1">Whatsapp No. (Name)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="whatsapp-number-1" id="whatsapp-number" placeholder="Whatsapp No. (Name)" required />

                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="whatsapp-number-2">Whatsapp No. (Name)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="whatsapp-number-2" id="whatsapp-number-2" placeholder="Whatsapp No. (Name)" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="VAT-liability-date-1">Date of Liabilty (VAT) </Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="date" id="VAT-liability-date-1" name="VAT-liability-date-1" placeholder="date" />
                      </FormGroup>
                    </Col>
                  </Row>



                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="VAT-liability-date-2">Date of Liabilty (VAT) </Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="date" id="VAT-liability-date-2" name="VAT-liability-date-2" placeholder="date" />

                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="GST-liability-date-1">Date of Liabilty (GST)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="date" id="GST-liability-date-1" name="GST-liability-date-1" placeholder="date" />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="GST-liability-date-2">Date of Validity (GST)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="date" id="GST-liability-date-2" name="GST-liability-date-2" placeholder="date" />
                      </FormGroup>
                    </Col>
                  </Row>




                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="ca-firm">CA. Firm Name</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="ca-firm" id="ca-firm">
                          <option value="20">--Select--</option>
                          <option value="Firm Name-1">Firm Name-1</option>
                          <option value="Firm Name-2">Firm Name-2</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="ca-name">Name of CA</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="ca-name" id="ca-name">
                          <option value="20">--Select--</option>
                          <option value="CA Name-1">CA Name-1</option>
                          <option value="CA Name-2">CA Name-2</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="ca-contact">CA Contact Number</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="ca-contact" id="ca-contact">
                          <option value="20">--Select--</option>
                          <option value="CA Number-1">CA Number-1</option>
                          <option value="CA Number-2">CA Number-2</option>
                        </Input></FormGroup>
                    </Col>
                  </Row>





                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="accountant-info-name">Accountant Name</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="accountant-info-name" id="accountant-info-name">
                          <option value="20">--Select--</option>
                          <option value="Name-1"> Name-1</option>
                          <option value="Name-2"> Name-2</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="accountant-info-contact">Accountant Contact No.</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="accountant-info-contact" id="accountant-info-contact">
                          <option value="20">--Select--</option>
                          <option value="Contact No-1">Contact No-1</option>
                          <option value="Contact No-2">Contact No-2</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="gst-username">GST User Name </Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="gst-username" id="gst-username" placeholder="GST User name" required />
                      </FormGroup>
                    </Col>
                  </Row>


                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="gst-password">GST Password</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="gst-password" id="gst-password" placeholder="GST Password" required />
                      </FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="vat-username">VAT User Name</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="vat-username" id="vat-username" placeholder="VAT User Name" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="vat-password">VAT Password</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="vat-password" id="vat-password" placeholder="VAT Password" required />
                      </FormGroup>
                    </Col>
                  </Row>


                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="audit-case">Audit Case</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="audit-case" id="audit-case">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="curr-fin-turnover">Turnover in Preceding Financial Year (2017-18)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="curr-fin-turnover" id="curr-fin-turnover" placeholder="Turnover" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="prev-fin-turnover">Turnover in Pre-Preceding Financial Year (2016-17)</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="prev-fin-turnover" id="prev-fin-turnover" placeholder="Turnover" required /></FormGroup>
                    </Col>

                  </Row>


                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="quartrly-curr-turnover">Quarterly/Monthly in Current Year</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="quartrly-curr-turnover" id="quartrly-curr-turnover">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Quarterly</option>
                          <option value="No"> Monthly</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="quartrly-prev-turnover">Quarterly/Monthly in Previous Year</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="quartrly-prev-turnover" id="quartrly-prev-turnover">
                          <option value="20">--Select--</option>
                          <option value="2017-18"> Quarterly</option>
                          <option value="2016-17"> Monthly</option>
                        </Input></FormGroup>
                    </Col>


                    <Col xs="12" sm="4">
                      
                    </Col>

                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="deal-exempted">Deals in purely exempted goods</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="deal-exempted" id="deal-exempted">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="deal-supply">Deals in almost unregd. supplies</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="deal-supply" id="deal-supply">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>

                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="scheme-hvat">Composition scheme HVAT </Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="scheme-hvat" id="scheme-hvat">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="scheme-gst">Composition scheme GST</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="scheme-gst" id="scheme-gst">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="tax-reversal">Reversal of Input Tax</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="tax-reversal" id="tax-reversal">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="gst-return-fee">GST Return Fees Structure</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="gst-return-fee" id="gst-return-fee">
                          <option value="20">--Select--</option>
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
                        <Label htmlFor="assessment-fee">Assessment Fees Structure</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="assessment-fee" id="assessment-fee">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="assessment-fee-free">Assessment Fees Free</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="assessment-fee-free" id="assessment-fee-free">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="returns-expenses-free">Returns Expenses free</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="returns-expenses-free" id="returns-expenses-free">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="fees-type">Fees</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="fees-type" id="fees-type">
                          <option value="20">--Select--</option>
                          <option value="Bills"> Bills</option>
                          <option value="Regular"> Regular</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="imp-dealer">Important Dealer</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="imp-dealer" id="imp-dealer">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>

                  </Row>

                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="sensitive-dealer">Is Return of Dealer is Sensitive</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="select" name="sensitive-dealer" id="sensitive-dealer">
                          <option value="20">--Select--</option>
                          <option value="Yes"> Yes</option>
                          <option value="No"> No</option>
                        </Input></FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                     
                    </Col>
                    <Col xs="12" sm="4">
                     
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="gstPortal-mailid">Mail Id with GST Portal</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="gstPortal-mailid" id="gstPortal-mailid" placeholder="xyz@abc.com" required />
                      </FormGroup>
                    </Col>
                    <Col xs="12" sm="4">
                      <FormGroup>
                        <Label htmlFor="gstPortal-mobileno">Mobile No with GST Portal</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="text" name="gstPortal-mobileno" id="gstPortal-mobileno" placeholder="Mobile No" required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12">
                      <FormGroup>
                        <Label htmlFor="other-comments">Other comments</Label>
                        <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                        <Input type="textarea" id="other-comments" name="other-comments" placeholder="Comments" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Modal isOpen={this.state.success} toggle={this.toggleSuccess}
                    className={'modal-success ' + this.props.className}>
                    <ModalHeader toggle={this.toggleSuccess}>Client Report</ModalHeader>
                    <ModalBody>
                      <Card>
                        <CardBody>
                          <Row>
                            <Col xs="12" sm="6" md="6">
                              <FormGroup>
                                <Label htmlFor="ccnumber">From Date</Label>
                                <Input type="date" id="date-input" name="date-from" placeholder="date" />
                              </FormGroup>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                              <FormGroup>
                                <Label htmlFor="ccnumber">To Date</Label>
                                <Input type="date" id="date-input" name="date-to" placeholder="date" />
                              </FormGroup>
                            </Col>
                          </Row>
                          {'&'}
                          <Row>
                            <Col xs="12" sm="6" md="6">
                              <FormGroup>
                                <Label htmlFor="ccnumber">Filter Fields</Label>
                                <Input type="select" name="business" id="business">
                                  <option value="20">--Select--</option>
                                  <option value="Field A">Field A</option>
                                  <option value="Field B">Field B</option>
                                  <option value="Field C">Field C</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                              <FormGroup>
                                <Label htmlFor="value">Value</Label>
                                <Input type="text" id="value" name="value" placeholder="Amount" />
                              </FormGroup>
                            </Col>
                          </Row>
                          {'&'}
                          <Row>
                            <Col xs="12" sm="6" md="6">
                              <FormGroup>
                                <Label htmlFor="ccnumber">Filter Fields</Label>
                                <Input type="select" name="business" id="business">
                                  <option value="20">--Select--</option>
                                  <option value="Field A">Field A</option>
                                  <option value="Field B">Field B</option>
                                  <option value="Field C">Field C</option>
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col xs="12" sm="6" md="6">
                              <FormGroup>
                                <Label htmlFor="clientValue">Value</Label>
                                <Input type="text" id="clientValue" placeholder="Amount" />
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="success" onClick={this.toggleSuccess}>Generate Report</Button>{' '}
                      <Button color="secondary" onClick={this.toggleSuccess}>Cancel</Button>
                    </ModalFooter>
                  </Modal>

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
                          <Button type="submit" onClick={(e) => this.toggleModal(e)} size="m" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
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

export default ClientMaster;
