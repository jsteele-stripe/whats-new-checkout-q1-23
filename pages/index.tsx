import type { NextPage } from 'next'

import * as React from 'react'

import CheckoutSection from 'components/checkout-section'
import PaymentIntentSection from 'components/payment-intent-section'

export default function Index({}: NextPage) {
  return (
    <div className="max-w-xl mx-auto md:max-w-4xl">
      <div className="py-8">
        <h1 className="text-4xl font-bold">Headline</h1>
        <div className="divide-y">
          <CheckoutSection />
          <PaymentIntentSection />
        </div>
      </div>
    </div>
  )
}
