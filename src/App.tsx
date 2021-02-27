import React, { useEffect, useState } from 'react';
import { pcv } from './pcv';

interface PCV {
  objetivo: Array<number>,
  restricoes: Array<Array<number>>
}


function App() {
  //variaveis
  const [pcvJSON, setPcvJSON] = useState<PCV>(pcv);
  const [arrayAjustes, setArrayAjustes] = useState({
    "ajuste": pcvJSON.objetivo
  });
  const bigM: number = 99999;
  //let count: number = 0;
  let newZ: Array<number> = pcvJSON.objetivo;
  let ajuste: Array<number> = arrayAjustes.ajuste;


  //Funções
  //Essa função é resposavel por limpar a variavel que recebe os ajustes na função ajuste() e adcionar o novo ajuste na variavel arrayAjustes
  function limparNewZ(): void {
    //console.log(`${count}Chamou limparNewZ ${newZ}`)
    newZ = [];
    adicionarAjuste(newZ);
    //count++;
  }

  //Essa função é responsável por substitur o ajuste
  function adicionarAjuste(newZ: Array<number>): void {
    ajuste = newZ;
    //console.log(`olha adc no ajustes ${ajuste}`);
    setArrayAjustes(prevState => { return { ...prevState, "ajuste": ajuste } });

  }


  //Esta função é responsável por ajustar a linha do Z
  function ajustes(): void {
    pcvJSON.objetivo.map((item, indexColuna) => (
      //console.log(`verificando o item ${item} coluna ${indexColuna + 1}`),
      item === bigM ?
        pcvJSON.restricoes.map((restricao, indexLinha) => (
          restricao[indexColuna] === 1 ?
            newZ.forEach((item, indexTeste) => (newZ.push(item - bigM * pcvJSON.restricoes[indexLinha][indexTeste])), limparNewZ(),)
            //console.log(`teste ${pcvJSON.objetivo.forEach((item, indexTeste) => console.log(`item z ${indexTeste} valor ${item - bigM*pcvJSON.restricoes[indexLinha][indexTeste]} restricao[indexColuna] ${indexTeste} ${pcvJSON.restricoes[indexLinha][indexTeste]}`))}`)
            //console.log(`Coluna ${indexColuna+1} Linha ${indexLinha+1} Restricao ${restricao[indexColuna]}`) ,
            :
            console.log()
        ),
        )
        :
        console.log()
    ));
  }

  //Retorna o menor valor em um array do números menores que 0
  function menorValorZ(): Array<number> {
    let arrayAux: Array<number> = [];
    for (let i = 0; i < arrayAjustes.ajuste.length - 1; i++) {
      if (arrayAjustes.ajuste[i] < 0)
        arrayAux.push(arrayAjustes.ajuste[i]);
    }
    return arrayAux;

  }

  //Retorna o index do array onde se encontra o menor valor
  function getIndexMenorValor(array: Array<number>): number {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] === Math.min.apply(Math, array)) {
        return i;
      }
    }
    return bigM;
  }

  //retorna um array com toda a coluna pivo
  function getColunaPivo(): Array<number> {
    let indexColunaPivo: number = getIndexMenorValor(menorValorZ());
    let colunaPivo: Array<number> = [];

    for (let i = 0; i < pcvJSON.restricoes.length; i++) {
      colunaPivo.push(pcvJSON.restricoes[i][indexColunaPivo]);
    }
    return colunaPivo;
  }

  //retorna um array com toda a coluna de cof
  function getColunaB(): Array<number> {
    let colunaB: Array<number> = [];

    for (let i = 0; i < pcvJSON.restricoes.length; i++) {
      colunaB.push(pcvJSON.restricoes[i][55]);
    }
    return colunaB;
  }
  function getCof(): Array<number> {
    let cof: Array<number> = [];
    let colunaPivo: Array<number> = getColunaPivo();
    let colunaB: Array<number> = getColunaB();
    for (let i = 0; i < pcvJSON.restricoes.length; i++) {
      if (colunaPivo[i] !== 0) {
        cof.push(colunaB[i] / colunaPivo[i]);
      } else {
        cof.push(bigM);
      }
    }
    return cof;
  }

  //retorna um array com toda a linha pivo
  function getLinhaPivo(): Array<number> {
    let linhaPivo: Array<number> = [];
    let cof: Array<number> = getCof();
    linhaPivo = pcvJSON.restricoes[getIndexMenorValor(cof)]

    return linhaPivo;
  }

  function simplex() {
    let colunaPivo: Array<number> = getColunaPivo();
    let cof: Array<number> = getCof();
    let linhaPivo: Array<number> = pcvJSON.restricoes[getIndexMenorValor(cof)];
    let objetivo: Array<number> = arrayAjustes.ajuste;
    let newObjetivo: Array<number> = [];
    let restricoes: Array<Array<number>> = [[]];
    for (let i = 0; i < colunaPivo.length; i++) {
      let restricao: Array<number> = [];
      if (colunaPivo[i] === 1 && i !== getIndexMenorValor(cof)) {
        pcvJSON.restricoes[i].forEach((item, index) => (restricao.push(item - linhaPivo[index])))
        restricoes.push(restricao);
      } else {
        restricao = pcvJSON.restricoes[i];
        restricoes.push(restricao);
      }
    }

    if (linhaPivo !== undefined) {
      objetivo.forEach((item, index) => (newObjetivo.push(item - (objetivo[getIndexMenorValor(menorValorZ())] * linhaPivo[index]))));
    }

    console.log(`Restricoes: ${restricoes}, Objetivo: ${newObjetivo}`);
  }
  useEffect(() => {
    ajustes();
  }, []);
  console.log(simplex())
  return (
    <div >
      <h1>Problema do caixeiro viajante - BigM </h1>
      <p>
        <table>
          <tr><th></th>{pcv.objetivo.map((item, index) => (<th key={index}>{index + 1}</th>))}</tr>
          {pcv.restricoes.map((restricao, index) => (<tr key={index}><th>{index + 1}</th>{restricao.map((item, index) => (<td key={index}>{item}</td>))}</tr>))}
          <tr><th>Z</th>{pcv.objetivo.map((item, index) => (<td key={index}>{item}</td>))}</tr>
          <tr><th>-Z</th>{arrayAjustes.ajuste.map((item, index) => (<td key={index}>{item}</td>))}</tr>
        </table>
      </p>
    </div>
  );
}

export default App;
