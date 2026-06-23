import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {

    try {

      setIsLoading(true);

      setError('');

 

      const response = await fetch('URL_DE_LA_API');

 

      if (!response.ok) {

        throw new Error('Error al consultar la API');

      }

 

      const result = await response.json();

 

      setData(result);

    } catch (error) {

      setError('No se pudo cargar la información.');

    } finally {

      setIsLoading(false);

    }

  };

 

  useEffect(() => {

    fetchData();

  }, []);

 

  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-gray-800">

          Mi mini SPA con API

        </h1>

 

        <p className="mt-2 text-gray-500">

          Esta aplicación consume una API externa usando useEffect.

        </p>

 

        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-6">

          {isLoading && <p>Cargando información...</p>}

 

          {error && <p className="text-red-500">{error}</p>}

 

          {!isLoading && !error && data && (

            <pre className="whitespace-pre-wrap text-sm text-gray-700">

              {JSON.stringify(data, null, 2)}

            </pre>

          )}

        </div>

 

        <button

          onClick={fetchData}

          disabled={isLoading}

          className="mt-6 rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white shadow-md hover:bg-blue-600 disabled:bg-gray-400"

        >

          {isLoading ? 'Consultando...' : 'Consultar de nuevo'}

        </button>

      </section>

    </main>

  );

}

 

export default App;