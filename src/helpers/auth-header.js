/**
 * Summary: auth header
 * Description: prepare header for all requests
 * @author Vikash Kumar.
 * @date  28.03.2018
 */
import { Md5 } from 'ts-md5/dist/md5';
import { _global } from './';

/**
* Description: returns header params to the request
* @param {string, string} username, password
* @return {object} Content-Type, charset, Accept, Authorization
*/
function authHeader(username, password) {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if(user["access-token"]){
            return { 'Authorization': 'Bearer ' + user["access-token"] };
        }else if(user["userId"]){
            let userdata = "Basic " + window.btoa(user["userId"]);
            return { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': userdata };
        }
    } else {
        if (!_global.isEmpty(username) && !_global.isEmpty(password)) {
            //credentials with base64 and md5 hash format
            let userdata = "Basic " + window.btoa(username + ":" + Md5.hashStr(password));
            return { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json', 'Authorization': userdata };
        }
        return false;
    }
}

export { authHeader };