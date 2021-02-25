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
  const bigM = 99999;
  //let count: number = 0;
  let newZ: Array<number> = pcvJSON.objetivo;
  let ajuste: Array<number> = arrayAjustes.ajuste;
  
  
  //Funções
  //Essa função é resposavel por limpar a variavel que recebe os ajustes na função ajuste() e adcionar o novo ajuste na variavel arrayAjustes
  function limparNewZ() {
    //console.log(`${count}Chamou limparNewZ ${newZ}`)
    newZ = [];
    adicionarAjuste(newZ);
    //count++;
  }

  //Essa função é responsável por substitur o ajuste
  function adicionarAjuste(newZ: Array<number>) {
    ajuste = newZ;
    //console.log(`olha adc no ajustes ${ajuste}`);
    setArrayAjustes(prevState => { return { ...prevState, "ajuste": ajuste } });

  }


  //Esta função é responsável por ajustar a linha do Z
  function ajustes() {
    pcvJSON.objetivo.map((item, indexColuna) => (
      console.log(`verificando o item ${item} coluna ${indexColuna + 1}`),
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
  function teste() {
    console.log("aqui vai o simplex")
  }

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
