var Teste = require('../models/teste');

exports.postTeste = function (req, res) {

  Teste.findOne({ nomeTeste: req.body.nomeTeste }, function (err, teste) {
    if (err)
      return res.send(err);

    if (!teste) {

      var newTeste = new Teste({
        nomeTeste: req.body.nomeTeste,
        pergunta: req.body.pergunta,
        respostas: [{
          desc1: req.body.desc1,
          desc2: req.body.desc2,
          desc3: req.body.desc3,
          desc4: req.body.desc4
        }]
      });

      newTeste.save(function (err) {
        if (err)
          return res.send(err);
        return res.json({ message: 'postNovoTesteSuccess', teste: newTeste });
      });

    } else {

      teste.respostas.push({
        desc1: req.body.desc1,
        desc2: req.body.desc2,
        desc3: req.body.desc3,
        desc4: req.body.desc4
      });

      teste.save();

      return res.json({ message: 'postAddTesteSuccess', teste: teste });

    }

  });

};

/*

exports.editTeste = function (req, res) {

  Teste.findOneAndUpdate(
    { nomeTeste: req.body.nomeTeste, 'respostas._id': req.body.idResposta },
    {
      "$set": {
        "respostas.$.desc1": req.body.desc1,
        "respostas.$.desc2": req.body.desc2,
        "respostas.$.desc3": req.body.desc3,
        "respostas.$.desc4": req.body.desc4
      }
    }, {new: true},
    function (err, doc) {
      if (err)
        return res.send(err);
        console.log(doc)
    }
  );

};

*/

exports.getTestes = function (req, res) {

  Teste.find({}).select('pergunta').select('resumo').select('nomeTeste').exec( function (err, testes) {
    if (err)
      return res.send(err);
    if (!testes)
      return res.json({ message: 'noteste' });
    // Success
    return res.json({ message: 'success', testes: testes });

  });

};

/*
exports.getResult = function (req, res) {

  User.findOne({ id: req.body.id }).select('testes').exec(function (err, testes) {
    if (err)
      return res.send(err);
    if (testes.length == 0)
      return res.json({ result: 0 });

    var teste = JSON.parse(JSON.stringify(testes))

    var cont = 0;
    for (var key in teste.testes) {
      if (teste.testes[key].tipo === req.body.tipoTeste) {
        cont++;
      }

    }

    return res.json({ result: cont });

  });



};*/