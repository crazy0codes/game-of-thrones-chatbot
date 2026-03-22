require('dotenv').config()

const express = require('express')
const fs = require('node:fs/promises')
const path = require('node:path')

const app = express()
const port = Number(process.env.PORT) || 3001
const promptPath = path.resolve(__dirname, '../client/prompt.md')
const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`

app.use(express.json({ limit: '1mb' }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }

  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: geminiModel, provider: 'gemini' })
})

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY
  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : []

  if (!apiKey) {
    res.status(500).json({
      error:
        'GEMINI_API_KEY is missing on the backend. Add it before sending chat requests.',
    })
    return
  }

  const messages = rawMessages
    .filter(
      (message) =>
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim(),
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))

  if (!messages.length) {
    res.status(400).json({ error: 'At least one chat message is required.' })
    return
  }

  try {
    const systemPrompt = await fs.readFile(promptPath, 'utf8')
    const contents = messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [
        {
          text: message.content,
        },
      ],
    }))

    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
        contents,
        generationConfig: {
        },
      }),
    })

    const data = await geminiResponse.json()

    if (!geminiResponse.ok) {
      res.status(geminiResponse.status).json({
        error: data?.error?.message || 'Gemini refused the request before answering.',
      })
      return
    }

    const reply = Array.isArray(data.candidates)
      ? data.candidates
          .flatMap((candidate) =>
            Array.isArray(candidate.content?.parts) ? candidate.content.parts : [],
          )
          .filter((part) => typeof part.text === 'string')
          .map((part) => part.text)
          .join('\n')
          .trim()
      : ''

    if (!reply) {
      res.status(502).json({
        error: 'Gemini returned no text reply for this exchange.',
      })
      return
    }

    console.debug(reply)

    res.json({
      reply: reply
    })
  } catch (error) {
    console.error('Chat request failed:', error)
    res.status(500).json({
      error: 'The rookery is in disarray. The backend could not reach Gemini.',
    })
  }
})

app.listen(port, () => {
  console.log(`Pycelle backend listening on http://localhost:${port}`)
})
