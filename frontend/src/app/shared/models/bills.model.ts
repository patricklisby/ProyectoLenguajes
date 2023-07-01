export class BillsModel {
    idBill?: number;
    idDetail : string;
    idPerson : string;
    namePerson? : string;
    dateGeneration? : Date;
  
    constructor(r?: BillsModel) {
      if (this.idBill !== undefined) {
        this.idBill = r?.idBill;
      }
      this.idDetail = r !== undefined ? r.idDetail : '';
      this.idPerson = r !== undefined ? r.idPerson : '';
      this.namePerson = r !== undefined ? r?.namePerson : '';

      if(this.dateGeneration !== undefined){
        this.dateGeneration = r?.dateGeneration;
    }
    }
  }
  