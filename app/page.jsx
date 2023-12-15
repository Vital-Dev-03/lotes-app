"use client";
import { useState } from "react";
import Venda from "@/app/components/venda";
import Main from "@/app/components/main";
import Lotes from "@/app/components/lotes";

export default function Home() {
  const [inputPedido, setInputPedido] = useState("");
  const [allRowsRecebimento, setAllRowsRecebimento] = useState([]);
  const [allRowsVenda, setAllRowsVenda] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("recebimento");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="ml-24">
        <div className="flex items-center justify-between mx-2 my-2">
          <button className="btn border-2 border-indigo-500">Voltar</button>
          <div className="text-5xl font-bold text-white">Lotes</div>
          <div className="w-5"></div>
        </div>
        <div className="divider"></div>

        <div role="tablist" className="tabs tabs-bordered my-5">
          <a
            role="tab"
            className={`tab ${activeTab === "recebimento" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("recebimento")}
          >
            Recebimento
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "venda" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("venda")}
          >
            Venda
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === "lotes" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("lotes")}
          >
            Lotes
          </a>
        </div>

        {activeTab === "recebimento" && <Main />}
        {activeTab === "venda" && <Venda />}
        {activeTab === "lotes" &&  <Lotes />}
      </div>
    </>
  );
}