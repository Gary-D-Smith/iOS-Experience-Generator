import { NextResponse } from 'next/server';
import { getRandomInput } from '@/lib/parseInputs';
import { getRandomOutput } from '@/lib/parseOutputs';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const input = getRandomInput();
    const output = getRandomOutput();
    
    const response = NextResponse.json({
      input: {
        category: input.category,
        item: input.item,
        library: input.library,
        link: input.link,
        full: `${input.category}: ${input.item}`
      },
      output: {
        category: output.category,
        item: output.item,
        library: output.library,
        link: output.link,
        full: `${output.category}: ${output.item}`
      }
    });
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Error getting random selection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get random selection' },
      { status: 500 }
    );
  }
}


