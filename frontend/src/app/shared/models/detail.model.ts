export class DetailModel {
    idDetail?: number;
    idCustomer : string;
    idProduct : string;
    cantItem : number;
  
    constructor(r?: DetailModel) {
      if (this.idDetail !== undefined) {
        this.idDetail = r?.idDetail;
      }
      this.idCustomer = r !== undefined ? r.idCustomer : '';
      this.idProduct = r !== undefined ? r.idProduct : '';
      this.cantItem = r !== undefined ? r.cantItem : 0;
    
    }
  }
  