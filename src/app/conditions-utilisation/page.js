export default function ConditionsUtilisation() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 bg-white dark:bg-[#23221f] text-[#23221f] dark:text-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Conditions d’utilisation</h1>
      <p className="mb-4">
        Bienvenue sur notre site. En utilisant ce service, vous acceptez les conditions suivantes :
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Respecter les lois en vigueur.</li>
        <li>Ne pas utiliser le service à des fins illégales ou abusives.</li>
        <li>Respecter la vie privée des autres utilisateurs.</li>
        {/* Ajoute ici d’autres points spécifiques à ton projet */}
      </ul>
      <p>
        Pour toute question, contactez-nous à noah.mathey@gmail.com.
      </p>
    </div>
  );
}
