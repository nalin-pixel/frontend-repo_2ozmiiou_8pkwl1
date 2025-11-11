import { useEffect, useMemo, useState } from 'react'

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
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-extrabold tracking-tight text-xl">Tattoo Studio</div>
        <nav className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setCurrent(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                current === t.key ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

function Home({ services, portfolio }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Авторские татуировки в вашем стиле</h1>
          <p className="mt-4 text-gray-600">Запишись на консультацию, подберём эскиз и дату. Работаю в разных стилях: минимализм, графика, блэкворк, реализм.</p>
          <div className="mt-6 flex gap-3">
            <a href="#booking" className="px-4 py-2 bg-black text-white rounded-md">Записаться</a>
            <a href="#portfolio" className="px-4 py-2 border rounded-md">Смотреть работы</a>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
          {portfolio?.find(p => p.featured) ? (
            <img src={portfolio.find(p => p.featured).image_url} alt="Featured" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500">Добавьте работы в админке</div>
          )}
        </div>
      </section>

      <section className="mt-16" id="services">
        <h2 className="text-2xl font-bold mb-4">Услуги</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {services?.length ? services.map(s => (
            <div key={s.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{s.title}</h3>
                {s.price_from != null && <span className="text-sm text-gray-700">от {s.price_from} ₽</span>}
              </div>
              {s.description && <p className="text-gray-600 text-sm mt-2">{s.description}</p>}
              {s.duration_min && <p className="text-gray-500 text-xs mt-1">~ {s.duration_min} мин</p>}
            </div>
          )) : (
            <div className="text-gray-500">Нет услуг. Добавьте в админке.</div>
          )}
        </div>
      </section>

      <section className="mt-16" id="portfolio">
        <h2 className="text-2xl font-bold mb-4">Портфолио</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {portfolio?.length ? portfolio.map(item => (
            <figure key={item.id} className="rounded-lg overflow-hidden border bg-white">
              <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
              <figcaption className="p-3">
                <div className="font-medium">{item.title}</div>
                {item.style && <div className="text-xs text-gray-500">{item.style}</div>}
                {item.description && <div className="text-sm text-gray-600 mt-1">{item.description}</div>}
              </figcaption>
            </figure>
          )) : (
            <div className="text-gray-500">Добавьте работы в админке.</div>
          )}
        </div>
      </section>
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
      <h2 className="text-2xl font-bold mb-4">Запись на консультацию</h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input value={form.client_name} onChange={e=>setForm({...form, client_name:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Телефон или Telegram</label>
          <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Дата</label>
            <input type="date" value={form.preferred_date} onChange={e=>setForm({...form, preferred_date:e.target.value})} className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Время</label>
            <input type="time" value={form.preferred_time} onChange={e=>setForm({...form, preferred_time:e.target.value})} className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Пожелания</label>
          <textarea value={form.note} onChange={e=>setForm({...form, note:e.target.value})} className="w-full border rounded-md px-3 py-2" rows={3} />
        </div>
        <button disabled={loading} className="px-4 py-2 bg-black text-white rounded-md w-full disabled:opacity-60">{loading? 'Отправка...' : 'Отправить заявку'}</button>
        {status && (
          <div className={`text-sm ${status.ok ? 'text-green-700' : 'text-red-600'}`}>{status.message}</div>
        )}
      </form>

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
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-4">Админ-панель</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-3 flex items-end gap-3">
          <div className="grow">
            <label className="block text-sm font-medium mb-1">Пароль администратора</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" placeholder="Введите пароль" />
            <p className="text-xs text-gray-500 mt-1">По умолчанию можно установить через переменную окружения ADMIN_PASSWORD.</p>
          </div>
          <button onClick={loadAppointments} className="h-10 px-4 bg-black text-white rounded-md">Загрузить заявки</button>
          <button onClick={downloadBackup} className="h-10 px-4 border rounded-md">Скачать бэкап</button>
        </div>

        <div className="md:col-span-2 bg-white border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Заявки</h3>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
            {apps.length ? apps.map(a => (
              <div key={a.id} className="border rounded-md p-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{a.client_name}</span>
                  <span className="text-gray-500">{a.status}</span>
                </div>
                {a.phone && <div className="text-sm text-gray-700">{a.phone}</div>}
                <div className="text-xs text-gray-500 mt-1">{a.preferred_date} {a.preferred_time}</div>
                {a.note && <div className="text-sm text-gray-600 mt-1">{a.note}</div>}
                <div className="text-[10px] text-gray-400 mt-1">{a.id}</div>
              </div>
            )) : <div className="text-gray-500">Нет заявок</div>}
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={addService} className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Добавить услугу</h3>
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Название" value={service.title} onChange={e=>setService({...service, title:e.target.value})} required />
            <textarea className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Описание" value={service.description} onChange={e=>setService({...service, description:e.target.value})} />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input className="w-full border rounded-md px-3 py-2" placeholder="Цена от" value={service.price_from} onChange={e=>setService({...service, price_from:e.target.value})} />
              <input className="w-full border rounded-md px-3 py-2" placeholder="Длительность (мин)" value={service.duration_min} onChange={e=>setService({...service, duration_min:e.target.value})} />
            </div>
            <button className="w-full bg-black text-white rounded-md py-2">Добавить</button>
          </form>

          <form onSubmit={addWork} className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Добавить работу</h3>
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Заголовок" value={work.title} onChange={e=>setWork({...work, title:e.target.value})} required />
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Ссылка на изображение" value={work.image_url} onChange={e=>setWork({...work, image_url:e.target.value})} required />
            <input className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Стиль (опционально)" value={work.style} onChange={e=>setWork({...work, style:e.target.value})} />
            <textarea className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Описание (опционально)" value={work.description} onChange={e=>setWork({...work, description:e.target.value})} />
            <label className="flex items-center gap-2 text-sm mb-2">
              <input type="checkbox" checked={work.featured} onChange={e=>setWork({...work, featured:e.target.checked})} />
              Показать на главном экране
            </label>
            <button className="w-full bg-black text-white rounded-md py-2">Добавить</button>
          </form>
        </div>
      </div>
      {msg && (
        <div className={`mt-4 text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-stone-100 text-gray-900">
      <Header current={current} setCurrent={setCurrent} />
      {current === 'home' && <Home services={services} portfolio={portfolio} />}
      {current === 'portfolio' && (
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Home services={services} portfolio={portfolio} />
        </div>
      )}
      {current === 'booking' && <Booking />}
      {current === 'admin' && <Admin />}
      <footer className="border-t mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Tattoo Studio</span>
          <a href="/test" className="hover:underline">Тест соединения</a>
        </div>
      </footer>
    </div>
  )
}
