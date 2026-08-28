export interface CaseContext {
  case_id: string;
  network: string;
  wallet: string;
  risk_score: number;
  risk_level: string;
  risk_signals: string[];
  transactions: any[];
  fund_flow: any[];
  entities: any[];
  vasps: any[];
}

export interface LLMResponse {
  summary: string;
  risk_explanation: string;
  fund_flow_explanation: string;
  key_indicators: string[];
  aml_typologies?: string[];
  recommended_next_steps: string[];
  confidence: number;
  sources?: any[];
}

export async function callGroqLLM(
  systemPrompt: string,
  caseContext: CaseContext,
  userQuestion?: string,
  ragContext?: string
): Promise<LLMResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-specdec';

  if (!apiKey || apiKey.startsWith('gsk_fake')) {
    console.warn('Groq API Key is not configured or is a placeholder.');
    throw new Error('Groq API Key is not configured. Please set GROQ_API_KEY in your environment.');
  }

  const messages = [
    { role: 'system', content: systemPrompt + "\n\nCRITICAL: You must respond ONLY with a raw JSON object. Do not include any explanations outside of the JSON. Do not wrap the JSON in markdown code blocks (e.g. do NOT use ```json). Return pure raw JSON." },
    {
      role: 'user',
      content: `
Analyze the following cryptocurrency investigation data and return a JSON object.

Case Context Data:
${JSON.stringify(caseContext, null, 2)}

${ragContext ? `Retrieved AML Knowledge Reference:\n${ragContext}\n` : ''}
${userQuestion ? `User Question: ${userQuestion}\n` : 'Please analyze this case and explain the risk and fund flow.'}

Your response must be a single JSON object matching this schema exactly:
{
  "summary": "High-level summary of the case and findings",
  "risk_explanation": "Detailed explanation of why this case has the given risk score and level",
  "fund_flow_explanation": "Explanation of how funds moved, hop counts, and destinations",
  "key_indicators": ["List of observed risk indicators"],
  "aml_typologies": ["List of relevant AML typologies observed (e.g. Layering, Mixer exposure)"],
  "recommended_next_steps": ["Actionable steps for the investigator"],
  "confidence": 95
}
`
    }
  ];

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Groq API Error response:', errText);
      throw new Error(`Groq API returned status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq LLM');
    }

    // Try parsing content
    const parsed = JSON.parse(content.trim()) as LLMResponse;
    
    // Ensure all required fields exist
    return {
      summary: parsed.summary || 'Summary unavailable',
      risk_explanation: parsed.risk_explanation || 'Risk explanation unavailable',
      fund_flow_explanation: parsed.fund_flow_explanation || 'Fund flow explanation unavailable',
      key_indicators: Array.isArray(parsed.key_indicators) ? parsed.key_indicators : [],
      aml_typologies: Array.isArray(parsed.aml_typologies) ? parsed.aml_typologies : [],
      recommended_next_steps: Array.isArray(parsed.recommended_next_steps) ? parsed.recommended_next_steps : [],
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 85,
    };
  } catch (error: any) {
    console.error('Error calling Groq LLM:', error);
    throw error;
  }
}
