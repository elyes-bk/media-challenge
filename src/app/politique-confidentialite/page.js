export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-white dark:bg-[#23221f] text-[#23221f] dark:text-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Politique de confidentialité</h1>
      <p className="mb-4">
        Nous attachons une grande importance à la protection de vos données personnelles.
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Les données collectées sont utilisées uniquement pour améliorer le service.</li>
        <li>Vous pouvez demander la suppression de vos données à tout moment.</li>
        <li>Nous ne partageons pas vos données avec des tiers sans votre consentement.</li>
        {/* Ajoute ici d’autres points spécifiques à ton projet */}
      </ul>
      <p>
        Pour toute question relative à la confidentialité, contactez-nous à noah.mathey@gmail.com
      </p>
    </div>
  );
}
