export default function AdminTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: 'users', label: 'Utilisateurs' },
    { key: 'events', label: 'Événements' },
    { key: 'categories', label: 'Catégories' },
    { key: 'video', label: 'Vidéo'}
  ]
  return (
    <div className="flex justify-center space-x-6 border-b border-gray-300">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-6 py-3 font-semibold transition-colors duration-200
            ${activeTab === tab.key
              ? 'border-b-4 border-blue-700 text-blue-800'
              : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
