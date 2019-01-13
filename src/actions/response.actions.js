import {
    customErrorConst,
    httpErrorConst,
    validCodes,
    invalidToken
  } from "../constants";
  import { userActions } from "./user.actions";
  import { history } from "../helpers";
  import { alertActions } from "./";
  export const responseActions = {
    response,
    errorResponse,
    updateAccessToken,
    isTokenValid,
    successResponse
  };
  
  /**
   * Description: Get the type and its message
   * @param {object}  response
   * @return {object}
   */
  function response(response, message) {
    try {
  
      let responseData = {};
      let httpStatusCode;
      if (response.hasOwnProperty("response")) {
        response = response.response;
      }
      if (response) {
        responseData = response["data"];
        httpStatusCode = response["status"];

        // if (isTokenValid(httpStatusCode)) {
        //   if (responseData.hasOwnProperty("code")) {
        //     return errorResponse(customErrorConst[responseData["code"]], responseData["message"]);      //respond with custom error code
        //   }
        //   return errorResponse(httpErrorConst[httpStatusCode]);
        // }else{
        //   return responseData.hasOwnProperty("code") && errorResponse(customErrorConst[responseData["code"]], responseData["message"]);
        // }

        if (validCodes(httpStatusCode)) {
          if (responseData.hasOwnProperty("code")) {
            return errorResponse(customErrorConst[responseData["code"]], responseData["sqlMessage"]);      //respond with custom error code
          }
          //check error code in the response (if any)
          if (response.hasOwnProperty("headers")) {
            let header = response["headers"];
            //updateAccessToken(header);
          }
          if (message) {
            return successResponse(message);
          }
          return successResponse(response);
        }
        
      } else {
        if (isTokenValid(httpStatusCode)) {
          if (responseData.hasOwnProperty("code")) {
            return errorResponse(customErrorConst[responseData["code"]], responseData["sqlMessage"]);      //respond with custom error code
          }
        }
        return errorResponse(httpErrorConst[httpStatusCode]);
      }
    } catch (e) {
      return errorResponse(customErrorConst.ERROR_DEFAULT);
    }
  }
  
  /**
   * Description: To update the new header token into user data (in localstorage) 
   * @param {object}   header
   * @return {null}
   */
  function updateAccessToken(header) {
    if (header.hasOwnProperty("access-token")) {
      //successfull login
      let userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData["access-token"]) {
        userData["access-token"] = header["access-token"];
        localStorage.setItem("user", JSON.stringify(userData));
      }
    }
  }
  
  /**
   * Description: If invalid token comes, user redirects to login page
   * @param {number}   code
   * @return {boolean}
   */
  function isTokenValid(code) {
    if (invalidToken[code]) {
      redirectToLogin();
    } else {
      return true;
    }
  }
  
  function redirectToLogin() {
    userActions.logout();
    history.push("/");
  }
  /**
   * Description: Get the error message
   * @param {string}   errorMessage
   * @param {string}   serverMsg
   * @return {object}
   */
  function errorResponse(errorMessage, serverMsg) {
    let errorMsg = errorMessage
      ? errorMessage
      : serverMsg
        ? serverMsg
        : customErrorConst.ERROR_DEFAULT;
    return alertActions.error(errorMsg);
  }
  
  /**
   * Description: Get the success message
   * @param {string}   successMessage
   * @return {object}
   */
  function successResponse(successMessage) {
    return alertActions.success(successMessage);
  }
  