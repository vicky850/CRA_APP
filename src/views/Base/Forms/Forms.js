import React, { Component, useState } from 'react';
import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";
import PageGuide from "./PageGuide";

import { AppSwitch } from '@coreui/react';
import db from '../../../database/fire';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal, ModalBody, ModalFooter, ModalHeader, Pagination, PaginationItem, PaginationLink, Row
} from 'reactstrap';

import { clientActions } from '../../../actions/client.actions';
import { alertConstants, messageConstants } from '../../../constants/alert.constants';
import { customErrorConst } from '../../../constants/error.constants';
import { _global } from '../../../helpers/global';

import Grid from './ReactGrid';



const gridMetaData = {
  'qtname': { 'label': 'Name', 'display': true, 'type': 'text', 'mandatory': true, 'edit': false, maxlen: 50 },
  'qtparam': { 'label': 'Actual Parameter Name', 'display': true, 'type': 'text', 'mandatory': true, 'edit': false, maxlen: 30 },
  'qtprototype': { 'label': 'Prototype', 'display': true, 'type': 'dropdown', 'mandatory': false, 'edit': false },
  'qtvalue': { 'label': 'Value', 'display': true, 'type': 'text', 'mandatory': true, 'edit': true, maxlen: 50 },
  'qtresponsible': { 'label': 'Responsible', 'display': true, 'type': 'text', 'mandatory': true, 'edit': false },
  'actions': {
    'label': 'Action', 'display': true, 'list': [
      { 'action': 'delete', 'label': '---' }
    ]
  }
}

const formdata = {
  "filenumber": "",
  "citystation": "",
  "gstinnumber": "",
  "clientaddress": "",
  "qrtrlymnthlycurrfiscal": "",
  "prevfinturnover": "",
  "dealexempted": "",
  "schemegst": "",
  "gstreturnfee": "",
  "taxreversal": "",
  "schemegst": "",
  "groupfirms": "",
  "groupname": "",
  "returnsexpensesfree": ""
}

const FILLED_BY = localStorage.getItem('userdata');
const { DropDownEditor } = Editors;

const YEARS = ['2013-14', '2014-15', '2015-16', '2016-17', '2017-18', '2018-19'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const RETURNTYPES = ['GSTR3-B', 'GSTR-1'];
const COMM_MODE = ['OnTime-Manually', 'OnTime-Mail', 'Late-Manually', 'Late-Mail'];
const PENDANCY_TYPE = ['Pending', 'N/A'];
const E_FILL_CATEGORY = ['Exempted', 'Unregd Supplies', 'Taxable'];
const RECEIVED_BY = ['Sanjay', 'Jyoti', 'Deveraj'];

const yearValues = YEARS.map((year, index) => {
  return { id: `year${index}`, value: year }
})
const yearValuesEditor = <DropDownEditor options={yearValues} />;

const monthValues = MONTHS.map((month, index) => {
  return { id: `month${index}`, value: month }
})
const monthValuesEditor = <DropDownEditor options={monthValues} />;

const returnTypeValues = RETURNTYPES.map((returntype, index) => {
  return { id: `returntype${index}`, value: returntype }
})
const returnTypeEditor = <DropDownEditor options={returnTypeValues} />;

const communicationType = COMM_MODE.map((mode, index) => {
  return { id: `mode${index}`, value: mode }
})
const communicationTypeEditor = <DropDownEditor options={communicationType} />;

const pendancyType = PENDANCY_TYPE.map((pendancy, index) => {
  return { id: `pendancy${index}`, value: pendancy }
})
const pendancyTypeEditor = <DropDownEditor options={pendancyType} />;

const efillCategory = E_FILL_CATEGORY.map((efilltype, index) => {
  return { id: `efilltype${index}`, value: efilltype }
})
const efillCategoryEditor = <DropDownEditor options={efillCategory} />;

const feeReceivedBy = RECEIVED_BY.map((receivedby, index) => {
  return { id: `receivedby${index}`, value: receivedby }
})
const feeReceivedByEditor = <DropDownEditor options={feeReceivedBy} />;

const COLUMN_WIDTH = 140;
const defaultColumnProperties = {
  //sortable: true,
  resizable: true,
  width: COLUMN_WIDTH
};
const columns = [
  { key: "action", name: "Action", frozen: true },
  { key: "year", name: "Year", editor: yearValuesEditor, disabled: true, frozen: true },
  { key: "month", name: "Month", editor: monthValuesEditor, sortDescendingFirst: true, frozen: true },
  { key: "returntype", name: "Return Type", editor: returnTypeEditor },
  { key: "dateofreceipt", name: "Date of Return Received", editable: true },
  { key: "comunicationmode", name: "Manually/Mail", editor: communicationTypeEditor },
  { key: "personincaselatereturn", name: "Mail/Name of Person (In case of Late Returns only )", editable: true },
  { key: "typeofpendancy", name: "Type of Pendancy", editor: pendancyTypeEditor },
  { key: "fillingdate", name: "Filing Date", editable: true },
  { key: "filledby", name: "Filed By" },
  { key: "efillcategory", name: "Types of Supply", editor: efillCategoryEditor },
  { key: "gstr3bturnover", name: "Turnover(GSTR3_B)", editable: true },
  { key: "remarks", name: "Remarks(If any)", editable: true },
  { key: "correspondacedatepending", name: "Correspondence (Pending returns) Date", editable: true },
  { key: "personname", name: "Name of Person", editable: true },
  { key: "feedue", name: "Fees Due", editable: true },
  { key: "feereceived", name: "Fees Received", editable: true },
  { key: "receivedby", name: "Collected By", editor: feeReceivedByEditor },
  { key: "receiptnumber", name: "Fee Receipt No", editable: true },
  { key: "receiptdate", name: "Date", editable: true },
  { key: "accountname", name: "In Which Account", editor: feeReceivedByEditor }
].map(c => ({ ...c, ...defaultColumnProperties }));;


columns[0].width = 40;




const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
  const comparer = (a, b) => {
    if (sortDirection === "ASC") {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else if (sortDirection === "DESC") {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  };
  return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
};



const fnActions = [];
class Forms extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.state = {
      sortStatus: "",
      sortError: "",
      sortErrorIndex: "",
      collapse: true,
      fadeIn: true,
      timeout: 300,
      success: false,
      clients: [],
      model: false,
      startGrid: [],
      alert: { type: null, message: null },
      rows: [],
      setRows: function () { },
      fnActions: fnActions
    };
    this.clientRef = db.database().ref('ClientDetails');
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  //<Button color="danger" className="mr-1"><i className="fa fa-ban"></i> Reset</Button>
  getCellActions = (column, row) => {
    const cellActions = {
      action: [
        {
          icon: <i className="fa fa-remove" style={{ "color": "#d37d32", cursor: "pointer" }}></i>, //<span style={{ "backgroundColor": "#d37d32", cursor: "pointer" }}>--</span>,
          callback: (event) => {
            this.deleteRow(row);
          }
        }
      ]
    };
    return cellActions[column.key];
  }

  addRow = (e) => {
    let rows = this.state.rows;
    let fileno = this.state.filenumber;
    let firmname = this.state.firmname;
    const newdata = { filenumber: fileno, firmname: firmname, year: "2018-19", month: "January", returntype: "GSTR3-B", dateofreceipt: "", comunicationmode: "Manually", personincaselatereturn: "", typeofpendancy: "Pending", fillingdate: "", filledby: FILLED_BY, efillcategory: "Exempted", gstr3bturnover: "",remarks: "", correspondacedatepending: "", personname: "", feedue: "", feereceived: "", receivedby: "Sanjay", receiptnumber: "", receiptdate: "", accountname: "Sanjay", id: `${fileno}${firmname}2018-19January` };
    rows.push(newdata);
    this.setState({ ...rows });
  }
  deleteRow = (row) => {
    var filtered = -1;
    for (let i = 0; i < this.state.rows.length; i++) {
      if (this.state.rows[i]["year"] === row["year"] && this.state.rows[i]["month"] === row["month"] && this.state.rows[i]["id"] === row["id"]) {
        filtered = i;
        break;
      };
    }
    if (filtered > -1) {
      let rowdata = this.state.rows;
      rowdata.splice(filtered, 1);
      this.setState({ rows: rowdata });
    }
  }
  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    const rows = this.state.rows.slice();
    this.setState(state => {
      const rows = state.rows.slice();
      if (updated["fillingdate"]) {
        rows[fromRow]["typeofpendancy"] === "Pending" ? updated["fillingdate"] = "" : updated["fillingdate"] = updated["fillingdate"];
      }
      if(updated["personincaselatereturn"]){
        rows[fromRow]["comunicationmode"].includes("Late") ? updated["personincaselatereturn"] = updated["personincaselatereturn"] : updated["personincaselatereturn"] = "";
      }
      if(rows[fromRow]["comunicationmode"].includes("Late") && rows[fromRow]["personincaselatereturn"]===""){
        alert('Please enter person contact in case of late return');
      }
      if(rows[fromRow]["returntype"].includes("GSTR3-B") && rows[fromRow]["gstr3bturnover"]===""){
        alert('Please enter Turnover for GSTR3-B');
      }else if(!rows[fromRow]["returntype"].includes("GSTR3-B")){
        updated["gstr3bturnover"]="";
      }
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  componentWillUpdate() {
    //  const [rows, setRows] = useState(this.state.rows);
    //  this.setState({rows: rows, setRows: setRows});
  }

  toggleSuccess() {
    this.setState({
      success: !this.state.success,
    });
  }
  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState } });
  }
  getClients = () => {
    let self = this;
    let currentuser = localStorage.getItem("userdata");
    clientActions.getClients(currentuser, true)
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


  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value.trimLeft() });
  }

  componentDidMount() {
    let self = this;
    let clients = [];
    this.getClients();
  }
  submitEfile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let self = this;
    let formdata = this.state.rows;
    clientActions.createClientFee(formdata).then(response => {
      try {
        self.toggleModal(e);
        if (response.type === alertConstants.SUCCESS) {
          self.setState({ alert:  { type: alertConstants.SUCCESS, message: messageConstants.SUCCESSFULL_CREATE_MESSAGE } });
        } else {
          self.setState({ alert: { type: alertConstants.ERROR, message: customErrorConst.ERROR_DEFAULT } });
        }
      } catch (e) {

      }
    });

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

  toggleModal(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      modal: !this.state.modal
    });
  }
  render() {

    const EmptyRowsView = () => {
      const message = "No data to show";
      return (
        <div style={{ textAlign: "center", backgroundColor: "#ddd", padding: "100px" }}>
          {/* <img src="./logo.png" alt={message} /> */}
          <h3>{message}</h3>
        </div>
      );
    };

    //const {rows, setRows} = useState(this.state.rows);
    return (
      <Form onChange={(e) => this.handleChange(e)} onSubmit={(e) => this.toggleModal(e)}>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <strong>Client Info</strong>
                <small></small>
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
                      <Input type="select" name="filenumber" id="firmname" onChange={(e) => this.getClientInfo(e)}>
                        <option value="--Select--">--Select--</option>
                        {this.state.clients.length &&
                          this.generateClients(this.state.clients)
                        }
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="firmname">Firm Name</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="firmname" value={this.state.firmname} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="citystation">Station</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="citystation" value={this.state["citystation"]} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="gstinnumber">GSTIN</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="gstinnumber" value={this.state["gstinnumber"]} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="clientaddress">Address</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="clientaddress" value={this.state["clientaddress"]} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="qrtrlymnthlycurrfiscal">Quarterly/Monthly</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="qrtrlymnthlycurrfiscal" value={this.state["qrtrlymnthlycurrfiscal"]} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>

                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="prevfinturnover">Turnover in Preceding Fin. Year</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="prevfinturnover" value={this.state["prevfinturnover"]} disabled />
                    </FormGroup>
                  </Col>

                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="dealsupply">Almost Unregistered</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="dealsupply" value={this.state["dealsupply"]} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="dealexempted">Purely exempted</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="dealexempted" value={this.state["dealexempted"]} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="schemegst">Composition scheme GST</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="schemegst" value={this.state["schemegst"]} disabled />
                    </FormGroup>
                  </Col>

                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="gstreturnfee">GST Return Fees Structure</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="gstreturnfee" value={this.state["gstreturnfee"]} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="taxreversal">Reversal of Input Tax</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="taxreversal" value={this.state["taxreversal"]} disabled />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="groupfirms">Group Firms</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="groupfirms" value={this.state["groupfirms"]} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="groupname">Name of Group</Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="groupname" value={this.state["groupname"]} disabled />
                    </FormGroup>
                  </Col>
                  <Col xs="12" sm="4">
                    <FormGroup>
                      <Label htmlFor="returnsexpensesfree">Returns Expenses free </Label>
                      <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                      <Input type="text" id="returnsexpensesfree" value={this.state["returnsexpensesfree"]} disabled />
                    </FormGroup>
                  </Col>

                  
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                          <ModalBody>
                            Are you sure to submit the data?
                        </ModalBody>
                          <ModalFooter>
                            <Button color="primary" onClick={this.submitEfile}>Yes</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                          </ModalFooter>
                        </Modal>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
       
          <Col>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> E-Filing
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="financialyear">Year</Label>
                  <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                  <Input type="select" name="financialyear" id="financialyear">
                    <option value="1">--Select--</option>
                    <option value="2">All</option>
                    <option value="2">2017-18</option>
                    <option value="3">2018-19</option>
                  </Input>
                </FormGroup>
                <i onClick={(e) => this.addRow(e)} className="fa fa-plus-square" style={{ cursor: "pointer", backgroundColor: "green", fontSize: "x-large" }}></i>

                <Row>
                  <Col xs="12" sm="12">
                    <div>
                      <ReactDataGrid
                        columns={columns}
                        maxHeight={100}
                        rowGetter={i => this.state.rows[i]}
                        rowsCount={this.state.rows.length}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}
                        getCellActions={this.getCellActions}
                        emptyRowsView={EmptyRowsView}
                      // onGridSort={(sortColumn, sortDirection) =>
                      //   this.state.setRows(this.state.sortRows(this.state.rows, sortColumn, sortDirection))
                      // }
                      />
                      {/* <PageGuide /> */}
                    </div>
                  </Col>
                </Row>

                <Modal isOpen={this.state.success} toggle={this.toggleSuccess}
                  className={'modal-success ' + this.props.className}>
                  <ModalHeader toggle={this.toggleSuccess}>E-Filing Report</ModalHeader>
                  <ModalBody>
                    <Card>
                      <CardBody>
                        <Row>
                          <Col xs="12" sm="6" md="6">
                            <FormGroup>
                              <Label htmlFor="ccnumber">From Date</Label>
                              <Input type="date" id="date-input" name="date-input" placeholder="date" />
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="6" md="6">
                            <FormGroup>
                              <Label htmlFor="ccnumber">To Date</Label>
                              <Input type="date" id="date-input" name="date-input" placeholder="date" />
                            </FormGroup>
                          </Col>
                        </Row>
                        {'&'}
                        <Row>
                          <Col xs="12" sm="6" md="6">
                            <FormGroup>
                              <Label htmlFor="ccnumber">Filter Fields</Label>
                              <Input type="select" name="business" id="business">
                                <option value="1">Field A</option>
                                <option value="2">Field B</option>
                                <option value="2">Field C</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="6" md="6">
                            <FormGroup>
                              <Label htmlFor="ccnumber">Value</Label>
                              <Input type="text" id="groupfirms" placeholder="Amount" />
                            </FormGroup>
                          </Col>
                        </Row>
                        {'&'}
                        <Row>
                          <Col xs="12" sm="6" md="6">
                            <FormGroup>
                              <Label htmlFor="ccnumber">Filter Fields</Label>
                              <Input type="select" name="business" id="business">
                                <option value="1">Field A</option>
                                <option value="2">Field B</option>
                                <option value="2">Field C</option>
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col xs="12" sm="6" md="6">
                            <FormGroup>
                              <Label htmlFor="ccnumber">Value</Label>
                              <Input type="text" id="groupfirms" placeholder="Amount" />
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
              </CardBody >
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
            </Card >
          </Col >
        </Row >
      </Form >
    );
  }
}

export default Forms;
