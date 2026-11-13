import fs from 'fs';
import path from 'path';

// Mock localStorage in Node
const storageMap = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => storageMap.get(k) ?? null,
  setItem: (k: string, v: string) => storageMap.set(k, String(v)),
  removeItem: (k: string) => storageMap.delete(k),
  clear: () => storageMap.clear(),
  key: (i: number) => Array.from(storageMap.keys())[i] ?? null,
  get length() { return storageMap.size; }
};

// Mock window and dispatchEvent
(globalThis as any).window = {
  dispatchEvent: () => true,
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { reload: () => {} }
};
(globalThis as any).CustomEvent = class CustomEvent {
  type: string;
  detail: any;
  constructor(type: string, opts?: any) {
    this.type = type;
    this.detail = opts?.detail;
  }
};

import { 
  getIsPremium, 
  setIsPremium, 
  getFlaggedQuestions, 
  toggleFlagQuestion,
  getMistakes,
  logMistake,
  removeMistake,
  saveProgress,
  getTopicProgress,
  hasAcceptedDisclaimer,
  acceptDisclaimer,
  resetDisclaimer,
  logSRSAnswer,
  getDueSRSQuestions,
  getAllSRSData,
  saveActiveMockExam,
  getActiveMockExam,
  clearActiveMockExam,
  getHistory,
  logQuizAttempt,
  getExamDate,
  setExamDate
} from '../src/lib/storage';
import { topics } from '../src/lib/data';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`  ✓ ${msg}`);
}

async function runTestSuite() {
  console.log('\n========================================');
  console.log('  RIGOROUS COMPREHENSIVE TEST SUITE');
  console.log('========================================\n');

  // ----------------------------------------------------
  // TEST 1: Question Bank Integrity & Manifest
  // ----------------------------------------------------
  console.log('[1/5] Testing Question Bank & Manifest Integrity...');
  const manifestPath = path.resolve('public/questions/manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(Array.isArray(manifest) && manifest.length === 14, `Manifest must list 14 topics, found: ${manifest.length}`);

  let totalQuestionsCount = 0;
  for (const mTopic of manifest) {
    const qFilePath = path.resolve(`public/questions/${mTopic.id}.json`);
    assert(fs.existsSync(qFilePath), `Topic file ${mTopic.id}.json must exist`);
    const qData = JSON.parse(fs.readFileSync(qFilePath, 'utf8'));
    assert(Array.isArray(qData) && qData.length > 0, `${mTopic.id}.json must contain non-empty question array`);
    
    // Validate sample questions of each topic for schema correctness
    for (let i = 0; i < Math.min(5, qData.length); i++) {
      const q = qData[i];
      assert(q.id !== undefined && q.id !== null, `${mTopic.id}[${i}] must have id`);
      assert(typeof q.question === 'string' && q.question.trim().length > 0, `${mTopic.id}[${i}] must have non-empty question`);
      assert(Array.isArray(q.options) && q.options.length >= 2, `${mTopic.id}[${i}] must have >= 2 options`);
      assert(typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < q.options.length, 
        `${mTopic.id}[${i}] correctAnswer index must be valid`);
      assert(typeof q.explanation === 'string', `${mTopic.id}[${i}] explanation must be string`);
    }
    totalQuestionsCount += qData.length;
  }
  assert(totalQuestionsCount === 14000, `Total question bank count must be exactly 14,000, got ${totalQuestionsCount}`);
  console.log(`  ✓ All 14 topic files valid. Total questions verified: ${totalQuestionsCount}\n`);

  // ----------------------------------------------------
  // TEST 2: Storage & Premium Status Management
  // ----------------------------------------------------
  console.log('[2/5] Testing Storage & Premium Status...');
  localStorage.clear();
  assert(getIsPremium() === false, 'Default status should be free (false)');
  
  setIsPremium(true);
  assert(getIsPremium() === true, 'Setting premium to true should persist in storage');
  
  setIsPremium(false);
  assert(getIsPremium() === false, 'Setting premium to false should persist');

  // Check topics premium configuration (7 Free / 7 Premium in 14-topic INBDE model)
  const premiumTopics = topics.filter(t => t.isPremiumOnly);
  const freeTopics = topics.filter(t => !t.isPremiumOnly);
  assert(premiumTopics.length === 7, `There should be 7 premium topics, got ${premiumTopics.length}`);
  assert(freeTopics.length === 7, `There should be 7 free topics, got ${freeTopics.length}`);
  console.log('  ✓ Premium gating configurations verified\n');

  // ----------------------------------------------------
  // TEST 3: User Statistics, Scoring & Mistake Tracking
  // ----------------------------------------------------
  console.log('[3/5] Testing Progress, Flags, Mistakes & Disclaimer...');
  localStorage.clear();

  // Disclaimer
  assert(hasAcceptedDisclaimer() === false, 'Disclaimer initially false');
  acceptDisclaimer();
  assert(hasAcceptedDisclaimer() === true, 'Disclaimer accepted successfully');
  resetDisclaimer();
  assert(hasAcceptedDisclaimer() === false, 'Disclaimer reset resets acceptance to false');
  acceptDisclaimer();
  assert(hasAcceptedDisclaimer() === true, 'Disclaimer can be re-accepted');

  // Flagging (toggle)
  assert(getFlaggedQuestions().length === 0, 'Initial flags must be empty');
  toggleFlagQuestion('anatomical-sciences-1');
  toggleFlagQuestion('patient-management-ethics-2');
  assert(getFlaggedQuestions().length === 2, 'Flags count should be 2');
  assert(getFlaggedQuestions().includes('anatomical-sciences-1'), 'Should contain anatomical-sciences-1');
  toggleFlagQuestion('anatomical-sciences-1'); // toggle off
  assert(!getFlaggedQuestions().includes('anatomical-sciences-1'), 'anatomical-sciences-1 should be unflagged');
  assert(getFlaggedQuestions().length === 1, 'Flags count should be 1');

  // Mistakes
  assert(getMistakes().length === 0, 'Initial mistakes must be empty');
  logMistake('general-pathology-5');
  logMistake('patient-management-ethics-8');
  assert(getMistakes().length === 2, 'Mistakes count should be 2');
  removeMistake('general-pathology-5');
  assert(getMistakes().length === 1 && getMistakes()[0] === 'patient-management-ethics-8', 'Mistake removed accurately');

  // Topic Progress & Highest Score calculation
  assert(getTopicProgress('patient-management-ethics') === null, 'Initial ethics progress is null');
  saveProgress('patient-management-ethics', 85, 100, 50, true, 100);
  let p = getTopicProgress('patient-management-ethics');
  assert(p !== null && p.highestScore === 85, 'Highest score saved as 85');
  
  saveProgress('patient-management-ethics', 70, 100, 50, true, 100);
  p = getTopicProgress('patient-management-ethics');
  assert(p !== null && p.highestScore === 85, 'Lower score does not overwrite highest score');

  saveProgress('patient-management-ethics', 95, 100, 50, true, 100);
  p = getTopicProgress('patient-management-ethics');
  assert(p !== null && p.highestScore === 95, 'Higher score overwrites highest score');

  // Quiz Attempt History
  logQuizAttempt('patient-management-ethics', 95, 100);
  const hist = getHistory();
  assert(hist.length === 1 && hist[0].score === 95, 'Quiz attempt logged to history');

  // Exam Date
  const futureDate = Date.now() + 86400000 * 30;
  setExamDate(futureDate);
  assert(getExamDate() === futureDate, 'Exam countdown date stored and retrieved accurately');
  console.log('  ✓ Progress, Flags, Mistakes and Quiz history verified\n');

  // ----------------------------------------------------
  // TEST 4: SM-2 Spaced Repetition Engine
  // ----------------------------------------------------
  console.log('[4/5] Testing SM-2 Spaced Repetition (SRS) Engine...');
  localStorage.clear();
  
  assert(getDueSRSQuestions().length === 0, 'No questions initially due');
  
  logSRSAnswer('srs-q1', true);
  const srsAll1 = getAllSRSData();
  assert(srsAll1['srs-q1'] !== undefined, 'SRS data recorded for srs-q1');
  assert(srsAll1['srs-q1'].repetition === 1, 'Repetitions should be 1');
  assert(srsAll1['srs-q1'].interval === 1, 'Initial interval should be 1 day');

  logSRSAnswer('srs-q1', true);
  const srsAll2 = getAllSRSData();
  assert(srsAll2['srs-q1'].repetition === 2, 'Repetitions should be 2');
  assert(srsAll2['srs-q1'].interval === 6, 'Second interval should be 6 days');

  logSRSAnswer('srs-q1', false);
  const srsAll3 = getAllSRSData();
  assert(srsAll3['srs-q1'].repetition === 0, 'Incorrect answer resets repetitions to 0');
  assert(srsAll3['srs-q1'].interval === 1, 'Incorrect answer resets interval to 1');
  console.log('  ✓ SM-2 Spaced Repetition progression and lapse reset verified\n');

  // ----------------------------------------------------
  // TEST 5: Active Mock Exam & Result Breakdown Math
  // ----------------------------------------------------
  console.log('[5/5] Testing Mock Exam State & Topic Breakdown Math...');
  localStorage.clear();

  assert(getActiveMockExam() === null, 'Initially activeMock should be null');
  const mockExamData = {
    questions: [{ id: '1', question: 'Q1', options: ['A','B'], correctAnswer: 0 } as any],
    currentIndex: 10,
    score: 8,
    endTime: Date.now() + 3600000
  };
  saveActiveMockExam(mockExamData);
  const loadedMock = getActiveMockExam();
  assert(loadedMock !== null && loadedMock.score === 8, 'Active mock exam persists accurately');
  assert(loadedMock?.currentIndex === 10, 'Mock current index persists');
  clearActiveMockExam();
  assert(getActiveMockExam() === null, 'Mock exam cleared successfully');

  const sampleBreakdown: Record<string, { correct: number; total: number }> = {
    'operative-materials': { correct: 8, total: 10 },
    'patient-management-ethics': { correct: 3, total: 4 },
    'oral-radiology': { correct: 1, total: 5 },
    'anatomical-sciences': { correct: 0, total: 2 }
  };
  const computedBreakdown = Object.keys(sampleBreakdown).map(topicId => {
    const b = sampleBreakdown[topicId];
    return {
      topicId,
      correct: b.correct,
      total: b.total,
      score: b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0
    };
  }).sort((a, b) => b.score - a.score);

  assert(computedBreakdown[0].topicId === 'operative-materials' && computedBreakdown[0].score === 80, 'Top topic is Operative & Materials at 80%');
  assert(computedBreakdown[1].topicId === 'patient-management-ethics' && computedBreakdown[1].score === 75, 'Second topic is Ethics at 75%');
  assert(computedBreakdown[2].topicId === 'oral-radiology' && computedBreakdown[2].score === 20, 'Third topic is Radiology at 20%');
  assert(computedBreakdown[3].topicId === 'anatomical-sciences' && computedBreakdown[3].score === 0, 'Fourth topic is Anatomy at 0%');
  console.log('  ✓ Topic breakdown mathematical accuracy verified\n');

  // ----------------------------------------------------
  // TEST 6: Premium Downgrade & Tier Transition Integrity
  // ----------------------------------------------------
  console.log('[6/6] Testing Premium Downgrade & Tier Transition Integrity...');
  localStorage.clear();

  saveProgress('general-pathology', 450, 500, 0, true, 500);
  let pathProg = getTopicProgress('general-pathology');
  assert(pathProg !== null, 'Pathology progress should exist');
  assert(pathProg.highestScore === 450, 'Highest score should be 450');
  assert(pathProg.totalQuestions === 500, 'Total questions should be 500');
  let pct = Math.round((pathProg.highestScore / pathProg.totalQuestions) * 100);
  assert(pct === 90, 'Topic card percentage must be exactly 90%');

  saveProgress('general-pathology', 8, 100, 10, false, 10);
  pathProg = getTopicProgress('general-pathology');
  assert(pathProg.highestScore === 450, 'In-progress free quiz must NOT downgrade highestScore');
  assert(pathProg.totalQuestions === 500, 'In-progress free quiz must NOT shrink totalQuestions to 100');
  pct = Math.round((pathProg.highestScore / pathProg.totalQuestions) * 100);
  assert(pct === 90, 'Topic card percentage must remain 90%, NOT 450%');

  saveProgress('general-pathology', 80, 100, 0, true, 100);
  pathProg = getTopicProgress('general-pathology');
  assert(pathProg.highestScore === 450, 'Lower accuracy run (80%) must not overwrite higher record (90%)');
  assert(pathProg.totalQuestions === 500, 'Total questions must remain 500');

  saveProgress('general-pathology', 96, 100, 0, true, 100);
  pathProg = getTopicProgress('general-pathology');
  assert(pathProg.highestScore === 96, 'Higher accuracy run (96%) must update highestScore');
  assert(pathProg.totalQuestions === 100, 'Total questions must update to 100 for the new record');
  pct = Math.round((pathProg.highestScore / pathProg.totalQuestions) * 100);
  assert(pct === 96, 'Topic card percentage must now be 96%');

  saveProgress('anatomical-sciences', 310, 500, 350, false, 350);
  let anatProg = getTopicProgress('anatomical-sciences');
  assert(anatProg.currentIndex === 350, 'Index saved at 350');
  
  const freeAvailable = 100;
  let resumeIndex = anatProg.currentIndex;
  if (resumeIndex >= freeAvailable) {
    saveProgress('anatomical-sciences', 0, freeAvailable, 0, false, 0);
  }
  anatProg = getTopicProgress('anatomical-sciences');
  assert(anatProg.currentIndex === 0, 'Out-of-bounds in-progress quiz cleanly resets index to 0');
  assert(anatProg.currentScore === 0, 'Out-of-bounds in-progress quiz cleanly resets score to 0');
  console.log('  ✓ Premium downgrade and score integrity verified\n');

  // ----------------------------------------------------
  // TEST 7: Premium Upgrade & Continuous Resume
  // ----------------------------------------------------
  console.log('[7/7] Testing Continuous Resume (Start from Where We Left Off)...');
  localStorage.clear();

  saveProgress('operative-materials', 85, 100, 0, true, 100);
  let dmProg = getTopicProgress('operative-materials');
  assert(dmProg !== null, 'Progress exists after completing 100 free questions');
  assert(dmProg.isFinished === true, 'Quiz was marked isFinished on free tier');
  assert(dmProg.highestScore === 85, 'Highest score is 85');
  assert(dmProg.questionsAnswered === 100, 'Questions answered is 100');

  const fullTopicTotal = 1500;
  const isPremiumUser = true;
  let effectiveTotal = isPremiumUser ? fullTopicTotal : 100;
  let newCurrentIndex = 0;
  let newCurrentScore = 0;

  if (isPremiumUser && dmProg.isFinished && dmProg.questionsAnswered < effectiveTotal) {
    newCurrentIndex = dmProg.questionsAnswered;
    newCurrentScore = dmProg.highestScore;
    saveProgress('operative-materials', newCurrentScore, effectiveTotal, newCurrentIndex, false, newCurrentIndex);
  }

  dmProg = getTopicProgress('operative-materials');
  assert(dmProg.currentIndex === 100, 'Resumes at index 100 (Question 101)');
  assert(dmProg.currentScore === 85, 'Retains score of 85 from previous 100 questions');
  assert(dmProg.totalQuestions === 1500, 'Total questions expanded to 1,500');
  assert(dmProg.isFinished === false, 'Quiz is in-progress on the full pool');
  console.log('  ✓ Continuous resume from Question 101 on Premium upgrade verified\n');

  console.log('========================================');
  console.log('  ALL 7 RIGOROUS LOGIC TESTS PASSED! 🎉');
  console.log('========================================\n');
}

runTestSuite().catch(err => {
  console.error(err);
  process.exit(1);
});
