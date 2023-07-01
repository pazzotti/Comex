import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class CarregaService {

  constructor(private http: HttpClient, private papa: Papa) { }

  getFileContent(fileUrl: string): Promise<string> {
    return this.http.get(fileUrl, { responseType: 'text' })
      .toPromise()
      .then(response => response || '');
  }


  processData(fileContent: string): Array<any> {
    const parsedData = this.papa.parse(fileContent, {
      header: true,
      delimiter: ';'
    }).data;
    const containerVolumes: Record<string, number> = {};
    const containerWeights: Record<string, number> = {};
    const result: Array<any> = [];

    for (const row of parsedData) {
      const {
        'Process': Process,
        'Container Id': Container,
        ' Channel': Channel,
        'Clearance Place': ClearancePlace,
        'Step': Step,
        'Transp. Type': Transport,
        'Invoice Number': Invoice,
        'SLine': Liner,
        'ATA': ATA,
        'Vessel Name/Flight (SLine)': Vessel,
        'Value': Value,
        'Expense': Expense,
        'Packing Volume (m3)': Volume,
        'Gross Weigth (kg)': Weight,
        'Estimated Arrival Date': Chegada
        // Continuar com os ajustes para as demais propriedades
      }: {
        'Process': string,
        'Container Id': string,
        ' Channel': string,
        'Clearance Place': string,
        'Step': string,
        'Transp. Type': string,
        'Invoice Number': string,
        'SLine': string,
        'ATA': string,
        'Vessel Name/Flight (SLine)': string,
        'Value': string,
        'Expense': string,
        'Packing Volume (m3)': string,
        'Gross Weigth (kg)': string,
        'Estimated Arrival Date': string
        // Continuar com os ajustes para as demais propriedades
      } = row;

      if (!Container || Container.trim().length === 0 || Transport !== '10' || ATA === '') {
        continue;
      }

      const parsedVolume = parseFloat(Volume.replace(',', '.'));
      const parsedWeight = parseFloat(Weight.replace(',', '.'));

      if (containerVolumes[Container]) {
        containerVolumes[Container] += parsedVolume;
      } else {
        containerVolumes[Container] = parsedVolume;
      }

      if (containerWeights[Container]) {
        containerWeights[Container] += parsedWeight;
      } else {
        containerWeights[Container] = parsedWeight;
      }

      if (!result.some((item) => item.Container === Container)) {
        result.push({
          Process,
          Container,
          Channel,
          ClearancePlace,
          Step,
          Transport,
          Invoice,
          Liner,
          ATA,
          Vessel,
          Value,
          Expense,
          Chegada,
          // Adicionar o campo 'Volume' corretamente
          Volume: undefined,
          Peso: undefined
          // Continuar com as demais propriedades que deseja extrair
        });
      }
    }

    for (const item of result) {
      const Container = item.Container;
      const Volume = containerVolumes[Container];
      const Weight = containerWeights[Container];

      item.Volume = Volume.toFixed(2);
      item.Peso = Weight.toFixed(2);
    }

    return result;
  }




  async loadFile(fileUrl: string): Promise<any[]> {
    const fileContent = await this.getFileContent(fileUrl);
    const data = this.processData(fileContent);
    return data;
  }

  testarArquivoCSV(arquivo: File): Promise<TesteArquivoResultado> {
    return new Promise<TesteArquivoResultado>((resolve, reject) => {
      this.papa.parse(arquivo, {
        complete: (result: any) => {
          const dados = result.data;
          const cabecalho = result.meta.fields;
          const erros = result.errors;
          const estaCorreto = this.validarArquivoCSV(dados, cabecalho, erros);
          const resultado: TesteArquivoResultado = {
            estaCorreto,
            dados,
            cabecalho,
            erros
          };
          resolve(resultado);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  validarArquivoCSV(dados: any[], cabecalho: string[], erros: any[]): boolean {
    // Verificar se existem erros de parsing no arquivo
    if (erros && erros.length > 0) {
      return false;
    }


    // Verificar se o cabeçalho está correto
    const cabecalhoEsperado = ['Process', 'Container Id', 'Channel', 'Clearance Place', 'Step', 'Transp. Type', 'Invoice Number', 'SLine', 'ATA','Vessel Name/Flight (SLine)','Value','Expense','Volume','Peso','Chegada'];
    if (!cabecalho || !this.arrayEquals(cabecalho, cabecalhoEsperado)) {
      return false;
    }

    // Verificar se os dados estão corretos
    if (!dados || dados.length === 0) {
      return false;
    }

    // Verificar se todos os dados estão preenchidos corretamente
    for (const row of dados) {
      if (!row || Object.values(row).some(value => value === null || value === undefined || value === '')) {
        return false;
      }
    }

    // Se chegou até aqui, o arquivo está correto
    return true;
  }

  // Função auxiliar para verificar se dois arrays são iguais
  arrayEquals(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }


}

interface TesteArquivoResultado {
  estaCorreto: boolean;
  dados: any[];
  cabecalho: string[];
  erros: any[];

}
