export class ClassificationModel {
    idClassification?: number;
    classificationDescription : string;
  
    constructor(r?: ClassificationModel) {
      if (this.idClassification !== undefined) {
        this.idClassification = r?.idClassification;
      }
      this.classificationDescription = r !== undefined ? r.classificationDescription : '';
    }
  }
  