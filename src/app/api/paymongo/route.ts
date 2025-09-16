import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json()

    // Validate URLs here if you want

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.PAYMONGO_SECRET_KEY + ":"
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                name: description || "Purchase",
                amount: amount, // centavos
                currency: "PHP",
                quantity: 1,
              },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
            cancel_url: `${process.env.NEXTAUTH_URL}/checkout/failed`,

            payment_method_types: ["gcash"],
          },
        },
      }),
    }

    const response = await fetch(
      "https://api.paymongo.com/v1/checkout_sessions",
      options
    )
    const data = await response.json()

    console.log("paymongo", data)

    if (!response.ok) {
      console.error("PayMongo API error:", data)
      return NextResponse.json({ error: data }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
