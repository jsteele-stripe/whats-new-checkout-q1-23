import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Stripe.Checkout.Session | { message: any }>
) {
  try {
    const body = req.body as Stripe.Checkout.SessionCreateParams

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(body)

    res.status(201).json(checkoutSession)
  } catch (error) {
    console.log(error)

    res.status(400).json({ message: error.message })
  }
}
