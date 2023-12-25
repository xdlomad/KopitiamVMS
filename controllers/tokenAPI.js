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

  
//error message generator
function errorMessage(){
  const x = Math.floor(Math.random()*6)
  if (x == 0){
    return ("Oopsie Daisy\n")
  }else if (x == 1){
    return ("Error! Error! Error!\n")
  }else if (x==2){
    return ("I can accept failure. Everyone fails at something. But I can't accept not trying. ― Michael Jordan\n")
  }else if (x==3){
    return ("Waoh how did you even get an error here?\n")
  }else if (x==4){
    return ("Something went wrong! FeelsBadMan\n")
  }else if (x==5){
    return ("Hi, I'm Error Man , I'm here to tell you\n")
  }else{
    return ("Oi bo- Sir/Madam, we seem to have an error\n")
  }
}


  module.exports = {
    generateToken,
    verifyToken,
    errorMessage
}