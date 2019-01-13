import React, { Component } from 'react';
import { AppSwitch } from '@coreui/react';
import db from '../../../database/fire';
import { Table} from 'reactstrap';
import { _global } from '../../../helpers/global';
import ReactRow from './ReactRow';
class Grid extends Component {
    /**
     * Description :    State is initialised
     * @param {object}  props 
     */
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            // data: [...this.props.rowData],
            show: false,
            dataObject: {}
        }
    }
    componentWillReceiveProps(nextProps) {
        let rowData = [...nextProps.rowData];
        this.setState({ data: rowData });
    }
    delete(row, index, gridId, event) {
        let rowData = [...this.state.data];
        rowData.splice(this.state.dataObject.index, 1);
        this.setState({ data: rowData })
        this.props.delete(this.state.dataObject.row, this.state.dataObject.index, this.state.dataObject.gridId, this.state.dataObject.event);
        this.handleDismiss();
    }
    onChange(row, index, gridId, event) {
        let rowData = [...this.state.data];
        rowData.splice(index, 1);
        rowData.splice(index, 0, row);
        this.setState({ data: rowData })
        this.props.onChange(row, index, gridId, event);
    }
    render() {

        return (
            <div>

                <Table hover bordered striped responsive size="sm">
                    <thead>
                        <tr>
                            <th style={{ "width": "200px" }}>
                                <label style={{ "width": "inherit" }}>Year (By Default)</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} />
                            </th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Month</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Type of Return</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Date of Receipt</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Manually/Mail</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Mail/Name of Person/N.A</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Mail ID/ Name of Person (In case of Late Returns only)</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Challan Status</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Filing Date</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Filed By (Auto Populated field arrived from its user Login)</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Exempted/Nil /Unregd. Supplies /Taxable</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Turnover(GSTR3_B)</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Correspondence (Pending returns) Date</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Name of Person</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Month</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Fees Due</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Fees (Received)</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Received By</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Receipt No.</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Date of Receipt</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>
                            <th style={{ "width": "200px" }}><label style={{ "width": "inherit" }}>Collection By</label><AppSwitch className={'float-right mb-0 mx-1'} color={'primary'} size={'sm'} outline checked label dataOn={'\u2713'} dataOff={'\u2715'} /></th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.props.rowData.length ?
                            this.state.data.map((elem, index) => {
                                return <ReactRow row={elem} index={index}
                                    length={this.props.rowData.length}
                                    id={this.props.id}
                                    mandatory
                                    actionHandler={this.props.actionHandler}
                                    columnDefs={this.props.columnDefs}
                                    submitted={this.props.submitted}
                                    prototypes={this.props.prototypes}
                                    onChange={this.props.onChange.bind(this)}
                                    delete={this.handleShow.bind(this)} key={index}
                                    clone={this.props.clone}
                                    blurSortOrder={this.props.blurSortOrder}
                                    sortError={this.props.sortError}
                                    sortErrorIndex={this.props.sortErrorIndex}
                                    handleOnMouseOver={this.props.handleOnMouseOver}
                                    categoryName={this.props.categoryName}
                                />
                            }) : <ReactRow row={null} index={0}
                                length={0}
                                id={this.props.id}
                                columnDefs={this.props.columnDefs}
                            />}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Grid;