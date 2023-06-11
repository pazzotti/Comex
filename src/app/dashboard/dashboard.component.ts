import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']


})
export class DashboardComponent {

  dataInicial: Date = new Date();
  dataFinal: Date = new Date();

  constructor() {

  }
  Highcharts: typeof Highcharts = Highcharts;
  columnChartOptions: Highcharts.Options = {
    chart: {
      width: 900,
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      type: 'column'
    },
    title: {
      text: 'Total containers Arrivel'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      title: {
        text: 'Month'
      }
    },
    yAxis: {
      title: {
        text: 'Quantity of Containers'
      }
    },
    series: [
      {
        type: 'column',
        name: 'Product A',
        data: [100, 200, 300, 400, 500, 600],
        pointWidth: 60, // Aumenta a largura das colunas para 40 pixels
      },
      {
        type: 'column',
        name: 'Product B',
        data: [200, 300, 400, 500, 600, 700],
        pointWidth: 50, // Aumenta a largura das colunas para 40 pixels
      }
    ]
  };
  pieChartOptions: Highcharts.Options = {
    chart: {
      width: 900,
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      type: 'pie'
    },
    title: {
      text: 'Share of Container Costs'
    },
    plotOptions: {
      pie: {
        innerSize: '30%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}'
        }
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Sales',
        data: [
          { name: 'Product A', y: 2100 },
          { name: 'Product B', y: 2500 }
        ]
      }
    ]
  };
  pieChart2Options: Highcharts.Options = {
    chart: {
      width: 900,
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      type: 'pie'
    },
    title: {
      text: 'Share of Container Costs'
    },
    plotOptions: {
      pie: {
        innerSize: '30%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}'
        }
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Sales',
        data: [
          { name: 'Product A', y: 2100 },
          { name: 'Product B', y: 2500 }
        ]
      }
    ]
  };
  buscarIntervalo(){

  }
}
