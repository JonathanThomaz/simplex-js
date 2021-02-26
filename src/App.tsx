import React, { useEffect, useState } from 'react';
import { pcv } from './pcv';


function App() {
  useEffect(() => {
    ajustes();
  }, []);

  //variaveis
  const [pcvJSON, setPcvJSON] = useState(pcv);
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
  function menorValorZ(): Array<number> {
    let arrayAux: Array<number> = [];
    for (let i = 0; i < arrayAjustes.ajuste.length - 1; i++) {
      if (arrayAjustes.ajuste[i] < 0)
        arrayAux.push(arrayAjustes.ajuste[i]);
    }
    return arrayAux;

  }
  function getIndexMenorValor(array: Array<number>): number {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] === Math.min.apply(Math, array)) {
        return i;
      }
    }
    return bigM;
  }
  function getColunaPivo(): Array<number> {
    let indexColunaPivo: number = getIndexMenorValor(menorValorZ());
    let colunaPivo: Array<number> = [];

    for (let i = 0; i < pcvJSON.restricoes.length; i++) {
      colunaPivo.push(pcvJSON.restricoes[i][indexColunaPivo]);
    }
    return colunaPivo;
  }
  function getColunaB(): Array<number> {
    let colunaB: Array<number> = [];

    for (let i = 0; i < pcvJSON.restricoes.length; i++) {
      colunaB.push(pcvJSON.restricoes[i][55]);
    }
    return colunaB;
  }
  function getLinhaPivo() {
    let linhaPivo: Array<number> = [];
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
    linhaPivo = pcvJSON.restricoes[getIndexMenorValor(cof)]
    
    return linhaPivo;
  }

  console.log(getLinhaPivo())
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
