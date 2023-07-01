export class DetailModel {
    idDetail?: number;
    idCustomer : string;
    nameCustomer? : string;
    productDescription? : string;
    idProduct : string;
    cantItem : number;
  
    constructor(r?: DetailModel) {
      if (this.idDetail !== undefined) {
        this.idDetail = r?.idDetail;
      }
      this.idCustomer = r !== undefined ? r.idCustomer : '';
      this.nameCustomer = r !== undefined ? r?.nameCustomer : '';
      this.productDescription = r !== undefined ? r?.productDescription : '';
      this.idProduct = r !== undefined ? r.idProduct : '';
      this.cantItem = r !== undefined ? r.cantItem : 0;
    
    }
  }
  