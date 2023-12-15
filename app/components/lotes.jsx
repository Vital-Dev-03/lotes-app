import React from 'react';
import Row from '@/app/components/row';

// Componente Home
export default function Home() {
  return (
    <>
      <div>
        <label className="text-2xl font-bold gap-x-10">Ultimos Lotes</label>
      </div>
      <br />
      <div className="flex w-full">
        <div className="grid h-50 flex-auto card bg-base-300 rounded-box place-items-stretch max-w-md">
          <div className="overflow-x-auto">
            <table className="table table-zebra max-w-md">
              <thead>
                <tr>
                  <th></th>
                  <th>identificador do lote</th>
                  <th>codigo</th>
                  <th>estoque</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <th>4</th>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
                <tr>
                  <th>5</th>
                  <td>A</td>
                  <td>B</td>
                  <td>C</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


        <div className="divider divider-horizontal"></div>

        <div className="grid h-25 flex-grow card bg-base-300 rounded-box place-items-center">
          <div className="flex flex-col gap-y-2 mx-2 my-2">
            <div className="flex items-center justify-stretch gap-x-8 my-6">
              <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Identificação do lote:</span>
                </div>
                <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                <div className="label">
                  <button className="btn btn-sm">Pesquisar</button>
                </div>
              </label>
              </div>
              <div className="divider divider-horizontal">ou</div>
              <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">SKU:</span>
                </div>
                <input type="text" placeholder="" className="input input-bordered w-full max-w-xs" />
                <div className="label">
                <button className="btn btn-sm">Pesquisar</button>
                </div>
              </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider divider-neutral"></div>
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
              <input type="text" placeholder="" className="input input-bordered w-full max-w-xs"/>
            </label>
          <button className="btn border-2 border-indigo-500 self-start">Salvar</button>
        </div>
      </div>
    </>
  );
}
