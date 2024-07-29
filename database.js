const mongoose = require("mongoose");

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://victordscabral:senhaGenerica@xwittercluster.ukgqssj.mongodb.net/?retryWrites=true&w=majority&appName=XwitterCluster")
        .then(() => {
            console.log("Conexao com a database sucedida");
        })
        .catch((err) => {
            console.log("Erro na conexao com a database" + err);
        })
    }
}

module.exports = new Database();