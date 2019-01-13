/**
 * Summary: GridRow
 * Description: Grid Row component
 * @author Pawan Gupta
 * @date  14.03.2018
 */

import React, { Component } from 'react';
import { FormControl, DropdownButton, MenuItem, Tooltip, OverlayTrigger } from 'react-bootstrap';
import DynamicTooltip from '../../../../common/tooltip/CategoryReactToolTip'
import { _global } from '../../../../../helpers'

let astrik = "";
const GridHoc = (props) => props.children;
const toolTipProperties = { place:"top", type:"", className:"" ,ariaHaspopup:"true" }

/**
 * @name GridRow
 * @extends React.Component
 */
class GridRow extends Component {
    constructor(props){
        super(props);
        this._protoMouseDown=this._protoMouseDown.bind(this);
    }
   _protoMouseDown(row, index, gridId, event) {
        this.props._protoMouseDown(row, index, gridId, event);
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
        if (!_global.handleNumberMaxLength(event) && event.target.className.search("sortOrder") >= 0) {
            return;
        }
        row[event.target.name]["value"] = event.target.value;
        this.props.onChange(row, index, gridId, event);
    }

    /**
    * Description: render to html 
    * @param {null}
    * @return {string}
    */
    render() {
        return (
            this.props.length ?<tr>
                    {Object.keys(this.props.columnDefs).map((cell, cellIndex) => {
                        if ((cell !== 'actions' && cell !== 'order') && this.props.columnDefs[cell].display) {
                            return <td key={cellIndex}>
                                {
                                    (this.props.columnDefs[cell].type === "dropdown") ?
                                        <span className="mandatory-wrapper"><span className="mandatory">{astrik = "*"}</span><FormControl value={this.props.row[cell].value} componentClass="select" placeholder="select" id={cell} name={cell} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} onClick={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} onKeyUp={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} onBlur={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)}>
                                            {
                                                this.props.prototypes.map((item, index) => {

                                                    return (<option key={index} value={item.selector} >{item.selector}</option>)

                                                })
                                            }
                                            {this.props.submitted && !this.props.row[cell].value &&
                                                <div id="error-technicalNameStart" className="error-message"> Field is required.</div>
                                            }
                                        </FormControl></span>
                                        :
                                        (_global.isEmpty(this.props.row[cell].value) && this.props.row[cell].mandatory) ?
                                            <span className="mandatory-wrapper"><span className="mandatory">{astrik = "*"}</span>{(cell === "qtvalue" || cell === "value") && <DynamicTooltip reactToolTipProperties={toolTipProperties} row={this.props.row} externalId={this.props.row[cell].value} category={this.props.categoryName} id={cell + this.props.index}></DynamicTooltip>}<FormControl onMouseOver={(cell === "qtvalue" || cell === "value") ? this.props.handleOnMouseOver && this.props.handleOnMouseOver.bind(this, this.props.row, cell) : undefined} data-tip data-for={cell + this.props.index}  type="text" maxLength={this.props.columnDefs[cell].maxlen} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} id={cell + this.props.index} value={this.props.row[cell].value} name={cell} placeholder="" /></span> :
                                            (this.props.row["add"] && this.props.row[cell].mandatory) ?
                                                <span className="mandatory-wrapper"><span className="mandatory">{astrik = "*"}</span>
                                                {(cell === "qtvalue" || cell === "value") && <DynamicTooltip reactToolTipProperties={toolTipProperties}  row={this.props.row} externalId={this.props.row[cell].value} category={this.props.categoryName} id={cell + this.props.index}></DynamicTooltip>}
                                                <FormControl onMouseOver={(cell === "qtvalue" || cell === "value") ? this.props.handleOnMouseOver && this.props.handleOnMouseOver.bind(this, this.props.row, cell) : undefined} data-tip data-for={cell + this.props.index} type="text" maxLength={this.props.columnDefs[cell].maxlen} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} id={cell + this.props.index} name={cell} value={this.props.row[cell].value} placeholder="" /></span>
                                                : (!this.props.row[cell].mandatory && this.props.columnDefs[cell].edit) ? <span className="mandatory-wrapper"><span className="mandatory">{astrik = ""}</span>{(cell === "qtvalue" || cell === "value") && <DynamicTooltip reactToolTipProperties={toolTipProperties} row={this.props.row} externalId={this.props.row[cell].value} category={this.props.categoryName} id={cell + this.props.index}></DynamicTooltip>}<FormControl onMouseOver={(cell === "qtvalue" || cell === "value") ? this.props.handleOnMouseOver && this.props.handleOnMouseOver.bind(this, this.props.row, cell) : undefined} data-tip data-for={cell + this.props.index} type="text" maxLength={this.props.columnDefs[cell].maxlen} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} id={cell + this.props.index} value={this.props.row[cell] && this.props.row[cell].value?this.props.row[cell].value:''} name={cell} placeholder="" /></span>
                                                    :
                                                    (this.props.columnDefs[cell].mandatory && this.props.columnDefs[cell].edit) ?
                                                        <span className="mandatory-wrapper"><span className="mandatory">{astrik = "*"}</span>{ (cell === "qtvalue" || cell === "value") && <DynamicTooltip reactToolTipProperties={toolTipProperties}  row={this.props.row} externalId={this.props.row[cell].value} category={this.props.categoryName} id={cell + this.props.index}></DynamicTooltip>}<FormControl onMouseOver={(cell === "qtvalue" || cell === "value") ? this.props.handleOnMouseOver && this.props.handleOnMouseOver.bind(this, this.props.row, cell) : undefined} data-tip data-for={cell + this.props.index} type="text" maxLength={this.props.columnDefs[cell].maxlen} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} id={cell + this.props.index} name={cell} value={this.props.row[cell].value} placeholder="" /></span>
                                                        :
                                                        this.props.columnDefs[cell].edit ?
                                                            <span className="mandatory-wrapper"><span className="mandatory">{astrik = ""}</span>{(cell === "qtvalue" || cell === "value") && <DynamicTooltip reactToolTipProperties={toolTipProperties} row={this.props.row} externalId={this.props.row[cell].value} category={this.props.categoryName} id={cell + this.props.index}></DynamicTooltip>}<FormControl onMouseOver={(cell === "qtvalue" || cell === "value") ? this.props.handleOnMouseOver && this.props.handleOnMouseOver.bind(this, this.props.row, cell) : undefined} data-tip data-for={cell + this.props.index} type="text" maxLength={this.props.columnDefs[cell].maxlen} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} id={cell + this.props.index} value={this.props.row[cell].value} name={cell} placeholder="" /></span>
                                                            : this.props.row[cell].value
                                }
                                {this.props.submitted && !this.props.row[cell].value && (astrik === "*") &&
                                    <div id="error-technicalNameStart" className="error-message"> Field is required.</div>
                                }
                            </td>
                        } else {
                            return false;
                        }
                    })}
                    {
                        this.props.columnDefs.order && this.props.id === 'coreGrid' ? <GridHoc>
                            <td>
                                <FormControl name="sortorder" id={"sort_" + this.props.index + this.props.id} className="sortOrder" type="number" min="0" max="99" onBlur={this.props.blurSortOrder.bind(this, this.props.row, this.props.index, this.props.id)} onChange={this.onChange.bind(this, this.props.row, this.props.index, this.props.id)} value={this.props.row.sortorder.value} placeholder="" maxLength="2" />
                                {this.props.sortError && parseInt(this.props.sortErrorIndex, 10) === parseInt(this.props.index, 10) &&
                                    <div id="error-technicalNameStart" className="error-message"> Sort Order cannot have value more than 99 and no duplicates are allowed.</div>
                                }
                            </td></GridHoc> : false
                    }
                    <td className="grid-options">
                        {
                            this.props.columnDefs.actions ?

                                this.props.columnDefs.actions.list.length > 1 ?
                                    <DropdownButton bsStyle="default" title="" noCaret id="dropdown-no-caret" className="fa fa-ellipsis-h">
                                        {
                                            this.props.columnDefs.actions.list.map((action, index) => {
                                                return <MenuItem key={index} eventKey={index} onClick={() => { return this.props.optionHandler(action, this.props.row) }}>{action.label}</MenuItem>
                                            })
                                        }
                                    </DropdownButton>
                                    :
                                    <button id="removeStart" disabled={this.props.mandatory ? true : false} className="btn btn-default icon-button" aria-label="Left Align" onClick={this.props.delete.bind(this, this.props.row, this.props.index, this.props.id)}><span className="fa fa-minus" aria-hidden="true">{this.props.columnDefs.actions.list[0].action.label} </span></button>
                                : ''
                        }
                        {
                            this.props.columnDefs.order && this.props.id === 'coreGrid' ? <OverlayTrigger placement="top" overlay={<Tooltip id="cloneTooltip">Clone</Tooltip>}><button flag="sortOrder" className="btn btn-default icon-button" onClick={this.props.clone.bind(this, this.props.row, this.props.index, this.props.id)}><span className="fa fa-clone" aria-hidden="true" > </span></button></OverlayTrigger> : ""
                        }
                    </td>
                </tr> :
                <tr>
                    <td colSpan={Object.keys(this.props.columnDefs).filter((col) => {
                        return this.props.columnDefs[col].display === true
                    }).length}></td>
                </tr>
        )
    }
}

export default GridRow;