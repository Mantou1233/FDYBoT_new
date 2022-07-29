var Lipsum = require('node-lipsum');
var fs = require('fs');
var lipsum = new Lipsum();
var lipsumOpts = {
  start: 'yes',
  what: 'list',
  amount: 80
};
lipsum.getText(function(text) {
  fs.writeFile('dummy.txt', text, function(err) {
    if (err) { 
      console.error(err);
    } else {
      console.log("Wrote " + text.length + "characters!");
    }
  });
}, lipsumOpts);