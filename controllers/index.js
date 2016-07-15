var fs = require('fs');
var path = require('path');
var uid = require('uid2');
var config = require('../config.js');

var TARGET_PATH = path.resolve(__dirname, '..' + config.storageDir);
var IMAGE_TYPES = ['image/jpeg', 'image/png'];

module.exports = {
  index: function(req, res, next) {
    res.render('index');
  },
  upload: function(req, res, next) {
    var is;
    var os;
    var targetPath;
    var targetName;
		var file = null;
    for (var i = 0; i < req.files.length; i++) {
				if (req.files[i].fieldname == config.formName) {
						file = req.files[i];
				}
    }
		var tempPath = file.path;
    var type = file.mimetype;
    var extension = file.originalname.split(/[. ]+/).pop();

    if (IMAGE_TYPES.indexOf(type) == -1) {
      return res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
    }

    targetName = uid(22) + '.' + extension;

    
    targetPath = path.join(TARGET_PATH, targetName);

		console.log(targetName);
		console.log(targetPath);

    is = fs.createReadStream(tempPath);

    os = fs.createWriteStream(targetPath);

    is.pipe(os);

    is.on('error', function() {
      if (err) {
        return res.send(500, 'Something went wrong');
      }
    });

    is.on('end', function() {

      fs.unlink(tempPath, function(err) {
        if (err) {
          return res.send(500, 'Something went wrong');
        }

		var url = config.protocol + '://' + config.domain + ':' + config.publicPort + config.publicUrl + targetName;
		console.log(url);
				res.redirect(url);


      });
    });
  }
};

