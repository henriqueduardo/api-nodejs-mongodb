// token
const jwt = require("jsonwebtoken");
const { findUserByIdService } = require("../services/user-services");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({ message: "Informe o token para prosseguir."});
    }

    // (1-bearer, 2-<token>)
    const parts = authHeader.split(" ");

    if(parts.length !== 2){
        return res.status(401).send({ message: "Token inválido1."});
    }

    const [schema, token] = parts;

    if(!/^Bearer$/i.test(schema)){
        return res.status(401).send({ message: "Token mal informado."});
    }

    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if(err){
            return res.status(500).send({ message: "Token inválido2."});
        }

        const user = await findUserByIdService(decoded.id);

        if(!user || !user.id){
            return res.status(401).send({ message: "Token inválido3!"});
        }

        req.userId = decoded.id;
        
        return next();
    });
}