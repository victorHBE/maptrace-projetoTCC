//Importando arquivo json da localizações das fazendas
//import jsonData from '../ArquivosJson/AREA_IMOVEL.json' assert {type: 'json'};

// Calcula as sobreposições entre os polígonos
 function calcularSobreposicoes(arqvJson) {

  const sobreposicoes = []
  for (let i = 0; i < arqvJson.length; i++) {
    for (let j = i + 1; j < arqvJson.length; j++) {
      try {
        const sobreposicao = turf.intersect(arqvJson[i].polygon, arqvJson[j].polygon);

        if (sobreposicao) {
          let areaMtsDaSobreposicao = turf.area(sobreposicao);
          let poligonoDaArea = turf.area(arqvJson[i].polygon);
          let marca1 = arqvJson[i].properties.COD_IMOVEL;
          let marca2 = arqvJson[j].properties.COD_IMOVEL;
          sobreposicao.porcentagens = {
            'metros': areaMtsDaSobreposicao,
            'porcentagem': (areaMtsDaSobreposicao / poligonoDaArea) * 100,
            'area1': marca1,
            'area2': marca2
          }
          console.log(sobreposicao);
          sobreposicoes.push(sobreposicao);

        }
      }
      catch (e) {
        // declarações para manipular quaisquer exceções
        console.log(e); // passa o objeto de exceção para o manipulador de erro
      }

    }

  }
  console.log(sobreposicoes)

  return sobreposicoes;
}

// função caso de algum erro
function error(err) {
  console.log(err);
}



