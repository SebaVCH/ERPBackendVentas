import { Divider } from "primereact/divider"
import { InputText } from "primereact/inputtext"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "primereact/button"

export default function Login() {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const handleLogin = () => {
        console.log({email, password})
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
                    </div>
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" className="font-semibold text-gray-700">
                                Correo electrónico
                            </label>

                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-envelope"></i>
                                </span>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    id="password"
                                    type={"password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            severity='contrast'
                            className="w-full hover:bg-gray-700! font-semibold! flex items-center justify-center gap-2"
                        >
                            <i className="pi pi-sign-in"></i>
                            Iniciar sesión
                        </Button>
                    </div>

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
                    ERP-SI2 e-commerce vegano
                </p>
            </div>
        </div>
    )
};
