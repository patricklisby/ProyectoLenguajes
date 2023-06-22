export class ProductModel {
    idProduct?: number;
    idSupplier : string;
    idClassification : string;
    productDescription : string;
    priceProduct : string;
    expirationProduct ?: Date;
  
    constructor(r?: ProductModel) {
      if (this.idProduct !== undefined) {
        this.idProduct = r?.idProduct;
      }
      this.idSupplier = r !== undefined ? r.idSupplier : '';
      this.idClassification = r !== undefined ? r.idClassification : '';
      this.productDescription = r !== undefined ? r.productDescription : '';
      this.priceProduct = r !== undefined ? r.priceProduct : '';

      if(this.expirationProduct !== undefined){
        this.expirationProduct = r?.expirationProduct;
    }
    }
  }
  