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
  setAuthData: (token: string, nickname: string) => void
  logout: () => void
  token?: string
  nickname?: string
}

export const AuthContext = createContext({} as IAuthContextData)

interface IAuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [token, setToken] = usePersistedState('tankz.token', null)
  const [nickname, setNickname] = usePersistedState('tankz.nickname', null)

  const logout = useCallback(() => {
    setToken(null)
  }, [])

  const isAuthenticated = useMemo(
    () => !!token && !!nickname,
    [token, nickname]
  )

  const setAuthData = useCallback(
    (token: string, nickname: string) => {
      setToken(token)
      setNickname(nickname)
    },
    [setToken, setNickname]
  )

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        setAuthData,
        logout,
        nickname
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
