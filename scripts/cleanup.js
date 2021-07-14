const fs = require('fs');

fs.readFile('src/js/main.js', 'utf8' , (e, data) => { if (e) {}
    const lines = data.split('\n');
    let out = lines.slice(0,-6)
    out = out.join('\n');
    fs.writeFile('src/js/main.js', out, function(e){});
})