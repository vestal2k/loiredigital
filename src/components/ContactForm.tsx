import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormData } from '../schemas/contact.schema'
import { getQuoteData, clearQuoteData, type StoredQuoteData } from '@/lib/utils/quote-storage'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [quoteData, setQuoteData] = useState<StoredQuoteData | null>(null)

  useEffect(() => {
    const data = getQuoteData()
    if (data) {
      setQuoteData(data)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      project: quoteData ? 'creation' : undefined,
    },
  })

  useEffect(() => {
    if (quoteData) {
      setValue('project', 'creation')
    }
  }, [quoteData, setValue])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    let messageWithQuote = data.message
    if (quoteData) {
      const quoteDetails = [
        `\n\n--- Détails du devis ---`,
        `Pack : ${quoteData.packName}`,
        `Nombre de pages : ${quoteData.pages}`,
        quoteData.optionNames.length > 0 ? `Options : ${quoteData.optionNames.join(', ')}` : null,
        `Maintenance : ${quoteData.maintenanceName}`,
        `Budget estimé : ${quoteData.totalPrice.toLocaleString('fr-FR')} €`,
        quoteData.maintenancePrice > 0
          ? `Maintenance : ${quoteData.maintenancePrice} €/mois`
          : null,
      ]
        .filter(Boolean)
        .join('\n')

      messageWithQuote = data.message + quoteDetails
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          message: messageWithQuote,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      clearQuoteData()
      setQuoteData(null)
      reset()
      window.location.href = '/confirmation'
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')

      setTimeout(() => {
        document.getElementById('error-message')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 100)
    } finally {
      setIsSubmitting(false)
    }
  }

  const dismissQuoteData = () => {
    clearQuoteData()
    setQuoteData(null)
  }

  return (
    <div className="bg-gray-pale rounded-xl p-8 md:p-10">
      <h3 className="text-2xl font-bold text-black mb-3">Envoyez-nous un message</h3>
      <p className="text-black font-medium mb-8 pb-6 border-b border-gray-200">
        Réponse garantie sous 24h par email. Pas de démarchage téléphonique.
      </p>

      {quoteData && (
        <div className="mb-8 bg-or/10 border border-or/30 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-or/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-or"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-black">Votre devis</h4>
                <p className="text-sm text-gray-600">Les informations seront transmises avec votre message</p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissQuoteData}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Supprimer le devis"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pack</span>
              <span className="font-medium text-black">{quoteData.packName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pages</span>
              <span className="font-medium text-black">{quoteData.pages}</span>
            </div>
            {quoteData.optionNames.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Options</span>
                <span className="font-medium text-black text-right">{quoteData.optionNames.join(', ')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Maintenance</span>
              <span className="font-medium text-black">{quoteData.maintenanceName}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-or/20">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-black">Budget estimé</span>
                <span className="text-xl font-bold text-or">{quoteData.totalPrice.toLocaleString('fr-FR')} €</span>
              </div>
              {quoteData.maintenancePrice > 0 && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">+ Maintenance</span>
                  <span className="text-sm font-medium text-or">{quoteData.maintenancePrice} €/mois</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-or focus:border-transparent outline-none transition-all text-black ${
              errors.name ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Jean Dupont"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-or focus:border-transparent outline-none transition-all text-black ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="jean.dupont@exemple.fr"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field (Optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-black mb-2">
            Téléphone <span className="text-gray-500 font-normal">(facultatif)</span>
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-or focus:border-transparent outline-none transition-all text-black ${
              errors.phone ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="0612345678"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Project Type Field */}
        <div>
          <label htmlFor="project" className="block text-sm font-semibold text-black mb-2">
            Type de projet *
          </label>
          <select
            id="project"
            {...register('project')}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-or focus:border-transparent outline-none transition-all text-black ${
              errors.project ? 'border-red-500' : 'border-gray-200'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Sélectionnez...</option>
            <option value="creation">Création de site</option>
            <option value="refonte">Refonte</option>
            <option value="maintenance">Maintenance</option>
            <option value="seo">SEO</option>
            <option value="autre">Autre</option>
          </select>
          {errors.project && (
            <p className="mt-1 text-sm text-red-600">{errors.project.message}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-black mb-2">
            Votre message *
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={6}
            className={`w-full px-4 py-3 bg-white border rounded-lg focus:ring-2 focus:ring-or focus:border-transparent outline-none transition-all resize-none text-black ${
              errors.message ? 'border-red-500' : 'border-gray-200'
            }`}
            placeholder="Décrivez votre projet en quelques lignes..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        {/* GDPR Consent */}
        <div className="bg-or/5 border border-or/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="gdprConsent"
              {...register('gdprConsent')}
              className="mt-1 w-5 h-5 text-or border-gray-300 rounded focus:ring-2 focus:ring-or cursor-pointer"
              disabled={isSubmitting}
            />
            <label htmlFor="gdprConsent" className="text-sm text-black cursor-pointer flex-1">
              J'accepte que mes données personnelles soient collectées et traitées pour répondre à
              ma demande, conformément à notre{' '}
              <a
                href="/politique-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="text-or hover:text-or-light underline font-medium"
              >
                politique de confidentialité
              </a>
              . *
            </label>
          </div>
          {errors.gdprConsent && (
            <p className="mt-2 text-sm text-red-600 ml-8">{errors.gdprConsent.message}</p>
          )}
        </div>

        {/* Honeypot - Anti-spam field (hidden from humans, visible to bots) */}
        <div className="absolute opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            {...register('website')}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gold py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Envoi en cours...
            </span>
          ) : (
            'Envoyer'
          )}
        </button>

        <p className="text-xs text-gray-600 text-center">* Champs obligatoires</p>
      </form>

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div
          id="error-message"
          className="mt-6 p-6 bg-red-50 border-2 border-red-600 rounded-lg animate-fade-in"
        >
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h4 className="font-bold text-black mb-1">Erreur d'envoi</h4>
              <p className="text-sm text-gray-text">
                Une erreur s'est produite. Veuillez réessayer ou nous contacter directement par
                email.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
