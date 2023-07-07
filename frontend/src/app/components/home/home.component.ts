import { Component, OnInit  } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  ngOnInit() {
    this.generateChart();
    this.generateProfitChart();
  }
  
  generateChart() {
    const salesData = [100, 200, 150, 300, 250, 400]; // Ejemplo de datos de ventas
  
    const canvas = <HTMLCanvasElement>document.getElementById('salesChart');
    const ctx = canvas.getContext('2d');
  
    if (ctx) { // Comprobar si ctx no es nulo
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [{
            label: 'Ventas',
            data: salesData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo de las barras
            borderColor: 'rgb(0,0,0)', // Color del borde de las barras
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  
  generateProfitChart() {
    const profitData = [500, 800, 700, 900, 1000, 1200]; // Ejemplo de datos de utilidades
  
    const canvas = <HTMLCanvasElement>document.getElementById('profitChart');
    const ctx = canvas.getContext('2d');
  
    if (ctx) { // Comprobar si ctx no es nulo
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [{
            label: 'Utilidades',
            data: profitData,
            fill: false,
            borderColor: 'rgb(0,0,0)', // Color de la línea
            borderWidth: 2,
            pointBackgroundColor: 'rgb(0,0,0)', // Color de los puntos
            pointRadius: 4,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  
  

}