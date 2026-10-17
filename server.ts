import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', hasKey: Boolean(apiKey) });
  });

  // Full Decision Deep Analysis
  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the AI Studio Secrets panel.',
        });
      }

      const { title, context, urgency, reversible, options } = req.body;

      if (!title || !options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          error: 'Please provide a decision title and at least two options.',
        });
      }

      const optionsListFormatted = options
        .map((opt: { id: string; name: string; description?: string }, idx: number) => {
          return `Option ${idx + 1} [ID: ${opt.id}]: "${opt.name}" ${opt.description ? `- ${opt.description}` : ''}`;
        })
        .join('\n');

      const systemPrompt = `You are "The Tiebreaker", an elite decision-making strategist and objective arbitrator.
Your mission is to rigorously evaluate tough choices, illuminate blind spots, balance trade-offs, and break ties with intellectual clarity and empathy.

Analyze the user's dilemma with high precision:
1. Generate 3 to 5 realistic, incisive PROS and 3 to 5 real, non-trivial CONS for each option with a weight (1-10) indicating genuine importance.
2. Formulate a comprehensive SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats) for each option.
3. Construct a Comparison Matrix with 4 to 6 critical criteria (e.g. Long-term Upside, Financial Impact, Stress/Burnout Risk, Adaptability/Flexibility, Alignment with Values). Score each option 1-10 on each criterion and declare a winner for each.
4. Deliver a decisive VERDICT:
   - Identify the recommended option clearly (must pick one to break the tie, no sitting on the fence!).
   - State the confidence percentage (e.g., 65% to 92%).
   - Provide a headline and clear executive rationale.
   - Reveal "The Tiebreaker Factor": the single pivotal truth or question that decisively tips the scale.
   - The 10/10/10 Rule: How will they feel about this in 10 minutes, 10 months, and 10 years?
   - Devil's Advocate: Call out the biggest blindspot or hard pill to swallow, and how to mitigate it.
   - Test-Drive Experiment: Suggest a concrete 24-to-72-hour low-risk simulation or micro-test before executing.

Make sure the IDs of options match the exact option IDs provided in the prompt.`;

      const userPrompt = `Dilemma: "${title}"
Context & Priorities: "${context || 'No specific personal context provided - evaluate based on standard life/business best practices.'}"
Urgency level: ${urgency || 'medium'}
Decision Type: ${reversible || 'type2_reversible'}

Options to evaluate:
${optionsListFormatted}

Evaluate these options thoroughly and return a structured JSON response matching the required schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    tagline: { type: Type.STRING },
                    pros: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          explanation: { type: Type.STRING },
                          category: { type: Type.STRING },
                          weight: { type: Type.INTEGER },
                        },
                        required: ['id', 'text', 'explanation', 'category', 'weight'],
                      },
                    },
                    cons: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          explanation: { type: Type.STRING },
                          category: { type: Type.STRING },
                          weight: { type: Type.INTEGER },
                        },
                        required: ['id', 'text', 'explanation', 'category', 'weight'],
                      },
                    },
                    swot: {
                      type: Type.OBJECT,
                      properties: {
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                    },
                  },
                  required: ['id', 'name', 'tagline', 'pros', 'cons', 'swot'],
                },
              },
              comparisonMatrix: {
                type: Type.OBJECT,
                properties: {
                  criteria: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        importance: { type: Type.STRING },
                        winnerOptionId: { type: Type.STRING },
                        scoresList: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              optionId: { type: Type.STRING },
                              rating: { type: Type.INTEGER },
                              rationale: { type: Type.STRING },
                            },
                            required: ['optionId', 'rating', 'rationale'],
                          },
                        },
                      },
                      required: ['name', 'category', 'importance', 'winnerOptionId', 'scoresList'],
                    },
                  },
                },
                required: ['criteria'],
              },
              verdict: {
                type: Type.OBJECT,
                properties: {
                  recommendedOptionId: { type: Type.STRING },
                  recommendedOptionName: { type: Type.STRING },
                  confidencePercentage: { type: Type.INTEGER },
                  headline: { type: Type.STRING },
                  executiveRationale: { type: Type.STRING },
                  theTiebreakerFactor: { type: Type.STRING },
                  rule101010: {
                    type: Type.OBJECT,
                    properties: {
                      in10Minutes: { type: Type.STRING },
                      in10Months: { type: Type.STRING },
                      in10Years: { type: Type.STRING },
                    },
                    required: ['in10Minutes', 'in10Months', 'in10Years'],
                  },
                  devilsAdvocate: {
                    type: Type.OBJECT,
                    properties: {
                      blindspot: { type: Type.STRING },
                      harshTruth: { type: Type.STRING },
                      howToMitigate: { type: Type.STRING },
                    },
                    required: ['blindspot', 'harshTruth', 'howToMitigate'],
                  },
                  testDriveExperiment: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      duration: { type: Type.STRING },
                    },
                    required: ['title', 'description', 'duration'],
                  },
                },
                required: [
                  'recommendedOptionId',
                  'recommendedOptionName',
                  'confidencePercentage',
                  'headline',
                  'executiveRationale',
                  'theTiebreakerFactor',
                  'rule101010',
                  'devilsAdvocate',
                  'testDriveExperiment',
                ],
              },
            },
            required: ['summary', 'options', 'comparisonMatrix', 'verdict'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini model.');
      }

      const parsed = JSON.parse(responseText);

      // Normalize option IDs across parsed.options and ensure consistent structure
      const normalizedOptions = (parsed.options || []).map((parsedOpt: any, idx: number) => {
        const matchingInputOpt = options[idx] || options.find((o: any) => o.id === parsedOpt.id);
        const resolvedId = matchingInputOpt ? matchingInputOpt.id : parsedOpt.id || `opt_${idx + 1}`;
        const resolvedName = matchingInputOpt ? matchingInputOpt.name : parsedOpt.name;

        return {
          id: resolvedId,
          name: resolvedName,
          tagline: parsedOpt.tagline || 'Strategic evaluation candidate',
          pros: (parsedOpt.pros || []).map((p: any, pIdx: number) => ({
            id: p.id || `p_${resolvedId}_${pIdx}`,
            text: p.text || 'Advantage',
            explanation: p.explanation || '',
            category: p.category || 'Strategic',
            weight: typeof p.weight === 'number' ? Math.max(1, Math.min(10, p.weight)) : 7,
          })),
          cons: (parsedOpt.cons || []).map((c: any, cIdx: number) => ({
            id: c.id || `c_${resolvedId}_${cIdx}`,
            text: c.text || 'Challenge',
            explanation: c.explanation || '',
            category: c.category || 'Risk',
            weight: typeof c.weight === 'number' ? Math.max(1, Math.min(10, c.weight)) : 6,
          })),
          swot: {
            strengths: Array.isArray(parsedOpt.swot?.strengths) ? parsedOpt.swot.strengths : [],
            weaknesses: Array.isArray(parsedOpt.swot?.weaknesses) ? parsedOpt.swot.weaknesses : [],
            opportunities: Array.isArray(parsedOpt.swot?.opportunities) ? parsedOpt.swot.opportunities : [],
            threats: Array.isArray(parsedOpt.swot?.threats) ? parsedOpt.swot.threats : [],
          },
        };
      });

      // Transform comparison matrix scoresList into score dictionary for rapid frontend access
      const formattedCriteria = (parsed.comparisonMatrix?.criteria || []).map((crit: any) => {
        const scoresDict: Record<string, { rating: number; rationale: string }> = {};
        if (Array.isArray(crit.scoresList)) {
          crit.scoresList.forEach((s: any, idx: number) => {
            const targetId = options[idx]?.id || s.optionId;
            scoresDict[targetId] = {
              rating: typeof s.rating === 'number' ? s.rating : 6,
              rationale: s.rationale || '',
            };
          });
        }

        // Ensure all options have an entry
        options.forEach((opt: any) => {
          if (!scoresDict[opt.id]) {
            scoresDict[opt.id] = { rating: 6, rationale: 'Comparable baseline performance.' };
          }
        });

        // Determine winner option ID
        let winnerId = crit.winnerOptionId;
        if (!options.some((o: any) => o.id === winnerId)) {
          let highest = -1;
          options.forEach((opt: any) => {
            const r = scoresDict[opt.id]?.rating ?? 0;
            if (r > highest) {
              highest = r;
              winnerId = opt.id;
            }
          });
        }

        return {
          name: crit.name || 'Decision Factor',
          category: crit.category || 'General',
          importance: crit.importance || 'High',
          winnerOptionId: winnerId,
          scores: scoresDict,
        };
      });

      // Ensure verdict option matches exact input option
      let recommendedOptionId = parsed.verdict?.recommendedOptionId;
      if (!options.some((o: any) => o.id === recommendedOptionId)) {
        recommendedOptionId = options[0]?.id;
      }
      const recommendedOption =
        options.find((o: any) => o.id === recommendedOptionId) || options[0];

      const safeVerdict = {
        recommendedOptionId: recommendedOption.id,
        recommendedOptionName: recommendedOption.name,
        confidencePercentage:
          typeof parsed.verdict?.confidencePercentage === 'number'
            ? Math.max(51, Math.min(99, parsed.verdict.confidencePercentage))
            : 82,
        headline: parsed.verdict?.headline || `Proceed with ${recommendedOption.name}`,
        executiveRationale:
          parsed.verdict?.executiveRationale ||
          'Strategic analysis demonstrates an asymmetric advantage with higher net upside.',
        theTiebreakerFactor:
          parsed.verdict?.theTiebreakerFactor ||
          'The determining factor is long-term optionality and regret minimization.',
        rule101010: {
          in10Minutes:
            parsed.verdict?.rule101010?.in10Minutes || 'A sense of relief and forward clarity.',
          in10Months:
            parsed.verdict?.rule101010?.in10Months || 'Tangible progress and positive adaptation.',
          in10Years:
            parsed.verdict?.rule101010?.in10Years || 'Minimal regret and pride in deliberate agency.',
        },
        devilsAdvocate: {
          blindspot:
            parsed.verdict?.devilsAdvocate?.blindspot ||
            'Underestimating initial friction during transition.',
          harshTruth:
            parsed.verdict?.devilsAdvocate?.harshTruth ||
            'Every upside comes with an unavoidable trade-off.',
          howToMitigate:
            parsed.verdict?.devilsAdvocate?.howToMitigate ||
            'Establish clear boundaries and regular check-in milestones.',
        },
        testDriveExperiment: {
          title: parsed.verdict?.testDriveExperiment?.title || '48-Hour Micro-Pilot',
          description:
            parsed.verdict?.testDriveExperiment?.description ||
            'Simulate the workflow or conditions for 48 hours before irreversible commitment.',
          duration: parsed.verdict?.testDriveExperiment?.duration || '48 Hours',
        },
      };

      const analysisResult = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        decisionInput: {
          id: `dec_${Date.now()}`,
          title,
          category: req.body.category || 'General',
          context: context || '',
          urgency: urgency || 'medium',
          reversible: reversible || 'type2_reversible',
          options,
          createdAt: Date.now(),
        },
        timestamp: Date.now(),
        summary: parsed.summary || 'Strategic decision appraisal.',
        options: normalizedOptions,
        comparisonMatrix: {
          criteria: formattedCriteria,
        },
        verdict: safeVerdict,
      };

      res.json(analysisResult);
    } catch (err: any) {
      console.error('Error generating decision analysis:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate decision analysis',
      });
    }
  });

  // Follow-up Consultation / Devil's Advocate Chat
  app.post('/api/followup', async (req: Request, res: Response) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const { dilemma, verdict, question, history } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const historyFormatted = (history || [])
        .slice(-6)
        .map((m: { sender: string; text: string }) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n');

      const systemPrompt = `You are "The Tiebreaker", an expert decision strategist.
You are assisting someone who is making a decision on: "${dilemma}".
Current AI recommendation: "${verdict?.recommendedOptionName || 'Undecided'}" (${verdict?.headline || ''}).
Key rationale: "${verdict?.executiveRationale || ''}".
Tiebreaker factor: "${verdict?.theTiebreakerFactor || ''}".

Answer the user's specific follow-up question directly, insightfully, and concisely (2 to 4 punchy paragraphs max).
If they challenge the verdict, defend the logic with nuance while acknowledging trade-offs.
Provide actionable suggestions, negotiation tactics, or reframing exercises where appropriate.`;

      const prompt = `${historyFormatted ? `Previous conversation:\n${historyFormatted}\n\n` : ''}User asks: "${question}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      res.json({ reply: response.text });
    } catch (err: any) {
      console.error('Error in follow-up chat:', err);
      res.status(500).json({ error: err.message || 'Failed to answer follow-up' });
    }
  });

  // Quick 30-Second Micro Tiebreaker for quick everyday dilemmas
  app.post('/api/quick-tiebreaker', async (req: Request, res: Response) => {
    try {
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const { optionA, optionB, mood } = req.body;
      if (!optionA || !optionB) {
        return res.status(400).json({ error: 'Please provide both options.' });
      }

      const prompt = `Choose decisively between:
Option A: "${optionA}"
Option B: "${optionB}"
User mood / vibe: "${mood || 'open-minded'}"

Give an instant, witty, yet genuinely practical tiebreaker verdict with:
1. Picked option (Option A or Option B)
2. One snappy punchy sentence why
3. One "If you still hesitate..." gut-check prompt.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an ultra-fast, witty, decisive tiebreaker judge. Never sit on the fence. Pick one decisively with flair and clarity.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              winner: { type: Type.STRING },
              punchline: { type: Type.STRING },
              rationale: { type: Type.STRING },
              gutCheck: { type: Type.STRING },
            },
            required: ['winner', 'punchline', 'rationale', 'gutCheck'],
          },
        },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (err: any) {
      console.error('Error in quick tiebreaker:', err);
      res.status(500).json({ error: err.message || 'Failed quick tiebreaker' });
    }
  });

  // Setup Vite in development or static in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
