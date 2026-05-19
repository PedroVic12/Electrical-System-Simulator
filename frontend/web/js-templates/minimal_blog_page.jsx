"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ==========================================
// MOCK CONTENT (simulando content/notes)
// ==========================================
const contentModel = {
    geracao: [
        {
            title: "Hidrelétricas",
            description:
                "Maior fonte do Brasil. Uso de energia potencial da água para geração de energia elétrica.",
        },
        {
            title: "Eólicas",
            description:
                "Uso da energia dos ventos para gerar eletricidade com baixo impacto ambiental.",
        },
    ],

    transmissao: [
        {
            title: "Linhas de Transmissão",
            description:
                "Transportam energia em alta tensão reduzindo perdas ao longo do sistema.",
        },
    ],

    distribuicao: [
        {
            title: "Distribuição",
            description:
                "Entrega energia ao consumidor final com tensão reduzida.",
        },
    ],
};

// ==========================================
// COMPONENTES REUTILIZÁVEIS (POO STYLE)
// ==========================================
function Row({ children }) {
    return <div className="flex flex-wrap gap-4">{children}</div>;
}

function Column({ children }) {
    return <div className="flex flex-col gap-4 w-full">{children}</div>;
}

function TabButton({ label, active, onClick }) {
    return (
        <Button
            onClick={onClick}
            className={`rounded-xl $${active
                ? "bg-cyan-600 text-white"
                : "bg-slate-200 hover:bg-cyan-500"
                }`}
        >
            {label}
        </Button>
    );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function Page() {
    const [activeTab, setActiveTab] = useState("geracao");
    const [activeItem, setActiveItem] = useState(null);

    const tabs = Object.keys(contentModel);
    const items = contentModel[activeTab];

    return (
        <main className="min-h-screen bg-gray-900 text-white p-6">
            {/* HEADER */}
            <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">
                ⚡ Dashboard SEP - Estudo ONS
            </h1>

            {/* TABS */}
            <Row>
                {tabs.map((tab) => (
                    <TabButton
                        key={tab}
                        label={tab.toUpperCase()}
                        active={tab === activeTab}
                        onClick={() => {
                            setActiveTab(tab);
                            setActiveItem(null);
                        }}
                    />
                ))}
            </Row>

            {/* CONTENT GRID */}
            <Column>
                <Row>
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer bg-gray-800 hover:bg-cyan-700 transition"
                            onClick={() => setActiveItem(item)}
                        >
                            <CardContent className="p-4">
                                <h3 className="font-bold">{item.title}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </Row>

                {/* DETAIL PANEL */}
                {activeItem && (
                    <Card className="bg-purple-800">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-yellow-300">
                                {activeItem.title}
                            </h2>
                            <p className="mt-2 text-gray-200">
                                {activeItem.description}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </Column>

            {/* FOOTER */}
            <footer className="mt-10 text-center text-gray-400 text-sm">
                Projeto SEP • Python + React + Dados
            </footer>
        </main>
    );
}
