export class SupplierModel {
    idSupplier?: number;
    supplierDescription : string;
    supplierPhone : string;
    supplierEmail : string;
    supplierAddress : string;
  
    constructor(r?: SupplierModel) {
      if (this.idSupplier !== undefined) {
        this.idSupplier = r?.idSupplier;
      }
      this.supplierDescription = r !== undefined ? r.supplierDescription : '';
      this.supplierPhone = r !== undefined ? r.supplierPhone : '';
      this.supplierEmail = r !== undefined ? r.supplierEmail : '';
      this.supplierAddress = r !== undefined ? r.supplierAddress : '';
    }
  }
  