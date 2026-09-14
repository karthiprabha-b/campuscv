import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // In a production app, here you would trigger an email with Resend/SendGrid or webhook.
    console.log('[Contact Submission Received]:', { name, email, subject, message, timestamp: new Date() });

    return NextResponse.json(
      {
        success: true,
        message: 'Message delivered successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing contact request.' },
      { status: 500 }
    );
  }
}
