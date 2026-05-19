'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// ============================================================
// § DATA MODEL (OOP / Model layer)
// ============================================================
class SepDataModel {
    static sections = [
        {
            id: 'geracao',
            slug: 'geracao',
            title: 'Geração',
            fullTitle: 'Geração de Energia Elétrica',
            icon: '⚡',
            color: '--yellow',
            accent: '#d29922',
            description: 'Onde a energia primária é convertida em elétrica nas usinas.',
            folder: 'geracao',
        },
        {
            id: 'transmissao',
            slug: 'transmissao',
            title: 'Transmissão',
            fullTitle: 'Transmissão de Energia Elétrica',
            icon: '🗼',
            color: '--blue',
            accent: '#58a6ff',
            description: 'Transporte em alta tensão por longas distâncias até os centros de consumo.',
            folder: 'transmissao',
        },
        {
            id: 'distribuicao',
            slug: 'distribuicao',
            title: 'Distribuição',
            fullTitle: 'Distribuição de Energia Elétrica',
            icon: '🏠',
            color: '--green',
            accent: '#3fb950',
            description: 'Entrega da energia ao consumidor final em tensão segura.',
            folder: 'distribuicao',
        },
        {
            id: 'componentes',
            slug: 'componentes',
            title: 'Componentes',
            fullTitle: 'Componentes Chave do SEP',
            icon: '⚙️',
            color: '--purple',
            accent: '#bc8cff',
            description: 'Equipamentos essenciais que compõem o sistema elétrico.',
            folder: 'componentes',
        },
        {
            id: 'equacoes',
            slug: 'equacoes',
            title: 'Equações',
            fullTitle: 'Modelos Matemáticos',
            icon: '📊',
            color: '--dracula-pink',
            accent: '#ff79c6',
            description: 'Fundamentos matemáticos e equações que governam o SEP.',
            folder: 'equacoes',
        },
    ]

    static getSection(id) {
        return this.sections.find(s => s.id === id) ?? null
    }

    static generationData = [
        { name: 'Hidrelétrica', pct: 60, mw: 109731, color: '#58a6ff' },
        { name: 'Eólica', pct: 12, mw: 24000, color: '#3fb950' },
        { name: 'Termelétrica', pct: 14, mw: 47000, color: '#d29922' },
        { name: 'Solar', pct: 8, mw: 23000, color: '#ff79c6' },
        { name: 'Nuclear', pct: 3, mw: 1990, color: '#bc8cff' },
        { name: 'Biomassa', pct: 3, mw: 15000, color: '#8be9fd' },
    ]

    static components = [
        { name: 'Transformador', desc: 'Eleva ou rebaixa a tensão por indução eletromagnética. Principal equipamento das subestações. Relação a = N1/N2 = V1/V2.' },
        { name: 'Disjuntor', desc: 'Protege o circuito interrompendo a corrente em situações de falta. Opera em milissegundos para evitar danos.' },
        { name: 'Barramento', desc: 'Barra condutora que interliga os equipamentos dentro de uma subestação. Pode ser simples, duplo ou em anel.' },
        { name: 'Reator', desc: 'Equipamento de compensação reativa indutiva. Controla sobretensões em linhas longas em períodos de baixa carga.' },
        { name: 'Capacitor', desc: 'Compensação reativa capacitiva. Eleva o fator de potência e melhora o perfil de tensão no sistema.' },
        { name: 'Relé de Proteção', desc: 'Sistema inteligente que detecta condições anormais e aciona os disjuntores para isolar faltas rapidamente.' },
        { name: 'Linha de Transmissão', desc: 'Cabos e torres que transportam energia em altíssimas tensões. Modelo π com impedância série e admitância shunt.' },
        { name: 'Para-raios', desc: 'Protege equipamentos contra surtos de tensão causados por descargas atmosféricas ou manobras no sistema.' },
    ]
}

// ============================================================
// § PRIMITIVE UI COMPONENTS (Layout: Row, Column, Box)
// ============================================================

/** Row: flex horizontal, equivale ao Row do Flutter */
function Row({ children, align = 'center', justify = 'start', gap = 0, className = '', style = {} }) {
    const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }
    const justifyMap = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between', around: 'space-around' }
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: alignMap[align] ?? align,
                justifyContent: justifyMap[justify] ?? justify,
                gap: gap ? `${gap * 4}px` : undefined,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

/** Column: flex vertical, equivale ao Column do Flutter */
function Column({ children, align = 'start', justify = 'start', gap = 0, className = '', style = {} }) {
    const alignMap = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }
    const justifyMap = { start: 'flex-start', center: 'center', end: 'flex-end', between: 'space-between' }
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: alignMap[align] ?? align,
                justifyContent: justifyMap[justify] ?? justify,
                gap: gap ? `${gap * 4}px` : undefined,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

/** Card: container com borda e background padrão do tema */
function Card({ children, accent, className = '', style = {}, glow = false }) {
    return (
        <div
            className={`rounded-xl border transition-all duration-300 ${glow ? 'glow-blue' : ''} ${className}`}
            style={{
                background: 'var(--bg-card)',
                borderColor: accent ? `${accent}44` : 'var(--border)',
                ...style,
            }}
        >
            {children}
        </div>
    )
}

/** Badge: tag colorida */
function Badge({ children, color = '#58a6ff' }) {
    return (
        <span
            className="font-mono text-xs px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}55`, background: `${color}11` }}
        >
            {children}
        </span>
    )
}

/** Divider: linha separadora com acento */
function Divider({ accent = '#58a6ff' }) {
    return (
        <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>
    )
}

// ============================================================
// § MARKDOWN RENDERER (client-side, sem remark)
// ============================================================
function MarkdownContent({ content }) {
    if (!content) return null

    // Simple inline markdown → HTML parser (sem dependência server)
    const parseInline = (text) =>
        text
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')

    const lines = content.split('\n')
    const elements = []
    let i = 0
    let inPre = false
    let preLines = []
    let inTable = false
    let tableRows = []
    let listItems = []
    let inList = false

    const flushList = () => {
        if (listItems.length) {
            elements.push(
                <ul key={`list-${i}`} style={{ paddingLeft: '1.4rem', marginBottom: '0.7rem' }}>
                    {listItems.map((li, idx) => (
                        <li key={idx} style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '0.25rem' }}
                            dangerouslySetInnerHTML={{ __html: parseInline(li) }} />
                    ))}
                </ul>
            )
            listItems = []
            inList = false
        }
    }

    while (i < lines.length) {
        const line = lines[i]

        // Code block
        if (line.startsWith('```')) {
            if (!inPre) { inPre = true; preLines = []; i++; continue }
            else {
                flushList()
                elements.push(
                    <pre key={`pre-${i}`} style={{ background: '#0d1117', border: '1px solid var(--border)', borderLeft: '3px solid var(--blue)', padding: '1rem', borderRadius: '6px', overflowX: 'auto', marginBottom: '1rem' }}>
                        <code style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--dracula-green)', fontSize: '0.78rem', display: 'block', whiteSpace: 'pre' }}>
                            {preLines.join('\n')}
                        </code>
                    </pre>
                )
                inPre = false; i++; continue
            }
        }
        if (inPre) { preLines.push(line); i++; continue }

        // Table
        if (line.startsWith('|')) {
            if (!inTable) { inTable = true; tableRows = [] }
            tableRows.push(line)
            if (!lines[i + 1]?.startsWith('|')) {
                flushList()
                const [headerRow, , ...dataRows] = tableRows
                const headers = headerRow.split('|').filter(Boolean).map(h => h.trim())
                elements.push(
                    <div key={`table-${i}`} style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                            <thead>
                                <tr>
                                    {headers.map((h, idx) => (
                                        <th key={idx} style={{ background: 'var(--bg-card2)', color: 'var(--blue)', padding: '8px 12px', textAlign: 'left', border: '1px solid var(--border)', fontFamily: "'Space Mono',monospace" }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {dataRows.map((row, ri) => (
                                    <tr key={ri}>
                                        {row.split('|').filter(Boolean).map((cell, ci) => (
                                            <td key={ci} style={{ padding: '8px 12px', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                                {cell.trim()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                inTable = false; tableRows = []
            }
            i++; continue
        }

        // List
        if (line.match(/^[-*]\s+/)) {
            inList = true
            listItems.push(line.replace(/^[-*]\s+/, ''))
            i++; continue
        }
        if (inList && !line.match(/^[-*]\s+/)) flushList()

        // Headings
        if (line.startsWith('### ')) {
            flushList()
            elements.push(<h3 key={`h3-${i}`} style={{ color: 'var(--purple)', fontFamily: "'Space Mono',monospace", fontSize: '0.95rem', margin: '1rem 0 0.4rem' }}>{line.slice(4)}</h3>)
        } else if (line.startsWith('## ')) {
            flushList()
            elements.push(<h2 key={`h2-${i}`} style={{ color: 'var(--dracula-cyan)', fontFamily: "'Space Mono',monospace", fontSize: '1.1rem', margin: '1.2rem 0 0.5rem' }}>{line.slice(3)}</h2>)
        } else if (line.startsWith('# ')) {
            flushList()
            elements.push(<h1 key={`h1-${i}`} style={{ color: 'var(--blue)', fontFamily: "'Space Mono',monospace", fontSize: '1.35rem', margin: '0 0 0.8rem' }}>{line.slice(2)}</h1>)
        } else if (line.trim() === '') {
            // skip blank
        } else {
            elements.push(
                <p key={`p-${i}`} style={{ color: 'var(--text)', lineHeight: 1.7, marginBottom: '0.7rem', fontSize: '0.93rem' }}
                    dangerouslySetInnerHTML={{ __html: parseInline(line) }} />
            )
        }
        i++
    }
    flushList()
    return <div className="animate-in">{elements}</div>
}

// ============================================================
// § NOTE FETCHER HOOK
// ============================================================
function useNote(folder) {
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!folder) return
        setLoading(true)
        setContent(null)
        setError(null)

        fetch(`/api/notes/${folder}`)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then(data => { setContent(data.content); setLoading(false) })
            .catch(err => { setError(err.message); setLoading(false) })
    }, [folder])

    return { content, loading, error }
}

// ============================================================
// § MINI BAR CHART (SVG, sem lib externa)
// ============================================================
function MiniBarChart({ data }) {
    const max = Math.max(...data.map(d => d.mw))
    const W = 320, H = 140, BAR_W = W / data.length - 6, PAD = 30

    return (
        <svg viewBox={`0 0 ${W} ${H + PAD}`} style={{ width: '100%', maxWidth: 380 }} aria-label="Capacidade instalada MW">
            <text x={W / 2} y={14} textAnchor="middle" fill="#8b949e" fontSize="9" fontFamily="'Space Mono',monospace">
                Capacidade Instalada (MW)
            </text>
            {data.map((d, i) => {
                const barH = ((d.mw / max) * H * 0.85)
                const x = i * (W / data.length) + 3
                const y = H - barH + 18
                return (
                    <g key={d.name}>
                        <rect x={x} y={y} width={BAR_W} height={barH} fill={d.color} rx="3" opacity="0.85" />
                        <text x={x + BAR_W / 2} y={H + 22} textAnchor="middle" fill="#8b949e" fontSize="7" fontFamily="'JetBrains Mono',monospace">
                            {d.name.slice(0, 5)}
                        </text>
                        <text x={x + BAR_W / 2} y={y - 3} textAnchor="middle" fill={d.color} fontSize="7" fontFamily="'JetBrains Mono',monospace">
                            {(d.mw / 1000).toFixed(0)}k
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

/** Mini donut SVG */
function MiniDonut({ data }) {
    const total = data.reduce((s, d) => s + d.pct, 0)
    let angle = -Math.PI / 2
    const R = 56, r = 32, cx = 70, cy = 70

    const slices = data.map(d => {
        const a = (d.pct / total) * 2 * Math.PI
        const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle)
        const x2 = cx + R * Math.cos(angle + a), y2 = cy + R * Math.sin(angle + a)
        const ix1 = cx + r * Math.cos(angle), iy1 = cy + r * Math.sin(angle)
        const ix2 = cx + r * Math.cos(angle + a), iy2 = cy + r * Math.sin(angle + a)
        const large = a > Math.PI ? 1 : 0
        const path = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1} Z`
        angle += a
        return { path, color: d.color, name: d.name, pct: d.pct }
    })

    return (
        <svg viewBox="0 0 140 140" style={{ width: '100%', maxWidth: 170 }} aria-label="Matriz energética">
            {slices.map((s, i) => (
                <path key={i} d={s.path} fill={s.color} opacity="0.9" />
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#e6edf3" fontSize="10" fontFamily="'Space Mono',monospace">Matriz</text>
            <text x={cx} y={cy + 8} textAnchor="middle" fill="#8b949e" fontSize="8" fontFamily="'Space Mono',monospace">Energética</text>
        </svg>
    )
}

// ============================================================
// § SECTION COMPONENTS
// ============================================================

/** NoteSection: seção genérica que busca .md da API */
function NoteSection({ section, isActive }) {
    const { content, loading, error } = useNote(isActive ? section.folder : null)

    return (
        <Column gap={4} style={{ padding: '1.5rem' }}>
            {loading && (
                <Row gap={2} align="center">
                    <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: section.accent }} />
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>carregando nota...</span>
                </Row>
            )}
            {error && (
                <p className="font-mono text-xs" style={{ color: 'var(--orange)' }}>Erro ao carregar: {error}</p>
            )}
            {content && <MarkdownContent content={content} />}
        </Column>
    )
}

/** GenerationSection: seção especial com gráficos */
function GenerationSection({ section, isActive }) {
    const { content, loading } = useNote(isActive ? section.folder : null)
    const [activeSource, setActiveSource] = useState(0)
    const src = SepDataModel.generationData[activeSource]

    return (
        <Column gap={0}>
            {/* Tabs de fontes */}
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
                <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>// selecione a fonte</p>
                <Row gap={2} style={{ flexWrap: 'wrap' }}>
                    {SepDataModel.generationData.map((g, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveSource(i)}
                            className="font-mono text-xs px-3 py-1.5 rounded border transition-all duration-200"
                            style={{
                                borderColor: activeSource === i ? g.color : 'var(--border)',
                                background: activeSource === i ? `${g.color}18` : 'transparent',
                                color: activeSource === i ? g.color : 'var(--text-muted)',
                            }}
                        >
                            {g.name}
                        </button>
                    ))}
                </Row>

                {/* Detalhe da fonte ativa */}
                <Card accent={src.color} className="mt-3 p-4 animate-in">
                    <Row justify="between" align="start">
                        <Column gap={1}>
                            <span className="font-display text-sm font-bold" style={{ color: src.color }}>{src.name}</span>
                            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                                {src.pct}% da matriz · {src.mw.toLocaleString()} MW
                            </span>
                        </Column>
                        <Badge color={src.color}>{src.pct}%</Badge>
                    </Row>
                    <div className="mt-2 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
                        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${src.pct}%`, background: src.color }} />
                    </div>
                </Card>

                {/* Charts SVG */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <MiniDonut data={SepDataModel.generationData} />
                    </Card>
                    <Card style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                        <MiniBarChart data={SepDataModel.generationData} />
                    </Card>
                </div>
            </div>

            <Divider accent={section.accent} />

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
                {loading && <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>carregando nota...</p>}
                {content && <MarkdownContent content={content} />}
            </div>
        </Column>
    )
}

/** ComponentsSection: grid de componentes clicáveis */
function ComponentsSection({ section, isActive }) {
    const { content, loading } = useNote(isActive ? section.folder : null)
    const [activeComp, setActiveComp] = useState(null)

    const handleComp = useCallback((i) => {
        setActiveComp(prev => prev === i ? null : i)
    }, [])

    return (
        <Column gap={0}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
                <p className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>// clique para expandir</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SepDataModel.components.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => handleComp(i)}
                            className="p-3 rounded-lg border text-left transition-all duration-200 text-xs font-mono"
                            style={{
                                borderColor: activeComp === i ? section.accent : 'var(--border)',
                                background: activeComp === i ? `${section.accent}18` : 'var(--bg-card2)',
                                color: activeComp === i ? section.accent : 'var(--text-muted)',
                            }}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                {activeComp !== null && (
                    <Card accent={section.accent} className="mt-3 p-4 animate-in">
                        <p className="font-display text-sm font-bold mb-1" style={{ color: section.accent }}>
                            {SepDataModel.components[activeComp].name}
                        </p>
                        <p style={{ color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                            {SepDataModel.components[activeComp].desc}
                        </p>
                    </Card>
                )}
            </div>

            <Divider accent={section.accent} />

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
                {loading && <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>carregando nota...</p>}
                {content && <MarkdownContent content={content} />}
            </div>
        </Column>
    )
}

/** EquacoesSection: seção de equações com highlight especial */
function EquacoesSection({ section, isActive }) {
    const { content, loading } = useNote(isActive ? section.folder : null)

    const highlights = [
        { label: 'Lei de Joule', eq: 'P = R × I²', color: '#ff79c6' },
        { label: 'Potência Aparente', eq: 'S = V × I*', color: '#8be9fd' },
        { label: 'Relação de Transformação', eq: 'a = N₁/N₂', color: '#50fa7b' },
        { label: 'Fluxo de Potência', eq: 'J · Δx = Δf', color: '#d29922' },
    ]

    return (
        <Column gap={0}>
            <div style={{ padding: '1.5rem 1.5rem 0' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {highlights.map((h, i) => (
                        <Card key={i} style={{ padding: '0.75rem 1rem' }}>
                            <p className="font-mono text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{h.label}</p>
                            <p className="font-mono text-base font-bold" style={{ color: h.color }}>{h.eq}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <Divider accent={section.accent} />

            <div style={{ padding: '0 1.5rem 1.5rem' }}>
                {loading && <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>carregando...</p>}
                {content && <MarkdownContent content={content} />}
            </div>
        </Column>
    )
}

// ============================================================
// § SECTION ROUTER: decide qual subcomponente renderizar
// ============================================================
function SectionBody({ section, isActive }) {
    switch (section.id) {
        case 'geracao': return <GenerationSection section={section} isActive={isActive} />
        case 'componentes': return <ComponentsSection section={section} isActive={isActive} />
        case 'equacoes': return <EquacoesSection section={section} isActive={isActive} />
        default: return <NoteSection section={section} isActive={isActive} />
    }
}

// ============================================================
// § ACCORDION SECTION WRAPPER
// ============================================================
function AccordionSection({ section, isOpen, onToggle }) {
    return (
        <Card accent={isOpen ? section.accent : null} className="mb-4 overflow-hidden transition-all duration-300" glow={isOpen}>
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full p-4 text-left transition-all duration-200"
                style={{ background: isOpen ? `${section.accent}10` : 'transparent' }}
                aria-expanded={isOpen}
            >
                <Row justify="between" align="center">
                    <Row gap={3} align="center">
                        <span
                            className="flex items-center justify-center w-10 h-10 rounded-lg text-lg"
                            style={{ background: `${section.accent}18`, border: `1px solid ${section.accent}44` }}
                        >
                            {section.icon}
                        </span>
                        <Column gap={0}>
                            <span className="font-display font-bold text-sm sm:text-base" style={{ color: isOpen ? section.accent : 'var(--text)' }}>
                                {section.fullTitle}
                            </span>
                            <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                                {section.description}
                            </span>
                        </Column>
                    </Row>
                    <ChevronIcon isOpen={isOpen} color={section.accent} />
                </Row>
            </button>

            {/* Body */}
            {isOpen && (
                <div className="animate-in border-t" style={{ borderColor: `${section.accent}33` }}>
                    <SectionBody section={section} isActive={isOpen} />
                </div>
            )}
        </Card>
    )
}

function ChevronIcon({ isOpen, color }) {
    return (
        <svg
            viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-300 flex-shrink-0"
            style={{ width: 18, height: 18, stroke: color, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    )
}

// ============================================================
// § HEADER
// ============================================================
function Header({ activeSection, sections, onSelectSection }) {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header
            className="sticky top-0 z-50 border-b"
            style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}
        >
            <div className="max-w-4xl mx-auto px-4 py-3">
                <Row justify="between" align="center">
                    {/* Logo */}
                    <Column gap={0}>
                        <span className="font-display font-bold text-sm" style={{ color: 'var(--blue)' }}>SEP.blog</span>
                        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Sistemas Elétricos de Potência</span>
                    </Column>

                    {/* Nav desktop */}
                    <nav className="hidden sm:flex" style={{ gap: 8 }}>
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => onSelectSection(s.id)}
                                className="font-mono text-xs px-3 py-1.5 rounded border transition-all duration-200"
                                style={{
                                    borderColor: activeSection === s.id ? s.accent : 'transparent',
                                    color: activeSection === s.id ? s.accent : 'var(--text-muted)',
                                    background: activeSection === s.id ? `${s.accent}12` : 'transparent',
                                }}
                            >
                                {s.icon} {s.title}
                            </button>
                        ))}
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="sm:hidden p-2 rounded border"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                        onClick={() => setMenuOpen(m => !m)}
                        aria-label="Menu"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </Row>

                {/* Mobile nav */}
                {menuOpen && (
                    <nav className="sm:hidden mt-2 pb-2 grid grid-cols-3 gap-2 animate-in">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { onSelectSection(s.id); setMenuOpen(false) }}
                                className="font-mono text-xs p-2 rounded border text-center transition-all"
                                style={{
                                    borderColor: activeSection === s.id ? s.accent : 'var(--border)',
                                    color: activeSection === s.id ? s.accent : 'var(--text-muted)',
                                    background: activeSection === s.id ? `${s.accent}12` : 'transparent',
                                }}
                            >
                                <span className="block text-base">{s.icon}</span>
                                {s.title}
                            </button>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    )
}

// ============================================================
// § HERO SECTION
// ============================================================
function Hero() {
    return (
        <section className="grid-bg py-10 sm:py-16 px-4 text-center relative overflow-hidden">
            {/* Glow orbs */}
            <div
                className="absolute rounded-full pointer-events-none"
                style={{ width: 300, height: 300, top: -80, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(88,166,255,0.08) 0%, transparent 70%)' }}
            />
            <div className="relative z-10 max-w-2xl mx-auto">
                <Row justify="center" gap={2} style={{ marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <Badge color="#58a6ff">SEP</Badge>
                    <Badge color="#3fb950">SIN</Badge>
                    <Badge color="#d29922">ONS</Badge>
                    <Badge color="#bc8cff">ANEEL</Badge>
                </Row>
                <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-3">
                    <span style={{ color: 'var(--blue)' }}>Sistemas</span>{' '}
                    <span style={{ color: 'var(--text)' }}>Elétricos de</span>{' '}
                    <span style={{ color: 'var(--dracula-cyan)' }}>Potência</span>
                </h1>
                <p className="font-mono text-sm sm:text-base mb-4" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    Geração · Transmissão · Distribuição · Componentes · Equações<br />
                    <span style={{ color: 'var(--dracula-green)' }}>// conteúdo gerado a partir de notas em /content/notes/</span>
                </p>

                {/* Inline mini flow diagram */}
                <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
                    {[
                        { label: 'Usina', color: '#d29922', v: '13,8 kV' },
                        { label: '→', color: '#8b949e', v: '' },
                        { label: 'Trafo Elevador', color: '#58a6ff', v: '500 kV' },
                        { label: '→', color: '#8b949e', v: '' },
                        { label: 'Transmissão', color: '#58a6ff', v: '500 kV' },
                        { label: '→', color: '#8b949e', v: '' },
                        { label: 'Distribuição', color: '#3fb950', v: '127/220 V' },
                    ].map((item, i) =>
                        item.label === '→'
                            ? <span key={i} className="font-mono text-base" style={{ color: item.color }}>→</span>
                            : (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="font-mono text-xs px-2 py-1 rounded border" style={{ borderColor: `${item.color}55`, color: item.color, background: `${item.color}11` }}>
                                        {item.label}
                                    </span>
                                    {item.v && <span className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.v}</span>}
                                </div>
                            )
                    )}
                </div>
            </div>
        </section>
    )
}

// ============================================================
// § FOOTER
// ============================================================
function Footer() {
    return (
        <footer className="border-t mt-12 py-6 px-4" style={{ borderColor: 'var(--border)' }}>
            <Column align="center" gap={2}>
                <Row gap={4} align="center">
                    <Badge color="#58a6ff">Next.js 15</Badge>
                    <Badge color="#3fb950">Tailwind v4</Badge>
                    <Badge color="#bc8cff">React 19</Badge>
                </Row>
                <p className="font-mono text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    SEP.blog · conteúdo em <code style={{ color: 'var(--dracula-cyan)' }}>/content/notes/</code> · mobile-first · SOLID
                </p>
            </Column>
        </footer>
    )
}

// ============================================================
// § PROGRESS BAR
// ============================================================
function ReadingProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement
            const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
            setProgress(pct)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-0.5" style={{ background: 'transparent' }}>
            <div className="h-full transition-all duration-100" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #58a6ff, #50fa7b, #ff79c6)' }} />
        </div>
    )
}

// ============================================================
// § ROOT PAGE COMPONENT
// ============================================================
export default function Page() {
    const sections = SepDataModel.sections

    // Controla quais seções estão abertas (accordion)
    const [openSections, setOpenSections] = useState(() => new Set(['geracao']))
    const [activeNav, setActiveNav] = useState('geracao')

    const toggleSection = useCallback((id) => {
        setOpenSections(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
        setActiveNav(id)
        // Smooth scroll to section
        setTimeout(() => {
            document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
    }, [])

    const handleNavSelect = useCallback((id) => {
        setOpenSections(prev => {
            const next = new Set(prev)
            next.add(id)
            return next
        })
        setActiveNav(id)
        setTimeout(() => {
            document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 80)
    }, [])

    return (
        <>
            <ReadingProgress />
            <Header activeSection={activeNav} sections={sections} onSelectSection={handleNavSelect} />

            <main className="max-w-4xl mx-auto px-4 pb-12">
                <Hero />

                <section className="mt-8">
                    <p className="font-mono text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            // {sections.length} módulos · clique para expandir
                    </p>

                    {sections.map(section => (
                        <div key={section.id} id={`section-${section.id}`} className="scroll-mt-20">
                            <AccordionSection
                                section={section}
                                isOpen={openSections.has(section.id)}
                                onToggle={() => toggleSection(section.id)}
                            />
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </>
    )
}