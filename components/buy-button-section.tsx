import Script from 'next/script'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

export default function BuyButtonSection(): JSX.Element {
  const snippet = `<script async src="https://js.stripe.com/v3/buy-button.js"></script>

<stripe-buy-button
  buy-button-id="buy_btn_xyz"
  publishable-key="pk_test_xxx"
/>`
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Payment Links buy button</h1>
      <p className="mt-2 text-lg text-gray-600">Buy button embed code</p>
      <div className="space-y-8">
        <SyntaxHighlighter language="html" style={oneDark}>
          {snippet}
        </SyntaxHighlighter>
        <Script src="https://js.stripe.com/v3/buy-button.js" />

        <stripe-buy-button
          buy-button-id="buy_btn_1MlenFBDB9fVNtrXlpa5Bs62"
          publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        />
      </div>
    </div>
  )
}
