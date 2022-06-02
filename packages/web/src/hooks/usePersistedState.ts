import { useEffect, useState } from 'react'

const usePersistedState = <T>(key: string, initialState: T) => {
  const [state, setState] = useState(() => {
    const storageValue = localStorage.getItem(key)

    if (storageValue) return JSON.parse(storageValue)

    return initialState
  })

  useEffect(() => {
    if (state) localStorage.setItem(key, JSON.stringify(state))
    else localStorage.removeItem(key)
  }, [key, state])

  return [state, setState] as const
}

export default usePersistedState
