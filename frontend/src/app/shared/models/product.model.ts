export class ProductModel {
    idProduct?: number;
    idSupplier? : number;
    supplierDescription : string;
    idClassification? :number;
    classificationDescription : string;
    productDescription : string;
    priceProduct : string;
    expirationProduct ?: Date;

    constructor(r?: ProductModel) {
      if (this.idProduct !== undefined) {
        this.idProduct = r?.idProduct;
      }
      if (this.idSupplier !== undefined) {
        this.idSupplier = r?.idSupplier;
      }
      if (this.idClassification !== undefined) {
        this.idClassification = r?.idClassification;
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
