var fs = require('fs');
module.exports = newEngine = (filePath, options, callback) => {
    // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err)
        // this is an extremely simple template engine
        var rendered = content.toString();
        // try {
        //     var s = content.toString().match(/@.*@/ig);
        //     console.log('target:', s);
        //     console.log(typeof (s));
        //     var myvar = s.toString().replace(/@/g, '');
        //     let regex = new RegExp(myvar, 'g');
        //     rendered = content.toString()
        //         .replace(regex, options[myvar]);
        //     console.log('$var:', myvar);
        //     console.log('regex:', regex);
        // }
        // catch (err) {
        //     console.log(err);
        //     rendered = content.toString();
        // }
        return callback(null, rendered)
    })
}
