import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const useApi = () => {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const get = async (path) => {
    const res = await fetch(`${baseUrl}${path}`)
    if (!res.ok) throw new Error('Request failed')
    return res.json()
  }
  const post = async (path, body) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }
  return { baseUrl, get, post }
}

function Header({ current, setCurrent }) {
  const tabs = [
    { key: 'home', label: 'Главная' },
    { key: 'portfolio', label: 'Портфолио' },
    { key: 'booking', label: 'Запись' },
    { key: 'admin', label: 'Админ' },
  ]
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-20 bg-white/70 supports-[backdrop-filter]:backdrop-blur-xl border-b"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="font-extrabold tracking-tight text-xl md:text-2xl"
        >
          Tattoo Studio
        </motion.div>
        <nav className="relative flex gap-1 bg-white/60 rounded-xl p-1 border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setCurrent(t.key)}
              className={`relative px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                current === t.key ? 'text-white' : 'text-gray-700 hover:text-black'
              }`}
            >
              {current === t.key && (
                <motion.span
                  layoutId="pill"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-black to-gray-800"
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  )
}

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

function Home({ services, portfolio, goBooking, goPortfolio }) {
  return (
    <div className="relative">
      {/* Floating accents */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 blur-3xl opacity-70"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-stone-200 to-stone-100 blur-3xl opacity-70"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Авторские татуировки в вашем стиле
            </h1>
            <p className="mt-4 text-gray-600">
              Запишись на консультацию, подберём эскиз и дату. Работаю в разных стилях: минимализм,
              графика, блэкворк, реализм.
            </p>
            <div className="mt-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={goBooking}
                className="px-5 py-2.5 rounded-md text-white bg-gradient-to-r from-black to-gray-800 shadow-sm"
              >
                Записаться
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={goPortfolio}
                className="px-5 py-2.5 rounded-md border shadow-sm bg-white/70"
              >
                Смотреть работы
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border bg-white"
          >
            {portfolio?.find((p) => p.featured) ? (
              <motion.img
                src={portfolio.find((p) => p.featured).image_url}
                alt="Featured"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">
                Добавьте работы в админке
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </motion.div>
        </section>

        <section className="mt-16" id="services">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-2xl font-bold mb-4"
          >
            Услуги
          </motion.h2>
          <motion.div
            className="grid sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {(services?.length ? services : []).map((s, i) => (
              <motion.div
                key={s.id || i}
                variants={{ hidden: { y: 16, opacity: 0 }, show: { y: 0, opacity: 1, transition: { delay: i * 0.05, duration: 0.5 } } }}
                whileHover={{ y: -4 }}
                className="p-4 rounded-xl bg-white border shadow-sm overflow-hidden relative group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neutral-50 to-stone-50" />
                <div className="relative flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  {s.price_from != null && (
                    <span className="text-sm text-gray-700">от {s.price_from} ₽</span>
                  )}
                </div>
                {s.description && <p className="relative text-gray-600 text-sm mt-2">{s.description}</p>}
                {s.duration_min && (
                  <p className="relative text-gray-500 text-xs mt-1">~ {s.duration_min} мин</p>
                )}
              </motion.div>
            ))}
            {!services?.length && (
              <motion.div variants={fadeUp} className="text-gray-500">Нет услуг. Добавьте в админке.</motion.div>
            )}
          </motion.div>
        </section>

        <section className="mt-16" id="portfolio">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="text-2xl font-bold mb-4"
          >
            Портфолио
          </motion.h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio?.length ? (
              portfolio.map((item, i) => (
                <motion.figure
                  key={item.id || i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="rounded-xl overflow-hidden border bg-white shadow-sm"
                >
                  <motion.img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  />
                  <figcaption className="p-3">
                    <div className="font-medium">{item.title}</div>
                    {item.style && <div className="text-xs text-gray-500">{item.style}</div>}
                    {item.description && (
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    )}
                  </figcaption>
                </motion.figure>
              ))
            ) : (
              <motion.div variants={fadeUp} className="text-gray-500">Добавьте работы в админке.</motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function Booking() {
  const { post } = useApi()
  const [form, setForm] = useState({ client_name: '', phone: '', preferred_date: '', preferred_time: '', note: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const res = await post('/appointments', { ...form, source: 'site' })
      setStatus({ ok: true, message: `Заявка отправлена. Номер: ${res.id}` })
      setForm({ client_name: '', phone: '', preferred_date: '', preferred_time: '', note: '' })
    } catch (e2) {
      setStatus({ ok: false, message: 'Ошибка отправки. Попробуйте позже.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10" id="booking">
      <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold mb-4">
        Запись на консультацию
      </motion.h2>
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 bg-white/90 backdrop-blur p-6 rounded-2xl border shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input value={form.client_name} onChange={e=>setForm({...form, client_name:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Телефон или Telegram</label>
          <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input type="date" value={form.preferred_date} onChange={e=>setForm({...form, preferred_date:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Время</label>
            <input type="time" value={form.preferred_time} onChange={e=>setForm({...form, preferred_time:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Пожелания</label>
          <textarea value={form.note} onChange={e=>setForm({...form, note:e.target.value})} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20" rows={3} />
        </div>
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={loading} className="px-4 py-2 bg-black text-white rounded-md w-full disabled:opacity-60">
          {loading? 'Отправка...' : 'Отправить заявку'}
        </motion.button>
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-600'}`}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <div className="mt-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        Также можно записаться через Telegram-бота: отправьте сообщение, бот задаст вопросы и оформит заявку.
      </div>
    </div>
  )
}

function Admin() {
  const { baseUrl, get, post } = useApi()
  const [password, setPassword] = useState('')
  const [apps, setApps] = useState([])
  const [service, setService] = useState({ title: '', description: '', price_from: '', duration_min: '' })
  const [work, setWork] = useState({ title: '', image_url: '', style: '', description: '', featured: false })
  const [msg, setMsg] = useState(null)

  const loadAppointments = async () => {
    try {
      const data = await get(`/admin/appointments?password=${encodeURIComponent(password)}`)
      setApps(data)
      setMsg({ ok: true, text: 'Заявки загружены' })
    } catch {
      setMsg({ ok: false, text: 'Ошибка авторизации' })
    }
  }

  const addService = async (e) => {
    e.preventDefault()
    try {
      await post(`/admin/services?password=${encodeURIComponent(password)}`, {
        ...service,
        price_from: service.price_from ? Number(service.price_from) : null,
        duration_min: service.duration_min ? Number(service.duration_min) : null,
        is_active: true,
      })
      setService({ title: '', description: '', price_from: '', duration_min: '' })
      setMsg({ ok: true, text: 'Услуга добавлена' })
    } catch {
      setMsg({ ok: false, text: 'Ошибка добавления услуги' })
    }
  }

  const addWork = async (e) => {
    e.preventDefault()
    try {
      await post(`/admin/portfolio?password=${encodeURIComponent(password)}`, {
        ...work,
        featured: Boolean(work.featured),
      })
      setWork({ title: '', image_url: '', style: '', description: '', featured: false })
      setMsg({ ok: true, text: 'Работа добавлена' })
    } catch {
      setMsg({ ok: false, text: 'Ошибка добавления работы' })
    }
  }

  const downloadBackup = async () => {
    try {
      const data = await get(`/backup/export?password=${encodeURIComponent(password)}`)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tattoo-backup.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setMsg({ ok: false, text: 'Ошибка бэкапа' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Админ-панель</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3 flex items-end gap-3">
          <div className="grow">
            <label className="block text-sm font-medium mb-1">Пароль администратора</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" placeholder="Введите пароль" />
            <p className="text-xs text-gray-500 mt-1">По умолчанию можно установить через переменную окружения ADMIN_PASSWORD.</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={loadAppointments} className="h-10 px-4 bg-black text-white rounded-md">Загрузить заявки</motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadBackup} className="h-10 px-4 border rounded-md">Скачать бэкап</motion.button>
        </div>

        <motion.div layout className="md:col-span-2 bg-white border rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Заявки</h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            <AnimatePresence>
              {apps.length ? (
                apps.map((a) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="border rounded-md p-3 bg-white/80"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{a.client_name}</span>
                      <span className="text-gray-500">{a.status}</span>
                    </div>
                    {a.phone && <div className="text-sm text-gray-700">{a.phone}</div>}
                    <div className="text-xs text-gray-500 mt-1">{a.preferred_date} {a.preferred_time}</div>
                    {a.note && <div className="text-sm text-gray-600 mt-1">{a.note}</div>}
                    <div className="text-[10px] text-gray-400 mt-1">{a.id}</div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">Нет заявок</motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.form layout onSubmit={addService} className="bg-white border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Добавить услугу</h3>
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Название" value={service.title} onChange={e=>setService({...service, title:e.target.value})} required />
            <textarea className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Описание" value={service.description} onChange={e=>setService({...service, description:e.target.value})} />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input className="w-full border rounded-md px-3 py-2" placeholder="Цена от" value={service.price_from} onChange={e=>setService({...service, price_from:e.target.value})} />
              <input className="w-full border rounded-md px-3 py-2" placeholder="Длительность (мин)" value={service.duration_min} onChange={e=>setService({...service, duration_min:e.target.value})} />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-black text-white rounded-md py-2">Добавить</motion.button>
          </motion.form>

          <motion.form layout onSubmit={addWork} className="bg-white border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Добавить работу</h3>
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Заголовок" value={work.title} onChange={e=>setWork({...work, title:e.target.value})} required />
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Ссылка на изображение" value={work.image_url} onChange={e=>setWork({...work, image_url:e.target.value})} required />
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Стиль (опционально)" value={work.style} onChange={e=>setWork({...work, style:e.target.value})} />
            <textarea className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Описание (опционально)" value={work.description} onChange={e=>setWork({...work, description:e.target.value})} />
            <label className="flex items-center gap-2 text-sm mb-2">
              <input type="checkbox" checked={work.featured} onChange={e=>setWork({...work, featured:e.target.checked})} />
              Показать на главном экране
            </label>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-black text-white rounded-md py-2">Добавить</motion.button>
          </motion.form>
        </div>
      </div>
      {msg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-4 text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</motion.div>
      )}
      <div className="mt-8 text-xs text-gray-500">Бэкап выгружается в JSON и включает услуги, портфолио, заявки и сессии бота.</div>
      <div className="mt-2 text-xs text-gray-500">Backend: {baseUrl}</div>
    </div>
  )
}

export default function App() {
  const { get } = useApi()
  const [current, setCurrent] = useState('home')
  const [services, setServices] = useState([])
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          get('/services'),
          get('/portfolio'),
        ])
        setServices(s)
        setPortfolio(p)
      } catch {
        // ignore for first load
      }
    }
    load()
  }, [])

  const PageWrapper = ({ children, keyName }) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyName}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-stone-100 text-gray-900">
      <Header current={current} setCurrent={setCurrent} />

      {current === 'home' && (
        <PageWrapper keyName="home">
          <Home
            services={services}
            portfolio={portfolio}
            goBooking={() => setCurrent('booking')}
            goPortfolio={() => setCurrent('portfolio')}
          />
        </PageWrapper>
      )}

      {current === 'portfolio' && (
        <PageWrapper keyName="portfolio">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <Home services={services} portfolio={portfolio} goBooking={() => setCurrent('booking')} goPortfolio={() => {}} />
          </div>
        </PageWrapper>
      )}

      {current === 'booking' && (
        <PageWrapper keyName="booking">
          <Booking />
        </PageWrapper>
      )}

      {current === 'admin' && (
        <PageWrapper keyName="admin">
          <Admin />
        </PageWrapper>
      )}

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Tattoo Studio</span>
          <a href="/test" className="hover:underline">Тест соединения</a>
        </div>
      </footer>
    </div>
  )
}
