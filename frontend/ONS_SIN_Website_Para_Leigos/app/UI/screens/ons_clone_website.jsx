"use client"; // This directive is CRUCIAL for Next.js App Router

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Menu, X, Apple, Zap, Twitter, Youtube, Music, Linkedin, Instagram, Play, User, Users, FileText, Globe, ClipboardList, BookOpen, Map, Settings, ZapOff, Send } from 'lucide-react';

// --- 1. DATA (Model) ---
const ONS_GREEN = '#4CAF50';
const DARK_MODE_BACKGROUND = '#1c1c1c';
const DARK_MODE_FOREGROUND = '#e0e0e0';

const navData = {
    topBar: [
        { label: 'PROTOCOLO ONS', href: '#' },
        { label: 'SINTEDE', href: '#' },
        { label: 'TRABALHE NO ONS', href: '#' },
        { label: 'VISITE O ONS', href: '#' },
        { label: 'FALE CONOSCO', href: '#' },
        { label: 'FORNECEDORES', href: '#' },
    ],
    mainMenu: [
        { label: 'SOBRE O ONS', href: '#' },
        { label: 'SOBRE O SIN', href: '#' },
        { label: 'ENERGIA NO FUTURO', href: '#' },
        { label: 'ENERGIA AMANHÃ', href: '#' },
        { label: 'ENERGIA AGORA', href: '#' },
        { label: 'RESULTADOS DA OPERAÇÃO', href: '#' },
        { label: 'CONHECIMENTO', href: '#' },
        { label: 'IMPRENSA', href: '#' },
    ],
    subMenu: [
        { label: 'O QUE SÃO', id: 'oque-sao' },
        { label: 'VIGENTES', id: 'vigentes' },
        { label: 'BUSCA AVANÇADA', id: 'busca-avancada' },
        { label: 'HISTÓRICO', id: 'historico' },
        { label: 'MAPO', id: 'mapo' },
        { label: 'SISTEMAS', id: 'sistemas' },
        { label: 'REFERÊNCIAS', id: 'referencias' },
    ],
    sidebarMenu: [
        { 
            title: "Elite Operations", 
            icon: Zap, 
            items: [
                { label: "Cadastro Elite (New)", route: 'REGISTRATION', icon: User },
                { label: "Lista de Funcionários", route: 'EMPLOYEELIST', icon: Users },
                { label: "Nova Notícia (Dark Mode)", route: 'NEWPOST', icon: FileText }
            ]
        },
        { 
            title: "Procedimentos de Rede", 
            icon: ClipboardList, 
            items: [
                { label: "O Que São", route: 'HOME', id: 'oque-sao-sidebar' },
                { label: "Documentos Vigentes", route: 'HOME', id: 'vigentes-sidebar' },
                { label: "Histórico Completo", route: 'HOME', id: 'historico-sidebar' },
            ] 
        },
        { 
            title: "Outras Rotas", 
            icon: Globe, 
            items: [
                { label: "Sobre o SIN", route: 'HOME', id: 'sin' },
                { label: "Fale Conosco", route: 'HOME', id: 'contato' },
            ] 
        },
    ]
};

const ROUTES = {
    HOME: 'HOME',
    REGISTRATION: 'REGISTRATION',
    EMPLOYEELIST: 'EMPLOYEELIST',
    NEWPOST: 'NEWPOST',
};

const LOCAL_STORAGE_KEY = 'elite_employees';

// --- 2. CONTROLLER (Hook for State & Logic) ---

const useNavigationController = () => {
    const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState('vigentes');

    // Navigation handlers
    const navigateTo = useCallback((route) => {
        setCurrentRoute(route);
        setIsSidebarOpen(false); // Close sidebar on navigation
        setActiveSubMenu('vigentes'); // Reset sub-menu when changing main pages
    }, []);

    const handleSubMenuClick = useCallback((id) => {
        setActiveSubMenu(id);
        setCurrentRoute(ROUTES.HOME); // Sub-menu always navigates to HOME view content
    }, []);

    return {
        currentRoute,
        navigateTo,
        isSidebarOpen,
        setIsSidebarOpen,
        activeSubMenu,
        handleSubMenuClick,
    };
};

const useEmployeeStorage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const storedEmployees = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedEmployees) {
                setEmployees(JSON.parse(storedEmployees));
            }
        } catch (error) {
            console.error("Erro ao carregar dados do localStorage:", error);
            // Fallback to empty array
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveEmployee = useCallback((newEmployee) => {
        const newEmployeeWithId = { ...newEmployee, id: Date.now().toString() };
        
        setEmployees(prevEmployees => {
            const updatedEmployees = [...prevEmployees, newEmployeeWithId];
            
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEmployees));
            } catch (error) {
                console.error("Erro ao salvar dados no localStorage:", error);
            }
            
            return updatedEmployees;
        });
    }, []);

    // Note: No real-time updates are needed as it's localStorage
    return { employees, saveEmployee, loading };
};


// --- 3. VIEWS (Presentational Components) ---

// Modal Component
const Modal = ({ title, message, type, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300 ${type === 'success' ? 'border-b-4 border-green-500' : 'border-b-4 border-red-500'}`}>
            <h3 className={`text-xl font-bold mb-3 ${type === 'success' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {type === 'success' ? 'Sucesso!' : 'Ops!'}
            </h3>
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition duration-200 ${type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                    Entendi
                </button>
            </div>
        </div>
    </div>
);

// --- Top Bar (The very top dark blue/red banner) ---
const TopBarView = () => (
    <div className="bg-gray-800 text-xs text-white p-2 flex justify-between items-center px-4 sm:px-8">
        <div className="flex items-center space-x-4">
            <img src="https://placehold.co/100x20/003366/ffffff?text=Great+Place" alt="Great Place to Work" className="h-4 sm:h-5" />
            <img src="https://placehold.co/100x20/FF0000/ffffff?text=GPTW+Cert" alt="GPTW Certificado" className="h-4 sm:h-5" />
        </div>
        <div className="flex items-center space-x-4">
            {navData.topBar.map(item => (
                <a key={item.label} href={item.href} className="hidden lg:inline hover:text-green-300 transition-colors">
                    {item.label}
                </a>
            ))}
            <a href="#" className="flex items-center text-yellow-300 hover:text-white transition-colors">
                Entrar
            </a>
        </div>
    </div>
);

// --- Main Header (Green banner with logo and main menu) ---
const MainHeaderView = ({ navigateTo, setIsSidebarOpen }) => {
    const mainLinks = navData.mainMenu;

    return (
        <header className={`bg-[${ONS_GREEN}] shadow-lg`}>
            {/* Header Content */}
            <div className="flex justify-between items-center p-4 sm:px-8">
                {/* Logo and Mobile Menu */}
                <div className="flex items-center space-x-4">
                    <button 
                        className="text-white lg:hidden p-2 rounded-lg hover:bg-green-600 transition"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>
                    <a href="#" onClick={() => navigateTo(ROUTES.HOME)} className="flex items-center space-x-2">
                        <img src={`https://placehold.co/60x30/${ONS_GREEN.substring(1)}/ffffff?text=ONS`} alt="Logo ONS" className="h-8 sm:h-10" />
                        <span className="text-white font-bold text-lg sm:text-xl hidden sm:block">Operador Nacional do Sistema Elétrico</span>
                    </a>
                </div>

                {/* Main Menu (Desktop) */}
                <nav className="hidden lg:flex flex-1 justify-end items-center space-x-6">
                    {mainLinks.map(item => (
                        <a key={item.label} href={item.href} className="text-white text-sm font-semibold hover:text-yellow-300 transition-colors whitespace-nowrap">
                            {item.label}
                        </a>
                    ))}
                    <Search className="text-white hover:text-yellow-300 transition-colors cursor-pointer" size={18} />
                </nav>
            </div>

            {/* Cadastro Elite Button (Integrated into the header layout) */}
            <div className={`p-2 lg:p-0 flex justify-end items-center bg-green-700/50 lg:bg-transparent`}>
                <button
                    onClick={() => navigateTo(ROUTES.REGISTRATION)}
                    className="bg-yellow-400 text-green-800 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300 text-sm whitespace-nowrap"
                >
                    Cadastro Elite
                </button>
            </div>
        </header>
    );
};

// --- Sub-Navigation Bar (Procedimentos de Rede) ---
const SubNavigationView = ({ activeSubMenu, handleSubMenuClick }) => (
    <div className={`bg-green-700 text-white shadow-inner`}>
        <div className="p-4 sm:px-8">
            <h2 className="text-2xl font-light mb-2">PROCEDIMENTOS DE REDE</h2>
            <div className="flex overflow-x-auto whitespace-nowrap space-x-6 text-sm sm:text-base scrollbar-hide">
                {navData.subMenu.map(item => (
                    <a
                        key={item.id}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubMenuClick(item.id);
                        }}
                        className={`py-1 cursor-pointer transition-colors ${activeSubMenu === item.id 
                            ? 'border-b-2 border-yellow-400 font-semibold text-yellow-400' 
                            : 'hover:text-yellow-200 border-b-2 border-transparent'
                        }`}
                    >
                        {item.label}
                    </a>
                ))}
            </div>
        </div>
    </div>
);

// --- Sidebar Menu (Collapsible Navigation) ---
const SidebarView = ({ navigateTo, isSidebarOpen, setIsSidebarOpen, activeRoute }) => {
    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (title) => {
        setOpenMenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const isRouteActive = (route) => route === activeRoute;

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-100 p-4 transform transition-transform duration-300 z-50 overflow-y-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block lg:h-full lg:w-64 lg:shadow-xl`}>
                
                {/* Header (Mobile Close Button) */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h3 className="text-lg font-bold">Navegação</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav>
                    {navData.sidebarMenu.map((section) => (
                        <div key={section.title} className="mb-4 border-b border-gray-700 last:border-b-0">
                            <button
                                onClick={() => toggleMenu(section.title)}
                                className="w-full flex justify-between items-center py-2 px-2 rounded-lg hover:bg-gray-800 transition duration-150"
                            >
                                <span className="flex items-center font-semibold text-sm">
                                    <section.icon size={18} className="mr-3 text-yellow-400" />
                                    {section.title}
                                </span>
                                <span className={`transform transition-transform duration-200 ${openMenus[section.title] ? 'rotate-90' : 'rotate-0'}`}>
                                    &gt;
                                </span>
                            </button>
                            
                            {/* Sub-Items */}
                            <div className={`overflow-hidden transition-all duration-300 ${openMenus[section.title] ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                {section.items.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => navigateTo(item.route)}
                                        className={`w-full text-left py-2 pl-10 pr-2 text-sm rounded-lg transition duration-150 flex items-center
                                            ${isRouteActive(item.route) ? 'bg-green-700 text-white font-bold' : 'hover:bg-gray-700 text-gray-300'}
                                        `}
                                    >
                                        {item.icon && <item.icon size={16} className="mr-2" />}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
};

// --- Footer ---
const FooterView = () => (
    <footer className="bg-gray-100 text-gray-600 p-6 sm:p-8 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0 text-sm">
                &copy; Copyright 2025 ONS
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
                <div className="flex space-x-4">
                    <a href="#" aria-label="WhatsApp" className="hover:text-green-600 transition"><Zap size={20} /></a>
                    <a href="#" aria-label="Instagram" className="hover:text-green-600 transition"><Instagram size={20} /></a>
                    <a href="#" aria-label="LinkedIn" className="hover:text-green-600 transition"><Linkedin size={20} /></a>
                    <a href="#" aria-label="YouTube" className="hover:text-green-600 transition"><Youtube size={20} /></a>
                    <a href="#" aria-label="Spotify" className="hover:text-green-600 transition"><Music size={20} /></a>
                    <a href="#" aria-label="Apple" className="hover:text-green-600 transition"><Apple size={20} /></a>
                </div>
                
                <div className="space-x-4">
                    <a href="#" className="hover:text-green-600 transition">Endereços</a>
                    <a href="#" className="hover:text-green-600 transition">Mapa do Site</a>
                    <a href="#" className="hover:text-green-600 transition">Privacidade e Proteção de Dados</a>
                    <a href="#" className="hover:text-green-600 transition">Membro do GO15</a>
                </div>
            </div>
        </div>
    </footer>
);

// --- Content Views ---

// 3.1. Home View (Default/Procedimentos de Rede)
const HomeView = ({ activeSubMenu }) => {
    // Determine title based on the active sub-menu item
    const currentSubMenu = navData.subMenu.find(item => item.id === activeSubMenu) || navData.subMenu[0];

    return (
        <div className="p-6 sm:p-8 bg-white min-h-[60vh] flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Procedimentos de Rede: <span className="text-green-700">{currentSubMenu.label}</span>
            </h1>

            <div className="space-y-4 text-gray-700 max-w-4xl">
                <p>
                    Esta seção apresenta os detalhes sobre "{currentSubMenu.label}" conforme definido pelo Operador Nacional do Sistema Elétrico (ONS). Os procedimentos garantem a segurança, estabilidade e qualidade da operação do Sistema Interligado Nacional (SIN).
                </p>

                <h2 className="text-xl font-semibold mt-8 text-green-700">Documentação {currentSubMenu.label}</h2>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><a href="#" className="text-blue-600 hover:underline">Módulo 1: Requisitos de Conexão e Acesso</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Módulo 2: Critérios de Desempenho Operacional</a></li>
                    <li><a href="#" className="text-blue-600 hover:underline">Anexo A: Formulários Específicos para {currentSubMenu.label}</a></li>
                </ul>
            </div>
        </div>
    );
};

// 3.2. Elite Registration View
const EliteRegistrationView = ({ saveEmployee, navigateTo }) => {
    const [form, setForm] = useState({ name: '', email: '', position: '', sector: 'Geração' });
    const [modal, setModal] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Simple validation
        if (!form.name || !form.email || !form.position) {
            setModal({ 
                title: "Erro de Cadastro", 
                message: "Preencha todos os campos obrigatórios para o registro Elite.", 
                type: 'error' 
            });
            return;
        }

        try {
            saveEmployee(form);
            
            setModal({ 
                title: "Bem-vindo ao Elite!", 
                message: `O funcionário ${form.name} foi cadastrado com sucesso na base local!`, 
                type: 'success' 
            });
            setForm({ name: '', email: '', position: '', sector: 'Geração' }); // Reset form

        } catch (error) {
            console.error("Erro ao cadastrar funcionário:", error);
            setModal({ 
                title: "Erro Interno", 
                message: "Não foi possível salvar o funcionário. Verifique o console.", 
                type: 'error' 
            });
        }
    };

    return (
        <div className="p-6 sm:p-8 bg-gray-50 min-h-[60vh] flex-1">
            <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center justify-between">
                Cadastro de Novos Funcionários | Conjunto Elite
                <button 
                    onClick={() => navigateTo(ROUTES.EMPLOYEELIST)}
                    className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                >
                    Ver Lista de Funcionários
                </button>
            </h1>
            <p className="text-gray-600 mb-8 max-w-xl">
                Preencha os dados do novo membro do Conjunto Elite. Todos os dados são salvos localmente no seu navegador (`localStorage`).
            </p>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl bg-white p-6 rounded-xl shadow-lg">
                
                {/* Name */}
                <div className="col-span-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Ex: Ana Silva"
                    />
                </div>

                {/* Email */}
                <div className="col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Corporativo</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="ana.silva@empresa.com"
                    />
                </div>

                {/* Position */}
                <div className="col-span-1">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">Cargo / Função</label>
                    <input
                        type="text"
                        name="position"
                        id="position"
                        value={form.position}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Ex: Especialista em Sinótico"
                    />
                </div>

                {/* Sector */}
                <div className="col-span-1">
                    <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Setor</label>
                    <select
                        name="sector"
                        id="sector"
                        value={form.sector}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                        <option>Geração</option>
                        <option>Transmissão</option>
                        <option>Comercialização</option>
                        <option>Planejamento</option>
                        <option>Tecnologia da Informação</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center space-x-2"
                    >
                        <User size={20} />
                        <span>Cadastrar Membro Elite</span>
                    </button>
                </div>
            </form>
            
            {modal && <Modal {...modal} onClose={() => setModal(null)} />}
        </div>
    );
};

// 3.3. Employee List View
const EmployeeListView = ({ employees, loading, navigateTo }) => {
    
    // Sort employees by name
    const sortedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => a.name.localeCompare(b.name));
    }, [employees]);

    return (
        <div className="p-6 sm:p-8 bg-gray-50 min-h-[60vh] flex-1">
            <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center justify-between">
                Lista de Funcionários | Conjunto Elite ({employees.length})
                <button 
                    onClick={() => navigateTo(ROUTES.REGISTRATION)}
                    className="bg-yellow-500 text-green-900 text-sm px-4 py-2 rounded-lg shadow-md hover:bg-yellow-400 transition"
                >
                    Novo Cadastro
                </button>
            </h1>
            <p className="text-gray-600 mb-8 max-w-xl">
                Visualização de todos os membros cadastrados na base local (`localStorage`).
            </p>

            {loading && <p className="text-lg text-gray-500">Carregando dados...</p>}
            
            {!loading && sortedEmployees.length === 0 && (
                <div className="p-6 bg-white rounded-xl shadow-lg text-center">
                    <p className="text-gray-700 font-semibold">Nenhum funcionário Elite cadastrado ainda.</p>
                    <p className="text-gray-500 mt-2">Use o botão "Novo Cadastro" para começar.</p>
                </div>
            )}

            {!loading && sortedEmployees.length > 0 && (
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-green-700 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-xl">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Cargo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Setor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tr-xl">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedEmployees.map((employee, index) => (
                                <tr key={employee.id || index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.sector}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{employee.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// 3.4. News Post View (Dark Mode Clone)
const NewsPostView = ({ navigateTo }) => {
    return (
        <div className="flex bg-gray-900 min-h-screen text-gray-100">
            {/* Sidebar Left (Simulated Windsurf Menu) */}
            <div className="hidden md:block w-64 border-r border-gray-700 flex-shrink-0 bg-gray-900 sticky top-0 h-screen overflow-y-auto">
                <div className="p-4 space-y-1">
                    <h3 className="text-xs font-semibold uppercase text-gray-500 mb-4">Postagem</h3>
                    <div 
                        onClick={() => navigateTo(ROUTES.NEWPOST)}
                        className="flex items-center space-x-3 p-2 bg-green-700 text-white rounded-lg cursor-pointer transition"
                    >
                        <Send size={18} />
                        <span className="font-semibold">Criar Notícia</span>
                    </div>
                    
                    <h3 className="text-xs font-semibold uppercase text-gray-500 pt-4 mb-2">Editor</h3>
                    <div className="space-y-1 text-sm">
                        {['Layout', 'Conteúdo', 'Imagens/Mídia', 'SEO', 'Publicação'].map(item => (
                            <a key={item} href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition">
                                <FileText size={16} className="mr-3" />
                                {item}
                            </a>
                        ))}
                    </div>

                    <h3 className="text-xs font-semibold uppercase text-gray-500 pt-4 mb-2">Rascunhos</h3>
                    <div className="space-y-1 text-sm">
                        {['Rascunho: Blackout no NE', 'Rascunho: Nova ETA'].map(item => (
                            <a key={item} href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-800 text-gray-300 transition">
                                <BookOpen size={16} className="mr-3" />
                                {item}
                            </a>
                        ))}
                    </div>

                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-x-hidden p-6 md:p-10 lg:p-12 relative">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-extrabold mb-8">
                        Editor de Notícias & Publicações ONS
                    </h1>
                    
                    <div className="flex flex-col lg:flex-row lg:space-x-10">
                        
                        {/* Post Editor (Main Panel) */}
                        <div className="lg:w-3/4">
                            <h2 className="text-2xl font-semibold text-green-500 mb-4">Detalhes da Notícia</h2>
                            
                            <div className="space-y-6">
                                {/* Title Input */}
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <label htmlFor="post-title" className="block text-sm font-medium text-gray-400 mb-2">Título da Notícia (Máximo 100 caracteres)</label>
                                    <input
                                        type="text"
                                        id="post-title"
                                        className="w-full bg-transparent border-b border-gray-600 text-lg focus:outline-none focus:border-green-500 pb-1"
                                        placeholder="Ex: Novo Recorde de Geração Eólica no SIN"
                                    />
                                </div>
                                
                                {/* Content Editor Placeholder */}
                                <div className="bg-gray-800 p-4 rounded-lg min-h-[300px]">
                                    <label htmlFor="post-content" className="block text-sm font-medium text-gray-400 mb-2">Corpo da Notícia (Markdown Suportado)</label>
                                    <textarea
                                        id="post-content"
                                        className="w-full h-64 bg-transparent text-sm resize-none focus:outline-none placeholder-gray-500"
                                        placeholder="Comece a escrever a notícia aqui. Use negrito e itálico para formatação..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel (TOC/Status) */}
                        <div className="lg:w-1/4 mt-8 lg:mt-0">
                            <div className="sticky top-4">
                                <h3 className="text-sm font-semibold uppercase text-gray-500 mb-4 flex items-center">
                                    <ClipboardList size={16} className="mr-2" />
                                    Nesta Página
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="text-green-500 font-semibold border-l-2 border-green-500 pl-2">Detalhes da Notícia</li>
                                    <li className="text-gray-400 border-l-2 border-gray-700 pl-2 hover:text-green-500 transition">Otimização SEO</li>
                                    <li className="text-gray-400 border-l-2 border-gray-700 pl-2 hover:text-green-500 transition">Configurações de Data</li>
                                </ul>

                                <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-xl space-y-3">
                                    <h4 className="font-semibold text-green-500">Status da Publicação</h4>
                                    <p className="text-xs text-gray-400">Rascunho salvo às 11:45.</p>
                                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                                        Pré-Visualizar
                                    </button>
                                    <button className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                                        Publicar Agora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 4. APP COMPONENT (Main Controller/Router) ---
const WebsiteONSPage = () => {
    // 1. Controller for Navigation
    const { 
        currentRoute, 
        navigateTo, 
        isSidebarOpen, 
        setIsSidebarOpen, 
        activeSubMenu,
        handleSubMenuClick
    } = useNavigationController();

    // 2. Controller for Data/Storage (Local Storage)
    const { employees, saveEmployee, loading } = useEmployeeStorage();

    // Memoize the content view based on the current route
    const content = useMemo(() => {
        switch (currentRoute) {
            case ROUTES.REGISTRATION:
                return <EliteRegistrationView saveEmployee={saveEmployee} navigateTo={navigateTo} />;
            case ROUTES.EMPLOYEELIST:
                return <EmployeeListView employees={employees} loading={loading} navigateTo={navigateTo} />;
            case ROUTES.NEWPOST:
                return <NewsPostView navigateTo={navigateTo} />;
            case ROUTES.HOME:
            default:
                return <HomeView activeSubMenu={activeSubMenu} />;
        }
    }, [currentRoute, activeSubMenu, employees, loading, saveEmployee, navigateTo]);

    // Handle the layout structure (Sidebar or Content Only)
    const isSidebarLayout = currentRoute === ROUTES.NEWPOST;

    // Use Tailwind utility for scrollbar hiding (needs custom tailwind config for production)
    const scrollbarHide = `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    `;

    return (
        <div className="flex flex-col min-h-screen font-inter">
            {/* Custom Styles for Scrollbar Hide (Simulated) */}
            <style>{scrollbarHide}</style>
            
            <TopBarView />
            <MainHeaderView navigateTo={navigateTo} setIsSidebarOpen={setIsSidebarOpen} />
            
            {/* Only show SubNav on the HOME route */}
            {currentRoute === ROUTES.HOME && (
                <SubNavigationView activeSubMenu={activeSubMenu} handleSubMenuClick={handleSubMenuClick} />
            )}

            <div className={`flex flex-1 ${isSidebarLayout ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Always render the full sidebar for desktop (LG) and as a mobile overlay */}
                <SidebarView 
                    navigateTo={navigateTo} 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen}
                    activeRoute={currentRoute}
                />
                
                {/* Main Content Area */}
                <main className={`flex-1 overflow-x-hidden ${isSidebarLayout ? '' : 'p-0'}`}>
                    {content}
                </main>
            </div>
            
            <FooterView />
        </div>
    );
};

export default WebsiteONSPage;
