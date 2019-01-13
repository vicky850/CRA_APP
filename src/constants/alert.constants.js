/**
* Summary: alertConstants, messageConstants constant
* Description: define the alertConstants, messageConstants
* @author Pawan Gupta
* @date  08.03.2018
*/

export const alertConstants = {
    SUCCESS: 'success',
    ERROR: 'danger',
    CLEAR: 'ALERT_CLEAR'
};

export const messageConstants = {
    CONFIRM_NAVIGATION: 'Are you sure you want to leave this page?',
    SUCCESSFULL_CREATE_MESSAGE: 'Client Created Successfully.',
    CONFIRM_DELETE: 'Do you want to delete this Item?',
    SUCCESSFULL_DELETE_MESSAGE: 'Deleted successfully.',
    SUCCESSFULL_UPDATE_MESSAGE: 'Updated successfully.',
    ERROR_EXTERNALID_ALREADY_EXIST: 'External Id already exists.',
    CONFIRM_DUPLICATE_PARAMETERS_NAMEVALUESORTORDER: 'Duplicate parameters (i.e. Actual Parameter Name/Value and Value/Sort Order ) exits. Are you sure you want to continue?',    
    CONFIRM_DUPLICATE_PARAMETERS_NAMEVALUE: 'Duplicate parameters (i.e. Actual Parameter Name/Value ) exits. Are you sure you want to continue?',    
    CONFIRM_DUPLICATE_PARAMETERS_VALUESORTORDER: 'Duplicate parameters (i.e. Value/Sort Order) exits. Are you sure you want to continue?',
    CONFIRM_REPLACE_PARAMETERS: "This action will remove or replace existing parameters - are you sure?"
    
};