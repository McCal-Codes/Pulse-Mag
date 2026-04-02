#!/usr/bin/env node
/**
 * Interactive Model Benchmark Comparison Tool
 */

const readline = require('readline');
const { 
  MODEL_BENCHMARKS, 
  compareModels,
  getRecommendation 
} = require('./model-benchmark-data');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

function printHeader(text) {
  console.log('\n' + '='.repeat(60));
  console.log(text);
  console.log('='.repeat(60) + '\n');
}

function printModelCard(modelKey) {
  const model = MODEL_BENCHMARKS[modelKey];
  if (!model) return;

  printHeader(model.name);
  console.log(`Provider: ${model.provider}`);
  console.log(`Size: ${model.size} parameters`);
  console.log(`Description: ${model.description}\n`);

  console.log('📊 Benchmark Results:');
  console.log('-'.repeat(40));
  for (const [benchmark, score] of Object.entries(model.benchmarks)) {
    const bar = '█'.repeat(Math.floor(score / 5)) + '░'.repeat(20 - Math.floor(score / 5));
    console.log(`${benchmark.padEnd(12)} | ${bar} ${score}%`);
  }

  console.log('\n✅ Strengths:');
  model.strengths.forEach(s => console.log(`  • ${s}`));

  console.log('\n⚠️  Considerations:');
  model.considerations.forEach(c => console.log(`  • ${c}`));
}

function printComparison(model1, model2) {
  const m1 = MODEL_BENCHMARKS[model1];
  const m2 = MODEL_BENCHMARKS[model2];

  if (!m1 || !m2) {
    console.log('❌ One or both models not found');
    return;
  }

  printHeader(`${m1.name} vs ${m2.name}`);

  const comparison = compareModels(model1, model2);
  let m1Wins = 0;
  let m2Wins = 0;

  console.log('Benchmark Comparison:\n');
  console.log('Benchmark'.padEnd(12) + ' | ' + m1.name.padEnd(20) + ' | ' + m2.name.padEnd(20) + ' | Winner');
  console.log('-'.repeat(80));

  for (const [benchmark, data] of Object.entries(comparison)) {
    const winner = data.winner === model1 ? m1.name : m2.name;
    if (data.winner === model1) m1Wins++;
    else m2Wins++;

    const b1 = data.model1.toString().padEnd(6);
    const b2 = data.model2.toString().padEnd(6);
    const diff = `(±${data.difference}%)`;

    console.log(`${benchmark.padEnd(12)} | ${b1.padEnd(20)} | ${b2.padEnd(20)} | ${winner} ${diff}`);
  }

  console.log('\n🏆 Summary:');
  console.log(`${m1.name}: ${m1Wins} wins`);
  console.log(`${m2.name}: ${m2Wins} wins`);

  if (m1Wins > m2Wins) {
    console.log(`\n✨ ${m1.name} wins overall`);
  } else if (m2Wins > m1Wins) {
    console.log(`\n✨ ${m2.name} wins overall`);
  } else {
    console.log(`\n🤝 Tie - both models perform similarly`);
  }
}

async function interactiveMode() {
  printHeader('🤖 Model Benchmark Comparison Tool');
  console.log('Compare published benchmark data for popular code models\n');

  while (true) {
    console.log('Options:');
    console.log('1. View single model details');
    console.log('2. Compare two models');
    console.log('3. Get recommendations for use case');
    console.log('4. List all available models');
    console.log('5. Exit\n');

    const choice = await question('Select option (1-5): ');

    switch (choice.trim()) {
      case '1':
        console.log('\nAvailable models:');
        Object.keys(MODEL_BENCHMARKS).forEach((key, i) => {
          console.log(`${i + 1}. ${MODEL_BENCHMARKS[key].name}`);
        });
        const modelChoice = await question('\nEnter model number or key: ');
        const modelKeys = Object.keys(MODEL_BENCHMARKS);
        const selectedModel = modelKeys[parseInt(modelChoice, 10) - 1] || modelChoice;
        printModelCard(selectedModel);
        break;

      case '2':
        console.log('\nAvailable models:');
        Object.keys(MODEL_BENCHMARKS).forEach((key, i) => {
          console.log(`${i + 1}. ${MODEL_BENCHMARKS[key].name}`);
        });
        const model1 = await question('\nFirst model: ');
        const model2 = await question('Second model: ');
        const keys = Object.keys(MODEL_BENCHMARKS);
        const m1 = keys[parseInt(model1, 10) - 1] || model1;
        const m2 = keys[parseInt(model2, 10) - 1] || model2;
        printComparison(m1, m2);
        break;

      case '3':
        console.log('\nUse cases:');
        console.log('1. general-coding (best overall)');
        console.log('2. fast-inference (quick responses)');
        console.log('3. complex-tasks (hardest problems)');
        console.log('4. resource-constrained (limited memory/CPU)');
        const useCase = await question('\nEnter use case: ');
        const rec = getRecommendation(useCase.trim());
        if (rec) {
          console.log(`\n🎯 Recommendation for ${useCase}:`);
          console.log(`Reason: ${rec.reason}\n`);
          rec.models.forEach(m => {
            const model = MODEL_BENCHMARKS[m];
            console.log(`• ${model.name} (${model.size})`);
            console.log(`  ${model.description}\n`);
          });
        } else {
          console.log('❌ Unknown use case. Try: general-coding, fast-inference, complex-tasks, resource-constrained');
        }
        break;

      case '4':
        console.log('\n📋 Available Models:');
        Object.entries(MODEL_BENCHMARKS).forEach(([key, model]) => {
          console.log(`\n${model.name} (${model.size})`);
          console.log(`  Key: ${key}`);
          console.log(`  HumanEval: ${model.benchmarks.HumanEval}%`);
          console.log(`  MMLU: ${model.benchmarks.MMLU}%`);
        });
        break;

      case '5':
        console.log('\n👋 Goodbye!');
        rl.close();
        return;

      default:
        console.log('❌ Invalid option');
    }

    console.log('\n' + '='.repeat(60) + '\n');
  }
}

// Quick comparison from command line
if (process.argv.length >= 4) {
  const model1 = process.argv[2];
  const model2 = process.argv[3];
  printComparison(model1, model2);
  rl.close();
} else {
  interactiveMode();
}
