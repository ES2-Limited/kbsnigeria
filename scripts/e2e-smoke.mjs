/**
 * Lightweight E2E smoke test — run: node scripts/e2e-smoke.mjs
 * Requires dev server on http://localhost:5173 and .env.local Supabase vars.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = 'http://localhost:5173'
const envPath = resolve(process.cwd(), '.env.local')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx), line.slice(idx + 1)]
    }),
)

const SUPABASE_URL = env.VITE_SUPABASE_URL
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY

const routes = ['/', '/about', '/academics', '/admissions', '/events', '/news', '/gallery', '/resources', '/contact', '/admissions?intent=tour', '/this-page-does-not-exist']

const results = []

async function checkRoute(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'follow' })
  const html = await res.text()
  const isSpa = html.includes('id="root"') || html.includes('id=\\"root\\"')
  const is404 = path.includes('does-not-exist') ? html.length > 0 : true
  results.push({
    name: `route ${path}`,
    pass: res.ok && isSpa,
    detail: `status ${res.status}`,
  })
}

async function checkSupabase(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
  })
  const data = await res.json()
  results.push({
    name: `supabase ${table}`,
    pass: res.ok && Array.isArray(data),
    detail: res.ok ? `${data.length} row(s)` : JSON.stringify(data),
  })
  return data
}

async function checkEnquiry() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/send-enquiry`, {
    method: 'POST',
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parentName: 'E2E Test Parent',
      childName: 'E2E Test Child',
      classLevel: 'Primary 3',
      phone: '08012345678',
      email: 'e2e-test@example.com',
      message: 'Automated E2E admissions test.',
      intent: 'tour',
      website: '',
    }),
  })
  results.push({
    name: 'send-enquiry edge function',
    pass: res.ok,
    detail: `status ${res.status}`,
  })
}

try {
  await fetch(BASE)
} catch {
  console.error('FAIL: Dev server not running at', BASE)
  process.exit(1)
}

for (const path of routes) {
  await checkRoute(path)
}

await checkSupabase('testimonials', 'featured=eq.true&select=name')
await checkSupabase('events', 'status=eq.published&select=title')
await checkSupabase('site_media', 'select=key,embed_url')
await checkEnquiry()

const failed = results.filter((r) => !r.pass)
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'} | ${r.name} | ${r.detail}`)
}

console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
