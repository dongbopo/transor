import { LLMProvider, APIKeys } from '../types';

export interface LLMTranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  apiKey: string;
  provider: LLMProvider;
  domain?: string;
}

export interface LLMTranslationResponse {
  translatedText: string;
  tokensUsed?: number;
  model?: string;
  error?: string;
}

/**
 * Translate text using OpenAI GPT
 */
async function translateWithOpenAI(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<LLMTranslationResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original formatting, style, and tone. Only return the translated text, nothing else.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim() || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      translatedText,
      tokensUsed,
      model: 'gpt-4o-mini',
    };
  } catch (error: any) {
    return {
      translatedText: '',
      error: error.message || 'OpenAI translation failed',
    };
  }
}

/**
 * Translate text using Google Gemini
 */
async function translateWithGemini(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<LLMTranslationResponse> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate the following text to ${targetLanguage}. Maintain the original formatting, style, and tone. Only return the translated text, nothing else.\n\n${text}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    const translatedText = data.candidates[0]?.content?.parts[0]?.text?.trim() || '';
    const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

    return {
      translatedText,
      tokensUsed,
      model: 'gemini-pro',
    };
  } catch (error: any) {
    return {
      translatedText: '',
      error: error.message || 'Gemini translation failed',
    };
  }
}

/**
 * Translate text using Anthropic Claude
 */
async function translateWithClaude(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<LLMTranslationResponse> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `Translate the following text to ${targetLanguage}. Maintain the original formatting, style, and tone. Only return the translated text, nothing else.\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Claude API error');
    }

    const data = await response.json();
    const translatedText = data.content[0]?.text?.trim() || '';
    const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

    return {
      translatedText,
      tokensUsed,
      model: 'claude-3-5-sonnet',
    };
  } catch (error: any) {
    return {
      translatedText: '',
      error: error.message || 'Claude translation failed',
    };
  }
}

/**
 * Translate text using xAI Grok
 */
async function translateWithGrok(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<LLMTranslationResponse> {
  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original formatting, style, and tone. Only return the translated text, nothing else.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Grok API error');
    }

    const data = await response.json();
    const translatedText = data.choices[0]?.message?.content?.trim() || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      translatedText,
      tokensUsed,
      model: 'grok-beta',
    };
  } catch (error: any) {
    return {
      translatedText: '',
      error: error.message || 'Grok translation failed',
    };
  }
}

/**
 * Main LLM Translation Service
 */
export class LLMTranslationService {
  /**
   * Translate text using specified LLM provider
   */
  static async translate(
    request: LLMTranslationRequest
  ): Promise<LLMTranslationResponse> {
    const { text, targetLanguage, apiKey, provider } = request;

    if (!apiKey) {
      return {
        translatedText: '',
        error: `${provider.toUpperCase()} API key is required`,
      };
    }

    switch (provider) {
      case 'openai':
        return translateWithOpenAI(text, targetLanguage, apiKey);
      case 'gemini':
        return translateWithGemini(text, targetLanguage, apiKey);
      case 'claude':
        return translateWithClaude(text, targetLanguage, apiKey);
      case 'grok':
        return translateWithGrok(text, targetLanguage, apiKey);
      default:
        return {
          translatedText: '',
          error: `Unsupported provider: ${provider}`,
        };
    }
  }

  /**
   * Translate text with multiple providers in parallel
   */
  static async translateMultiple(
    text: string,
    targetLanguage: string,
    apiKeys: Partial<APIKeys>
  ): Promise<Record<string, LLMTranslationResponse>> {
    const providers: LLMProvider[] = ['openai', 'gemini', 'claude', 'grok'];
    const results: Record<string, LLMTranslationResponse> = {};

    const promises = providers.map(async (provider) => {
      const apiKey = apiKeys[provider];
      if (!apiKey) {
        results[provider] = {
          translatedText: '',
          error: `No API key for ${provider}`,
        };
        return;
      }

      const result = await this.translate({
        text,
        targetLanguage,
        apiKey,
        provider,
      });
      results[provider] = result;
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * Translate long text by chunking
   */
  static async translateLongText(
    text: string,
    targetLanguage: string,
    apiKey: string,
    provider: LLMProvider,
    chunkSize: number = 2000
  ): Promise<string> {
    // Split text into sentences first
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    }
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    // Translate chunks sequentially to maintain context
    const translatedChunks: string[] = [];
    for (const chunk of chunks) {
      const result = await this.translate({
        text: chunk,
        targetLanguage,
        apiKey,
        provider,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      translatedChunks.push(result.translatedText);
    }

    return translatedChunks.join(' ');
  }
}

