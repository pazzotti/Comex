import { Component, OnInit } from '@angular/core';
import { isToday } from 'date-fns';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from '../services/contratos/contratos.service';
import { AppModule } from '../app.module';
import { DevolverVazioFormDialogComponent } from '../app/home/devolver_vazio/devolver-vazio-form-dialog.component';
import { ContainerReuseFormDialogComponent } from '../app/home/container_reuse/container-reuse-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-tela-user-transport',
  templateUrl: './tela-user-transport.component.html',
  styleUrls: ['./tela-user-transport.component.css']
})
export class TelaUserComponentTransport implements OnInit {
  items: any[] = [];
  sortColumn: string = '';
  sortNumber: number = 0;
  sortDirection: number = 1;
  dataLoaded = true;
  filtroDataInicio: Date = new Date();
  filtroDataTermino: Date = new Date();
  itemsFiltrados: any[] = [];
  searchText: string = '';
  items2: any[] = [ /* Seus itens aqui */];
  private searchTextSubject = new Subject<string>();
  private searchTextSubscription!: Subscription;
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'Pipeline_Inbound';
  data: any;


  constructor(private dynamoDBService: ApiService, public dialog: MatDialog) { }

  ngOnInit() {

    this.searchTextSubscription = this.searchTextSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterItems();
    });
    this.getItemsFromDynamoDB();

  }



  devolverVazio(item: Array<any>, url: string, table: string): void {
    const dialogRef = this.dialog.open(DevolverVazioFormDialogComponent, {
      data: {
        itemsData: item,
        url: url,
        query: table
      },
      height: '350px',
      minWidth: '450px',
      position: {
        top: '10vh',
        left: '30vw'
      },


    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 700); // Ajuste o tempo de atraso conforme necessário
      }

    });
  }

  reutilizar(item: Array<any>, url: string, table: string): void {const dialogRef = this.dialog.open(ContainerReuseFormDialogComponent, {
    data: {
      itemsData: item,
      url: url,
      query: table
    },
    height: '350px',
    minWidth: '750px',
    position: {
      top: '10vh',
      left: '30vw'
    },


  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      setTimeout(() => {
        this.getItemsFromDynamoDB();
      }, 700); // Ajuste o tempo de atraso conforme necessário
    }

  });
  }

  ngOnDestroy() {
    this.searchTextSubscription.unsubscribe();
  }

  converterData(stringData: string): string {
    const partes = stringData.split('/');
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    return `${ano}-${mes}-${dia}`;
  }

  calcularSomaTrip(): number {
    return this.itemsFiltrados.reduce((sum, item) => sum + Number(item.TripCost), 0);
  }
  calcularSomaHandling(): number {
    return this.itemsFiltrados.reduce((sum, item) => sum + Number(item.Handling), 0);
  }
  calcularSomaDemurrage(): number {
    return this.itemsFiltrados.reduce((sum, item) => sum + Number(item.Demurrage), 0);
  }

  getItemsFromDynamoDB(): void {
    const filtro = 'Scheduled';
    this.dynamoDBService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items.map(item => ({ ...item}));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
              this.itemsFiltrados = this.items; // Movido para dentro do bloco subscribe
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




  sortBy(column: string) {
    if (this.sortColumn === column) {
      // Reverse the sort direction
      this.sortDirection *= -1;
    } else {
      // Set the new sort column and reset the sort direction
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the data array based on the selected column and direction
    this.itemsFiltrados.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      if (valueA < valueB) {
        return -1 * this.sortDirection;
      } else if (valueA > valueB) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }
  sortBy2(column: string) {
    if (this.sortColumn === column) {
      // Reverse the sort direction
      this.sortDirection *= -1;
    } else {
      // Set the new sort column and reset the sort direction
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the data array based on the selected column and direction
    this.itemsFiltrados.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const valueA = parseFloat(a[this.sortColumn]);
      const valueB = parseFloat(b[this.sortColumn]);

      if (valueA < valueB) {
        return -1 * this.sortDirection;
      } else if (valueA > valueB) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }
  sortByDate(column: string) {
    if (this.sortColumn === column) {
      // Inverte a direção da ordenação
      this.sortDirection *= -1;
    } else {
      // Define a nova coluna de ordenação e redefine a direção da ordenação
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the data array based on the selected column and direction
    this.itemsFiltrados.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const dateA = this.parseDate(a[this.sortColumn]);
      const dateB = this.parseDate(b[this.sortColumn]);

      if (dateA < dateB) {
        return -1 * this.sortDirection;
      } else if (dateA > dateB) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }


  filterItems() {
    const searchText = this.searchText.toLowerCase();
    this.itemsFiltrados = this.items.filter(item => {
      const process = item.Process ? item.Process.toLowerCase() : '';
      const invoice = item.Invoice ? item.Invoice.toLowerCase() : '';
      const container = item.Container ? item.Container.toLowerCase() : '';
      const step = item.Step ? item.Step.toLowerCase() : '';
      const vessel = item.Vessel ? item.Vessel.toLowerCase() : '';
      const liner = item.Liner ? item.Liner.toLowerCase() : '';
      const channel = item.Channel ? item.Channel.toLowerCase() : '';

      // Implemente a lógica de filtragem com base no seu HTML
      // Por exemplo, se seus itens tiverem uma propriedade 'Process':
      return process.includes(searchText)
        || invoice.includes(searchText)
        || container.includes(searchText)
        || step.includes(searchText)
        || vessel.includes(searchText)
        || liner.includes(searchText)
        || channel.includes(searchText);
    });
  }

  onSearchTextChanged() {
    this.searchTextSubject.next(this.searchText);
  }

}









