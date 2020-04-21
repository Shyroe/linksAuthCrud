const bcrypt = require('bcryptjs');

const helpers = {};

//Método para Signup, ou seja, quando estamos registrando
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); //Padrão para codificar a senha
  const hash = await bcrypt.hash(password, salt);
  return hash; //hash é a senha encryptada(codificada)
};

//Método para Signin. Serve para comparar a senha do usuário. Verifica se a senha que estou digitando é a mesma que pertence ao usuário
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;
