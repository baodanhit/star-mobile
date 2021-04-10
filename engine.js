var fs = require('fs');
module.exports = newEngine = (filePath, options, callback) => {
    // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err)
        // this is an extremely simple template engine
        var rendered = content.toString();
        return callback(null, rendered)
    })
}
