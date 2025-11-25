import { Component, ElementRef, input, OnInit, viewChild, effect, OnDestroy, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';


@Component({
  selector: 'app-sales-line-chart',
  standalone: true,
  template: '<canvas #chart></canvas>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 300px;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class SalesLineChart implements AfterViewInit, OnDestroy {
  
  private chartEffect = effect(() => {
  this.updateChart();
});
  ngAfterViewInit(): void {
   this.updateChart();
  }
  
  chartElement = viewChild<ElementRef<HTMLCanvasElement>>('chart');

  labels = input<string[]>([]);
  data = input<number[]>([]);

  
  private chart?: Chart;

  private updateChart(): void {
    const canvas = this.chartElement()?.nativeElement;
    if (!canvas) {
      console.log('❌ Canvas not found');
      return;
    }

    console.log('📊 Updating chart with data:', this.data());

    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.labels(),
        datasets: [{
          label: 'Ventas (€)',
          data: this.data(),
          borderColor: '#744c3e',
          backgroundColor: 'rgba(116, 76, 62, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#744c3e',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // ← Cambiar a false
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}€`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value}€`
            }
          }
        }
      }
    };

    this.chart = new Chart(canvas, config);
    console.log('✅ Chart created');
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}