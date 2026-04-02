/**
 * Model Installation Helper
 * Pull benchmark models from Ollama registry
 */

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BENCHMARK_MODELS = {
  "qwen2.5-coder:14b": {
    name: "Qwen2.5 Coder 14B",
    description: "Code-optimized model, good balance of size/performance",
    size: "~9GB",
    humanEval: "52.5%",
    bestFor: "General coding with fast inference"
  },
  "gemma3:27b": {
    name: "Gemma 3 27B", 
    description: "Google's best code model, top benchmark scores",
    size: "~17GB",
    humanEval: "70.0%",
    bestFor: "Complex tasks, highest accuracy"
  },
  "qwen3:8b": {
    name: "Qwen3 8B",
    description: "Lightweight Qwen3 for fast inference",
    size: "~5GB",
    humanEval: "48.0%",
    bestFor: "Quick responses, limited resources"
  },
  "deepseek-r1:8b": {
    name: "DeepSeek R1 8B",
    description: "Reasoning-focused model",
    size: "~5GB", 
    humanEval: "45.0%",
    bestFor: "Reasoning tasks, low memory usage"
  }
};

function question(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

function pullModel(modelName) {
  return new Promise((resolve, reject) => {
    console.log(`\n⬇️  Pulling ${modelName}...`);
    console.log('This may take several minutes depending on your internet speed.\n');
    
    const proc = spawn('ollama', ['pull', modelName], { 
      stdio: 'inherit',
      shell: true
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${modelName} installed successfully!`);
        resolve();
      } else {
        reject(new Error(`Failed to pull ${modelName} (exit code: ${code})`));
      }
    });
    
    proc.on('error', (err) => {
      reject(new Error(`Failed to start ollama pull: ${err.message}`));
    });
  });
}

async function main() {
  console.log('🚀 Model Installer\n');
  console.log('Install benchmark models for local AI development\n');
  
  console.log('Available models:\n');
  Object.entries(BENCHMARK_MODELS).forEach(([key, model], index) => {
    console.log(`${index + 1}. ${model.name}`);
    console.log(`   Size: ${model.size} | HumanEval: ${model.humanEval}`);
    console.log(`   Best for: ${model.bestFor}\n`);
  });
  
  console.log('5. Install ALL models (~36GB total)');
  console.log('6. Exit\n');
  
  const answer = await question('Which model(s) to install? (1-6, or comma-separated): ');
  const choices = answer.split(',').map(s => s.trim());
  
  const modelKeys = Object.keys(BENCHMARK_MODELS);
  let modelsToInstall = [];
  
  if (choices.includes('5')) {
    modelsToInstall = modelKeys;
  } else if (choices.includes('6')) {
    console.log('👋 Exiting...');
    rl.close();
    return;
  } else {
    choices.forEach(choice => {
      const index = parseInt(choice, 10) - 1;
      if (index >= 0 && index < modelKeys.length) {
        modelsToInstall.push(modelKeys[index]);
      }
    });
  }
  
  if (modelsToInstall.length === 0) {
    console.log('❌ No valid models selected');
    rl.close();
    return;
  }
  
  console.log(`\n📦 Installing ${modelsToInstall.length} model(s)...\n`);
  
  for (const model of modelsToInstall) {
    try {
      await pullModel(model);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Installation complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run ollama:compare');
  console.log('2. Run: npm run ollama:status');
  console.log('3. Start: npm run claw-dev');
  
  rl.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  rl.close();
  process.exit(1);
});
