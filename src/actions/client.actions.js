/**
 * Summary: AccessPoints action
 * Description: AccessPoints function which will called to service layer
 * @author Sumit Kumar Gupta.
 * @date  28.03.2018
 */
import { baseService } from '../service';
import { authHeader } from '../helpers';
import { uriConstants } from '../constants';
import { responseActions } from './'

/**
* Description: const accesspointActions  would be exposed so it can be accessed outside
* @param {null}
* @return {null}
*/
export const clientActions = {
    create,
    getClients,
    getAllClients,
    getClientInfo,
    createClientInfo,
    updateClientInfo,
    getClientFee,
    createClientFee
};

const URL='http://localhost:7000'; // 'https://craapp.herokuapp.com'; //
/**
* Description: accesspointActions create api would be called and handled success/error response accordingly.
* @param {json} requestData
* @return {object} successResponse, errorResponse
*/
function create(requestData) {
    //let url = uriConstants.CREATE_CLIENT;
    let url=`${URL}/clients/add`;
    return baseService.put(url, authHeader(), requestData).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}
function getAllClients(){
    let url=`${URL}/allactiveclients?clientinfo=true`;
    return baseService.get(url, authHeader()).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}

function getClients(currentuser, clientinfo){
    let url=`${URL}/api/clients?createdby=${currentuser}&clientinfo=${clientinfo}`;
    return baseService.get(url, authHeader()).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}

function getClientInfo(filenumber){
    let url=`${URL}/clientInfo?filenumber=${filenumber}`;
    return baseService.get(url, authHeader()).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}

function getClientFee(filenumber){
    let url=`${URL}/clientFee?filenumber=${filenumber}`;
    return baseService.get(url, authHeader()).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}


function createClientInfo(requestData) {
    //let url = uriConstants.CREATE_CLIENT;
    let url=`${URL}/clients/addInfo`;
    return baseService.put(url, authHeader(), requestData).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}

function createClientFee(requestData) {
    //let url = uriConstants.CREATE_CLIENT;
    let url=`${URL}/clients/addFee`;
    return baseService.put(url, authHeader(), requestData).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}


function updateClientInfo(requestData) {
    //let url = uriConstants.CREATE_CLIENT;
    let url=`${URL}/clients/updateclientInfo`;
    return baseService.post(url, authHeader(), requestData).then(
        req_response => {
           return responseActions.response(req_response);
        },
        error => { /* handle default error */
            return responseActions.errorResponse(error);
        }
    );
}