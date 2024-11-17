export function QRCodeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="transform transition-all duration-300 ease-out cursor-default bg-white rounded-lg p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-64 h-64">
          <img 
            src="/qrcode.png" 
            alt="微信二维码" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">扫码添加微信</p>
        </div>
      </div>
    </div>
  );
} 