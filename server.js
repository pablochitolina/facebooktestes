// Load required packages
var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/facequiz');

var bodyParser = require('body-parser');
var userController = require('./controllers/user');
var testeController = require('./controllers/teste');
var app = express();
var router = express.Router();
var proxy = require('html2canvas-proxy');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, nome, email, id");
  next();
});

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({
  extended: true
}));

router.route('/postTeste')
  .post(testeController.postTeste);

router.route('/getTestes')
  .get(testeController.getTestes);

  router.route('/getTestePergunta')
  .get(testeController.getTestePergunta);

//router.route('/editTeste').post(testeController.editTeste);

router.route('/imagem/:imagename')
  .get(userController.getImagem);

//router.route('/backteste/:teste/:imagename').get(userController.getBackTeste);

router.route('/postImg')
  .post(userController.postImg);

//router.route('/getResult').post(testController.getResult);

router.route('/postUser')
  .post(userController.postUser);

router.route('/postUserAdmin').post(userController.postUserAdmin);

//router.route('/addTestUser').post(userController.addTestUser);

router.route('/getUsers')
  .get(userController.getUsers);

router.route('/postTesteResult')
  .post(userController.postTesteResult);

router.route('/addTeste')
  .post(userController.postUser);

app.use('/proxy', proxy());

// Register all our routes with /api
app.use('/api', router);

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  console.log("Node server listening on port 3000")
});