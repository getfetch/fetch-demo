// Origin: https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage

// Gets an array from localStorage
function localStorageGetArray(key) {
  var data = window.localStorage.getItem(key);
  return data ? data.split(',') : [];
}

// Stores an array to localStorage
function localStorageSetArray(key, items) {
  if (!Array.isArray(items)) {
    throw new Error('localStorageSetArray: items must be an Array.');
  }
  data = items.join(',');
  window.localStorage.setItem(key, data);
}

// Pushes an item to an array stored in localStorage
function localStoragePush(key, item) {
  // TODO: Escape the item string if it contains ','
  var items = localStorageGetArray(key);
  items.push(item.toString());
  localStorageSetArray(key, items);
}

// Pops an item to an array stored in localStorage
function localStoragePop(key, item) {
  var items = localStorageGetArray(key);
  var index = items.indexOf(item.toString());
  if (index === -1) {
    return false;
  }
  items.pop(index);
  localStorageSetArray(key, items);
  return true;
}

if (!window.localStorage) {
  Object.defineProperty(window, "localStorage", new (function () {
    var aKeys = [], oStorage = {};
    Object.defineProperty(oStorage, "getItem", {
      value: function (sKey) { return sKey ? this[sKey] : null; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "key", {
      value: function (nKeyId) { return aKeys[nKeyId]; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "setItem", {
      value: function (sKey, sValue) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "length", {
      get: function () { return aKeys.length; },
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "removeItem", {
      value: function (sKey) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    this.get = function () {
      var iThisIndx;
      for (var sKey in oStorage) {
        iThisIndx = aKeys.indexOf(sKey);
        if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
        else { aKeys.splice(iThisIndx, 1); }
        delete oStorage[sKey];
      }
      for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
      for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
        aCouple = aCouples[nIdx].split(/\s*=\s*/);
        if (aCouple.length > 1) {
          oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
          aKeys.push(iKey);
        }
      }
      return oStorage;
    };
    this.configurable = false;
    this.enumerable = true;
  })());
}
