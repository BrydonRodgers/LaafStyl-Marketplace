import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    // Verify signature
    const paramString = Object.entries(data)
      .filter(([k, _]) => k !== 'signature')
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join('&')

    const signature = crypto
      .createHash('md5')
      .update(paramString + process.env.PAYFAST_PASSPHRASE)
      .digest('hex')

    if (signature !== data.signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Update order if payment complete
    if (data.payment_status === '2') { // 2 = complete
      await supabase
        .from('orders')
        .update({ payment_status: 'paid' })
        .eq('id', data.m_payment_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
