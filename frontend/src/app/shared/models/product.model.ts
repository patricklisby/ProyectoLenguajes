export class ProductModel {
    idProduct?: number;
    supplierDescription : string;
    classificationDescription : string;
    productDescription : string;
    priceProduct : string;
    expirationProduct ?: Date;

    constructor(r?: ProductModel) {
      if (this.idProduct !== undefined) {
        this.idProduct = r?.idProduct;
      }
      this.supplierDescription = r !== undefined ? r.supplierDescription : '';
      this.classificationDescription = r !== undefined ? r.classificationDescription : '';
      this.productDescription = r !== undefined ? r.productDescription : '';
      this.priceProduct = r !== undefined ? r.priceProduct : '';

      if(this.expirationProduct !== undefined){
        this.expirationProduct = r?.expirationProduct;
    }
    }
  }
