export class Cor {
    public id : string;
    public cor : string;

    constructor(obj?: Partial<Cor>) {
        if (obj) {
            this.id = obj.id
            this.cor = obj.cor
        }
    }

    toFirestore() {
        const cor =  {
            id : this.id,
            cor : this.cor,
         }
         return cor
    }

        toString() {
            const Objeto = `{
                "id": "${this.id}",
                "cor": "${this.cor}",
            }`
            return Objeto

    }

};