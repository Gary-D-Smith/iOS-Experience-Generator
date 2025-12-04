import { NextResponse } from 'next/server';
import { getRandomInput } from '@/lib/parseInputs';
import { getRandomOutput } from '@/lib/parseOutputs';

export async function GET() {
  try {
    const input = getRandomInput();
    const output = getRandomOutput();
    
    return NextResponse.json({
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
  } catch (error: any) {
    console.error('Error getting random selection:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get random selection' },
      { status: 500 }
    );
  }
}


