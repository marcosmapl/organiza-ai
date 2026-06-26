import { useCallback, useEffect, useMemo, useState } from 'react'
import client from '../api/client'

const defaultByType = (type) => (type === 'checkbox' ? false : '')

const normalize = (item, field) => {
  if (field.type === 'datetime-local' && item[field.name]) {
    return new Date(item[field.name]).toISOString().slice(0, 16)
  }

  if (field.type === 'checkbox') {
    return Boolean(item[field.name])
  }

  return item[field.name] ?? ''
}

const CrudPage = ({ title, endpoint, fields, columns }) => {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState(() => Object.fromEntries(fields.map((field) => [field.name, defaultByType(field.type)])))

  const reset = () => {
    setEditingId(null)
    setForm(Object.fromEntries(fields.map((field) => [field.name, defaultByType(field.type)])))
  }

  const load = useCallback(async () => {
    const { data } = await client.get(endpoint)
    setItems(data)
  }, [endpoint])

  useEffect(() => {
    load()
  }, [load])

  const optionsCache = useMemo(() => Object.fromEntries(fields.map((field) => [field.name, field.options || []])), [fields])

  const handleChange = (field, value, checked) => {
    setForm((prev) => ({ ...prev, [field.name]: field.type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFeedback('')

    try {
      if (editingId) {
        await client.put(`${endpoint}/${editingId}`, form)
        setFeedback(`${title.slice(0, -1)} updated successfully.`)
      } else {
        await client.post(endpoint, form)
        setFeedback(`${title.slice(0, -1)} created successfully.`)
      }
      await load()
      reset()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Request failed')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm(Object.fromEntries(fields.map((field) => [field.name, normalize(item, field)])))
  }

  const handleDelete = async (id) => {
    await client.delete(`${endpoint}/${id}`)
    await load()
  }

  return (
    <section className="panel">
      <h2>{title}</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <label key={field.name}>
            {field.label}
            {field.type === 'select' ? (
              <select value={form[field.name]} onChange={(event) => handleChange(field, event.target.value)} required={field.required}>
                <option value="">Select</option>
                {optionsCache[field.name].map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <input
                type="checkbox"
                checked={Boolean(form[field.name])}
                onChange={(event) => handleChange(field, '', event.target.checked)}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={(event) => handleChange(field, event.target.value)}
                required={field.required}
              />
            )}
          </label>
        ))}
        <div className="actions">
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" onClick={reset}>Cancel</button>}
        </div>
      </form>
      {feedback && <p className="feedback success">{feedback}</p>}
      {error && <p className="feedback error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => <th key={column.label}>{column.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.label}>{column.render ? column.render(item) : item[column.key]}</td>
                ))}
                <td>
                  <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CrudPage
