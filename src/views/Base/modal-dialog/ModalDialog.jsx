/**
 * Summary: ModalDialog
 * Description: Modal Dialog
 * @author Pawan Gupta
 * @date  2.04.2018
 */

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
require('./css/modal-dialog.css');

const ModalDialog = (props) => {
    let alertDialog = () => {
        return (
            <Modal.Dialog>
                <Modal.Body>{props.message}
                    {props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button autoFocus onClick={props.action} bsStyle="danger">Yes</Button>
                    <Button onClick={props.handleDismiss}>No</Button>
                </Modal.Footer>
            </Modal.Dialog>
        )
    }
    let popUpDialog = () => {
        return (
            <Modal.Dialog bsSize="large" className='custom-modal'>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </Modal.Dialog>
        )
    }
    return (
        <div>
            {(props.popUpType === "ALERT" && alertDialog()) || popUpDialog()}
        </div>
    )
};


ModalDialog.defaultProps = {
    action: function () { return false; },
    popUpType: "ALERT"
};
export default ModalDialog;