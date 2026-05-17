{/* PERBAIKAN GRID BARU: Desain mode compact agar muat banyak di layar HP */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={`grid-${product.id}`} className="bg-gradient-to-b from-[#0d0d0f] to-[#121215] border border-[#3d3d3d] rounded-xl flex flex-col overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 group">
                  
                  {/* Gambar Penutup Kartu (Diperkecil) */}
                  <div className="h-28 md:h-36 bg-gradient-to-b from-[#1a1a24] to-[#0d0d0f] relative overflow-hidden border-b border-[#3d3d3d]/50 group-hover:border-cyan-500/30 transition-colors">
                    <div className="absolute inset-0 bg-cyan-500/5 blur-xl rounded-full scale-150"></div>
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Penunjuk Lencana (Diskalakan Ulang) */}
                    <div className="absolute top-2 right-2 z-20 legendary-indicator scale-75 origin-top-right">
                      <Crown size={10} className="mr-1 inline-block"/> {product.category}
                    </div>
                  </div>

                  {/* Panel Informasi Detil (Padding & Font Diperkecil) */}
                  <div className="p-3 md:p-4 flex flex-col flex-grow relative z-10 bg-gradient-to-b from-transparent to-[#0f0f13]/50">
                    <span className="card-brand text-[9px] md:text-[10px] mb-0.5 block opacity-70">EDELWEISS</span>
                    <h3 className="text-sm md:text-base font-extrabold mb-1 text-white tracking-tight uppercase group-hover:text-cyan-400 transition-colors leading-tight">{product.name}</h3>
                    <p className="text-[10px] md:text-xs text-gray-400 mb-3 line-clamp-2 italic opacity-80 flex-grow leading-snug">"{product.description}"</p>
                    
                    {/* Kelola Tombol Aksi Bawah */}
                    <div className="border-t border-[#3d3d3d]/50 pt-3 mt-auto">
                      <div className="text-center font-bold text-sm md:text-base text-white mb-2 tracking-tight">Rp {product.price.toLocaleString('id-ID')}</div>
                      
                      <div className="flex gap-1.5 md:gap-2">
                        <button 
                          onClick={() => setSelectedProduct(product)} 
                          className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all duration-300 active:scale-95 shadow-[0_4px_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase tracking-wider"
                        >
                          Beli
                        </button>
                        <button 
                          onClick={(e) => handleAddToCart(e, product.name)}
                          className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-2 md:px-2.5 py-1.5 md:py-2 rounded-md md:rounded-lg transition-all duration-300 active:scale-95 group-hover:border-cyan-400 flex items-center justify-center"
                          title="Tambah ke keranjang"
                        >
                          <ShoppingCart size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
               <div className="col-span-full text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-800 text-xs md:text-sm">
                 Tidak ada produk di kategori {activeCategory}.
               </div>
            )}
          </div>