import { NextResponse } from 'next/server';
import { loadAllAgents } from '@/lib/loadAgents';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('id');
    
    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Load all agents and find the requested one
    const agents = await loadAllAgents();
    const agent = agents.find(a => a.id === agentId);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Handle different configUrl formats
    let downloadUrl = agent.configUrl;
    
    // If configUrl starts with /configs/, serve from public directory
    if (downloadUrl.startsWith('/configs/')) {
      // This will be served by Next.js static file serving
      return NextResponse.redirect(new URL(downloadUrl, request.url));
    }
    
    // If it's a sandbox URL or other format, redirect directly
    if (downloadUrl.startsWith('sandbox:') || downloadUrl.startsWith('http')) {
      return NextResponse.redirect(downloadUrl);
    }

    // Fallback: treat as relative path
    return NextResponse.redirect(new URL(`/configs/${downloadUrl}`, request.url));
    
  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}