import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { z } from 'zod'
import { checkRateLimit } from '../../lib/utils/rate-limiter'

const sendQuoteSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  packName: z.string(),
  pages: z.number(),
  optionNames: z.array(z.string()),
  maintenanceName: z.string(),
  totalPrice: z.number(),
  maintenancePrice: z.number(),
})

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const data = await request.json()

    const validationResult = sendQuoteSchema.safeParse(data)

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Donnees invalides.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const validData = validationResult.data

    const ip = clientAddress || 'unknown'
    if (!checkRateLimit(ip, 3, 60000)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Trop de requetes. Veuillez reessayer dans quelques instants.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!import.meta.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      console.log('Quote email request:', validData)

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Devis envoye. (Mode developpement)',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    try {
      const resend = new Resend(import.meta.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Loire Digital <contact@loiredigital.fr>',
        to: validData.email,
        subject: 'Votre devis Loire Digital',
        html: generateQuoteEmailForClient(validData),
      })

      await resend.emails.send({
        from: 'Loire Digital <contact@loiredigital.fr>',
        to: 'contact@loiredigital.fr',
        subject: `Nouveau lead devis: ${validData.email}`,
        html: generateQuoteEmailForAdmin(validData),
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Devis envoye avec succes.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing send-quote request:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Une erreur est survenue.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

function generateQuoteEmailForClient(data: {
  packName: string
  pages: number
  optionNames: string[]
  maintenanceName: string
  totalPrice: number
  maintenancePrice: number
}): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Votre devis Loire Digital</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #b8860b 0%, #d4a832 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 30px;
          }
          .price-box {
            background: #fef9e7;
            border: 2px solid #b8860b;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
          }
          .price {
            font-size: 42px;
            font-weight: 700;
            color: #b8860b;
            margin: 0;
          }
          .price-label {
            color: #666;
            font-size: 14px;
          }
          .maintenance-price {
            font-size: 24px;
            font-weight: 600;
            color: #b8860b;
            margin-top: 12px;
          }
          .details {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
          }
          .details h2 {
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #333;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #666;
          }
          .detail-value {
            font-weight: 600;
            color: #333;
          }
          .cta-box {
            text-align: center;
            padding: 20px 0;
          }
          .cta-button {
            display: inline-block;
            background: #b8860b;
            color: white;
            padding: 14px 32px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e5e7eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Votre devis Loire Digital</h1>
          </div>
          <div class="content">
            <div class="price-box">
              <p class="price">${data.totalPrice.toLocaleString('fr-FR')} EUR</p>
              <p class="price-label">Prix de creation (paiement unique)</p>
              ${data.maintenancePrice > 0 ? `<p class="maintenance-price">+ ${data.maintenancePrice} EUR/mois</p><p class="price-label">Maintenance ${data.maintenanceName}</p>` : ''}
            </div>

            <div class="details">
              <h2>Recapitulatif de votre projet</h2>
              <div class="detail-row">
                <span class="detail-label">Pack</span>
                <span class="detail-value">${data.packName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Nombre de pages</span>
                <span class="detail-value">${data.pages}</span>
              </div>
              ${data.optionNames.length > 0 ? `
              <div class="detail-row">
                <span class="detail-label">Options</span>
                <span class="detail-value">${data.optionNames.join(', ')}</span>
              </div>
              ` : ''}
              <div class="detail-row">
                <span class="detail-label">Maintenance</span>
                <span class="detail-value">${data.maintenanceName}</span>
              </div>
            </div>

            <p style="color: #666; font-size: 14px; margin-bottom: 24px;">
              Ce devis est une estimation basee sur vos choix. Le prix final peut varier selon la complexite du projet.
            </p>

            <div class="cta-box">
              <a href="https://loiredigital.fr/#contact" class="cta-button">
                Discutons de votre projet
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Loire Digital - Sites web pour commercants et artisans</p>
            <p>Saint-Etienne et alentours</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function generateQuoteEmailForAdmin(data: {
  email: string
  packName: string
  pages: number
  optionNames: string[]
  maintenanceName: string
  totalPrice: number
  maintenancePrice: number
}): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Nouveau lead devis</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .field { margin-bottom: 12px; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .highlight { background: #fef9e7; padding: 16px; border-radius: 8px; margin: 16px 0; }
        </style>
      </head>
      <body>
        <h1>Nouveau lead - Devis par email</h1>

        <div class="highlight">
          <div class="field">
            <span class="label">Email du prospect:</span>
            <span class="value"><a href="mailto:${data.email}">${data.email}</a></span>
          </div>
        </div>

        <h2>Details du devis</h2>
        <div class="field">
          <span class="label">Pack:</span>
          <span class="value">${data.packName}</span>
        </div>
        <div class="field">
          <span class="label">Pages:</span>
          <span class="value">${data.pages}</span>
        </div>
        ${data.optionNames.length > 0 ? `
        <div class="field">
          <span class="label">Options:</span>
          <span class="value">${data.optionNames.join(', ')}</span>
        </div>
        ` : ''}
        <div class="field">
          <span class="label">Maintenance:</span>
          <span class="value">${data.maintenanceName}</span>
        </div>
        <div class="field">
          <span class="label">Total:</span>
          <span class="value">${data.totalPrice.toLocaleString('fr-FR')} EUR ${data.maintenancePrice > 0 ? `+ ${data.maintenancePrice} EUR/mois` : ''}</span>
        </div>

        <p style="margin-top: 24px; color: #666; font-size: 12px;">
          Ce prospect a demande a recevoir son devis par email depuis le calculateur.
        </p>
      </body>
    </html>
  `
}
