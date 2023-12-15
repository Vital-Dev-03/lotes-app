import React, { useState } from 'react';
import Row from '@/app/components/row';

// Componente Home
export default function Home() {
  // Estados
  const [inputPedido, setInputPedido] = useState("");
  const [allRows, setAllRows] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loteData, setLoteData] = useState({
    idLote: "",
    estoqueLote: "",
  });
  const [totalValue, setTotalValue] = useState(0);
  const [dtPrevisao, setDtPrevisao] = useState("");
  const [fornecedorInfo, setFornecedorInfo] = useState({
    nCodFor: "",
    razaoSocial: "",
    cnpjCpf: "",
    nomeComprador: "",
  });

  async function omie() {
    // Configurações do cabeçalho
    const cabecalhoOptions = {
      method: 'POST',
      body: JSON.stringify({ 
        call: "ConsultarPedCompra", 
        payload: { "cNumero": inputPedido }, 
        url: "produtos/pedidocompra/" }),
    };

    try {
      // Requisição à API Omie
      const response = await fetch('/api/omie', cabecalhoOptions);
      const responseData = await response.json();

      // Processamento dos dados da resposta
      const dataCabecalho = responseData.cabecalho_consulta;
      console.log(responseData);

      if (dataCabecalho) {
        const nCodCompr = dataCabecalho.nCodCompr;
        console.log('nCodCompr:', nCodCompr);

        setDtPrevisao(dataCabecalho.dDtPrevisao);

        const nCodFor = dataCabecalho.nCodFor;

        // Atualização do estado fornecedorInfo
        setFornecedorInfo({ ...fornecedorInfo, nCodFor });

        // Consulta de informações do fornecedor
        const fornecedorOptions = {
          method: 'POST',
          body: JSON.stringify({
            call: "ConsultarCliente",
            payload: { "codigo_cliente_omie": nCodFor },
            url: "geral/clientes/",
          }),
        };

        const fornecedorResponse = await fetch('/api/omie', fornecedorOptions);
        const fornecedorData = await fornecedorResponse.json();

        console.log(fornecedorData);
        if (fornecedorData) {
          setFornecedorInfo({
            ...fornecedorInfo,
            razaoSocial: fornecedorData.razao_social,
            cnpjCpf: fornecedorData.cnpj_cpf,
          });
        }

        // Consulta de informações do comprador
        const compradorOptions = {
          method: 'POST',
          body: JSON.stringify({ call: "ListarCompradores", payload: {
            pagina: 1,
            registros_por_pagina: 50
          }, url: '/estoque/comprador/' }), 
        };

        const compradorResponse = await fetch('/api/omie', compradorOptions);
        const compradorData = await compradorResponse.json();
        
        console.log("informação comprador", compradorData);

        let nomeComprador = null;

        for (const comprador of compradorData.cadastros) {
          if (comprador.nCodigo === nCodCompr) {
            nomeComprador = comprador.cDescricao;
            break;
          }
        }

        // Atualização do estado do fornecedorInfo com nomeComprador
        setFornecedorInfo((prevInfo) => ({
          ...prevInfo,
          nomeComprador: nomeComprador !== null ? nomeComprador : prevInfo.nomeComprador,
        }));

        const prods = responseData.produtos_consulta;
        let temp = [];
        let iterator = 1;
        let total = 0;

        for (const products in prods) {
          // Consulta de locais de estoque
          const options = {
            method: 'POST',
            body: JSON.stringify({ call: "ListarLocaisEstoque", 
            payload: { "nPagina": 1, "nRegPorPagina": 20 }, 
            url: "estoque/local/" }),
          };

          var nomeEstoque;

          const fetchResponse = await fetch('/api/omie', options);
          const locaisResponse = await fetchResponse.json();
          const data = locaisResponse.locaisEncontrados;

          for (const locais in data) {
            var codLocal = data[locais].codigo_local_estoque;
            if (codLocal == prods[products].codigo_local_estoque) {
              nomeEstoque = data[locais].descricao;
              break;
            }
          }

          temp.push(
            <Row
              rowNumber={iterator}
              code={prods[products].cProduto}
              itemDesc={prods[products].cDescricao}
              amount={prods[products].nQtde}
              unitPrice={prods[products].nValUnit}
              totalValue={prods[products].nValTot}
              stockLocation={nomeEstoque}
              weight={prods[products].nPesoLiq}
            />
          );

          total += prods[products].nValTot;
          iterator += 1;
        }

        setTotalValue(total);
        setAllRows(temp);

      }
    } catch (error) {
      console.error(error);
    }
    
  }

  function handleCheckboxChange(productIndex) {
    setSelectedItem(productIndex);

    if (productIndex !== null) {
      const estoqueDoLote = allRows[productIndex].props.amount;
      setLoteData({
        idLote: "",
        estoqueLote: estoqueDoLote,
      });
    } else {
      setLoteData({
        idLote: "",
        estoqueLote: "",
      });
    }
  }

  // Função para lidar com a mudança no estoque do lote
  function handleEstoqueLoteChange(e) {
    setLoteData({
      ...loteData,
      estoqueLote: e.target.value,
    });
  }

  // Renderização do componente Home
  return (
    <>
      <div className="flex justify-center gap-x-2 py-7">
        <div className="text-2xl font-bold">Nº do pedido: </div>
        <input
          type="text"
          placeholder="Escreva aqui..."
          className="input input-bordered w-1/2"
          onChange={(e) => { setInputPedido(e.target.value) }}
        />
        <button className="btn border-2 border-indigo-500" onClick={(e) => omie()}>Confirmar</button>
      </div>

      {/* Seção de informações do pedido */}
      <div className="grid grid-rows-2 grid-cols-2 m-5 justify-between items-center">
        {/* Informações do fornecedor */}
        <div className="flex gap-x-2">
          <div className="text-2xl font-bold gap-y-8">Fornecedor: </div>
          <div className="text-2xl">{fornecedorInfo.razaoSocial}</div>
        </div>
        <br/>

        <div className="flex gap-x-2">
          <div className="text-m font-bold gap-y-8">CNPJ/CPF: </div>
          <div className="text-m">{fornecedorInfo.cnpjCpf}</div>
        </div>

        <div className="flex gap-x-2">
          <div className="text-m font-bold gap-y-8">Comprador: </div> 
          <div className="text-m">{fornecedorInfo.nomeComprador}</div>
        </div>

        <div className="flex gap-x-2">
          <div className="text-m font-bold gap-y-8">Data de Previsão: </div>
          <div className="text-m">{dtPrevisao}</div>
        </div>

        <div className="flex gap-x-2">
          <div className="text-m font-bold gap-y-8">Valor Total: </div>
          <div className="text-m">{totalValue}</div>
        </div>
      </div>

      <div className="flex gap-x-2">
        <div className="text-3xl font-bold my-5 mx-5">Produto:</div>
      </div>
      <div className="overflow-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Selecionar</th>
              <th>Código</th>
              <th>Descrição do Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Valor Total do Item</th>
              <th>Local Estoque</th>
              <th>Peso</th>
            </tr>
          </thead>
          <tbody>

            {allRows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItem === index}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td>{row.props.code}</td>
                <td>{row.props.itemDesc}</td>
                <td>{row.props.amount}</td>
                <td>{row.props.unitPrice}</td>
                <td>{row.props.totalValue}</td>
                <td>{row.props.stockLocation}</td>
                <td>{row.props.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-y-2 mx-2 my-2">
          <div className="flex items-center justify-stretch gap-x-8 my-6">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Data de inclusão</span>
              </div>
              <input type="date" placeholder="" className="input input-bordered w-full max-w-xs" />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Identificação do lote</span>
              </div>
              <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Data de fabricação</span>
              </div>
              <input type="date" placeholder="" className="input input-bordered w-full max-w-xs" />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Data de validade</span>
              </div>
              <input type="date" placeholder="" className="input input-bordered w-full max-w-xs" />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Estoque do lote</span>
              </div>
              <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" value={loteData.estoqueLote} onChange={handleEstoqueLoteChange} />
            </label>
            <button className="btn border-2 border-indigo-500 self-start">Salvar</button>
          </div>
        </div>
      </div>
    </>
  );
}
