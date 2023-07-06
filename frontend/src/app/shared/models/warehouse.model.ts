export class WarehouseModel {
  idWareHouse?: number;
  idProduct: string;
  productDescription?: string;
  supplierDescription: string;
  classificationDescription: string;
  priceProduct: string;
  expirationProduct?: Date;
  cantItem: string;


  constructor(r?: WarehouseModel) {
    if (this.idWareHouse !== undefined) {
      this.idWareHouse = r?.idWareHouse;
    }
    this.idProduct = r !== undefined ? r.idProduct : '';
    this.productDescription = r !== undefined ? r?.productDescription : '';
    this.supplierDescription = r !== undefined ? r?.supplierDescription : '';
    this.classificationDescription = r !== undefined ? r?.classificationDescription : '';
    this.priceProduct = r !== undefined ? r?.priceProduct : '';
    this.cantItem = r !== undefined ? r.cantItem : '';
    if(this.expirationProduct !== undefined){
      this.expirationProduct = r?.expirationProduct;
  }
  }
}
