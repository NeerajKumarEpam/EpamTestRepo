
import React, { useEffect, useMemo, useState } from 'react'

const statuses = ['All', 'Todo', 'In Progress', 'Done']

function formatDateTime(s) {
  if (!s) return ''
  const d = new Date(s)
  if (isNaN(d.getTime())) return String(s)
  return d.toLocaleString()
}

function isOverdue(dueDate, status) {
  if (!dueDate) return false
  if (status === 'Done') return false
  const d = new Date(dueDate)
  if (isNaN(d.getTime())) return false
  return d.getTime() < Date.now()
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')

  const [editing, setEditing] = useState(null) // task or null
  const [form, setForm] = useState({ title: '', description: '', status: 'Todo', dueDate: '' })

  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (status) p.set('status', status)
    p.set('sortBy', sortBy)
    p.set('sortDir', sortDir)
    return p.toString()
  }, [q, status, sortBy, sortDir])

  async function fetchTasks() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/tasks?${queryString}`)
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message || 'Failed to load tasks')
      setTasks(body.tasks || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString])

  function startCreate() {
    setEditing(null)
    setForm({ title: '', description: '', status: 'Todo', dueDate: '' })
  }

  function startEdit(task) {
    setEditing(task)
    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'Todo',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
    })
  }

  async function save() {
    setError('')
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description,
      status: form.status,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null
    }

    const isEdit = !!editing
    const url = isEdit ? `/api/tasks/${editing.id}` : '/api/tasks'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body?.error?.message || 'Save failed')
      return
    }

    startCreate()
    await fetchTasks()
  }

  async function remove(task) {
    setError('')
    const ok = window.confirm(`Delete task "${task.title}"?`)
    if (!ok) return

    const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setError(body?.error?.message || 'Delete failed')
      return
    }
    await fetchTasks()
  }

  return (
    <div style={{ fontFamily: 'system-ui, Arial', padding: 16, maxWidth: 980, margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Task Tracker Lite</h1>
        <button aria-label="New task" onClick={startCreate}>+ New Task</button>
      </header>

      <section style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 220px 220px 140px', gap: 8 }}>
        <input aria-label="Search" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
        <select aria-label="Status filter" value={status} onChange={e => setStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select aria-label="Sort by" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="title">Title</option>
        </select>
        <select aria-label="Sort direction" value={sortDir} onChange={e => setSortDir(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </section>

      <section style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>{editing ? 'Edit Task' : 'Create Task'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label>
              Title*<br />
              <input aria-label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </label>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label>
              Status<br />
              <select aria-label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>
              Description<br />
              <textarea aria-label="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </label>
          </div>
          <div>
            <label>
              Due date<br />
              <input aria-label="Due date" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </label>
          </div>
        </div>

        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button aria-label="Save" onClick={save}>Save</button>
          {editing && <button aria-label="Cancel" onClick={startCreate}>Cancel</button>}
        </div>

        {error && (
          <div role="alert" style={{ marginTop: 10, color: '#b00020' }}>
            {error}
          </div>
        )}
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Tasks</h2>
        {loading && <p>Loading...</p>}
        {!loading && tasks.length === 0 && <p>No tasks yet.</p>}
        {!loading && tasks.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Title</th>
                <th align="left">Status</th>
                <th align="left">Due</th>
                <th align="left">Created</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => {
                const overdue = isOverdue(t.dueDate, t.status)
                return (
                  <tr key={t.id} style={{ borderTop: '1px solid #eee', background: overdue ? '#fff3f3' : 'transparent' }}>
                    <td>{t.title}</td>
                    <td>{t.status}</td>
                    <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                    <td>{formatDateTime(t.createdAt)}</td>
                    <td>
                      <button aria-label={`Edit ${t.title}`} onClick={() => startEdit(t)}>Edit</button>{' '}
                      <button aria-label={`Delete ${t.title}`} onClick={() => remove(t)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      <footer style={{ marginTop: 24, color: '#666', fontSize: 12 }}>
        <p>Local demo app for AI-driven SDLC workflow.</p>
      </footer>
    </div>
  )
}
