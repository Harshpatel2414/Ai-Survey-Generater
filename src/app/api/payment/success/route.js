export async function POST(request) {
    try {
        const data = await request.json();
        // Process the payment success data here
        console.log('Payment success data received:', data);

        return new Response(JSON.stringify({ message: 'Payment successful' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Payment failed', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}