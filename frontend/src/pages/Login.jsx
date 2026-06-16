import { useLoginLogic } from '../hooks/useLogin'
import GlobeIcon from '../components/icons/GlobeIcon'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'

export default function Login() {
  const {
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
  } = useLoginLogic()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-np-bg">
      <div className="w-full max-w-sm np-fade-up">
        <Card className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center mb-7">
              <GlobeIcon />
              <h1 className="text-2xl font-bold mt-3 text-np-text tracking-wider">
                NETPRO
              </h1>
            </div>

            <Input
              label="Usuario"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              autoComplete="username"
              autoFocus
              disabled={isLoading}
              error={errUsername ? 'Ingresa tu usuario' : error && !username ? error : undefined}
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              autoComplete="current-password"
              disabled={isLoading}
              error={errPassword ? 'Ingresa tu contraseña' : error ? error : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={isLoading}
            >
              INGRESAR
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}