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
        setError('No se pudo cargar la lista de Pokémon.');
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
      setError('No se pudo obtener la información básica del Pokémon.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800 p-6 flex flex-col items-center justify-center font-sans selection:bg-neutral-200">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* Header minimalista sin la carcasa roja de Pokédex */}
        <header className="flex flex-col gap-1 border-b border-neutral-200 pb-4">
          <h1 className="text-xl font-medium tracking-tight text-neutral-900">
            Pokédex <span className="text-neutral-400 font-normal text-sm ml-1">v1.0 (Kanto)</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Proyecto escolar de consumo de APIs asíncronas con React y Tailwind.
          </p>
        </header>

        {error && (
          <div className="p-3 bg-neutral-100 text-neutral-600 border border-neutral-200 rounded text-center text-xs tracking-wide">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Panel Izquierdo: Lista limpia con scroll sutil */}
          <section className="flex flex-col h-[450px]">
            <h2 className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-3">
              Índice de registros
            </h2>

            <div className="border border-neutral-200 rounded-lg p-2 flex-1 overflow-y-auto bg-white divide-y divide-neutral-100">
              {isLoadingList && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-neutral-400 text-xs animate-pulse">Cargando índice...</p>
                </div>
              )}

              {!isLoadingList && pokemonList.map((pokemon, index) => {
                const isSelected = selectedPokemon?.name === pokemon.name;
                
                return (
                  <button
                    key={pokemon.name}
                    onClick={() => fetchPokemonDetail(pokemon.name)}
                    disabled={isLoadingDetail}
                    className={`w-full text-left px-3 py-2.5 text-xs font-mono transition-all duration-150 flex justify-between items-center
                      ${isSelected 
                        ? 'bg-neutral-900 text-white font-medium rounded-md shadow-sm' 
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }`}
                  >
                    <span className="capitalize">{pokemon.name}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-neutral-400' : 'text-neutral-300'}`}>
                      #{String(index + 1).padStart(3, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Panel Derecho: Vista de Detalle limpia */}
          <section className="md:col-span-2 border border-neutral-200 rounded-lg bg-white h-[450px] flex items-center justify-center p-6 relative">
            
            {!isLoadingDetail && !selectedPokemon && (
              <div className="text-center p-4">
                <p className="text-neutral-400 text-xs tracking-wide font-mono">
                  [ Selecciona un espécimen del índice ]
                </p>
              </div>
            )}

            {isLoadingDetail && (
              <div className="text-center">
                <p className="text-neutral-400 text-xs animate-pulse font-mono">Petición HTTP en curso...</p>
              </div>
            )}

            {!isLoadingDetail && selectedPokemon && (
              <div className="w-full h-full flex flex-col justify-between items-center py-4">
                
                <span className="font-mono text-[11px] text-neutral-400 absolute top-4 right-4">
                  ID: {String(selectedPokemon.id).padStart(4, '0')}
                </span>

                {/* Contenedor de la imagen sin fondos estridentes */}
                <div className="w-40 h-40 flex items-center justify-center bg-neutral-50 border border-neutral-100 rounded-full my-auto p-4">
                  <img
                    src={selectedPokemon.sprites.front_default}
                    alt={selectedPokemon.name}
                    className="w-full h-full object-contain grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                  />
                </div>

                <div className="text-center w-full mt-auto">
                  <h3 className="text-2xl font-light tracking-tight capitalize text-neutral-900">
                    {selectedPokemon.name}
                  </h3>

                  {/* Badges de tipos minimalistas en tonos grises/blancos */}
                  <div className="mt-3 flex gap-1.5 justify-center">
                    {selectedPokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="px-2.5 py-0.5 rounded border border-neutral-200 text-[10px] tracking-wider uppercase bg-white text-neutral-500 font-medium"
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
        
        <footer className="text-center text-[10px] text-neutral-400 font-mono mt-4">
          Hecho con ☕ — Interfaz de Usuario II
        </footer>
      </div>
    </main>
  );
}

export default App;