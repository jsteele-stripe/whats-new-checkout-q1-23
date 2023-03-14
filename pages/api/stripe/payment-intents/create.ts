import type { NextApiRequest, NextApiResponse } from 'next'
import type { Stripe } from 'stripe'

import stripe from '@/lib/stripe'

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<Stripe.PaymentIntent | { message: any }>
) {
  try {
    const body = req.body as Stripe.PaymentIntentCreateParams

    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create(body)

    res.status(201).json(paymentIntent)
  } catch (error) {
    console.log(error)

    res.status(400).json({ message: error.message })
  }
}
