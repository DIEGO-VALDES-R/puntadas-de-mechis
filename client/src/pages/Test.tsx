export default function Test() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Imágenes</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Ruta relativa /gallery/</h2>
          <img 
            src="/gallery/1002478157.jpg" 
            alt="Test 1"
            className="w-full h-40 object-cover border-2 border-red-500"
            onLoad={() => console.log('Image 1 loaded')}
            onError={(e) => console.error('Image 1 error:', e)}
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">URL absoluta</h2>
          <img 
            src="https://3000-i9n12bjiu7iguxbar0tr8-4d3b8c1e.manusvm.computer/gallery/1002478157.jpg"
            alt="Test 2"
            className="w-full h-40 object-cover border-2 border-blue-500"
            onLoad={() => console.log('Image 2 loaded')}
            onError={(e) => console.error('Image 2 error:', e)}
          />
        </div>
      </div>
    </div>
  );
}
