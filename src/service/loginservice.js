/**
 * Summary: login service
 * Description: middleware for login, logout and authentication
 * @author Vikash Kumar.
 * @date  28.03.2018
 */
import { baseService } from './service';
import { uriConstants } from '../constants/uri.constants';
import { history } from '../helpers';
export const loginService = {
    login,
    logout,
    authenticate
};

/**
* Description: login request
* @param {object, object} header, params
* @return {promise} promise
*/
function login(header, params) {
    let url = uriConstants.LOGIN;
    return baseService.get(url, header);
}

/**
* Description: logout request
* @param {null}
* @return {null}
*/
function logout() {
    // remove user and tmSiteName from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('tmSiteName');
}

/**
* Description: authentication request
* @param {null}
* @return {null}
*/
function authenticate() {
    //authenticate user
    try {
        var user = localStorage.getItem('user');
        user = user ? JSON.parse(user) : null;
        if (user) {
            return true;
        } else {
            history.push('/login');
        }
    } catch (e) {
        history.push('/login');
    }
}
