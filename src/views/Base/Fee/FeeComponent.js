import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import ReactDataGrid from "react-data-grid";
import { Editors } from "react-data-grid-addons";
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
    Label, Table,
    Row, Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';

import { clientActions } from '../../../actions/client.actions';
import { alertConstants, messageConstants } from '../../../constants/alert.constants';
import { customErrorConst } from '../../../constants/error.constants';



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
  { key: "month", name: "Year", editor: monthValuesEditor, sortDescendingFirst: true, frozen: true },
  { key: "returntype", name: "Month", editor: returnTypeEditor },
  { key: "dateofreceipt", name: "Particulars", editable: true },
  { key: "comunicationmode", name: "Amount due", editor: communicationTypeEditor },
  { key: "personincaselatereturn", name: "Received Amount", editable: true },
  { key: "typeofpendancy", name: "Settled", editor: pendancyTypeEditor },
  { key: "fillingdate", name: "Receipt No.", editable: true },
  { key: "filledby", name: "Date of Reciept" },
  { key: "efillcategory", name: "In which Account", editor: efillCategoryEditor },
  { key: "remarks", name: "Remarks(GTO etc.)", editable: true}
  
].map(c => ({ ...c, ...defaultColumnProperties }));;

columns[0].width = 40;


class ClientMenu extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleFade = this.toggleFade.bind(this);
        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            success: false,
            clients: [],
            model: false,
            rows: [],
            currentClient: {}
        };
        this.clientRef = db.database().ref('ClientDetails');
        this.toggleSuccess = this.toggleSuccess.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
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
    toggleFade() {
        this.setState((prevState) => { return { fadeIn: !prevState } });
    }
    componentDidMount() {
        let self = this;
        let clients = [];
        // this.clientRef.orderByChild("clientname").on("child_added", function (data) {
        //     clients.push(data.val().clientname);
        //     self.setState({ clients: clients })
        // });
        this.getClients();
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
    getClientInfo = (e) => {
        if (e.target.selectedIndex > 0) {
            let filenumber = this.state.clients[e.target.selectedIndex - 1].filenumber;
            let currentClient = this.state.clients[e.target.selectedIndex];
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
                                            self.setState({ ...clientInfoData[0], rows: efileRowData, currentClient: currentClient });
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
    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        const rows = this.state.rows.slice();
        this.setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
    };
    handleChange = (e) => {
        let self = this;
        if (e.target.id = "firm-name") {
            let queryVal = e.target.value;
            let clientDetails = {};
            this.clientRef.orderByChild("clientname").equalTo(queryVal).on("child_added", function (data) {
                clientDetails = data.val();
                if (clientDetails) {
                    self.fillDetails(clientDetails);
                }
            });
        }
    }
    fillDetails = (formdata) => {
        console.log(formdata);
    }
    generateClients = (props) => {
        return props.map(client => {
            return (
                <option key={client.filenumber} value={client.filenumber}>
                    {client.filenumber}
                </option>
            )
        })
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
        return (
            <Form onChange={(e) => this.handleChange(e)} onSubmit={(e) => this.toggleModal(e)}>
                <div className="animated fadeIn">
                    <Row>
                        <Col xs="12" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>Fee Ledger</strong>
                                    <small></small>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="firmname">File Number</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="select" name="firmname" id="firmname" onChange={(e) => this.getClientInfo(e)}>
                                                    <option value="--Select--">--Select--</option>
                                                    {
                                                        this.generateClients(this.state.clients)
                                                    }
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="firmname">Firm Name</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="firmname" value={this.state["firmname"]} disabled />
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
                                                <Label htmlFor="schemegst">Composition scheme GST</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="schemegst" value={this.state["schemegst"]} disabled />
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
                                                <Label htmlFor="feestype">Fees Type</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="feestype" value={this.state["feestype"]} disabled /></FormGroup></Col>
                                    </Row>
                                    <Row>
                                    <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="account">Account</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="account" value={this.state.currentClient["account"]} disabled />
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="cancelledwef">Cancelled w.e.f</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="cancelledwef" value={this.state.currentClient["cancelledwef"]} disabled />
                                            </FormGroup>
                                        </Col>

                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>Fee Ledger</strong>
                                </CardHeader>
                                <CardBody>

                                    <i onClick={(e) => this.addRow(e)} className="fa fa-plus-square" style={{ cursor: "pointer", backgroundColor: "green", fontSize: "x-large" }}></i>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <div>
                                                <ReactDataGrid
                                                    columns={columns}
                                                    maxHeight={100}
                                                    maxWidth={400}
                                                    rowGetter={i => this.state.rows[i]}
                                                    rowsCount={this.state.rows.length}
                                                    onGridRowsUpdated={this.onGridRowsUpdated}
                                                    enableCellSelect={true}
                                                    getCellActions={this.getCellActions}
                                                    emptyRowsView={EmptyRowsView}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>On Account Detail</strong>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <Table hover bordered striped responsive size="sm">
                                                <thead>
                                                    <tr>
                                                        <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Amount Recd.</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                                                        <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Date</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                                                        <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Reciept Number</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: 500 }}> <FormGroup>
                                                            <Input type="text" id="amount-received" name="amount-received" placeholder="amount received" />
                                                        </FormGroup></td>
                                                        <td style={{ width: 500 }}> <FormGroup>
                                                            <Input type="text" id="reciept-date" name="reciept-date" placeholder="reciept-date" />
                                                        </FormGroup></td>
                                                        <td style={{ width: 500 }}> <FormGroup>
                                                            <Input type="text" id="reciept-number" name="reciept-number" placeholder="reciept-number" />
                                                        </FormGroup></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Total Fees</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="group-firms" placeholder="Total Fees" />
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Received Fee</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="group-firms" placeholder="Received Fee" />
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Balance</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="group-firms" placeholder="Balance" />
                                            </FormGroup>
                                        </Col>
                                        {/* <Col xs="12" sm="4">
                                        <Label htmlFor="business">In which Account</Label>
                                        <Input type="select" name="business" id="business">
                                            <option value="1">Account A</option>
                                            <option value="2">Account B</option>
                                        </Input></Col> */}
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12">
                            <Card>
                                <CardHeader>
                                    <strong>Informed on</strong>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xs="12" sm="4"><FormGroup>
                                            <Label htmlFor="business">To Whom</Label>
                                            <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                            <Input type="select" name="business" id="business">
                                                <option value="1">--Select--</option>
                                                <option value="1">Person A</option>
                                                <option value="2">Person B</option>
                                            </Input></FormGroup></Col>

                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="business">Date</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="date" id="date-input" name="date-input" placeholder="date" />
                                            </FormGroup>
                                        </Col>

                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Amount</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="group-firms" placeholder="Amount" />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="4">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Given By</Label>
                                                <AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                                                <Input type="text" id="group-firms" placeholder="Given By" />
                                            </FormGroup>
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
                    <Modal isOpen={this.state.success} toggle={this.toggleSuccess}
                        className={'modal-success ' + this.props.className}>
                        <ModalHeader toggle={this.toggleSuccess}>Fee Report</ModalHeader>
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
                                                    <option value="1">--Select--</option>
                                                    <option value="1">Field A</option>
                                                    <option value="2">Field B</option>
                                                    <option value="2">Field C</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6" md="6">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Value</Label>
                                                <Input type="text" id="group-firms" placeholder="Amount" />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    {'&'}
                                    <Row>
                                        <Col xs="12" sm="6" md="6">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Filter Fields</Label>
                                                <Input type="select" name="business" id="business">
                                                    <option value="1">--Select--</option>
                                                    <option value="1">Field A</option>
                                                    <option value="2">Field B</option>
                                                    <option value="2">Field C</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="12" sm="6" md="6">
                                            <FormGroup>
                                                <Label htmlFor="ccnumber">Value</Label>
                                                <Input type="text" id="group-firms" placeholder="Amount" />
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
                </div>
            </Form>
        );
    }
}

export default ClientMenu;
