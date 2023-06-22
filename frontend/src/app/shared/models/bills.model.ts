export class BillsModel {
    idBill?: number;
    idDetail : string;
    idPerson : string;
    dateGeneration? : Date;
  
    constructor(r?: BillsModel) {
      if (this.idBill !== undefined) {
        this.idBill = r?.idBill;
      }
      this.idDetail = r !== undefined ? r.idDetail : '';
      this.idPerson = r !== undefined ? r.idPerson : '';

      if(this.dateGeneration !== undefined){
        this.dateGeneration = r?.dateGeneration;
    }
    }
  }
  