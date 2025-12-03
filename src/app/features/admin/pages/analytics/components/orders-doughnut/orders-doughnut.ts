// orders-doughnut.ts
import {
  Component,
  ElementRef,
  input,
  OnInit,
  viewChild,
  effect,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-orders-doughnut',
  standalone: true,
  template: '<canvas #chart></canvas>',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      canvas {
        width: 100% !important;
        height: 100% !important;
      }
    `,
  ],
})
export class OrdersDoughnut implements AfterViewInit, OnDestroy {
  chartElement = viewChild<ElementRef<HTMLCanvasElement>>('chart');

  labels = input<string[]>([]);
  data = input<number[]>([]);
  colors = input<string[]>([]);

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
      type: 'doughnut',
      data: {
        labels: this.labels(),
        datasets: [
          {
            data: this.data(),
            backgroundColor: this.colors(),
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 10,
              font: {
                size: 12,
              },
            },
          },
        },
      },
    };

    this.chart = new Chart(canvas, config);
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}
