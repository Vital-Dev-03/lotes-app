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

  // Função para interagir com a API Omie
  async function omie() {
    // Configurações do cabeçalho
    const cabecalhoOptions = {
      method: 'POST',
      body: JSON.stringify({ call: "ConsultarPedido", payload: { "numero_pedido": inputPedido }, url: "produtos/pedido/" }),
    };

    try {
      // Requisição à API Omie
      const response = await fetch('/api/omie', cabecalhoOptions);
      const responseData = await response.json();

      // Verificar se a propriedade pedido_venda_produto está presente
      if (responseData.pedido_venda_produto) {
        // Acessando a propriedade pedido_venda_produto
        const pedidoVendaProduto = responseData.pedido_venda_produto;

        // Acessando a propriedade data_previsao dentro do cabeçalho
        const dataPrevisao = pedidoVendaProduto.cabecalho.data_previsao;

        // Atualizando o estado dtPrevisao
        setDtPrevisao(dataPrevisao);

        // Acessando o campo valor_total_pedido dentro de total_pedido
        const valorTotalPedido = pedidoVendaProduto.total_pedido.valor_total_pedido;

        // Atualizando o estado totalValue
        setTotalValue(valorTotalPedido);

        console.log("Data de Previsão:", dataPrevisao);
        console.log("Valor Total do Pedido:", valorTotalPedido);

        const produtos = pedidoVendaProduto.det;

        const rows = produtos.map((produto, index) => (
          <Row
            key={index}
            code={produto.produto.codigo}
            itemDesc={produto.produto.descricao}
            amount={produto.produto.quantidade}
            unitPrice={produto.produto.valor_unitario}
            totalValue={produto.produto.valor_total}
            stockLocation={produto.inf_adic.codigo_local_estoque}
            weight={produto.inf_adic.peso_bruto}
          />
        ));
          
        setAllRows(rows);
      } else {
        console.warn("Propriedade 'pedido_venda_produto' ausente na resposta da API.");
      }

      console.log(responseData);
    } catch (error) {
      console.error('Erro na requisição à API Omie:', error);
    }

    const fornecedor = {
      method: 'POST',
      body: JSON.stringify({
        call: "ConsultarCliente",
        payload: {"codigo_cliente_integracao": inputPedido},
        url: '/geral/clientes/'})     
    };
    
    const fornecedorResponse = await fetch('/api/omie/', fornecedor);
    const fornecedorData = await fornecedorResponse.json();
    
    if (fornecedorData) {
      setFornecedorInfo({
        ...fornecedorInfo,
        razao_social: fornecedorData.razao_social,
        cnpj_cpf: fornecedorData.cnpj_cpf,
      });
    }
    
    console.log(fornecedorData);
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

      <div className="grid grid-rows-2 grid-cols-2 m-5 justify-between items-center">
        <div className="flex gap-x-2">
          <div className="text-2xl font-bold">Fornecedor: </div>
          <div className="text-2xl">{fornecedorInfo.razao_social}</div>
        </div>
        <br/>

        <div className="flex gap-x-2">
          <div className="text-m font-bold gap-y-8">CNPJ/CPF: </div>
          <div className="text-m">{fornecedorInfo.cnpj_cpf}</div>
        </div>

        <div className="flex gap-x-2">
          <div className="text-m font-bold">Vendedor: </div>
          <div className="text-m"></div>
        </div>

        <div className="flex gap-x-2">
          <div className="text-m font-bold">Data de Previsão: </div>
          <div className="text-m">{dtPrevisao}</div>
        </div>

        <div className="flex gap-x-2">
          <div className="text-m font-bold">Valor Total: </div>
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
      </div>

      {selectedItem !== null && (
        <div className="mt-5">
        </div>
      )}

      <div className="flex flex-col gap-y-2 mx-2 my-2">
        <div className="flex items-center justify-stretch gap-x-8 my-6">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Data de inclusão</span>
            </div>
            <span type="date" placeholder="" className="input input- w-full max-w-xs" />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Identificação</span>
            </div>
            <select className="select select-bordered">
              <option disabled selected> </option>
              <option>a</option>
              <option>b</option>
              <option>c</option>
              <option>d</option>
              <option>e</option>
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Data de fabricação</span>
            </div>
            <span type="date" placeholder="" className="input input w-full max-w-xs" />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Data de validade</span>
            </div>
            <span type="date" placeholder="" className="input input- w-full max-w-xs" />
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
    </>
  );
} 