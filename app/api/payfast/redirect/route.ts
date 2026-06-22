import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, email } = await req.json()

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const params = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: process.env.PAYFAST_RETURN_URL,
      cancel_url: process.env.PAYFAST_CANCEL_URL,
      notify_url: process.env.PAYFAST_NOTIFY_URL,
      name_first: 'Customer',
      email_address: email,
      m_payment_id: orderId,
      amount: total.toFixed(2),
      item_name: 'Order',
      item_description: 'LaafStyl Order',
    }

    const paramString = Object.entries(params)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&')

    const signature = crypto
      .createHash('md5')
      .update(paramString + process.env.PAYFAST_PASSPHRASE)
      .digest('hex')

    const redirectUrl = `https://www.payfast.co.za/eng/process?${paramString}&signature=${signature}`

    return NextResponse.json({ redirectUrl })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
