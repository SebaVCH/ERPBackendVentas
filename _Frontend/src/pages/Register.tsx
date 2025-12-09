import { useState, type FormEvent } from "react"
import { Divider } from 'primereact/divider';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';        
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useRegister } from "../api/queries/useAuth";
import { ProgressSpinner } from "primereact/progressspinner";


type TRegister = {
    firstName : string
    lastName: string
    email: string
    password: string
    confirmPassword: string
}

const initialForm : TRegister = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
}

export default function Register() {

    const navigate = useNavigate()
    const [ formData, setFormData ] = useState<TRegister>(initialForm)
    const [ error, setError ] = useState<string | null>(null)
    const [ isErrorPassword, setIsErrorPassword ] = useState(false)
    const { mutate, isPending, isSuccess } = useRegister()


    const handleChange = (field : keyof TRegister, value : string) => {
        setFormData({ ...formData, [field]: value })
        setError(null)
    }

    const handleRegister = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(!e.currentTarget.checkValidity()) return     

        if(formData.password !== formData.confirmPassword) {
            setIsErrorPassword(true)
            setError('Verifica que las contraseñas sean identicas')
            return 
        }

        if(formData.password.length < 6) {
            setIsErrorPassword(true)
            setError('La contraseña debe tener una longitud mayor a 6')
            return 
        }

        setIsErrorPassword(false)
        setError(null)
        mutate({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            createdAt: new Date()
        }, 
        {
            onSuccess: () => {
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            },
            onError: (error) => {
                setError(error.response?.data.message ?? null)
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-100 to-slate-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Únete a nosotros
                        </h1>
                        <p className="text-gray-600">Crea tu cuenta en segundos</p>
                        <p className={`
                            mt-4 min-h-6 font-semibold transition-all duration-100
                            ${error ? "text-red-600 opacity-100" : ""}
                            ${isSuccess ? "text-green-600 opacity-100" : ""}
                        `}>
                            { isSuccess ? "Registro exitoso" : error }
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold text-gray-700">
                                Nombre
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    id="firstName"
                                    type="text"
                                    required
                                    aria-required
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    placeholder="Tu nombre"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold text-gray-700">
                                Apellido
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    id="lastName"
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    placeholder="Tu apellido (opcional)"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="reg-email" className="font-semibold text-gray-700">
                                Correo electrónico
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-envelope"></i>
                                </span>
                                <InputText
                                    id="email"
                                    type="email"
                                    required
                                    aria-required
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="reg-password" className="font-semibold text-gray-700">
                                Contraseña
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-lock"></i>
                                </span>
                                <InputText
                                    id="reg-password"
                                    required
                                    aria-required
                                    type={"password"}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={isErrorPassword ? "p-invalid" : ""}  
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirm-password" className="font-semibold text-gray-700">
                                Confirmar contraseña
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-lock"></i>
                                </span>
                                <InputText
                                    id="confirm-password"
                                    required
                                    type={"password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    className={isErrorPassword ? "p-invalid" : ""}  
                                />
                            </div>
                        </div>

                
                        <Button
                            disabled={isPending}
                            type="submit"
                            severity={isSuccess ? 'success' : 'contrast'}
                            className="w-full min-h-[50px] hover:bg-gray-700 font-semibold! flex items-center justify-center gap-2 transition-all duration-300 ease-in-out"
                        >
                            {
                                isPending ? 
                                <>
                                    <ProgressSpinner style={{width: '25px', height: '20px'}} strokeWidth="8" animationDuration=".5s" />
                                </> 
                                :
                                isSuccess ?
                                <>
                                    <i className="pi pi-check"></i>
                                    Registro válido
                                </> 
                                :
                                <>
                                    <i className="pi pi-user-plus"></i>
                                    Crear cuenta
                                </>
                            }

                        </Button>
                    </form>

                    <Divider type="solid" className="w-full my-6 bg-gray-300 h-px" />

                    {/* Login Link */}
                    <div className="text-center mt-6">  
                        <p className="text-gray-600">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 font-semibold">
                            Inicia sesión
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
