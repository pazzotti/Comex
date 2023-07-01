import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { getISOWeek } from 'date-fns';
import { ApiService } from '../services/contratos/contratos.service';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']


})
export class DashboardComponent {
  items: any[] = [];
  itemsHandling: number = 0;
  itemsDemurrage: number = 0;
  itemsFreight: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  weekCounts: any;
  monthCounts: any;
  dados: string[] = [];
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'Pipeline_Inbound';
  date: Date = new Date();

  constructor(private dynamoDBService: ApiService) {

  }

  ngOnInit() {




    this.endDate = new Date(); // Data atual
    this.endDate.setDate(this.endDate.getDate() - 30); // Subtrai 30 dias




    this.endDate = new Date();
    let year = this.endDate.getFullYear();
    let month = String(this.endDate.getMonth() + 1).padStart(2, '0');
    let day = String(this.endDate.getDate()).padStart(2, '0');

    let formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"

    this.endDate = new Date(formattedDate);



    this.startDate.setDate(this.startDate.getDate() - 30);

    year = this.startDate.getFullYear();
    month = String(this.startDate.getMonth() + 1).padStart(2, '0');
    day = String(this.startDate.getDate()).padStart(2, '0');

    formattedDate = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"

    this.startDate = new Date(formattedDate);

     // Chama as funções com um atraso de 1 segundo (1000 milissegundos)
     setTimeout(() => {
      this.getItemsFromDynamoDB();
      setTimeout(() => {
        this.updateChart();
      }, 2000);
    }, 100);


  }

  getItemsFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamoDBService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items.map(item => ({ ...item, checked: false }));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
              // Forçar detecção de alterações após atualizar os dados
            } else {
              console.error('Invalid items data:', items);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getMonthInterval(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }

  createChart() {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    let intervalo = this.getMonthInterval(startDate, endDate);
    let labels: string[] = [];
    let dados: string[] = [];
    let intervalos: number[] = [10, 20, 30];

    if (intervalo < 1) {
      // Intervalo inferior a 1 mês (por semana)
      labels = this.getWeekLabels(startDate, endDate);
      dados = labels.map((weekLabel: string) => {
        const weekNumber = parseInt(weekLabel.split(' ')[1]);
        return this.weekCounts[weekNumber] || 0;
      });
    } else {
      // Intervalo superior a 1 mês (por mês)
      labels = this.getMonthLabels(startDate, endDate);
      dados = labels.map((monthLabel: string) => {
        return this.monthCounts[monthLabel] || 0;
      });
    }

    this.updateChart();
  }

  getWeekLabels(startDate: Date, endDate: Date): string[] {
    const labels: string[] = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const weekNumber = getISOWeek(currentDate);
      const weekLabel = `Semana ${weekNumber}`;
      labels.push(weekLabel);

      // Incrementa a data em uma semana
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return labels;
  }

  getMonthLabels(startDate: Date, endDate: Date): string[] {
    const labels: string[] = [];

    // Obter o ano e mês de início
    let year = startDate.getFullYear();
    let month = startDate.getMonth();

    // Iterar pelos meses até chegar à data de término
    while (year < endDate.getFullYear() || (year === endDate.getFullYear() && month <= endDate.getMonth())) {
      const monthLabel = `${this.getMonthName(month)} ${year}`;
      labels.push(monthLabel);

      // Incrementar para o próximo mês
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }

    return labels;
  }

  getMonthName(monthIndex: number): string {
    const monthNames: string[] = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return monthNames[monthIndex];
  }


  chartOptionsCO2: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      width: 900
    },
    title: {
      text: 'CO2 Emissions Monitoring'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'CO2 Emissions (tons)'
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: 'line', // Adicione a propriedade type
        name: 'CO2 Emissions',
        data: [100, 120, 150, 110, 130, 140, 160, 155, 170, 180, 200, 190]
      }
    ]
  };



  chartOptionsReutiliza: Highcharts.Options = {
    chart: {
      type: 'bar',
      backgroundColor: 'rgba(242, 242, 242, 0.5)',
      width: 900
    },
    title: {
      text: 'Number of Reused and Damage Containers'
    },
    xAxis: {
      categories: ['Total Exported', 'Total Reused', 'Total Damaged']
    },
    yAxis: {
      title: {
        text: 'Scale of Containers'
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: 'bar',
        name: 'Percentual',
        data: [] // Deixe os dados vazios inicialmente
      }
    ]
  };

  updateChart() {
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    const itemsLocal = this.items.filter(item => {
      const parts = item.ATA.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const date = new Date(year, month, day);

      return date >= startDate && date <= endDate;
    }).map(item => item.ClearancePlace);

    const itemCounts: { [item: string]: number } = {};

    itemsLocal.forEach(item => {
      if (itemCounts[item]) {
        itemCounts[item]++;
      } else {
        itemCounts[item] = 1;
      }
    });


    // Verifique se a propriedade xAxis existe e é um objeto antes de atualizar as categorias
    if (this.barQuantidadeContainers.xAxis && typeof this.barQuantidadeContainers.xAxis === 'object') {
      const xAxisOptions = this.barQuantidadeContainers.xAxis as Highcharts.XAxisOptions;
      xAxisOptions.categories = Object.keys(itemCounts);

      // Crie um novo objeto de série com os valores atualizados
      const updatedSeries: Highcharts.SeriesOptionsType = {
        type: 'bar',
        name: 'Quantidade de Containers',
        data: Object.values(itemCounts),
        dataLabels: {
          enabled: true,
          inside: true,
          align: 'center',
          verticalAlign: 'middle',
          style: {
            fontWeight: 'bold'
          }
        }
      };

      // Atualize o objeto de série existente no gráfico
      this.barQuantidadeContainers.series = [updatedSeries];

      // Redesenhe o gráfico para refletir as mudanças
      Highcharts.chart('chartQuantidade', this.barQuantidadeContainers);
    }





    this.itemsDemurrage = this.items
      .filter(item => {
        const parts = item.ATA.split('/');
        const day = parseInt(parts[0], 10); // Converter o dia para um número inteiro
        const month = parseInt(parts[1], 10) - 1; // Converter o mês para um número inteiro (subtraindo 1 para ajustar à base zero)
        const year = parseInt(parts[2], 10); // Converter o ano para um número inteiro

        const date = new Date(year, month, day); // Criar o objeto Date com os valores do dia, mês e ano

        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      .map(item => item.Demurrage)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    this.itemsFreight = this.items
      .filter(item => {
        const parts = item.ATA.split('/');
        const day = parseInt(parts[0], 10); // Converter o dia para um número inteiro
        const month = parseInt(parts[1], 10) - 1; // Converter o mês para um número inteiro (subtraindo 1 para ajustar à base zero)
        const year = parseInt(parts[2], 10); // Converter o ano para um número inteiro

        const date = new Date(year, month, day); // Criar o objeto Date com os valores do dia, mês e ano

        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      .map(item => item.TripCost)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    this.itemsHandling = this.items
      .filter(item => {
        const parts = item.ATA.split('/');
        const day = parseInt(parts[0], 10); // Converter o dia para um número inteiro
        const month = parseInt(parts[1], 10) - 1; // Converter o mês para um número inteiro (subtraindo 1 para ajustar à base zero)
        const year = parseInt(parts[2], 10); // Converter o ano para um número inteiro

        const date = new Date(year, month, day); // Criar o objeto Date com os valores do dia, mês e ano

        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      .map(item => item.Handling)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    console.log(this.itemsHandling);




    const itemsInRange = this.items
      .filter(item => {
        const parts = item.ATA.split('/');
        const day = parseInt(parts[0], 10); // Converter o dia para um número inteiro
        const month = parseInt(parts[1], 10) - 1; // Converter o mês para um número inteiro (subtraindo 1 para ajustar à base zero)
        const year = parseInt(parts[2], 10); // Converter o ano para um número inteiro

        const date = new Date(year, month, day); // Criar o objeto Date com os valores do dia, mês e ano

        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      .map(item => item.Step);

    const itemsAvariados = this.items
      .filter(item => {
        const parts = item.ATA.split('/');
        const day = parseInt(parts[0], 10); // Converter o dia para um número inteiro
        const month = parseInt(parts[1], 10) - 1; // Converter o mês para um número inteiro (subtraindo 1 para ajustar à base zero)
        const year = parseInt(parts[2], 10); // Converter o ano para um número inteiro

        const date = new Date(year, month, day); // Criar o objeto Date com os valores do dia, mês e ano

        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      .map(item => item.avariado);



    const countReusedItems = itemsInRange.filter(item => item === 'Reused').length;
    const countEmptyItems = itemsInRange.filter(item => item === 'Empty Return').length;
    const countAvariados = itemsAvariados.filter(item => item === true).length;
    const totalItens = countReusedItems + countEmptyItems
    const intervalo = [totalItens, countReusedItems, countAvariados]
    const percentReuse = (countReusedItems / totalItens * 100).toFixed(1);
    const percentRDamage = (countAvariados / totalItens * 100).toFixed(1);



    // Verifique se a propriedade chartOptionsReutiliza é undefined
    if (this.chartOptionsReutiliza === undefined) {
      this.chartOptionsReutiliza = {} as Highcharts.Options;
    }

    // Atualize os dados do gráfico
    if (this.chartOptionsReutiliza.series === undefined) {
      this.chartOptionsReutiliza.series = [];
    }
    this.chartOptionsReutiliza.series[0] = {
      type: 'bar',
      name: 'Percentual',
      data: intervalo
    };

    this.chartOptionsReutiliza.series[0].data = [
      { y: totalItens, dataLabels: { enabled: true, align: 'center', inside: true, format: '{y}' } },
      { y: countReusedItems, dataLabels: { enabled: true, align: 'center', inside: true, format: '{y}  Reused   (' + percentReuse + '%)' } },
      { y: countAvariados, dataLabels: { enabled: true, align: 'center', inside: true, format: '{y}  Damaged   (' + percentRDamage + '%)' } }
    ];


    // Redesenha o gráfico
    Highcharts.chart('chartContainer', this.chartOptionsReutiliza);

    // Verifique se a propriedade pieChartOptions é undefined
    if (this.pieChartOptions === undefined) {
      this.pieChartOptions = {} as Highcharts.Options;
    }

    // Atualize os dados do gráfico
    if (this.pieChartOptions.series === undefined) {
      this.pieChartOptions.series = [];
    }
    this.pieChartOptions.series[0] = {
      type: 'pie',
      name: 'Share',
      data: [
        {
          y: this.itemsDemurrage,
          dataLabels: {
            format: '<b>Demurrage:</b> US$ {point.y:,.2f}'
          }
        },
        {
          y: this.itemsHandling,
          dataLabels: {
            format: '<b>THC:</b> R$ {point.y:,.2f}'
          }
        },
        {
          y: this.itemsFreight,
          dataLabels: {
            format: '<b>Freight:</b> US$ {point.y:,.2f}'
          }
        }
      ]
    };

    this.pieChartOptions.plotOptions = {
      pie: {
        innerSize: '30%',
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          distance: -30,
          style: {
            fontWeight: 'bold',
            color: 'white'
          }
        }
      }
    };



    // Redesenha o gráfico
    Highcharts.chart('pieChartOptions', this.pieChartOptions);

  }



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
      categories: this.dados,
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
          format: '<b>{point.name}</b>: {point.percentage:.1f}%'
        }
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Cost Share',
        data: [
          { name: 'Demurrage', y: this.itemsDemurrage },
          { name: 'Handling', y: this.itemsHandling },
          { name: 'Freight', y: this.itemsFreight }
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
      text: 'Clearance Place'
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: 'Quantity'
      }
    },
    series: [
      {
        type: 'bar',
        name: 'Clearance Place',
        data: [], // Substitua os valores com seus dados reais
      }
    ]
  };

  buscarIntervalo() {

  }
}
