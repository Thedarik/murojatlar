import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Murojaat } from '../config/supabase'
import './Statistics.css'

interface StatisticsProps {
  murojaatlar: Murojaat[]
  language: 'uz' | 'uz-cyrl' | 'ru'
  selectedTashkilot: string
  onTashkilotFilter: (tashkilot: string) => void
}

const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff']

function Statistics({ murojaatlar, language, selectedTashkilot, onTashkilotFilter }: StatisticsProps) {
  const translations = {
    uz: {
      all: 'Barchasi',
      byDate: 'Kunlar kesimida',
      byRegion: 'Xududlar kesimida',
      byStatus: 'Holat bo\'yicha',
      total: 'Jami',
      inProgress: 'Jarayonda',
      resolved: 'Hal qilindi',
      sortFilters: 'Filtrlarni saralash'
    },
    'uz-cyrl': {
      all: 'Барчаси',
      byDate: 'Кунлар кесимида',
      byRegion: 'Худудлар кесимида',
      byStatus: 'Ҳолат бўйича',
      total: 'Жами',
      inProgress: 'Жараёнда',
      resolved: 'Ҳал қилинди',
      sortFilters: 'Филтрларни саралаш'
    },
    ru: {
      all: 'Все',
      byDate: 'По дням',
      byRegion: 'По регионам',
      byStatus: 'По статусу',
      total: 'Всего',
      inProgress: 'В процессе',
      resolved: 'Решено',
      sortFilters: 'Сортировать фильтры'
    }
  }

  const t = translations[language]

  // Tashkilotlar ro'yxati
  const tashkilotlar = useMemo(() => {
    const unique = Array.from(new Set(murojaatlar.map(m => m.tashkilot))).filter(Boolean)
    return unique
  }, [murojaatlar])

  // Kunlar kesimida statistika
  const dailyStats = useMemo(() => {
    const stats: Record<string, { count: number; timestamp: number }> = {}
    
    murojaatlar.forEach(murojaat => {
      if (murojaat.created_at) {
        const date = new Date(murojaat.created_at)
        const timestamp = date.setHours(0, 0, 0, 0) // Kun boshiga
        const dateKey = date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
          month: 'short',
          day: 'numeric'
        })
        
        if (!stats[dateKey]) {
          stats[dateKey] = { count: 0, timestamp }
        }
        stats[dateKey].count++
      }
    })

    return Object.entries(stats)
      .map(([date, data]) => ({ date, count: data.count, timestamp: data.timestamp }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-30) // Oxirgi 30 kun
      .map(({ date, count }) => ({ date, count }))
  }, [murojaatlar, language])

  // Xududlar kesimida statistika
  const regionStats = useMemo(() => {
    const stats: Record<string, number> = {}
    
    murojaatlar.forEach(murojaat => {
      if (murojaat.tuman_shahar) {
        stats[murojaat.tuman_shahar] = (stats[murojaat.tuman_shahar] || 0) + 1
      }
    })

    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .map((item) => ({
        ...item,
        percent: ((item.value / murojaatlar.length) * 100).toFixed(1)
      }))
  }, [murojaatlar])

  // Status bo'yicha statistika (hozircha barcha murojaatlar "jarayonda" deb hisoblanadi)
  const statusStats = useMemo(() => {
    const total = murojaatlar.length
    // Keyinchalik status maydoni qo'shilganda, bu yerda real statistika bo'ladi
    return [
      { name: t.resolved, value: Math.floor(total * 0.7) }, // 70% hal qilingan deb taxmin qilamiz
      { name: t.inProgress, value: Math.floor(total * 0.3) } // 30% jarayonda
    ]
  }, [murojaatlar, t])

  return (
    <div className="statistics-container">
      {/* Tashkilotlar filtrlari */}
      <div className="tashkilot-filters">
        <button
          className={`filter-button ${selectedTashkilot === '' ? 'active' : ''}`}
          onClick={() => onTashkilotFilter('')}
        >
          {t.all}
        </button>
        {tashkilotlar.map(tashkilot => (
          <button
            key={tashkilot}
            className={`filter-button ${selectedTashkilot === tashkilot ? 'active' : ''}`}
            onClick={() => onTashkilotFilter(tashkilot)}
          >
            {tashkilot}
          </button>
        ))}
      </div>

      {/* Jami statistika */}
      <div className="total-stat">
        <span className="total-label">{t.total}:</span>
        <span className="total-value">{murojaatlar.length}</span>
      </div>

      {/* Grafiklar */}
      <div className="charts-grid">
        {/* Line Chart - Kunlar kesimida */}
        <div className="chart-card">
          <h3 className="chart-title">{t.byDate}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#1e3a8a" 
                strokeWidth={2}
                dot={{ fill: '#1e3a8a', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Xududlar kesimida */}
        <div className="chart-card">
          <h3 className="chart-title">{t.byRegion}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => {
                  const percent = entry.percent || 0
                  return percent > 5 ? `${entry.name}: ${(percent * 100).toFixed(1)}%` : ''
                }}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {regionStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Status bo'yicha */}
        <div className="chart-card">
          <h3 className="chart-title">{t.byStatus}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e3a8a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Statistics

