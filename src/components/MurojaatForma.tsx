import { useState, FormEvent, useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase, Murojaat } from '../config/supabase'
import './MurojaatForma.css'

interface FormData {
  fio: string
  telefon: string
  tumanShahar: string
  manzil: string
  murojaatMazmuni: string
  tashkilot: string
}

function MurojaatForma() {
  const { t, language } = useLanguage()
  const [formData, setFormData] = useState<FormData>({
    fio: '',
    telefon: '',
    tumanShahar: '',
    manzil: '',
    murojaatMazmuni: '',
    tashkilot: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Error xabarni tozalash foydalanuvchi yozganda
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSubmitted(false)

    try {
      // Form ma'lumotlarini Supabase formatiga o'tkazish
      const murojaatData: Murojaat = {
        fio: formData.fio.trim(),
        telefon: formData.telefon.trim(),
        tuman_shahar: formData.tumanShahar.trim(),
        manzil: formData.manzil.trim(),
        murojaat_mazmuni: formData.murojaatMazmuni.trim(),
        tashkilot: formData.tashkilot.trim()
      }

      // Debug: Ma'lumotlarni console'da ko'rsatish
      console.log('Yuborilayotgan ma\'lumotlar:', murojaatData)
      console.log('Supabase client:', supabase)
      
      // Supabase ga ma'lumotlarni yuborish
      const { data, error: supabaseError } = await supabase
        .from('murojaatlar')
        .insert([murojaatData])
        .select()

      // Xatolik bo'lsa, to'liq ma'lumotlarni ko'rsatish
      if (supabaseError) {
        console.error('Supabase xatolik:', {
          message: supabaseError.message,
          details: supabaseError.details,
          hint: supabaseError.hint,
          code: supabaseError.code,
          fullError: supabaseError
        })
        throw supabaseError
      }

      // Muvaffaqiyatli yuborildi
      console.log('Murojaat muvaffaqiyatli saqlandi:', data)
      setSubmitted(true)
      
      // Formani tozalash
      setFormData({
        fio: '',
        telefon: '',
        tumanShahar: '',
        manzil: '',
        murojaatMazmuni: '',
        tashkilot: ''
      })

      // 3 soniyadan keyin success xabarni yashirish
      // Oldingi timeout'ni tozalash
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setSubmitted(false)
      }, 3000)

    } catch (err: any) {
      console.error('Murojaat yuborishda xatolik:', err)
      
      // Xatolikni to'liq ko'rsatish
      let errorMessage = 'Murojaat yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'
      
      if (err) {
        // Supabase xatolik xabari
        if (err.message) {
          errorMessage = err.message
        }
        // Supabase PostgREST xatolik xabari
        if (err.details) {
          errorMessage += ` (${err.details})`
        }
        // Supabase xatolik kodi
        if (err.code) {
          errorMessage += ` [${err.code}]`
        }
        // Boshqa xatolik xabari
        if (err.hint) {
          errorMessage += ` (Hint: ${err.hint})`
        }
      }
      
      setError(errorMessage)
      
      // Console'da to'liq xatolik ma'lumotlarini ko'rsatish
      console.error('To\'liq xatolik ma\'lumotlari:', {
        message: err?.message,
        details: err?.details,
        hint: err?.hint,
        code: err?.code,
        error: err
      })
    } finally {
      setLoading(false)
    }
  }

  // Cleanup timeout component unmount bo'lganda
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="murojaat-forma-container">
      <form className="murojaat-forma" onSubmit={handleSubmit}>
        {submitted && (
          <div className="success-message">
            {t.form.successMessage}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="fio">
            {t.form.fio.label} <span className="required">{t.form.required}</span>
          </label>
          <input
            type="text"
            id="fio"
            name="fio"
            value={formData.fio}
            onChange={handleChange}
            required
            placeholder={t.form.fio.placeholder}
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefon">
            {t.form.telefon.label} <span className="required">{t.form.required}</span>
          </label>
          <input
            type="tel"
            id="telefon"
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            required
            placeholder={t.form.telefon.placeholder}
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tumanShahar">
            {t.form.tumanShahar.label} <span className="required">{t.form.required}</span>
          </label>
          <select
            id="tumanShahar"
            name="tumanShahar"
            value={formData.tumanShahar}
            onChange={handleChange}
            required
          >
            <option value="">{t.form.tumanShahar.placeholder}</option>
            {t.tumanlar.map(tuman => (
              <option key={tuman} value={tuman}>
                {tuman}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="manzil">
            {t.form.manzil.label} <span className="required">{t.form.required}</span>
          </label>
          <input
            type="text"
            id="manzil"
            name="manzil"
            value={formData.manzil}
            onChange={handleChange}
            required
            placeholder={t.form.manzil.placeholder}
          />
        </div>

        <div className="form-group">
          <label htmlFor="murojaatMazmuni">
            {t.form.murojaatMazmuni.label} <span className="required">{t.form.required}</span>
          </label>
          <textarea
            id="murojaatMazmuni"
            name="murojaatMazmuni"
            value={formData.murojaatMazmuni}
            onChange={handleChange}
            required
            rows={6}
            placeholder={t.form.murojaatMazmuni.placeholder}
            style={{ minHeight: '100px' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tashkilot">
            {t.form.tashkilot.label} <span className="required">{t.form.required}</span>
          </label>
          <select
            id="tashkilot"
            name="tashkilot"
            value={formData.tashkilot}
            onChange={handleChange}
            required
          >
            <option value="">{t.form.tashkilot.placeholder}</option>
            {t.tashkilotlar.map(tashkilot => (
              <option key={tashkilot} value={tashkilot}>
                {tashkilot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 
              (language === 'ru' ? 'Отправка...' : 
               language === 'uz-cyrl' ? 'Юборилмоқда...' : 
               'Yuborilmoqda...') : 
              t.form.submitButton}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MurojaatForma

