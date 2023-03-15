import type Stripe from 'stripe'

import * as React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetcher } from '@/lib/fetcher'
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const schema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['gbp', 'eur', 'usd'])
})

type PaymentIntentInputs = z.infer<typeof schema>

export default function PaymentIntentSection(): JSX.Element {
  const [clientSecret, setClientSecret] = React.useState<string>(null)
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<PaymentIntentInputs>({
    defaultValues: { amount: 1000, currency: 'usd' },
    resolver: zodResolver(schema)
  })

  const createPaymentIntent = async (data: PaymentIntentInputs) => {
    try {
      const paymentIntent = await fetcher<Stripe.PaymentIntent>(
        '/api/stripe/payment-intents/create',
        {
          method: 'POST',
          body: JSON.stringify({
            automatic_payment_methods: { enabled: true },
            ...data
          })
        }
      )

      setClientSecret(paymentIntent.client_secret)
    } catch (error) {
      console.log(error)
    }
  }

  const snippet = `<Elements
  stripe={loadStripe('pk_test_xxx')}
  options={{ clientSecret: 'pi_abc_secret_xyz' }}
>
  <PaymentElement />
  <AddressElement options={{ mode: 'shipping' }} />
</Elements>`

  const Checkout = (): JSX.Element => {
    const elements = useElements()
    const stripe = useStripe()

    const confirmPaymentIntent = async (e: React.FormEvent) => {
      e.preventDefault()

      await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href }
      })
    }
    return (
      <React.Fragment>
        <PaymentElement />
        <AddressElement options={{ mode: 'shipping' }} />
        <button
          onClick={confirmPaymentIntent}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Pay
        </button>
      </React.Fragment>
    )
  }

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Address Element demo</h1>
      <p className="mt-2 text-lg text-gray-600">
        Example Address Element initialisation to collect shipping address
        details during payment confirmation
      </p>
      <div className="space-y-8">
        <SyntaxHighlighter language="jsx" style={oneDark}>
          {snippet}
        </SyntaxHighlighter>
        {clientSecret ? (
          <Elements
            stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}
            options={{ clientSecret }}
          >
            <Checkout />
          </Elements>
        ) : null}
        <form
          onSubmit={handleSubmit(createPaymentIntent)}
          className="sm:max-w-md space-y-8"
        >
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-700">Currency</span>
              <select
                {...register('currency')}
                className="
                    block
                    w-full
                    mt-1
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              >
                <option value="gbp">GBP</option>
                <option value="eur">EUR</option>
                <option value="usd">USD</option>
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Amount</span>
              <input
                {...register('amount', {
                  valueAsNumber: true
                })}
                type="number"
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
              />
            </label>
          </div>
          <button
            disabled={!!clientSecret}
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Initialise Address Element
          </button>
        </form>
      </div>
    </div>
  )
}
