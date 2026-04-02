#!/usr/bin/env node
/**
 * Cascade Launcher with Model Selection
 * Start Cascade agent with optional model picker
 */

const { spawn } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const MODELS = [
  { key: 'qwen2.5-coder:14b', name: 'Qwen2.5 Coder 14B', desc: 'Balanced performance' },
  { key: 'gemma3:27b', name: 'Gemma 3 27B', desc: 'Best accuracy (slower)' },
  { key: 'qwen3:8b', name: 'Qwen3 8B', desc: 'Fast, lightweight' },
  { key: 'deepseek-r1:8b', name: 'DeepSeek R1 8B', desc: 'Reasoning-focused' }
];

function question(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

function getEnvPath() {
  return path.join(process.cwd(), '.env');
}

function updateEnvModel(modelKey) {
  const envPath = getEnvPath();
  if (!fs.existsSync(envPath)) return false;
  
  let content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  let found = false;
  
  const newLines = lines.map(line => {
    if (line.startsWith('OLLAMA_MODEL=')) {
      found = true;
      return `OLLAMA_MODEL=${modelKey}`;
    }
    return line;
  });
  
  if (!found) {
    newLines.push(`OLLAMA_MODEL=${modelKey}`);
  }
  
  fs.writeFileSync(envPath, newLines.join('\n'));
  return true;
}

function getCurrentModel() {
  const envPath = getEnvPath();
  if (!fs.existsSync(envPath)) return null;
  
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/OLLAMA_MODEL=(.+)/);
  return match ? match[1].trim() : null;
}

async function selectModel() {
  console.log('🤖 Cascade Model Selection\n');
  
  const currentModel = getCurrentModel();
  console.log(`Current model: ${currentModel || 'not set'}\n`);
  
  console.log('Available models:\n');
  MODELS.forEach((m, i) => {
    const marker = m.key === currentModel ? ' (current)' : '';
    console.log(`${i + 1}. ${m.name}${marker}`);
    console.log(`   ${m.desc}\n`);
  });
  
  console.log('5. Keep current / Skip selection\n');
  
  const choice = await question('Select model (1-5): ');
  const index = parseInt(choice, 10) - 1;
  
  if (index >= 0 && index < MODELS.length) {
    const selected = MODELS[index];
    if (updateEnvModel(selected.key)) {
      console.log(`\n✅ Updated .env to use ${selected.name}`);
    }
    return selected.key;
  }
  
  return currentModel;
}

async function startCascade(model) {
  console.log('\n🚀 Starting Cascade with Ollama...');
  console.log(`Model: ${model || 'default'}\n`);
  
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'powershell' : 'bash';
  const args = isWindows 
    ? ['-ExecutionPolicy', 'Bypass', '-File', 'scripts/run-local-agent.ps1']
    : ['scripts/run-local-agent.sh'];
  
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });
  
  proc.on('close', (code) => {
    process.exit(code);
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  // If --select flag passed, show model picker
  if (args.includes('--select')) {
    const model = await selectModel();
    rl.close();
    
    if (model) {
      await startCascade(model);
    } else {
      console.log('❌ No model selected');
      process.exit(1);
    }
    return;
  }
  
  // Otherwise just start with current model
  const currentModel = getCurrentModel();
  rl.close();
  await startCascade(currentModel);
}

main().catch(err => {
  console.error('Error:', err.message);
  rl.close();
  process.exit(1);
});
