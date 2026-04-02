#!/usr/bin/env node
/**
 * Local Dev Launcher
 * Runs web, studio, and Cascade agent together
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const net = require('net');

// Colors for output
const colors = {
  web: '\x1b[36m',    // Cyan
  studio: '\x1b[35m', // Magenta
  proxy: '\x1b[32m',  // Green
  reset: '\x1b[0m'
};

function log(service, message) {
  const prefix = `${colors[service]}[${service.toUpperCase()}]${colors.reset}`;
  console.log(`${prefix} ${message}`);
}

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });
    socket.connect(port, '127.0.0.1');
  });
}

function startService(name, command, args, cwd, env = {}) {
  log(name, `Starting: ${command} ${args.join(' ')}`);
  
  const proc = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    shell: true,
    stdio: 'pipe'
  });

  proc.stdout.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) log(name, line.trim());
    });
  });

  proc.stderr.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line.trim()) log(name, `⚠️  ${line.trim()}`);
    });
  });

  proc.on('close', (code) => {
    log(name, `Exited with code ${code}`);
  });

  return proc;
}

async function main() {
  const root = process.cwd();
  const clawDevRoot = path.join(root, '..', 'Clawd', 'claw-dev');

  console.log('\n🚀 Local Dev Environment\n');

  // Check if proxy is already running
  const proxyRunning = await checkPort(8789);
  let proxyProc;

  if (proxyRunning) {
    log('proxy', '✅ Proxy already running on port 8789');
  } else {
    console.log('Starting all services...\n');
    // Start the Anthropic proxy first
    proxyProc = startService(
      'proxy',
      'npx',
      ['tsx', 'src/anthropicCompatProxy.ts'],
      clawDevRoot,
      {
        OLLAMA_MODEL: 'qwen2.5-coder:14b',
        OLLAMA_BASE_URL: 'http://127.0.0.1:11434'
      }
    );

    // Wait a moment for proxy to start
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Check if web dependencies exist
  const webNodeModules = path.join(root, 'apps', 'web', 'node_modules');
  const studioNodeModules = path.join(root, 'apps', 'studio', 'node_modules');

  if (!fs.existsSync(webNodeModules)) {
    log('web', '⚠️  Dependencies not installed. Run: pnpm install');
    console.log('\n💡 Run this first:\n  pnpm install\n');
    process.exit(1);
  }

  if (!fs.existsSync(studioNodeModules)) {
    log('studio', '⚠️  Dependencies not installed. Run: pnpm install');
    console.log('\n💡 Run this first:\n  pnpm install\n');
    process.exit(1);
  }

  // Start web dev server
  const webProc = startService(
    'web',
    'pnpm',
    ['--filter', 'web', 'dev'],
    root
  );

  // Start studio dev server
  const studioProc = startService(
    'studio',
    'pnpm',
    ['--filter', 'studio', 'dev'],
    root
  );

  console.log('\n📋 Services started:\n');
  console.log('  🌐 Web:     http://localhost:3000');
  console.log('  🎨 Studio:  http://localhost:3333');
  console.log('  🤖 Proxy:   http://127.0.0.1:8789');
  console.log('\n💡 Use /agent in Windsurf Cascade panel for local AI');
  console.log('🛑 Press Ctrl+C to stop all services\n');

  // Handle shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...\n');
    proxyProc.kill();
    webProc.kill();
    studioProc.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    proxyProc.kill();
    webProc.kill();
    studioProc.kill();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
