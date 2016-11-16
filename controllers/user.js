// Load required packages
var User = require('../models/user');
var UserAdmin = require('../models/useradmin');
var Teste = require('../models/teste');
var fs = require("fs");

//Cria novo usuario e envia token de ativação
exports.postUserAdmin = function (req, res) {

      var userNew = new UserAdmin({

        email: req.body.email,
        id: req.body.id
      });

      userNew.save(function (err) {
        if (err)
          return res.send(err);
        return res.json({ message: 'postUserAdminSuccess' });
      });

};

//Cria novo usuario e envia token de ativação
exports.postUser = function (req, res) {

  User.findOne({ idUserFB: req.body.idUserFB }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user) {

      var userNew = new User({

        email: req.body.email,
        name: req.body.name,
        lastName: req.body.lastName,
        idUserFB: req.body.idUserFB,
        gender: req.body.gender,
        birthday: req.body.birthday

      });

      userNew.save(function (err) {
        if (err)
          return res.send(err);
        return res.json({ message: 'postUserSuccess' });
      });

    } else {
      return res.json({ message: 'success' });
    }

  });

};

exports.postTesteResult = function (req, res) {

  User.findOne({ idUserFB: req.body.idUserFB }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });

    var userJson = JSON.parse(JSON.stringify(user))

    var id = null;

    for (var key in userJson.testes) {
      if (userJson.testes[key].nomeTeste === req.body.nomeTeste) {
        id = userJson.testes[key].idResposta;
      }
    }

    if (id) {

      Teste.findOne({ nomeTeste: req.body.nomeTeste }, function (err, teste) {
        if (err)
          return res.send(err);
        if (!teste)
          return res.json({ message: 'notesteresposta' });
        // Success
        var testeJson = JSON.parse(JSON.stringify(teste))

        var retorno = null;


        for (var key in testeJson.respostas) {
          if (testeJson.respostas[key]._id + '' === id) {
            retorno = testeJson.respostas[key];
          }
        }

        return res.json({ message: 'successFeito', teste: retorno, pergunta: testeJson.pergunta });

      });
    } else {
      Teste.findOne({ nomeTeste: req.body.nomeTeste }, function (err, teste) {
        if (err)
          return res.send(err);
        if (!teste)
          return res.json({ message: 'notestenome' });

        var testeJson = JSON.parse(JSON.stringify(teste))

        var index = Math.floor(Math.random() * (testeJson.respostas.length - 0) + 0);

        user.testes.push({ nomeTeste: req.body.nomeTeste, idResposta: testeJson.respostas[index]._id + '' });

        user.save();

        return res.json({ message: 'successNovo', teste: testeJson.respostas[index], pergunta: testeJson.pergunta });

      });
    }

  });

};


exports.postImg = function (req, res) {

  var nome = req.body.idUserFB + '_' + req.body.teste + '.png';

  //fs.exists('uploads/' + nome, function (exists) {
  // if (exists) {
  //  return res.json({ message: 'postImgExists' });
  //} else {
  fs.writeFile('uploads/' + nome, req.body.file, 'base64', function (err) {
    if (err)
      return res.json({ message: 'postImgErr', 'erro': err });

    return res.json({ message: 'postImgSuccess' });
  });
  //}
  //});

};

exports.getImagem = function (req, res) {

  var options = {
    root: __dirname + '/../uploads/'
  };

  var fileName = req.params.imagename;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }

  });

};


exports.getUsers = function (req, res) {

  //console.log(req.headers.email)

  UserAdmin.findOne({ email: req.headers.email }, function (err, userSeguro) {
    if (err)
      return res.send(err);
    if (!userSeguro)
      return res.json({ message: 'notauthorized' });

    if (userSeguro.id === req.headers.id) {

      User.find({}, function (err, users) {
        if (err)
          return res.send(err);

        return res.json({ message: 'users', user: users });

      });

    } else {
      return res.json({ message: 'notauthorized' });
    }

  });

};

/*


exports.getBackTeste = function (req, res) {

  var options = {
    root: __dirname + '/../images/' + req.params.teste + '/'
  };

  var fileName = req.params.imagename;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }

  });

};
exports.addTestUser = function (req, res) {

  User.findOne({ id: req.body.id }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });

    user.testes.push({ nome: req.body.nome, id: req.body.id });

    user.save();

    return res.json({ message: 'addTestUserSuccess' });

  });

};/*/

