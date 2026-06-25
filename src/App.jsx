import React, { useEffect, useState } from 'react';

function App() {

  // ESTADOS (Control de Memoria y Flujo)

  // 1. Almacena la lista inicial de los 151 Pokémon (Array de objetos con 'name' y 'url').
  // Inicializa vacío ([]) porque la respuesta de la API no es instantánea.
  const [pokemonList, setPokemonList] = useState([]);

  // 2. Almacena el objeto JSON masivo con los detalles del Pokémon seleccionado (ID, foto, peso, etc.).
  // Inicializa en 'null' porque al arrancar la app el usuario no ha hecho clic en ningún elemento.
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // 3. Bandera lógica (Booleano) para el estado de carga de la lista izquierda.
  // Permite implementar renderizado condicional mientras los bytes viajan por la red.
  const [isLoadingList, setIsLoadingList] = useState(false);

  // 4. Bandera lógica (Booleano) para el estado de carga del panel de detalles.
  // Evita que el usuario sature la API a base de clics rápidos antes de que termine la consulta actual.
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // 5. Estado para el manejo de excepciones. Si el servidor falla o no hay internet,
  // captura el error para evitar un "crash" de la aplicación (pantalla en blanco).
  const [error, setError] = useState('');

  // COMPORTAMIENTO 1: Fase de Montaje 
  useEffect(() => {
    // Se declara una función asíncrona interna para poder usar la sintaxis imperativa 'async/await'
    const fetchInitialList = async () => {
      try {
        setIsLoadingList(true); // Flujo de UI: Activa el aviso de "Cargando datos..."
        setError('');           // Limpieza: Resetea errores previos

        // Petición HTTP asíncrona: Detiene esta función en segundo plano, pero NO congela la interfaz
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        
        // Control de errores de red: Si el estado HTTP no es 2xx, fuerza la caída al bloque 'catch'
        if (!response.ok) throw new Error('Error al cargar la lista');
        
        // Deserialización: Convierte el flujo de datos binarios en un objeto JavaScript ejecutable
        const result = await response.json();
        
        // Mutación del Estado: Modifica la memoria. React detecta el cambio y fuerza un re-renderizado
        setPokemonList(result.results);
      } catch (err) {
        // Captura de la excepción: Alimenta el estado con un mensaje controlado para el estudiante/usuario
        setError('No se pudo cargar la Pokédex.');
      } finally {
        // Garantía lógica: Exitoso o fallido el proceso, apaga el indicador de carga para liberar la pantalla
        setIsLoadingList(false);
      }
    };

    fetchInitialList(); // Invocación inmediata de la función asíncrona recién declarada

  }, []); 

  // COMPORTAMIENTO 2: Guiado por Evento

  // Responde única y exclusivamente a una interacción directa del usuario (Manejador de Eventos).
  const fetchPokemonDetail = async (name) => {
    try {
      setIsLoadingDetail(true); // Activa el estado de consulta en el panel derecho
      setError('');
      
      // Interpolación de Strings (Template Literals): Modifica la URL dinámicamente usando el parámetro recibido
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) throw new Error('Error al cargar el detalle');
      
      const result = await response.json();
      setSelectedPokemon(result); // Almacena el payload completo del Pokémon individual
    } catch (err) {
      setError('No se pudo cargar el detalle del Pokémon.');
    } finally {
      setIsLoadingDetail(false); // Libera la interfaz para permitir nuevas selecciones
    }
  };

  // INTERFAZ (Renderizado Condicional) 
  
  return (
    <main className="min-h-screen bg-slate-900 p-6 flex items-center justify-center font-sans">
      
      {/* CONTENEDOR FÍSICO DE LA POKÉDEX */}
      <div className="w-full max-w-4xl bg-red-600 rounded-2xl p-6 shadow-xl border-4 border-red-700 flex flex-col">
        
        {/* HEADER ESTÁTICO */}
        <header className="flex items-center justify-between border-b-2 border-red-700 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-cyan-400 border-4 border-white shadow"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">
            Pokédex 
          </h1>
        </header>

        {/* ALERTA DE ERROR: Renderizado Condicional mediante Evaluación de Cortocircuito (AND lógico `&&`) */}
        {/* Si 'error' es un string con texto (evalúa a true), React procede a renderizar el bloque HTML de la derecha */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg text-center font-medium text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* CUERPO PRINCIPAL EN DOS PANELES (Layout estructurado mediante CSS Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* --- PANEL IZQUIERDO: SELECCIÓN DE DATOS --- */}
          <section className="bg-red-700 p-4 rounded-xl flex flex-col h-[400px]">
            <h2 className="text-xs font-bold text-red-200 uppercase mb-2">
              Registros Disponibles
            </h2>

            <div className="bg-slate-800 rounded-lg p-2 flex-1 overflow-y-auto">
              {/* Condición de Espera Inicial: Bloquea el renderizado de la lista si la API no ha respondido */}
              {isLoadingList && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-cyan-400 text-xs font-mono">Cargando datos...</p>
                </div>
              )}

              {/* Programación Funcional: Iteración con el método .map() */}
              {/* Transforma cada elemento del array lógico en un componente interactivo de interfaz de usuario */}
              {!isLoadingList && pokemonList.map((pokemon, index) => {
                
                // EVALUACIÓN DE IDENTIDAD: Compara el Pokémon que se está dibujando en este ciclo
                // contra el Pokémon guardado globalmente en memoria. El encadenamiento opcional `?.`
                // previene errores de ejecución si 'selectedPokemon' apunta a null.
                const isSelected = selectedPokemon?.name === pokemon.name;
                
                return (
                  <button
                    key={pokemon.name} // ATRIBUTO REQUERIDO: Proporciona una clave de identidad única al Algoritmo de Reconciliación de React
                    onClick={() => fetchPokemonDetail(pokemon.name)} // Callback: Dispara el comportamiento asíncrona pasando argumentos
                    disabled={isLoadingDetail} // Control de estado: Deshabilita el botón si otra petición está en curso
                    
                    // Expresión Ternaria Inyectada en Template String: Controla dinámicamente los estilos CSS de Tailwind
                    className={`w-full text-left px-3 py-2 my-1 rounded text-xs font-mono uppercase transition-colors block
                      ${isSelected 
                        ? 'bg-cyan-500 text-slate-900 font-bold' // Estilo si la comparación booleana fue VERDADERA
                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600' // Estilo si fue FALSA
                      }`}
                  >
                    {/* Operación con Strings: Añade ceros a la izquierda para simular un formato de índice de tres dígitos (001, 002) */}
                    {String(index + 1).padStart(3, '0')}. {pokemon.name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* --- PANEL DERECHO: MONITOR DE DETALLES BIOLÓGICOS --- */}
          <section className="md:col-span-2 bg-slate-200 p-4 rounded-xl flex flex-col justify-center items-center h-[400px]">
            
            {/* CASO INTERFAZ 1: MODO ESPERA ESTÁTICO */}
            {/* Lógica: Si NO se está descargando información Y ADEMÁS NO hay ningún registro seleccionado */}
            {!isLoadingDetail && !selectedPokemon && (
              <div className="text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 mx-auto mb-3 font-bold text-lg">
                  i
                </div>
                <h3 className="font-bold text-slate-700 text-sm uppercase">Pantalla en espera</h3>
                <p className="text-slate-500 text-xs mt-2 max-w-xs font-mono">
                  Selecciona un Pokémon de la lista izquierda para solicitar sus datos biológicos a la API.
                </p>
              </div>
            )}

            {/* CASO INTERFAZ 2: CONSULTA DE DATOS EN PROCESO */}
            {/* Si el booleano cambia a verdadero, oculta los otros estados y dibuja el texto de carga */}
            {isLoadingDetail && (
              <div className="text-center">
                <p className="text-slate-600 font-mono text-sm">Consultando PokéAPI...</p>
              </div>
            )}

            {/* CASO INTERFAZ 3: DESPLIEGUE COMPLETO DEL OBJETO JSON */}
            {/* Lógica: Si terminó la consulta de red y disponemos de la estructura del Pokémon en memoria */}
            {!isLoadingDetail && selectedPokemon && (
              <div className="w-full flex flex-col items-center">
                
                {/* TARJETA VISUAL */}
                <div className="bg-white border border-slate-300 w-full max-w-sm rounded-lg p-4 flex flex-col items-center shadow-sm">
                  {/* Acceso directo a propiedades del estado mutado */}
                  <span className="font-mono text-xs text-slate-400 font-bold self-end">
                    Nº {String(selectedPokemon.id).padStart(4, '0')}
                  </span>

                  {/* VISOR DE IMAGEN */}
                  <div className="w-32 h-32 bg-slate-100 border border-slate-200 rounded flex items-center justify-center mt-2">
                    <img
                      src={selectedPokemon.sprites.front_default} // Enlace directo extraído dinámicamente desde el objeto JSON
                      alt={selectedPokemon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h2 className="text-xl font-bold capitalize text-slate-800 mt-3">
                    {selectedPokemon.name}
                  </h2>

                  {/* ITERACIÓN SECUNDARIA INTERNA (Mapeo de Tipos Elementales) */}
                  <div className="mt-2 flex gap-2">
                    {selectedPokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-700 text-white"
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}

export default App;