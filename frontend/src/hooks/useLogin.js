import { useState, useCallback } from 'react'
import { useNetProStore } from '../store/useNetProStore'

export function useLoginLogic() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({ username: false, password: false })

  const login = useNetProStore(s => s.login)
  const isLoading = useNetProStore(s => s.isLoading)
  const error = useNetProStore(s => s.error)
  const clearError = useNetProStore(s => s.clearError)

  const errUsername = touched.username && !username.trim()
  const errPassword = touched.password && !password

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value)
    clearError()
  }, [clearError])

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value)
    clearError()
  }, [clearError])

  const handleUsernameBlur = useCallback(() => {
    setTouched(t => ({ ...t, username: true }))
  }, [])

  const handlePasswordBlur = useCallback(() => {
    setTouched(t => ({ ...t, password: true }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setTouched({ username: true, password: true })
    if (!username.trim() || !password) return
    clearError()
    try {
      await login({ name: username.trim(), password })
    } catch {}
  }, [username, password, login, clearError])

  return {
    username,
    password,
    isLoading,
    error,
    errUsername,
    errPassword,
    handleUsernameChange,
    handlePasswordChange,
    handleUsernameBlur,
    handlePasswordBlur,
    handleSubmit,
  }
}