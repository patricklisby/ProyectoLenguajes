import { Component } from '@angular/core';

@Component({
  selector: 'app-error403',
  template: `<div class="bg-light p5 rounded-ld mx-3 mt-1">
    <h1 class="display-4 text-center">No Autorizado</h1>
    <h3 class="display-5 text-center">
      No tienes permisos para usar esta funcionalidad.
    </h3>
  </div>`,
})
export class Error403Component {}
