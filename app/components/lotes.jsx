import React, { useEffect } from 'react';

function Lotes() {
  useEffect(() => {
    const fetchData = async () => {
      const url = '/api/omie/estoque/comprador/';

      const listarCompradoresOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call: 'ListarCompradores',
          app_key: '2195462804535',
          app_secret: '613348abc256e52d487df9b388b8329a',
          param: { pagina: 1, registros_por_pagina: 50 },
        }),
      };

      try {
        const response = await fetch(url, listarCompradoresOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Conteúdo do componente */}
    </div>
  );
}

export default Lotes;
