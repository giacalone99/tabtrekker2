/*
 * Data:
 * images_lastchosen
 * images_lastupdated
 */

function saveOption(key, value) {
    var data = {};
    data[key] = value;
    browser.storage.local.set(data);
}

function saveAllOptions(keys, vals) {
    var data = {};
    for(var i = 0; i < keys.length; i++) {
        data[keys[i]] = vals[i];
    }
    browser.storage.local.set(data);
}

function getOption(key, fn) {
    var getting = browser.storage.local.get(key);
    getting.then(function(result) {
        fn(result[key]);
    });
}

function getAllOptions(fn) {
    var getting = browser.storage.local.get();
    getting.then(fn);
}
