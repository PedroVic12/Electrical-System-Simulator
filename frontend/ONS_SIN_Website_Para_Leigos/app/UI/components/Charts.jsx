'use client'
import { useEffect, useRef } from 'react'
import { AppDataModel } from '../../models/AppDataModel'

export function ReusableChart({ chartId, type, data, options, deps = [] }) {
  const canvasRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      const { Chart } = await import('chart.js/auto')
      const existing = Chart.getChart(canvasRef.current)
      if (existing) existing.destroy()
      if (instanceRef.current) {
        instanceRef.current.destroy()
        instanceRef.current = null
      }
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || cancelled) return
      instanceRef.current = new Chart(ctx, { type, data, options })
    }
    init()
    return () => {
      cancelled = true
    }
  }, deps)

  return (
    <div className="chart-container relative w-full max-w-sm mx-auto h-72 md:h-80">
      <canvas id={chartId} ref={canvasRef} />
    </div>
  )
}

export function GenerationChart() {
  const data = {
    labels: AppDataModel.chartData.labels,
    datasets: [{
      label: 'Matriz Energética (%)',
      data: AppDataModel.chartData.data,
      backgroundColor: AppDataModel.chartData.backgroundColor,
      borderColor: '#ffffff',
      borderWidth: 3
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 12, family: 'Inter' } } },
      tooltip: { callbacks: { label: ctx => `${ctx.label || ''}: ${ctx.parsed || 0}%` } }
    }
  }
  return (
    <ReusableChart
      chartId="generationPercentChart"
      type="doughnut"
      data={data}
      options={options}
      deps={[JSON.stringify(data)]}
    />
  )
}

export function CapacityChart() {
  const capacityData = AppDataModel.generationData.map(item => item.capacityMW)
  const labels = AppDataModel.generationData.map(item => item.name)
  const data = {
    labels,
    datasets: [{
      label: 'Capacidade admissivel (MW)',
      data: capacityData,
      backgroundColor: AppDataModel.chartData.backgroundColor,
      borderColor: AppDataModel.chartData.backgroundColor.map(color => color),
      borderWidth: 2
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString() + ' MW'
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toLocaleString()} MW` } }
    }
  }
  return (
    <ReusableChart
      chartId="capacityMWChart"
      type="bar"
      data={data}
      options={options}
      deps={[JSON.stringify(data)]}
    />
  )
}
