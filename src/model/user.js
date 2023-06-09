// criar usuário através de um model schema mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, unique: true,required: true},
    senha: { type: String, required: true},
    imagem: { type: String, required: true},
    enderecos: [
        {
            rua: { type: String, required: true},
            numero: { type: Number, required: true},
            complemento: { type: String, required: false},
            CEP: { type: String, required: true},
            createAt: {type: Date, required: true, default: Date.now()},
        }
    ],
     pizzas_favs: [
         {
              // ID referenciado ao produtos
              _id: { type: mongoose.Schema.Types.ObjectId, unique: true, ref: "pizzas"},
              createdAt: { type: Date, default: Date.now()},
         }
     ],
      // definir padrão(false) ao criar user adm s/n
     createAt: {type: Date, required: true, default: Date.now()},
     admin: { type: Boolean, required: true, default: false},
});

UsuarioSchema.pre("save", async function(next) {
    if(this.senha){
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    next();
});

// criptografar senha
UsuarioSchema.pre("findOneAndUpdate", async function(next) {
    if(this._update.senha){
        this._update.senha = await bcrypt.hash(this._update.senha, 10);
    }
    next();
});

const Usuario = mongoose.model("usuarios", UsuarioSchema);

module.exports = Usuario;