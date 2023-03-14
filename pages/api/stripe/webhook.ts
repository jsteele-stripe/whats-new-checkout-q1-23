import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export const config = {
  api: {
    bodyParser: false
  }
}

const verifyStripeSignature =
  (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
      event: Stripe.Event
    ) => void
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<{ message: any }>) => {
    const chunks = []

    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        Buffer.concat(chunks),
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOOK_SIGNING_SECRET
      )

      return handler(req, res, event)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>,
  event: Stripe.Event
) {
  const permittedEvents: [string?] = []

  if (req.method === 'POST') {
    if (permittedEvents.includes(event.type)) {
      try {
        switch (event.type) {
          default:
            throw new Error(`Unhhandled event: ${event.type}`)
        }
      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Webhook handler failed' })
      }
    }

    res.status(200).json({ message: 'Received' })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default verifyStripeSignature(handler)
