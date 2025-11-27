import { createClient } from '@sanity/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

// Configuration Sanity
const sanityClient = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'r98l8u9o',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function resetPassword() {
  console.log('\n🔐 Réinitialisation du mot de passe client\n')

  // 1. Demander l'email du client
  const email = (await question('📧 Email du client : ')).trim().toLowerCase()

  if (!email) {
    console.log('❌ Email requis !')
    rl.close()
    return
  }

  // 2. Vérifier que le client existe
  const query = `*[_type == "client" && email == $email][0]`
  const client = await sanityClient.fetch(query, { email })

  if (!client) {
    console.log(`❌ Aucun client trouvé avec l'email : ${email}`)
    rl.close()
    return
  }

  console.log(`\n✅ Client trouvé : ${client.firstName} ${client.lastName}`)

  // 3. Demander si on veut générer un mot de passe automatique ou le saisir
  const choice = await question(
    '\n💡 Voulez-vous :\n  1. Générer un mot de passe automatique (recommandé)\n  2. Saisir un mot de passe personnalisé\n\nVotre choix (1 ou 2) : ',
  )

  let newPassword
  if (choice.trim() === '2') {
    newPassword = await question('🔑 Nouveau mot de passe : ')
    if (newPassword.length < 8) {
      console.log('❌ Le mot de passe doit faire au moins 8 caractères !')
      rl.close()
      return
    }
  } else {
    newPassword = generatePassword()
  }

  // 4. Hasher le mot de passe
  console.log('\n⏳ Hashage du mot de passe...')
  const passwordHash = await bcrypt.hash(newPassword, 10)

  // 5. Mettre à jour dans Sanity
  console.log('⏳ Mise à jour dans Sanity...')
  await sanityClient.patch(client._id).set({ passwordHash }).commit()

  // 6. Afficher les identifiants
  console.log('\n' + '='.repeat(60))
  console.log('✅ Mot de passe réinitialisé avec succès !')
  console.log('='.repeat(60))
  console.log('\n📋 IDENTIFIANTS À ENVOYER AU CLIENT :\n')
  console.log(`   Email : ${email}`)
  console.log(`   Mot de passe : ${newPassword}`)
  console.log(`\n   URL de connexion : https://loiredigital.fr/espace-client/connexion`)
  console.log('\n' + '='.repeat(60))
  console.log('\n⚠️  Envoie ces identifiants au client par email ou message sécurisé.\n')

  rl.close()
}

resetPassword().catch((error) => {
  console.error('\n❌ Erreur :', error.message)
  rl.close()
  process.exit(1)
})
