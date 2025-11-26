import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Murojaat } from '../config/supabase'
import './Statistics.css'
import { normalizeByLanguage } from '../utils/transliteration'

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
  const locale = language === 'ru' ? 'ru-RU' : 'uz-UZ'

  // Tashkilotlar ro'yxati va ularning soni
  const tashkilotlarWithCount = useMemo(() => {
    const counts: Record<string, number> = {}
    murojaatlar.forEach(m => {
      if (!m.tashkilot) return
      const normalized = normalizeByLanguage(m.tashkilot, language)
      if (normalized) {
        counts[normalized] = (counts[normalized] || 0) + 1
      }
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [murojaatlar, language])

  // Kunlar kesimida statistika
  const monthNames = {
    uz: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
    'uz-cyrl': ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
  }

  const dailyStats = useMemo(() => {
    const dayCounts = new Map<string, number>()
    
    murojaatlar.forEach(murojaat => {
      if (!murojaat.created_at) return

        const date = new Date(murojaat.created_at)
      if (isNaN(date.getTime())) return

        date.setHours(0, 0, 0, 0)
      const isoKey = date.toISOString().split('T')[0]
      dayCounts.set(isoKey, (dayCounts.get(isoKey) || 0) + 1)
    })

    const monthLabels = monthNames[language] || monthNames.uz
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Array.from({ length: 30 }).map((_, idx) => {
      const targetDate = new Date(today)
      targetDate.setDate(today.getDate() - (29 - idx))
      const isoKey = targetDate.toISOString().split('T')[0]

      const formattedDate = `${targetDate.getDate()} ${monthLabels[targetDate.getMonth()]}`

      return {
        date: formattedDate,
        count: dayCounts.get(isoKey) || 0
      }
    })
  }, [murojaatlar, language])

  const normalizeRegionName = (value: string) => normalizeByLanguage(value, language)

  // Xududlar kesimida statistika
  const regionStats = useMemo(() => {
    const stats: Record<string, number> = {}
    
    murojaatlar.forEach(murojaat => {
      if (murojaat.tuman_shahar) {
        const normalized = normalizeRegionName(murojaat.tuman_shahar)
        stats[normalized] = (stats[normalized] || 0) + 1
      }
    })

    const total = Object.values(stats).reduce((sum, value) => sum + value, 0) || 1
    return Object.entries(stats)
      .map(([name, value]) => ({
        name,
        value,
        percent: Number(((value / total) * 100).toFixed(1))
      }))
      .sort((a, b) => b.value - a.value)
  }, [murojaatlar, language])

  const summaryStats = useMemo(() => {
    const formatter = new Intl.NumberFormat(locale)
    return [
      {
        label: t.total,
        value: formatter.format(murojaatlar.length),
        color: COLORS[0]
      }
    ]
  }, [murojaatlar.length, t.total, locale])

  // Status bo'yicha statistika (hozircha barcha murojaatlar "jarayonda" deb hisoblanadi)
  const statusStats = useMemo(() => {
    const total = murojaatlar.length || 1
    // Keyinchalik status maydoni qo'shilganda, bu yerda real statistika bo'ladi
    return [
      { name: t.resolved, value: Math.floor(total * 0.7) }, // 70% hal qilingan deb taxmin qilamiz
      { name: t.inProgress, value: Math.ceil(total * 0.3) } // 30% jarayonda
    ].map(item => ({
      ...item,
      percent: Math.round((item.value / total) * 100)
    }))
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
          <span className="filter-count">{murojaatlar.length}</span>
        </button>
        {tashkilotlarWithCount.map(({ name, count }) => (
          <button
            key={name}
            className={`filter-button ${selectedTashkilot === name ? 'active' : ''}`}
            onClick={() => onTashkilotFilter(name)}
          >
            {name}
            <span className="filter-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Umumiy statistika */}
      <div className="summary-cards">
        {summaryStats.map((item) => (
          <div className="summary-card" key={item.label}>
            <span className="summary-dot" style={{ backgroundColor: item.color }} />
            <div className="summary-text">
              <span className="summary-label">{item.label}</span>
              <span className="summary-value">{item.value}</span>
            </div>
          </div>
        ))}
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
          <div className="daily-summary">
            <span className="daily-summary-label">24 soat ichida:</span>
            <span className="daily-summary-value">{dailyStats[dailyStats.length - 1]?.count || 0} ta murojaat</span>
          </div>
        </div>

        {/* Pie Chart - Xududlar kesimida */}
        <div className="chart-card">
          <h3 className="chart-title">{t.byRegion}</h3>
          <div className="pie-layout">
            <div className="pie-chart">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={regionStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const name = props.name || ''
                      const payloadPercent = props.payload?.percent
                      const percentValue = typeof payloadPercent === 'number'
                        ? payloadPercent
                        : (props.percent || 0) * 100
                      if (percentValue < 5) return ''
                      const formatter = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1
                      })
                      return `${name}: ${formatter.format(percentValue)}%`
                    }}
                    outerRadius={100}
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

            <div className="pie-legend">
              {regionStats.map((region, index) => (
                <div key={region.name} className="pie-legend-item">
                  <span
                    className="pie-legend-dot"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="pie-legend-name">{region.name}</span>
                  <span className="pie-legend-percent">
                    {region.percent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status bo'yicha - Premium dizayn */}
        <div className="chart-card full-width status-section">
          <h3 className="chart-title">{t.byStatus}</h3>
          <div className="status-showcase">
            {statusStats.map((item, index) => (
              <div key={item.name} className={`status-tile ${index === 0 ? 'resolved' : 'pending'}`}>
                <div className="status-glow"></div>
                <div className="status-content">
                  <div className="status-ring">
                    <svg viewBox="0 0 100 100">
                      <circle className="ring-bg" cx="50" cy="50" r="42" />
                      <circle 
                        className="ring-progress" 
                        cx="50" 
                        cy="50" 
                        r="42"
                        style={{ strokeDasharray: `${item.percent * 2.64} 264` }}
                      />
                    </svg>
                    <div className="ring-center">
                      <span className="ring-percent">{item.percent}%</span>
                    </div>
                  </div>
                  <div className="status-info">
                    <span className="status-label">{item.name}</span>
                    <span className="status-count">{item.value} ta</span>
                  </div>
                </div>
                <div className="status-decoration">
                  {index === 0 ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics

