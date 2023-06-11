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



  chartOptionsReutiliza: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      width: 900
    },
    title: {
      text: 'Percentual de Containers Reutilizados vs Importação'
    },
    xAxis: {
      categories: ['Total de Importação', 'Containers Reutilizados', 'Containers Avariados']
    },
    yAxis: {
      title: {
        text: 'Percentual (%)'
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: 'bar',
        name: 'Percentual',
        data: [80, 20, 5] // Substitua os valores com seus dados reais
      }
    ]
  };


  lineChartOptionsCustos: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      width: 900
    },
    title: {
      text: 'Comparação de Orçamento e Realizado'
    },
    xAxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    yAxis: {
      title: {
        text: 'Valor (em milhões)'
      }
    },
    series: [
      {
        type: 'line',
        name: 'Orçamento',
        data: [10, 12, 15, 13, 11, 9, 10, 14, 16, 18, 17, 15],
        marker: {
          enabled: false
        }
      },
      {
        type: 'line',
        name: 'Realizado',
        data: [9, 11, 14, 12, 10, 8, 9, 13, 15, 17, 16, 14],
        marker: {
          enabled: false
        }
      }
    ]
  };
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

  pieChartOptionsCustos: Highcharts.Options = {
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
          format: '{point.percentage:.1f}%',
          distance: -30,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        }
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Share',
        data: [
          { name: 'Frete', y: 100 },
          { name: 'Manuseio', y: 200 },
          { name: 'Clean', y: 150 },
          { name: 'Transport', y: 300 },
          { name: 'Storage', y: 250 },
          { name: 'Demurrage', y: 175 }
        ],
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%',
          distance: -30,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        }
      },
      {
        type: 'pie',
        name: 'Values',
        innerSize: '60%',
        data: [
          { name: 'Frete', y: 100 },
          { name: 'Manuseio', y: 200 },
          { name: 'Clean', y: 150 },
          { name: 'Transport', y: 300 },
          { name: 'Storage', y: 250 },
          { name: 'Demurrage', y: 175 }
        ],
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
          distance: 30,
          style: {
            fontWeight: 'bold'
          }
        }
      }
    ],
    legend: {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical',
      itemMarginTop: 10,
      itemMarginBottom: 10
    }
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

  barQuantidadeContainers: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      width: 900
    },
    title: {
      text: 'Quantidade de Containers por Local'
    },
    xAxis: {
      categories: ['CRGEA', 'SSZ', 'BTP']
    },
    yAxis: {
      title: {
        text: 'Quantidade'
      }
    },
    series: [
      {
        type: 'bar',
        name: 'Quantidade de Containers',
        data: [120, 180, 150], // Substitua os valores com seus dados reais
      }
    ]
  };

  buscarIntervalo(){

  }
}
