import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface CreateTicketForm {
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: string;
}

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTicketForm>();
  const [attachments, setAttachments] = useState<File[]>([]);

  const onSubmit = async (data: CreateTicketForm) => {
    try {
      // En una implementación real, enviar el ticket al backend
      /*
      const formData = new FormData();
      formData.append('titulo', data.titulo);
      formData.append('descripcion', data.descripcion);
      formData.append('categoria', data.categoria);
      formData.append('prioridad', data.prioridad);
      
      // Añadir archivos adjuntos
      attachments.forEach(file => {
        formData.append('archivos', file);
      });
      
      const response = await axios.post('http://localhost:3000/api/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      */
      
      toast.success('Ticket creado exitosamente');
      
      // Simular un retraso para la demostración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redireccionar a la lista de tickets después de crear
      navigate('/tickets');
    } catch (error) {
      console.error('Error al crear ticket:', error);
      toast.error('Error al crear el ticket');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments([...attachments, ...fileList]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Crear nuevo ticket
        </h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Información del ticket
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Completa todos los campos para crear un nuevo ticket de soporte.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
                Título <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="titulo"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                    errors.titulo ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                  placeholder="Escribe un título conciso para tu problema"
                  {...register('titulo', {
                    required: 'El título es obligatorio',
                    minLength: {
                      value: 5,
                      message: 'El título debe tener al menos 5 caracteres'
                    },
                    maxLength: {
                      value: 100,
                      message: 'El título no puede exceder los 100 caracteres'
                    }
                  })}
                />
                {errors.titulo && (
                  <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                Descripción <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="descripcion"
                  rows={5}
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                    errors.descripcion ? 'border-red-300' : 'border-gray-300'
                  } rounded-md`}
                  placeholder="Describe tu problema con detalle (pasos para reproducir, errores, etc.)"
                  {...register('descripcion', {
                    required: 'La descripción es obligatoria',
                    minLength: {
                      value: 20,
                      message: 'La descripción debe tener al menos 20 caracteres'
                    }
                  })}
                ></textarea>
                {errors.descripcion && (
                  <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="categoria"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                      errors.categoria ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                    {...register('categoria', {
                      required: 'La categoría es obligatoria'
                    })}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Aplicación Web">Aplicación Web</option>
                    <option value="Aplicación Móvil">Aplicación Móvil</option>
                    <option value="Cuenta y Acceso">Cuenta y Acceso</option>
                    <option value="Facturación">Facturación</option>
                    <option value="API y Integraciones">API e Integraciones</option>
                    <option value="Reportes y Analíticas">Reportes y Analíticas</option>
                    <option value="Otro">Otro</option>
                  </select>
                  {errors.categoria && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
                  Prioridad <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="prioridad"
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                      errors.prioridad ? 'border-red-300' : 'border-gray-300'
                    } rounded-md`}
                    {...register('prioridad', {
                      required: 'La prioridad es obligatoria'
                    })}
                  >
                    <option value="">Selecciona una prioridad</option>
                    <option value="Baja">Baja - No urgente</option>
                    <option value="Media">Media - Importante pero no crítico</option>
                    <option value="Alta">Alta - Urgente, afecta el trabajo</option>
                  </select>
                  {errors.prioridad && (
                    <p className="mt-1 text-sm text-red-600">{errors.prioridad.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Archivos adjuntos
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Sube un archivo</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        multiple
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF, DOC hasta 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de archivos adjuntos */}
            {attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Archivos seleccionados:</h4>
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {attachments.map((file, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-5 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/tickets')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Crear ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;