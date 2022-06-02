import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo
} from 'react'
import Login from '../pages/Login'
import usePersistedState from '../hooks/usePersistedState'

export interface IAuthContextData {
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
  token?: string
}

export const AuthContext = createContext({} as IAuthContextData)

interface IAuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [token, setToken] = usePersistedState('tankz.token', null)

  const logout = useCallback(() => {
    setToken(null)
  }, [])

  const isAuthenticated = useMemo(() => !!token, [token])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        setToken,
        logout
      }}>
      {isAuthenticated ? children : <Login />}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export const getAuthorization = () => {
  const token = localStorage.getItem('tankz.token')

  return token ? `Bearer ${JSON.parse(token)}` : undefined
}
