import { Component, ElementRef, input, OnInit, viewChild, effect, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-products-bar-chart',
  standalone: true,
  template: '<canvas #chart></canvas>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class ProductsBarChart implements AfterViewInit, OnDestroy {
  
  chartElement = viewChild<ElementRef<HTMLCanvasElement>>('chart');
  
  labels = input<string[]>([]);
  data = input<number[]>([]);

  
  private chart?: Chart;

    private chartEffect = effect(() => {
  this.updateChart();
});
  ngAfterViewInit(): void {
   this.updateChart();
  }
  

  private updateChart(): void {
    const canvas = this.chartElement()?.nativeElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.labels(),
        datasets: [{
          label: 'Unidades vendidas',
          data: this.data(),
          backgroundColor: '#8fa998',
          borderColor: '#8fa998',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.chart = new Chart(canvas, config);
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}