import type Stripe from 'stripe'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetcher } from '@/lib/fetcher'

const schema = z.object({
  customer_email: z.string().email()
})

type CheckoutSessionInputs = z.infer<typeof schema>

export default function CheckoutSection(): JSX.Element {
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<CheckoutSessionInputs>({
    resolver: zodResolver(schema)
  })

  const createCheckoutSession = async (data: CheckoutSessionInputs) => {
    try {
      const checkoutSession = await fetcher<Stripe.Checkout.Session>(
        '/api/stripe/checkout/sessions/create',
        {
          method: 'POST',
          body: JSON.stringify({
            cancel_url: window.location.href,
            line_items: [
              {
                price: process.env.NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID,
                quantity: 1
              }
            ],
            mode: 'payment',
            success_url: window.location.href,
            ...data
          })
        }
      )

      window.location.assign(checkoutSession.url)
    } catch (error) {
      console.error(error)
    }
  }

  const snippet = `const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
  customer_email: '4242@stripe.com',
  line_items: [{
    price: 'price_xyz'
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://stripe.com?success',
})`

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Checkout Session creation</h1>
      <p className="mt-2 text-lg text-gray-600">
        Example API call to create a Checkout Session
      </p>
      <div className="space-y-8">
        <SyntaxHighlighter language="typescript" style={oneDark}>
          {snippet}
        </SyntaxHighlighter>
        <form
          onSubmit={handleSubmit(createCheckoutSession)}
          className="sm:max-w-md space-y-8"
        >
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-700">E-mail address</span>
              <input
                {...register('customer_email')}
                type="email"
                className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
                placeholder="4242@stripe.com"
              />
            </label>
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Checkout Session
          </button>
        </form>
      </div>
    </div>
  )
}
