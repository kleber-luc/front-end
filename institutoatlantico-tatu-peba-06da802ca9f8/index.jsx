export default function AdminResponse() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="Admin avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-lg font-semibold text-gray-800">Admin João</p>
            <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
              Resposta Gratuita
            </span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <p className="text-gray-700">
            Olá! Sua solicitação foi recebida e já está sendo analisada.
            Responderemos em breve. Obrigado pelo contato!
          </p>
        </div>
      </div>
    </div>
  );
}
