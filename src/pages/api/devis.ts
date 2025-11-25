import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json()

    // Validate the request data
    if (!data.packId || !data.pages || !data.name || !data.email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Données manquantes. Veuillez remplir tous les champs requis.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Adresse email invalide.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // TODO: Integrate with email service (Resend, SendGrid, Brevo, etc.)
    // For now, we'll log the data and return success
    console.log('Quote request received:', {
      ...data,
      timestamp: new Date().toISOString(),
    })

    // In production, you would send an email here
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: 'contact@loiredigital.fr',
    //   replyTo: data.email,
    //   subject: `Nouveau devis de ${data.name}`,
    //   html: generateQuoteEmailHTML(data),
    // })

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'Votre demande de devis a été envoyée avec succès. Nous vous contacterons sous 24h.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing quote request:', error)

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// Helper function to generate email HTML (to be implemented)
// function generateQuoteEmailHTML(data: any): string {
//   return `
//     <h1>Nouvelle demande de devis</h1>
//     <p><strong>Nom:</strong> ${data.name}</p>
//     <p><strong>Email:</strong> ${data.email}</p>
//     <p><strong>Pack:</strong> ${data.packId}</p>
//     <p><strong>Pages:</strong> ${data.pages}</p>
//     <p><strong>Options:</strong> ${data.optionIds?.join(', ') || 'Aucune'}</p>
//     <p><strong>Maintenance:</strong> ${data.maintenance}</p>
//     <p><strong>Prix total:</strong> ${data.totalPrice}€</p>
//     ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
//   `
// }
