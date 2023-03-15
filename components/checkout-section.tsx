import type Stripe from 'stripe'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetcher } from '@/lib/fetcher'

const schema = z.object({
  custom_fields: z
    .array(
      z.object({
        key: z.string(),
        type: z.enum(['numeric', 'text']),
        optional: z.boolean()
      })
    )
    .max(2)
})

type CheckoutSessionInputs = z.infer<typeof schema>

export default function CheckoutSection(): JSX.Element {
  const {
    formState: { errors },
    handleSubmit,
    register
  } = useForm<CheckoutSessionInputs>({
    defaultValues: {
      custom_fields: [
        {
          key: 'engraving',
          type: 'text',
          optional: false
        },
        {
          key: 'invoice',
          type: 'numeric',
          optional: true
        }
      ]
    },
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
            custom_fields: data.custom_fields.map((field) => ({
              label: { custom: field.key, type: 'custom' },
              ...field
            }))
          })
        }
      )

      window.location.assign(checkoutSession.url)
    } catch (error) {
      console.error(error)
    }
  }

  const snippet = `const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
  custom_fields: [{
    key: 'engraving',
    label: {
      custom: 'FREE engraving',
      type: 'custom'
    },
    optional: false,
    type: 'text'
  }]
  line_items: [{
    price: 'price_xyz'
    quantity: 1
  }],
  mode: 'payment',
  success_url: 'https://stripe.com?success',
})`

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Custom fields with Checkout</h1>
      <p className="mt-2 text-lg text-gray-600">
        Example API call to create a Checkout Session with multiple custom
        fields
      </p>
      <div className="space-y-8">
        <SyntaxHighlighter language="typescript" style={oneDark}>
          {snippet}
        </SyntaxHighlighter>
        <form
          onSubmit={handleSubmit(createCheckoutSession)}
          className="space-y-8"
        >
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3 space-y-6">
              <label className="block">
                <span className="text-gray-700">Key</span>
                <input
                  {...register('custom_fields.0.key')}
                  type="text"
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
              <label className="block">
                <span className="text-gray-700">Type</span>
                <select
                  {...register('custom_fields.0.type')}
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
                  <option value="numeric">Numeric</option>
                  <option value="text">Text</option>
                </select>
              </label>
              <div className="block">
                <div className="mt-2">
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        {...register('custom_fields.0.optional')}
                        type="checkbox"
                        className="
                          rounded
                          bg-gray-200
                          border-transparent
                          focus:border-transparent focus:bg-gray-200
                          text-gray-700
                          focus:ring-1 focus:ring-offset-2 focus:ring-gray-500
                        "
                      />
                      <span className="ml-2">Optional</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-3 space-y-6">
              <label className="block">
                <span className="text-gray-700">Key</span>
                <input
                  {...register('custom_fields.1.key')}
                  type="text"
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
              <label className="block">
                <span className="text-gray-700">Type</span>
                <select
                  {...register('custom_fields.1.type')}
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
                  <option value="numeric">Numeric</option>
                  <option value="text">Text</option>
                </select>
              </label>
              <div className="block">
                <div className="mt-2">
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        {...register('custom_fields.1.optional')}
                        type="checkbox"
                        className="
                          rounded
                          bg-gray-200
                          border-transparent
                          focus:border-transparent focus:bg-gray-200
                          text-gray-700
                          focus:ring-1 focus:ring-offset-2 focus:ring-gray-500
                        "
                      />
                      <span className="ml-2">Optional</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
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
