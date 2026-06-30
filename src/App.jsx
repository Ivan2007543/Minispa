import React, { useEffect, useState } from 'react';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialList = async () => {
      try {
        setIsLoadingList(true);
        setError('');

        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        
        if (!response.ok) throw new Error('Error al cargar la lista');
        
        const result = await response.json();
        setPokemonList(result.results);
      } catch (err) {
        setError('No se pudo cargar la Pokédex.');
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchInitialList();
  }, []); 

  const fetchPokemonDetail = async (name) => {
    try {
      setIsLoadingDetail(true);
      setError('');
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) throw new Error('Error al cargar el detalle');
      
      const result = await response.json();
      setSelectedPokemon(result);
    } catch (err) {
      setError('No se pudo cargar el detalle del Pokémon.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-red-600 rounded-2xl p-6 shadow-xl border-4 border-red-700 flex flex-col">
        
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-lg text-center font-medium text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <section className="bg-red-700 p-4 rounded-xl flex flex-col h-[400px]">
            <h2 className="text-xs font-bold text-red-200 uppercase mb-2">
              Registros Disponibles
            </h2>

            <div className="bg-slate-800 rounded-lg p-2 flex-1 overflow-y-auto">
              {isLoadingList && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-cyan-400 text-xs font-mono">Cargando datos...</p>
                </div>
              )}

              {!isLoadingList && pokemonList.map((pokemon, index) => {
                const isSelected = selectedPokemon?.name === pokemon.name;
                
                return (
                  <button
                    key={pokemon.name}
                    onClick={() => fetchPokemonDetail(pokemon.name)}
                    disabled={isLoadingDetail}
                    className={`w-full text-left px-3 py-2 my-1 rounded text-xs font-mono uppercase transition-colors block
                      ${isSelected 
                        ? 'bg-cyan-500 text-slate-900 font-bold' 
                        : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                  >
                    {String(index + 1).padStart(3, '0')}. {pokemon.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="md:col-span-2 bg-slate-200 p-4 rounded-xl flex flex-col justify-center items-center h-[400px]">
            
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

            {isLoadingDetail && (
              <div className="text-center">
                <p className="text-slate-600 font-mono text-sm">Consultando PokéAPI...</p>
              </div>
            )}

            {!isLoadingDetail && selectedPokemon && (
              <div className="w-full flex flex-col items-center">
                
                <div className="bg-white border border-slate-300 w-full max-w-sm rounded-lg p-4 flex flex-col items-center shadow-sm">
                  <span className="font-mono text-xs text-slate-400 font-bold self-end">
                    Nº {String(selectedPokemon.id).padStart(4, '0')}
                  </span>

                  <div className="w-32 h-32 bg-slate-100 border border-slate-200 rounded flex items-center justify-center mt-2">
                    <img
                      src={selectedPokemon.sprites.front_default}
                      alt={selectedPokemon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h2 className="text-xl font-bold capitalize text-slate-800 mt-3">
                    {selectedPokemon.name}
                  </h2>

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