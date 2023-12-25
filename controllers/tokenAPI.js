const jwt = require('jsonwebtoken');
//generate token for login authentication
function generateToken(loginProfile){
    return jwt.sign(loginProfile, 'UltimateSuperMegaTitanicBombasticGreatestBestPOGMadSuperiorTheOneandOnlySensationalSecretPassword', { expiresIn: '1h' });
  }
  
  //verify generated tokens
  function verifyToken(req, res, next){
    if (!req.headers.authorization) {
      res.send("There is no token bro")
      return
    }
    let header = req.headers.authorization
    let token = header.split(' ')[1] //checking header
    jwt.verify(token,'UltimateSuperMegaTitanicBombasticGreatestBestPOGMadSuperiorTheOneandOnlySensationalSecretPassword',function(err,decoded){
      if(err) {
        res.send("Token is not valid D:, go to the counter to exchange (joke)")
        return
      }
      req.user = decoded // bar
  
      next()
    });
  }

  module.exports = {
    generateToken,
    verifyToken
}