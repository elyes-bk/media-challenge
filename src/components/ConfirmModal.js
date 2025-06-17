export default function ConfirmModal({ show, onClose, onConfirm, children }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-sm">
        <div className="text-gray-900 text-lg">{children}</div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white transition"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}
