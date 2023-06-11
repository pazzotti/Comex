import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  template: `
    <highcharts-chart
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 400px;"
    ></highcharts-chart>
  `
})
export class DashboardComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Sales Data'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      title: {
        text: 'Month'
      }
    },
    yAxis: {
      title: {
        text: 'Sales'
      }
    },
    series: [
      {
        type: 'column', // Adicione esta propriedade
        name: 'Product A',
        data: [100, 200, 300, 400, 500, 600]
      },
      {
        type: 'column', // Adicione esta propriedade
        name: 'Product B',
        data: [200, 300, 400, 500, 600, 700]
      }
    ]
  };
}
