const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const https = require('https');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function loadEnvChain(filePaths) {
  for (const filePath of filePaths) {
    if (!filePath) continue;
    loadDotEnv(filePath);
  }
}

function defaultSharedEnvPath() {
  return path.join(os.homedir(), '.claw-dev.env');
}

function checkRequired(keys) {
  const missing = keys.filter((k) => !process.env[k] || process.env[k].trim() === '');
  return missing;
}

function hasValue(name) {
  return Boolean(process.env[name] && process.env[name].trim() !== '');
}

function requestJson(urlString) {
  return new Promise((resolve, reject) => {
    let url;
    try {
      url = new URL(urlString);
    } catch (err) {
      reject(new Error(`Invalid URL: ${urlString}`));
      return;
    }

    const client = url.protocol === 'https:' ? https : http;

    const req = client.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        timeout: 4000,
      },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
            return;
          }
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('Request timed out'));
    });

    req.on('error', (err) => reject(err));
    req.end();
  });
}

async function runStatus() {
  const root = process.cwd();
  loadEnvChain([defaultSharedEnvPath(), path.join(root, '.env')]);

  const required = [
    'CLAW_PROVIDER',
    'ANTHROPIC_COMPAT_PROVIDER',
    'ANTHROPIC_COMPAT_PORT',
    'OLLAMA_BASE_URL',
    'OLLAMA_MODEL',
    'OLLAMA_KEEP_ALIVE',
    'OLLAMA_NUM_CTX',
    'OLLAMA_NUM_PREDICT',
  ];

  const missing = checkRequired(required);
  if (missing.length > 0) {
    console.error('❌ Missing required env vars: - dev.js:105', missing.join(', '));
    process.exitCode = 1;
    return;
  }

  if (String(process.env.CLAW_PROVIDER).toLowerCase() !== 'ollama') {
    console.error('❌ CLAW_PROVIDER must be set to ollama for local-only mode.');
    process.exitCode = 1;
    return;
  }

  if (String(process.env.ANTHROPIC_COMPAT_PROVIDER).toLowerCase() !== 'ollama') {
    console.error('❌ ANTHROPIC_COMPAT_PROVIDER must be set to ollama for local-only mode.');
    process.exitCode = 1;
    return;
  }

  const cloudKeyVars = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'AZURE_OPENAI_API_KEY'];
  const presentCloudKeys = cloudKeyVars.filter(hasValue);
  if (presentCloudKeys.length > 0) {
    console.error('❌ Cloud API key(s) detected in environment:', presentCloudKeys.join(', '));
    console.error('   Unset them in this terminal/session to avoid cloud fallback and rate-limit errors.');
    process.exitCode = 1;
    return;
  }

  console.log('✅ Environment loaded - dev.js:110');
  console.log(`CLAW_PROVIDER=${process.env.CLAW_PROVIDER} - dev.js:111`);
  console.log(`OLLAMA_BASE_URL=${process.env.OLLAMA_BASE_URL} - dev.js:112`);
  console.log(`OLLAMA_MODEL=${process.env.OLLAMA_MODEL} - dev.js:113`);

  const tagsUrl = `${process.env.OLLAMA_BASE_URL.replace(/\/$/, '')}/api/tags`;
  try {
    const tags = await requestJson(tagsUrl);
    const tagModels = tags && tags.models;
    const models = Array.isArray(tagModels) ? tagModels : [];
    const found = models.some((m) => m && m.name === process.env.OLLAMA_MODEL);

    if (found) {
      console.log(`✅ Ollama reachable and model found: ${process.env.OLLAMA_MODEL} - dev.js:122`);
      process.exitCode = 0;
      return;
    }

    const available = models.map((m) => (m ? m.name : undefined)).filter(Boolean);
    console.error(`❌ Ollama reachable but model not found: ${process.env.OLLAMA_MODEL} - dev.js:128`);
    if (available.length > 0) {
      console.error(`Available models: ${available.join(', ')} - dev.js:130`);
    } else {
      console.error('No models reported by Ollama. - dev.js:132');
    }
    process.exitCode = 1;
  } catch (err) {
    console.error(`❌ Could not reach Ollama at ${tagsUrl} - dev.js:136`);
    console.error(`${err.message} - dev.js:137`);
    process.exitCode = 1;
  }
}

function runDoctor() {
  const root = process.cwd();
  loadEnvChain([defaultSharedEnvPath(), path.join(root, '.env')]);

  const cloudKeyVars = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'AZURE_OPENAI_API_KEY'];
  const presentCloudKeys = cloudKeyVars.filter(hasValue);

  console.log('--- Local Agent Doctor ---');
  console.log(`CLAW_PROVIDER=${process.env.CLAW_PROVIDER || ''}`);
  console.log(`ANTHROPIC_COMPAT_PROVIDER=${process.env.ANTHROPIC_COMPAT_PROVIDER || ''}`);
  console.log(`ANTHROPIC_COMPAT_PORT=${process.env.ANTHROPIC_COMPAT_PORT || ''}`);
  console.log(`OLLAMA_BASE_URL=${process.env.OLLAMA_BASE_URL || ''}`);
  console.log(`OLLAMA_MODEL=${process.env.OLLAMA_MODEL || ''}`);
  console.log(`OLLAMA_NUM_CTX=${process.env.OLLAMA_NUM_CTX || ''}`);
  console.log(`OLLAMA_NUM_PREDICT=${process.env.OLLAMA_NUM_PREDICT || ''}`);

  if (presentCloudKeys.length > 0) {
    console.log(`Cloud keys present: ${presentCloudKeys.join(', ')}`);
  } else {
    console.log('Cloud keys present: none');
  }

  const localProviderOk = String(process.env.CLAW_PROVIDER || '').toLowerCase() === 'ollama';
  const compatProviderOk = String(process.env.ANTHROPIC_COMPAT_PROVIDER || '').toLowerCase() === 'ollama';

  if (!localProviderOk || !compatProviderOk || presentCloudKeys.length > 0) {
    console.error('❌ Local-only safety check failed.');
    process.exitCode = 1;
    return;
  }

  console.log('✅ Local-only safety check passed.');
  process.exitCode = 0;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--status')) {
    await runStatus();
    return;
  }

  if (args.includes('--doctor')) {
    runDoctor();
    return;
  }

  console.log('Dev runner ready. Use --status to verify Ollama and --doctor for local-only safety checks.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
