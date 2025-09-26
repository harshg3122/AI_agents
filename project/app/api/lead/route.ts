import { NextResponse } from 'next/server';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  agentId: z.string().min(1, 'Agent ID is required'),
  query: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'Consent is required'),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
  }).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // In production, you would:
    // 1. Save to database
    // 2. Send to CRM (HubSpot, Salesforce, etc.)
    // 3. Send confirmation email
    // 4. Add to email list
    // 5. Set analytics/tracking

    // For now, just log the data
    console.log('New lead captured:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));

    // Set a short-lived cookie to allow download
    const response = NextResponse.json({ 
      success: true, 
      message: 'Lead captured successfully' 
    });
    
    response.cookies.set('lead-authorized', 'true', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 300, // 5 minutes
    });

    return response;
  } catch (error) {
    console.error('Error processing lead:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}