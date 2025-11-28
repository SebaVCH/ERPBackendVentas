import { useState } from "react"
import { Divider } from 'primereact/divider';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';        
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


type TRegister = {
    name : string
    email: string
    password: string
    confirmPassword: string
}

const initialForm : TRegister = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

export default function Register() {

    const [ formData, setFormData ] = useState<TRegister>(initialForm)

    const handleChange = (field : keyof TRegister, value : string) => {
        setFormData({ ...formData, [field]: value })
    }

    const handleRegister = () => {
        console.log(formData)
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
                    </div>


                    <div className="space-y-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="font-semibold text-gray-700">
                                Nombre completo
                            </label>
                            <div className="p-inputgroup flex1">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-user"></i>
                                </span>
                                <InputText
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Tu nombre"
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
                                    value={initialForm.email}
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
                                    type={"password"}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
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
                                    type={"password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700 focus:border-transparent outline-none transition"
                                />
                            </div>
                        </div>

                
                        <Button
                        onClick={handleRegister}
                        severity="contrast"
                        className="w-full hover:bg-gray-700 font-semibold! flex items-center justify-center gap-2"
                        >
                       <i className="pi pi-user-plus"></i>
                        Crear cuenta
                        </Button>
                    </div>

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
                    ERP-SI2 e-commerce vegano
                </p>
            </div>
        </div>
    )    
};
