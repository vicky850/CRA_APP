export const _global = {
    isEmpty,
    isEmptyObject,
    handleNumberMaxLength,
    leftTrim,
    cancelHandle,
    scrollToElement,
    getValue,
    getMax
};

/**
 * Description: isEmpty will check the empty value
 * @param {string} _param
 * @return {boolean}
 */
function isEmpty(_param) {
    return (_param === 'undefined' || _param === undefined || _param === '' || _param === null);
}

/**
 * Description: isEmptyObject will check the empty object
 * @param {object} _obj
 * @return {boolean}
 */
function isEmptyObject(_obj) {
    if (_obj == null) return true;// null and undefined are "empty"
    if (_obj.length > 0) return false;
    if (_obj.length === 0) return true;
    for (var key in _obj) {
        if (hasOwnProperty.call(_obj, key)) return false;
    }
    return true;
}

/**
 * Description: leftTrim will trim of string
 * @param {string} _str
 * @return {string}
 */
function leftTrim(_str) {
    return _str.replace(/^\s+/, "");
}

function handleNumberMaxLength(_event) {
    if (_event.target.hasAttribute("maxLength") && _event.target.type === "number") {
        if ((_event.target.value.toString().length > parseInt(_event.target.maxLength, 10))) {
            return false;
        }
        if (!isEmpty(_event.nativeEvent.data) && !Number.isInteger(parseInt(_event.nativeEvent.data, 10))) {
            _event.target.value = "";
            return false;
        }
    }
    return true;
}

function cancelHandle(flag, callback, self) {
    if (flag === false) {
        window.history.go(-1);
    }
    else {
        if (self && callback) {
            callback(self);
        }
    }
}

function scrollToElement(e) {
    return false;
}

/**
* Description: get value from object
* @param {object}   obj
* @return {number}
*/
function getValue(obj) {
    return obj.sortorder.value;
}

/**
* Description: get value from object
* @param {number}   param1
* @param {number}   param2
* @return {number}
*/    
function getMax(param1, param2)
{
    return Math.max(param1, param2);
}
