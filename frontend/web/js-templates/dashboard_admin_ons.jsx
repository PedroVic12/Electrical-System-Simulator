"use client";
import React, { useState } from "react";

// ==========================================
// 1. DADOS (Mock de uma API Python/SQLite)
// ==========================================
const apiDados = {
    visaoGeral: [
        { id: 1, title: "Carga do Sistema (SIN)", value: "85.400 MW", trend: "+2.4%", status: "normal" },
        { id: 2, title: "Frequência", value: "60.02 Hz", trend: "estável", status: "normal" },
        { id: 3, title: "Reserva Girante", value: "3.200 MW", trend: "-1.2%", status: "alert" },
    ],
    matriz: [
        { id: 1, title: "Hidrelétrica", value: "65%", info: "Nível de reservatórios a 72%" },
        { id: 2, title: "Eólica", value: "15%", info: "Ventos fortes no NE" },
        { id: 3, title: "Solar", value: "10%", info: "Pico de geração 13:00" },
        { id: 4, title: "Térmica", value: "10%", info: "Despacho mínimo" },
    ]
};

// ==========================================
// 2. COMPONENTES BASE (Estilo Flutter / SOLID)
// ==========================================
const Row = ({ children, className = "" }) => (
    <div className={`flex flex-row items-center gap-4 ${className}`}>{children}</div>
);

const Column = ({ children, className = "" }) => (
    <div className={`flex flex-col gap-4 ${className}`}>{children}</div>
);

const CardItem = ({ title, value, trend, status, info }) => {
    // Paleta estilo Dracula (Dark Vibe)
    const isAlert = status === "alert";
    return (
        <div className={`p-6 rounded-xl border border-gray-700 bg-gray-800 shadow-lg flex-1 transition-all hover:border-blue-500`}>
            <Column>
                <span className="text-gray-400 text-sm font-semibold tracking-wider uppercase">{title}</span>
                <Row className="items-end justify-between">
                    <span className="text-3xl font-bold text-gray-100">{value}</span>
                    {trend && (
                        <span className={`text-sm font-medium ${isAlert ? 'text-yellow-500' : 'text-emerald-400'}`}>
                            {trend}
                        </span>
                    )}
                </Row>
                {info && <span className="text-xs text-gray-500 mt-2">{info}</span>}
            </Column>
        </div>
    );
};

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${active
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
    >
        {label}
    </button>
);

// ==========================================
// 3. PAINEIS DE CONTEÚDO (Injeção de Dependência)
// ==========================================
const VisaoGeralPanel = () => (
    <Column className="w-full">
        <h2 className="text-xl font-bold text-gray-200 mb-2">Despacho de Carga (Tempo Real)</h2>
        <Row className="w-full flex-wrap">
            {apiDados.visaoGeral.map(item => (
                <CardItem key={item.id} {...item} />
            ))}
        </Row>
    </Column>
);

const MatrizEnergeticaPanel = () => (
    <Column className="w-full">
        <h2 className="text-xl font-bold text-gray-200 mb-2">Composição da Matriz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiDados.matriz.map(item => (
                <CardItem key={item.id} {...item} />
            ))}
        </div>
    </Column>
);

// ==========================================
// 4. MAIN APP (Controller)
// ==========================================
export default function EngineeringDashboard() {
    const [activeTab, setActiveTab] = useState("visao");

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="mb-10">
                    <Row className="justify-between">
                        <Column className="gap-1">
                            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                ⚡ ENG-STACK: SEP Monitor
                            </h1>
                            <p className="text-gray-400">Sistema Interligado Nacional - Dashboard Técnico</p>
                        </Column>
                        <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-sm text-gray-300 font-mono">Conectado (Tauri IPC)</span>
                        </div>
                    </Row>
                </header>

                {/* Navegação */}
                <nav className="mb-8">
                    <Row>
                        <TabButton label="Visão Geral" active={activeTab === "visao"} onClick={() => setActiveTab("visao")} />
                        <TabButton label="Matriz Energética" active={activeTab === "matriz"} onClick={() => setActiveTab("matriz")} />
                        <TabButton label="Fluxo de Carga" active={activeTab === "fluxo"} onClick={() => setActiveTab("fluxo")} />
                        <TabButton label="Documentação (MD)" active={activeTab === "docs"} onClick={() => setActiveTab("docs")} />
                    </Row>
                </nav>

                {/* Conteúdo Dinâmico */}
                <main className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm min-h-[400px]">
                    {activeTab === "visao" && <VisaoGeralPanel />}
                    {activeTab === "matriz" && <MatrizEnergeticaPanel />}
                    {activeTab === "fluxo" && (
                        <div className="flex items-center justify-center h-full text-gray-500 italic mt-20">
                            Módulo de Fluxo de Potência (Em construção - Conecte com o script Python)
                        </div>
                    )}
                    {activeTab === "docs" && (
                        <div className="flex items-center justify-center h-full text-gray-500 italic mt-20">
                            Leitor de Markdown usando 'fs' do Node será injetado aqui.
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
}