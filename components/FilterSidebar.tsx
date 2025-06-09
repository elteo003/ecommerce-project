// components/FilterSidebar.tsx
import React from 'react';

interface FilterSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  sortPriceAsc: boolean;
  setSortPriceAsc: (val: boolean) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedArtisans: string[];
  setSelectedArtisans: (artisans: string[]) => void;
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
}

export default function FilterSidebar({
  open,
  setOpen,
  maxPrice,
  setMaxPrice,
  sortPriceAsc,
  setSortPriceAsc,
  selectedTags,
  setSelectedTags,
  selectedArtisans,
  setSelectedArtisans,
  selectedMaterials,
  setSelectedMaterials,
}: FilterSidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-black text-white shadow-xl transform transition-transform duration-300 z-50 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        <button
          onClick={() => setOpen(false)}
          className="self-end mb-6 text-white hover:text-gray-300"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-6">Filtri & Ordine</h3>

        {/* Filtro Prezzo */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Prezzo massimo (€)</label>
          <input
            type="number"
            min={0}
            value={maxPrice === Infinity ? '' : maxPrice}
            onChange={(e) =>
              setMaxPrice(
                e.target.value === '' ? Infinity : Number(e.target.value)
              )
            }
            className="w-full border border-gray-700 rounded p-2 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
            placeholder="Nessun limite"
          />
        </div>

        {/* Ordinamento Prezzo */}
        <div className="mb-6">
          <p className="font-medium mb-2">Ordina per prezzo</p>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={sortPriceAsc}
              onChange={() => setSortPriceAsc(!sortPriceAsc)}
              className="accent-white"
            />
            Ascendente
          </label>
        </div>

        {/* Filtro Tag */}
        <div className="mb-6">
          <p className="font-medium mb-2">Tag</p>
          <input
            type="text"
            value={selectedTags.join(', ')}
            onChange={(e) =>
              setSelectedTags(
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t)
              )
            }
            placeholder="inserisci tag separati da virgola"
            className="w-full border border-gray-700 rounded p-2 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {/* Filtro Artigiani */}
        <div className="mb-6">
          <p className="font-medium mb-2">Artigiani</p>
          <input
            type="text"
            value={selectedArtisans.join(', ')}
            onChange={(e) =>
              setSelectedArtisans(
                e.target.value
                  .split(',')
                  .map((a) => a.trim())
                  .filter((a) => a)
              )
            }
            placeholder="inserisci artigiani separati da virgola"
            className="w-full border border-gray-700 rounded p-2 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {/* Filtro Materiali */}
        <div className="mb-6">
          <p className="font-medium mb-2">Materiali</p>
          <input
            type="text"
            value={selectedMaterials.join(', ')}
            onChange={(e) =>
              setSelectedMaterials(
                e.target.value
                  .split(',')
                  .map((m) => m.trim())
                  .filter((m) => m)
              )
            }
            placeholder="inserisci materiali separati da virgola"
            className="w-full border border-gray-700 rounded p-2 bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>

        {/* Pulsante Reset */}
        <button
          onClick={() => {
            setMaxPrice(Infinity);
            setSortPriceAsc(false);
            setSelectedTags([]);
            setSelectedArtisans([]);
            setSelectedMaterials([]);
          }}
          className="mt-auto bg-gray-800 hover:bg-gray-700 text-white py-2 rounded"
        >
          Reset filtri
        </button>
      </div>
    </aside>
  );
}
