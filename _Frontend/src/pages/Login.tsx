import { Divider } from "primereact/divider"
import { InputText } from "primereact/inputtext"
import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "primereact/button"
import { useLogin } from "../api/queries/useAuth"
import { ProgressSpinner } from "primereact/progressspinner"

export default function Login() {

    const navigate = useNavigate()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ error, setError ] = useState<string | null>(null) 
    const { mutate, isPending, isSuccess } = useLogin()


    const handleLogin = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!e.currentTarget.checkValidity()) return     
        setError(null)
        mutate({ email, password }, 
        {
            onSuccess: () => {
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            },
            onError: (error) => {
                setError(error.response?.data.message ?? error.message ?? null)
            }
        })
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-100 to-slate-50 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            ¡Bienvenido de vuelta!
                        </h1>
                        <p className="text-gray-600">Ingresa a tu cuenta</p>
                        <p className={`
                            mt-4 min-h-6 font-semibold transition-all duration-100
                            ${error ? "text-red-600 opacity-100" : ""}
                            ${isSuccess ? "text-green-600 opacity-100" : ""}
                        `}>
                            { isSuccess ? "Login exitoso" : error }
                        </p>
                    </div>
                    
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-semibold text-gray-700">
                                Correo electrónico
                            </label>

                            <div className={`p-inputgroup flex1`}>
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-envelope"></i>
                                </span>
                                <InputText
                                    required
                                    id="email"
                                    type="email"
                                    value={email}
                                    className={error ? "p-invalid" : ""}
                                    onChange={(e) => {setEmail(e.target.value); setError(null)}}
                                    onBlur={() => setError(null)}
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="password" className="font-semibold text-gray-700">
                                Contraseña
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-lock text-gray-400"></i>
                                </span>
                                <InputText
                                    required
                                    id="password"
                                    type={"password"}
                                    value={password}
                                    className={error ? "p-invalid" : ""}
                                    onChange={(e) => {setPassword(e.target.value); setError(null)}}
                                    placeholder="••••••••"
                                    
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            severity={isSuccess ? 'success' : 'contrast'}
                            className={`w-full min-h-[50px] font-semibold! flex items-center justify-center gap-2 transition-all duration-300 ease-in-out`}
                            disabled={isPending}
                        >
                            
                            { isPending ? 
                                <ProgressSpinner style={{width: '25px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                                :
                              isSuccess ? 
                                <>
                                    <i className="pi pi-check"></i>
                                    Sesión válida
                                </>
                                :
                                <>
                                    <i className="pi pi-sign-in"></i>
                                    Iniciar sesión
                                </>
                            }
                        </Button>
                    </form>

                    <Divider/>

                    <div className="text-center mt-5">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-gray-600 hover:text-gray-900 font-semibold">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                    ElectroPulse E-Store
                </p>
            </div>
        </div>
    )
};
