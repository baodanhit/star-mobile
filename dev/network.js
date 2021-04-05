var os = require('os');
var networkInterfaces = os.networkInterfaces;

var cmd = require('node-cmd');
var getSSID = () => {
    const syncData = cmd.runSync('netsh wlan show interfaces');
    var ssidstr = syncData.data.toString().split(/\n/g)[8];
    var ssidnospace = ssidstr.replace(/\s/g, '');
    var ssid = ssidnospace.split(':')[1];
    return ssid
}

module.exports = getLocalExternalIP = () => {
    let ipAddress = [].concat(...Object.values(networkInterfaces()))
        .filter(details => details.family === 'IPv4' && !details.internal)
        .pop().address;
    var wifiname = getSSID();
    return { ip: ipAddress, wifiname }

}
