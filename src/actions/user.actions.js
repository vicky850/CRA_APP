/**
 * Summary: user actions
 * Description: action file for user activities on login page
 * @author Vikash Kumar.
 * @date  28.03.2018
 */
import { baseService, loginService } from '../service';
import { authHeader } from '../helpers';
import { alertActions } from './';
import { customErrorConst, httpErrorConst, validCodes, uriConstants } from '../constants';
import { responseActions } from './response.actions';

export const userActions = {
    login,
    logout,
    getTMInstance
};

/**
* Description: login request
* @param {string, string} username, password
* @return {promise} promise
*/
function login(username, password) {
    return loginService.login(authHeader(username, password)).then(
        userResponse => {
            try {
                let userData = {};
                let httpStatusCode;
                if (userResponse.hasOwnProperty("response")) {
                    userResponse = userResponse.response;
                }
                userData = userResponse["data"];
                httpStatusCode = userResponse["status"];

                if (validCodes(httpStatusCode)) {        //check error code in the response (if any)
                    if (userResponse.hasOwnProperty("headers")) {
                        let header = userResponse["headers"];
                        if (header.hasOwnProperty("access-token")) {        //successfull login
                            userData["access-token"] = header["access-token"];
                        }
                    }
                    localStorage.setItem('user', JSON.stringify(userData));
                    return successResponse(false);
                }
                if (userData.hasOwnProperty("code")) {
                    return errorResponse(customErrorConst[userData["code"]]);      //respond with custom error code
                }
                return errorResponse(httpErrorConst[httpStatusCode]);
            } catch (e) {
                return errorResponse(customErrorConst.ERROR_LOGIN);
            }
        },
        error => {
            return errorResponse(error);
        }
    );
}

/**
* Description: get TM instance
* @param {number} companyid
* @return {promise} promise
*/
function getTMInstance(companyid) {
    let url = uriConstants.TMINSTANCE + `/${companyid}/bep-mf-site`;
    return baseService.get(url, authHeader()).then(
        req_response => {
            let getResponse = responseActions.response(req_response);
            if (getResponse) {
                return getResponse;
            }
        },
        error => {
            return responseActions.errorResponse(error);
        }
    )
}
/**
* Description: error Response
* @param {string} errorMessage
* @return {object} alert object
*/
function errorResponse(errorMessage) {
    let errorMsg = (errorMessage) ? errorMessage : customErrorConst.ERROR_LOGIN;
    return alertActions.error(errorMsg);
}

/**
* Description: success Response
* @param {string/boolean} successMessage
* @return {object} alert object
*/
function successResponse(successMessage) {
    return alertActions.success(successMessage);
}

/**
* Description: logout request
* @param {null}
* @return {null}
*/
function logout() {
    loginService.logout();
}
