// autenticação login
const authService = require("../services/service-auth");
const bcrypt = require("bcrypt");

const loginController = async (req, res) => {
    const {email, senha} = req.body;

    const user = await authService.loginService(email);

    if(!user){
        return res.status(400).send({ message: "Usuário não encontrado."})
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if(!isPasswordValid){
        return res.status(400).send({ message: "Senha incorreta."});
    }

    // gerar token baseado no ID
    const token = authService.gerenateToken(user.id);

    res.status(200).send({
        email,
        token
    });
}

module.exports = { loginController };