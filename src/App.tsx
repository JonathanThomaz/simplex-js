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
    newZ = [];
    adicionarAjuste(newZ);
    //count++;
  }

  //Essa função é responsável por substitur o ajuste
  function adicionarAjuste(newZ: Array<number>): void {
    ajuste = newZ;
    setArrayAjustes(prevState => { return { ...prevState, "ajuste": ajuste } });

  }


  //Esta função é responsável por ajustar a linha do Z
  function ajustes(): void {
    pcvJSON.objetivo.map((item, indexColuna) => (
      item === bigM ?
        pcvJSON.restricoes.map((restricao, indexLinha) => (
          restricao[indexColuna] === 1 ?
            newZ.forEach((item, indexTeste) => (newZ.push(item - bigM * pcvJSON.restricoes[indexLinha][indexTeste])), limparNewZ(),)
            :
            console.log()
        ),
        )
        :
        console.log()
    ));
  }

  //Retorna o menor valor em um array do números menores que 0
  function menorValorZ(array: Array<number>): Array<number> {
    let arrayAux: Array<number> = [];
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] < 0)
        arrayAux.push(array[i]);
    }
    return arrayAux;

  }
  function getIndexMenorValorNegativo(arrayObjetivo: Array<number>, arrayMenorZ: Array<number>): number {
    for (let i = 0; i < arrayObjetivo.length - 1; i++) {
      if (arrayObjetivo[i] === Math.min.apply(Math, arrayMenorZ)) {
        return i;
      }
    }
    return bigM;
  }
  //Retorna o index do array onde se encontra o menor valor
  function getIndexMenorValor(array: Array<number>): number {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === Math.min.apply(Math, array)) {
        return i;
      }
    }
    return bigM;
  }

  //retorna um array com toda a coluna pivo
  function getColunaPivo(arrayRestricoes: Array<Array<number>>, arrayObjetivo: Array<number>): Array<number> {
    let indexColunaPivo: number = getIndexMenorValorNegativo(arrayObjetivo, menorValorZ(arrayObjetivo));
    let colunaPivo: Array<number> = [];

    for (let i = 0; i < arrayRestricoes.length; i++) {
      colunaPivo.push(arrayRestricoes[i][indexColunaPivo]);
    }
    return colunaPivo;

  }

  //retorna um array com toda a coluna de cof
  function getColunaB(arrayRestricoes: Array<Array<number>>): Array<number> {
    let colunaB: Array<number> = [];

    for (let i = 0; i < arrayRestricoes.length; i++) {
      colunaB.push(arrayRestricoes[i][55]);
    }
    return colunaB;
  }
  function getCof(arrayRestricoes: Array<Array<number>>, arrayObjetivo: Array<number>): Array<number> {
    let cof: Array<number> = [];
    let colunaPivo: Array<number> = getColunaPivo(arrayRestricoes, arrayObjetivo);
    let colunaB: Array<number> = getColunaB(arrayRestricoes);
    if (colunaPivo !== null) {
      for (let i = 0; i < arrayRestricoes.length; i++) {
        if (colunaPivo[i] !== 0) {
          cof.push(colunaB[i] / colunaPivo[i]);
        } else {
          cof.push(bigM);
        }
      }
    }
    return cof;
  }

  //retorna um array com toda a linha pivo
  function getLinhaPivo(arrayRestricoes: Array<Array<number>>, arrayObjetivo: Array<number>): Array<number> {
    let linhaPivo: Array<number> = [];
    let cof: Array<number> = getCof(arrayRestricoes, arrayObjetivo);
    linhaPivo = pcvJSON.restricoes[getIndexMenorValor(cof)]

    return linhaPivo;
  }

  function simplex(ajuste: Array<number>) {
    let restricoes: Array<Array<number>> = pcvJSON.restricoes;
    let objetivo: Array<number> = ajuste;
    let indexColunaPivo = getIndexMenorValorNegativo(objetivo, menorValorZ(objetivo));
    console.log(`${indexColunaPivo}Restricoes: ${restricoes}, Objetivo: ${objetivo}`)
    let count = 0;
    while (indexColunaPivo !== bigM) {
      
      let colunaPivo: Array<number> = getColunaPivo(restricoes, objetivo);
      let cof: Array<number> = getCof(restricoes, objetivo);
      let linhaPivo: Array<number> = getLinhaPivo(restricoes, objetivo);
      
      let newObjetivo: Array<number> = [];
      let newRestricoes: Array<Array<number>> = [];
      for (let i = 0; i < colunaPivo.length; i++) {
        let restricao: Array<number> = [];
        if (colunaPivo[i] !== 0 && i !== getIndexMenorValor(cof)) {
          for (let f = 0; f < restricoes[i].length; f++) {
            restricao.push(restricoes[i][f] - (restricoes[i][indexColunaPivo] * linhaPivo[f]))
          }
          newRestricoes.push(restricao);
        } else {
          restricao = restricoes[i];
          newRestricoes.push(restricao);
        }
      }

      if (linhaPivo !== undefined) {
        for (let i = 0; i < objetivo.length; i++) {
          //console.log(`${objetivo[indexColunaPivo]}*${linhaPivo[i]}=${Math.abs(objetivo[indexColunaPivo]) * linhaPivo[i]}`)
          newObjetivo.push(objetivo[i] - (objetivo[indexColunaPivo]* linhaPivo[i]))
        }
      }
      objetivo = newObjetivo;
      restricoes = newRestricoes;
      indexColunaPivo = getIndexMenorValorNegativo(objetivo, menorValorZ(objetivo))
      console.log(`${count} index:${getIndexMenorValorNegativo(objetivo, menorValorZ(objetivo))} Restricoes: ${restricoes.forEach(item => console.log(`[${item}]`))}, Objetivo: [${objetivo}]`)
      count++;
    }




    // if (newRestricoes !== [] && newObjetivo !== []) {
    //   setPcvJSON(prevState => { return { ...prevState, "restricoes": newRestricoes } });
    //   setPcvJSON(prevState => { return { ...prevState, "objetivo": newObjetivo } });
    // }

  }

  useEffect(() => {
    ajustes();
    simplex(arrayAjustes.ajuste);
  });
  // if (getIndexMenorValor(menorValorZ()) !== bigM) { simplex(); }

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
