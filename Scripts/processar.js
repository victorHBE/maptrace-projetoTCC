function processarArquivo() {
    
    const loader = document.querySelector('#loader');
    loader.style.display = 'block'; // Exibe o loader

    const fileInput = document.querySelector('#arquivo');
    const cidade = document.getElementById('cidade');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const conteudoArquivo = event.target.result;

      try {
        const dados = JSON.parse(conteudoArquivo);

        const poligonos = dados.features.map(feature => {
          const coords = feature.geometry.coordinates;
          const type = feature.geometry.type;
          const properties = feature.properties;
          let polygon;

          if (type === 'Polygon') {
            polygon = turf.polygon(coords);
          } else if (type === 'MultiPolygon') {
            polygon = turf.multiPolygon(coords);
          } else {
            throw new Error('Invalid geometry type');
          }

          return {
            type: 'Feature',
            properties,
            geometry: polygon.geometry,
            polygon: polygon
          };
        });

        const sobreposicoes = calcularSobreposicoes(poligonos);
        
        // Oculta o loader
        loader.style.display = 'none';

        // Armazena os dados processados e as sobreposições no armazenamento local
        //localStorage.setItem('dadosProcessados', JSON.stringify(poligonos));
        localStorage.setItem('sobreposicoes', JSON.stringify(sobreposicoes));
        localStorage.setItem('cidade', JSON.stringify(cidade.value));

        enviarDados(sobreposicoes, cidade.value);

        // Redirecionando para a index.html
        // window.location.href = 'index.html';
      } catch (error) {
        console.error('Erro ao analisar o arquivo JSON:', error);
        // Oculta o loader em caso de erro
        loader.style.display = 'none';
      }
    };

    if (file) {
      reader.readAsText(file);
    }
    
  }

  function enviarDados(sobreposicoes, cidade) {
    axios.post('http://localhost:3000/overlap/salvar-dados', { sobreposicoes, cidade })
        .then(response => {
            console.log(response);
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Erro ao enviar os dados:', error);
        });
}