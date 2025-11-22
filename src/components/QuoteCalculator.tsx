import { useState } from 'react';

interface QuoteOptions {
  projectType: string;
  pages: number;
  features: string[];
  design: string;
  seo: boolean;
  maintenance: string;
}

const QuoteCalculator = () => {
  const [step, setStep] = useState(1);
  const [options, setOptions] = useState<QuoteOptions>({
    projectType: '',
    pages: 1,
    features: [],
    design: 'template',
    seo: false,
    maintenance: 'none',
  });

  const [showResult, setShowResult] = useState(false);

  // Pricing logic
  const calculatePrice = () => {
    let basePrice = 0;

    // Base price by project type
    switch (options.projectType) {
      case 'vitrine':
        basePrice = 800;
        break;
      case 'ecommerce':
        basePrice = 2500;
        break;
      case 'custom':
        basePrice = 1500;
        break;
      default:
        basePrice = 800;
    }

    // Price per page (beyond first 3)
    if (options.pages > 3) {
      basePrice += (options.pages - 3) * 150;
    }

    // Features
    const featurePrices: Record<string, number> = {
      contact: 0, // included
      booking: 300,
      blog: 200,
      gallery: 150,
      maps: 0, // included
      multilang: 400,
    };

    options.features.forEach(feature => {
      basePrice += featurePrices[feature] || 0;
    });

    // Design
    if (options.design === 'custom') {
      basePrice += 500;
    }

    // SEO
    if (options.seo) {
      basePrice += 300;
    }

    return basePrice;
  };

  const getMaintenancePrice = () => {
    switch (options.maintenance) {
      case 'essential':
        return 49;
      case 'premium':
        return 99;
      default:
        return 0;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleFeature = (feature: string) => {
    if (options.features.includes(feature)) {
      setOptions({
        ...options,
        features: options.features.filter(f => f !== feature),
      });
    } else {
      setOptions({
        ...options,
        features: [...options.features, feature],
      });
    }
  };

  const resetCalculator = () => {
    setStep(1);
    setShowResult(false);
    setOptions({
      projectType: '',
      pages: 1,
      features: [],
      design: 'template',
      seo: false,
      maintenance: 'none',
    });
  };

  if (showResult) {
    const totalPrice = calculatePrice();
    const maintenancePrice = getMaintenancePrice();

    return (
      <div className="bg-dark-900 border border-dark-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-electric-950 border border-indigo-electric-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-electric-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-4xl font-display font-bold text-white mb-2">Votre devis estimatif</h2>
          <p className="text-gray-400">Estimation basée sur vos choix</p>
        </div>

        <div className="bg-dark-950 border border-indigo-electric-900/30 rounded-xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="text-5xl font-display font-bold text-indigo-electric-400 mb-2">
              {totalPrice.toLocaleString('fr-FR')} €
            </div>
            <p className="text-gray-400">Prix de création (paiement unique)</p>
          </div>

          {maintenancePrice > 0 && (
            <div className="text-center pt-6 border-t border-dark-800">
              <div className="text-3xl font-display font-bold text-indigo-electric-400 mb-2">
                + {maintenancePrice} €/mois
              </div>
              <p className="text-gray-400">Maintenance {options.maintenance === 'essential' ? 'Essentielle' : 'Premium'}</p>
            </div>
          )}
        </div>

        <div className="bg-dark-950 border border-dark-800 rounded-xl p-6 mb-8">
          <h3 className="font-display font-bold text-lg text-white mb-4">Récapitulatif de votre projet :</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-indigo-electric-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Type : {options.projectType === 'vitrine' ? 'Site vitrine' : options.projectType === 'ecommerce' ? 'Site e-commerce' : 'Site sur-mesure'}
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-indigo-electric-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Nombre de pages : {options.pages}
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-indigo-electric-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Design : {options.design === 'custom' ? 'Sur-mesure' : 'À partir d\'un template'}
            </li>
            {options.features.length > 0 && (
              <li className="flex items-start">
                <svg className="w-5 h-5 text-indigo-electric-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  Fonctionnalités : {options.features.join(', ')}
                </div>
              </li>
            )}
            {options.seo && (
              <li className="flex items-center">
                <svg className="w-5 h-5 text-indigo-electric-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pack SEO local inclus
              </li>
            )}
          </ul>
        </div>

        <div className="bg-indigo-electric-950/30 border border-indigo-electric-900/50 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-400">
            <strong className="text-indigo-electric-400">Note :</strong> Ce devis est une estimation. Le prix final peut varier selon
            la complexité exacte de votre projet. Contactez-nous pour un devis détaillé et personnalisé.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={resetCalculator}
            className="flex-1 px-6 py-3 bg-dark-950 border border-dark-800 text-gray-300 rounded-lg font-semibold hover:bg-dark-800 transition-colors"
          >
            Recommencer
          </button>
          <a
            href="/contact"
            className="flex-1 px-6 py-3 bg-indigo-electric-600 text-white rounded-lg font-semibold hover:bg-indigo-electric-500 transition-colors text-center shadow-lg shadow-indigo-electric-600/20"
          >
            Demander un devis détaillé
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-400">Étape {step} sur 5</span>
          <span className="text-sm font-semibold text-indigo-electric-400">{Math.round((step / 5) * 100)}%</span>
        </div>
        <div className="w-full bg-dark-950 border border-dark-800 rounded-full h-2">
          <div
            className="bg-indigo-electric-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Project Type */}
      {step === 1 && (
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Type de projet</h2>
          <p className="text-gray-400 mb-6">Quel type de site souhaitez-vous créer ?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setOptions({ ...options, projectType: 'vitrine' })}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                options.projectType === 'vitrine'
                  ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                  : 'border-dark-800 hover:border-indigo-electric-900'
              }`}
            >
              <div className="w-12 h-12 bg-indigo-electric-950 border border-indigo-electric-900 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Site Vitrine</h3>
              <p className="text-sm text-gray-400 mb-3">
                Présenter votre activité, vos services et être trouvé en ligne
              </p>
              <div className="text-xs text-indigo-electric-400 font-semibold">À partir de 800€</div>
            </button>

            <button
              onClick={() => setOptions({ ...options, projectType: 'ecommerce' })}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                options.projectType === 'ecommerce'
                  ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                  : 'border-dark-800 hover:border-indigo-electric-900'
              }`}
            >
              <div className="w-12 h-12 bg-indigo-electric-950 border border-indigo-electric-900 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">E-commerce</h3>
              <p className="text-sm text-gray-400 mb-3">
                Vendre vos produits en ligne avec panier et paiement sécurisé
              </p>
              <div className="text-xs text-indigo-electric-400 font-semibold">À partir de 2500€</div>
            </button>

            <button
              onClick={() => setOptions({ ...options, projectType: 'custom' })}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                options.projectType === 'custom'
                  ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                  : 'border-dark-800 hover:border-indigo-electric-900'
              }`}
            >
              <div className="w-12 h-12 bg-indigo-electric-950 border border-indigo-electric-900 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Sur-mesure</h3>
              <p className="text-sm text-gray-400 mb-3">
                Site avec fonctionnalités spécifiques adaptées à vos besoins
              </p>
              <div className="text-xs text-indigo-electric-400 font-semibold">À partir de 1500€</div>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Number of Pages */}
      {step === 2 && (
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Nombre de pages</h2>
          <p className="text-gray-400 mb-6">Combien de pages aura votre site ?</p>

          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center mb-6">
              <span className="text-5xl font-display font-bold text-indigo-electric-400">{options.pages}</span>
              <span className="text-2xl text-gray-400 ml-2">page{options.pages > 1 ? 's' : ''}</span>
            </div>

            <input
              type="range"
              min="1"
              max="15"
              value={options.pages}
              onChange={(e) => setOptions({ ...options, pages: parseInt(e.target.value) })}
              className="w-full h-3 bg-dark-950 border border-dark-800 rounded-lg appearance-none cursor-pointer slider"
              style={{
                accentColor: '#4f46e5'
              }}
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 page</span>
              <span>15 pages</span>
            </div>

            <div className="mt-6 bg-dark-950 border border-dark-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Exemples :</strong> Accueil, Services, À propos, Portfolio, Contact, Blog, etc.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Features */}
      {step === 3 && (
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Fonctionnalités</h2>
          <p className="text-gray-400 mb-6">Quelles fonctionnalités souhaitez-vous ?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'contact', icon: '📧', title: 'Formulaire de contact', desc: 'Permettez aux visiteurs de vous contacter', price: 'Inclus' },
              { key: 'booking', icon: '📅', title: 'Système de réservation', desc: 'Prise de RDV en ligne', price: '+300€' },
              { key: 'blog', icon: '📝', title: 'Blog / Actualités', desc: 'Partagez du contenu régulièrement', price: '+200€' },
              { key: 'gallery', icon: '🖼️', title: 'Galerie photos', desc: 'Présentez vos réalisations', price: '+150€' },
              { key: 'maps', icon: '🗺️', title: 'Google Maps', desc: 'Carte interactive avec votre adresse', price: 'Inclus' },
              { key: 'multilang', icon: '🌍', title: 'Multilingue', desc: 'Site en plusieurs langues', price: '+400€' },
            ].map((feature) => (
              <button
                key={feature.key}
                onClick={() => toggleFeature(feature.key)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  options.features.includes(feature.key)
                    ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                    : 'border-dark-800 hover:border-indigo-electric-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-display font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                  <span className={`font-semibold text-sm ${feature.price === 'Inclus' ? 'text-indigo-electric-400' : 'text-indigo-electric-400'}`}>
                    {feature.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Design & SEO */}
      {step === 4 && (
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Design et référencement</h2>
          <p className="text-gray-400 mb-6">Personnalisez votre projet</p>

          <div className="space-y-6">
            <div>
              <h3 className="font-display font-semibold text-lg text-white mb-4">Type de design</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setOptions({ ...options, design: 'template' })}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    options.design === 'template'
                      ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                      : 'border-dark-800 hover:border-indigo-electric-900'
                  }`}
                >
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">À partir d'un template</h3>
                  <p className="text-sm text-gray-400">
                    Design professionnel personnalisable selon votre image
                  </p>
                  <div className="mt-3 text-xs text-gray-500">Inclus dans le prix de base</div>
                </button>

                <button
                  onClick={() => setOptions({ ...options, design: 'custom' })}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    options.design === 'custom'
                      ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                      : 'border-dark-800 hover:border-indigo-electric-900'
                  }`}
                >
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">Design sur-mesure</h3>
                  <p className="text-sm text-gray-400">
                    Design 100% unique créé spécifiquement pour vous
                  </p>
                  <div className="mt-3 text-xs text-indigo-electric-400 font-semibold">+500€</div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-lg text-white mb-4">Référencement SEO</h3>
              <button
                onClick={() => setOptions({ ...options, seo: !options.seo })}
                className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                  options.seo
                    ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                    : 'border-dark-800 hover:border-indigo-electric-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl mb-3">🔍</div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">Pack SEO Local</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Optimisation complète pour être trouvé sur Google à Saint-Étienne
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>✓ Optimisation Google My Business</li>
                      <li>✓ Recherche de mots-clés locaux</li>
                      <li>✓ Optimisation technique complète</li>
                      <li>✓ Soumission aux annuaires locaux</li>
                    </ul>
                  </div>
                  <span className="text-indigo-electric-400 font-semibold">+300€</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Maintenance */}
      {step === 5 && (
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Maintenance</h2>
          <p className="text-gray-400 mb-6">Souhaitez-vous un forfait de maintenance ?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setOptions({ ...options, maintenance: 'none' })}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                options.maintenance === 'none'
                  ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                  : 'border-dark-800 hover:border-indigo-electric-900'
              }`}
            >
              <h3 className="font-display font-bold text-lg text-white mb-2">Pas de maintenance</h3>
              <p className="text-sm text-gray-400 mb-3">
                Vous gérez vous-même votre site
              </p>
              <div className="text-2xl font-display font-bold text-gray-300">0€/mois</div>
            </button>

            <button
              onClick={() => setOptions({ ...options, maintenance: 'essential' })}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                options.maintenance === 'essential'
                  ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                  : 'border-dark-800 hover:border-indigo-electric-900'
              }`}
            >
              <h3 className="font-display font-bold text-lg text-white mb-2">Essentiel</h3>
              <ul className="text-sm text-gray-400 space-y-1 mb-3">
                <li>✓ Mises à jour de sécurité</li>
                <li>✓ Sauvegardes hebdomadaires</li>
                <li>✓ Support par email</li>
                <li>✓ Monitoring 24/7</li>
              </ul>
              <div className="text-2xl font-display font-bold text-indigo-electric-400">49€/mois</div>
            </button>

            <button
              onClick={() => setOptions({ ...options, maintenance: 'premium' })}
              className={`p-6 rounded-xl border-2 transition-all text-left relative ${
                options.maintenance === 'premium'
                  ? 'border-indigo-electric-600 bg-indigo-electric-950/30'
                  : 'border-dark-800 hover:border-indigo-electric-900'
              }`}
            >
              <div className="absolute -top-3 left-4 bg-indigo-electric-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-indigo-electric-600/20">
                Populaire
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Premium</h3>
              <ul className="text-sm text-gray-400 space-y-1 mb-3">
                <li>✓ Tout Essentiel +</li>
                <li>✓ Modifications (2h/mois)</li>
                <li>✓ Support prioritaire</li>
                <li>✓ Optimisations SEO</li>
                <li>✓ Rapport analytics</li>
              </ul>
              <div className="text-2xl font-display font-bold text-indigo-electric-400">99€/mois</div>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="flex-1 px-6 py-3 bg-dark-950 border border-dark-800 text-gray-300 rounded-lg font-semibold hover:bg-dark-800 transition-colors"
          >
            Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={step === 1 && !options.projectType}
          className="flex-1 px-6 py-3 bg-indigo-electric-600 text-white rounded-lg font-semibold hover:bg-indigo-electric-500 transition-colors disabled:bg-dark-800 disabled:cursor-not-allowed disabled:text-gray-500 shadow-lg shadow-indigo-electric-600/20"
        >
          {step === 5 ? 'Voir le devis' : 'Suivant'}
        </button>
      </div>
    </div>
  );
};

export default QuoteCalculator;
