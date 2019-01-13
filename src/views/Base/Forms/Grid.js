/**
 * Summary: EditableGrid
 * Description: Editable Grid component
 * @author Pawan Gupta
 * @date  14.03.2018
 */

import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import GridRow from './grid-row/GridRow';
import { messageConstants } from '../../../../constants';
import ModalDialog from '../modal-dialog/ModalDialog';

/**
 * @name Grid
 * @extends React.Component
 */
class Grid extends Component {
    /**
     * Description :    State is initialised
     * @param {object}  props 
     */
    constructor(props) {
        super(props);
        this.state = {
            data: [...this.props.rowData],
            show: false,
            dataObject: {}
        }
    }

    /**
     * Description: hide the element 
     * @param {null}
     * @return {null}
     */
    handleDismiss() {
        this.setState({ show: false });
    }

    /**
     * Description: show the element 
     * @param {object}    row
     * @param {number}    index
     * @param {string}    gridId
     * @param {object}    event
     * @return {null}
     */
    handleShow(row, index, gridId, event) {
        let dataObject = {
            row: row, index: index,
            gridId: gridId, event: event
        }
        this.setState({ dataObject: dataObject ,  show: true });
    }

    /**
     * Description:  Set the row data
     * @param {object}    nextProps
     * @return {null}
     */
    componentWillReceiveProps(nextProps) {
        let rowData = [...nextProps.rowData];
        this.setState({ data: rowData });
    }

    /**
    * Description: Delete the Row on button click 
    * @param {object}   row
    * @param {number}   index
    * @param {string}   gridId
    * @param {object}   event
    * @return {null}
    */
    delete(row, index, gridId, event) {
        let rowData = [...this.state.data];
        rowData.splice(this.state.dataObject.index, 1);
        this.setState({ data: rowData })
        this.props.delete(this.state.dataObject.row, this.state.dataObject.index, this.state.dataObject.gridId, this.state.dataObject.event);
        this.handleDismiss();
    }

    /**
    * Description: Maintain the state for value of the row on change event.
    * @param {object}   row
    * @param {number}   index
    * @param {string}   gridId
    * @param {object}   event
    * @return {null}
    */
    onChange(row, index, gridId, event) {
        let rowData = [...this.state.data];
        rowData.splice(index, 1);
        rowData.splice(index, 0, row);
        this.setState({ data: rowData })
        this.props.onChange(row, index, gridId, event);
    }

    /**
    * Description: render to html 
    * @param {null}
    * @return {string}
    */
    render() {

        return (
            <div>
                <Table className="table">
                    <thead>
                    <tr>
                            {Object.keys(this.props.columnDefs).map((elem, index) => {
                                if (this.props.columnDefs[elem]['display']) {
                                    return <th id={'grid-col-' + elem} className={'grid-col-' + elem} key={index}>
                                        {elem === "order"?  this.props.id === 'coreGrid' ?  <div id="sort_order" onClick={
                                            this.props.sorting
                                        } ><span className="filter-option-name enable">Sort Order</span> {this.props.sortstatus === "desc"? <span className="sorting-option"><i className="fa fa fa-sort-desc"></i></span> :<span className="sorting-option"><i className="fa fa fa-sort-asc"></i></span>}</div>:"" : this.props.columnDefs[elem]['label']  } 
                                    </th>
                                } else {
                                    return false;
                                }
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.rowData.length ?
                            this.state.data.map((elem, index) => {
                                return <GridRow row={elem} index={index}
                                    length={this.props.rowData.length}
                                    id={this.props.id}
                                    mandatory={elem.qttype==="M"?true:false}
                                    actionHandler={this.props.actionHandler}
                                    columnDefs={this.props.columnDefs}
                                    submitted={this.props.submitted}
                                    prototypes={this.props.prototypes}
                                    onChange={this.props.onChange.bind(this)}
                                    delete={this.handleShow.bind(this)} key={index}
                                    clone = {this.props.clone}
                                    blurSortOrder =  {this.props.blurSortOrder}
                                    sortError =  {this.props.sortError}
                                    sortErrorIndex = {this.props.sortErrorIndex}
                                    handleOnMouseOver={this.props.handleOnMouseOver}
                                    categoryName={this.props.categoryName}
                                    />
                            }) : <GridRow row={null} index={0}
                                length={0}
                                id={this.props.id}
                                columnDefs={this.props.columnDefs}
                            />}
                    </tbody>
                </Table>
                {this.state.show &&
                    <ModalDialog message={messageConstants.CONFIRM_DELETE} action={this.delete.bind(this)} handleDismiss ={this.handleDismiss.bind(this)} data={this.state.show} />
                }
            </div>
        )
    }
}

export { Grid };
