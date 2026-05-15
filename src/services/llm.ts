import OpenAI from 'openai';
import { BRAIN } from '../config/brain.config';

function getClient() {
  if (BRAIN.provider === 'openai') {
    return new OpenAI({ apiKey: BRAIN.apiKey });
  }
  if (BRAIN.provider === 'local') {
    return new OpenAI({
      apiKey: BRAIN.apiKey || 'local',
      baseURL: BRAIN.baseURL,
    });
  }
  if (BRAIN.provider === 'anthropic') {
    return new OpenAI({
      apiKey: BRAIN.apiKey,
      baseURL: 'https://api.anthropic.com/v1',
      defaultHeaders: { 'anthropic-version': '2023-06-01' },
    });
  }
  return null;
}

export async function callLLM(prompt: string, schema?: string): Promise<Record<string, any>> {
  if (BRAIN.provider === 'mock') {
    console.log(`[Mock LLM] Prompt received: ${prompt.substring(0, 100)}...`);
    const res = mockResponse(prompt);
    console.log(`[Mock LLM] Returning keys: ${Object.keys(res).join(', ')}`);
    return res;
  }

  const client = getClient();
  if (!client) throw new Error('No valid AI provider configured.');

  const systemMsg = schema
    ? `${BRAIN.systemPrompt}\n\nYou must respond with valid JSON matching this schema:\n${schema}`
    : BRAIN.systemPrompt;

  const response = await client.chat.completions.create({
    model: BRAIN.model,
    messages: [
      { role: 'system', content: systemMsg },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: BRAIN.temperature,
    max_tokens: BRAIN.maxTokens,
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

function mockResponse(prompt: string): Record<string, any> {
  const p = prompt.toLowerCase();

  // 1. Methodology
  if (p.includes('decide') && p.includes('methodology')) {
    return {
      methodology: 'Hybrid',
      confidence: 'High',
      reasoning: 'The project has fixed regulatory requirements (Waterfall) but iterative delivery needs (Agile), making Hybrid the optimal approach.',
      alternativeConsidered: 'Agile',
      whyNotAlternative: 'Compliance requirements demand upfront documentation not suited to pure Agile.'
    };
  }

  // 2. Executive Summary
  if (p.includes('executive summary')) {
    return {
      executiveSummary: 'This project will modernize the organization\'s core systems over 12 months with a $500K investment, delivering measurable efficiency gains of 40%.',
      overview: 'This project will modernize the organization\'s core systems over 12 months with a $500K investment, delivering measurable efficiency gains of 40%.',
      top3NextActions: [
        'Secure final approval of project budget',
        'Initiate recruitment for Technical Architect',
        'Schedule stakeholder kick-off meeting'
      ],
      healthScore: 'Amber',
      healthReasoning: 'Budget is adequate but timeline is aggressive given team size.'
    };
  }

  // 3. Initiation
  if (p.includes('initiation details')) {
    return {
      smartObjectives: [
        'Migrate 100% of legacy HR data to cloud platform by Month 9 with zero data loss',
        'Reduce manual HR processing time by 40% within 3 months of go-live',
        'Achieve 90%+ employee adoption rate within 6 months of launch'
      ],
      stakeholderRegister: [
        { name: 'Sarah Mitchell', role: 'Project Sponsor', department: 'HR', interest: 'High', influence: 'High', engagementStrategy: 'Weekly executive briefings' },
        { name: 'IT Infrastructure Team', role: 'Technical Lead', department: 'IT', interest: 'High', influence: 'High', engagementStrategy: 'Daily standups during migration phases' }
      ],
      successCriteria: [
        'All 3 modules live and operational by end of Month 12',
        'Zero P1 security incidents post-migration',
        'Employee satisfaction score above 7/10 at 90-day post-launch survey'
      ],
      governanceStructure: {
        approvalAuthority: 'Project Sponsor approves changes over $10K or 1 week schedule impact',
        escalationPath: 'PM → Project Sponsor → Executive Committee',
        steeringCommittee: 'Monthly — Sponsor, PM, IT Lead, Finance, Legal'
      }
    };
  }

  // 4. Phases
  if (p.includes('project phases')) {
    return {
      phases: [
        {
          name: 'Phase 1 — Initiation & Discovery',
          description: 'Establish project foundations, complete stakeholder alignment, finalize scope.',
          duration: '4 weeks',
          keyActivities: ['Stakeholder interviews', 'Current state assessment', 'Requirements gathering', 'Vendor evaluation'],
          entryCriteria: 'Project Charter approved by Sponsor',
          exitCriteria: 'Requirements document signed off, vendor selected',
          deliverables: ['Requirements Document', 'Vendor Contract', 'Project Plan v1'],
          owner: 'Project Manager'
        },
        {
          name: 'Phase 2 — Design & Architecture',
          description: 'Define technical architecture, data migration strategy, integration design.',
          duration: '6 weeks',
          keyActivities: ['System architecture design', 'Data mapping', 'Integration specs', 'Security review'],
          entryCriteria: 'Requirements signed off, vendor onboarded',
          exitCriteria: 'Architecture approved by IT Lead and Security',
          deliverables: ['Architecture Document', 'Data Migration Plan', 'Security Assessment'],
          owner: 'IT Lead'
        },
        {
          name: 'Phase 3 — Build & Configure',
          description: 'System configuration, custom development, data migration execution.',
          duration: '12 weeks',
          keyActivities: ['Platform configuration', 'Module development', 'Data cleansing', 'Initial migration'],
          entryCriteria: 'Architecture approved',
          exitCriteria: 'UAT environment ready, all modules configured',
          deliverables: ['Configured System', 'Migrated Data', 'Test Environment'],
          owner: 'IT Lead + Vendor'
        },
        {
          name: 'Phase 4 — Testing & UAT',
          description: 'End-to-end testing, user acceptance testing, defect resolution.',
          duration: '6 weeks',
          keyActivities: ['System integration testing', 'UAT sessions', 'Performance testing', 'Bug fixes'],
          entryCriteria: 'All modules configured, test scripts ready',
          exitCriteria: 'UAT sign-off from HR, zero P1 defects',
          deliverables: ['Test Results Report', 'UAT Sign-off', 'Go-live Checklist'],
          owner: 'Project Manager + HR Team'
        },
        {
          name: 'Phase 5 — Training & Go-Live',
          description: 'User training, cutover execution, post-launch hypercare support.',
          duration: '4 weeks',
          keyActivities: ['Training delivery', 'Cutover plan execution', 'Hypercare support', 'Issue triage'],
          entryCriteria: 'UAT signed off, training materials approved',
          exitCriteria: 'System live, hypercare period complete',
          deliverables: ['Training Materials', 'Go-live Report', 'Hypercare Log'],
          owner: 'Project Manager'
        }
      ]
    };
  }

  // 5. WBS
  if (p.includes('hierarchical wbs')) {
    return {
      wbs: [
        { id: '1', level: 1, task: 'Project Management', description: 'Overall project coordination and governance', duration: '52 weeks', effort: '416 hours', owner: 'Project Manager', dependencies: [] },
        { id: '1.1', level: 2, task: 'Project Planning', description: 'Develop and maintain project plan', duration: '4 weeks', effort: '40 hours', owner: 'Project Manager', dependencies: [] },
        { id: '1.2', level: 2, task: 'Stakeholder Management', description: 'Ongoing stakeholder communication', duration: '52 weeks', effort: '104 hours', owner: 'Project Manager', dependencies: ['1.1'] },
        { id: '2', level: 1, task: 'Requirements & Design', description: 'Discovery, requirements, architecture', duration: '10 weeks', effort: '200 hours', owner: 'IT Lead', dependencies: ['1.1'] },
        { id: '2.1', level: 2, task: 'Requirements Gathering', description: 'Workshops, interviews, documentation', duration: '4 weeks', effort: '80 hours', owner: 'Business Analyst', dependencies: [] },
        { id: '2.2', level: 2, task: 'System Architecture', description: 'Technical design and approval', duration: '6 weeks', effort: '120 hours', owner: 'IT Lead', dependencies: ['2.1'] },
        { id: '3', level: 1, task: 'Build & Configure', description: 'Platform setup, development, migration', duration: '12 weeks', effort: '800 hours', owner: 'IT Lead + Vendor', dependencies: ['2.2'] },
        { id: '4', level: 1, task: 'Testing', description: 'SIT, UAT, performance testing', duration: '6 weeks', effort: '300 hours', owner: 'QA Lead', dependencies: ['3'] },
        { id: '5', level: 1, task: 'Training & Go-Live', description: 'Training delivery and cutover', duration: '4 weeks', effort: '160 hours', owner: 'Project Manager', dependencies: ['4'] }
      ],
      criticalPath: ['2.1', '2.2', '3', '4', '5'],
      totalDuration: '52 weeks',
      totalEffort: '1876 hours'
    };
  }

  // 6. Resources & Budget
  if (p.includes('resource plan') || p.includes('cost breakdown')) {
    return {
      resources: [
        { role: 'Project Manager', count: 1, allocation: '100%', phases: 'All phases', type: 'Internal', estimatedDailyRate: 800, skills: ['PMP', 'Stakeholder Management', 'Risk Management'] },
        { role: 'IT Lead / Architect', count: 1, allocation: '80%', phases: 'Phase 2-4', type: 'Internal', estimatedDailyRate: 900, skills: ['Cloud Architecture', 'Integration', 'Security'] },
        { role: 'Business Analyst', count: 1, allocation: '100%', phases: 'Phase 1-3', type: 'Internal', estimatedDailyRate: 650, skills: ['Requirements', 'Process Mapping', 'UAT'] },
        { role: 'Vendor (CloudHR Solutions)', count: 1, allocation: 'Per contract', phases: 'Phase 2-5', type: 'External', estimatedDailyRate: 0, skills: ['Platform implementation', 'Data migration'] },
        { role: 'Change Manager', count: 1, allocation: '50%', phases: 'Phase 4-5', type: 'Internal', estimatedDailyRate: 700, skills: ['Training delivery', 'Adoption management'] }
      ],
      costBreakdown: [
        { category: 'Labour — Internal', description: 'PM, BA, IT Lead, Change Manager', estimatedCost: 180000, phase: 'All' },
        { category: 'Vendor Fees', description: 'CloudHR implementation + licensing Year 1', estimatedCost: 150000, phase: 'Phase 2-5' },
        { category: 'Infrastructure', description: 'Cloud hosting, security tools, backups', estimatedCost: 40000, phase: 'Phase 3 onwards' },
        { category: 'Software Licences', description: 'Annual SaaS subscriptions', estimatedCost: 60000, phase: 'Phase 5 onwards' },
        { category: 'Training', description: 'Materials, facilitation, LMS', estimatedCost: 20000, phase: 'Phase 5' },
        { category: 'Contingency Reserve (10%)', description: 'Risk buffer', estimatedCost: 50000, phase: 'All' }
      ],
      totalBudget: 500000,
      budgetPhasing: 'Front-loaded — 60% of spend in Phases 2-3 (vendor and build costs)',
      procurementPlan: 'CloudHR Solutions contract to be signed by end of Phase 1. Infrastructure procurement in Phase 2.'
    };
  }

  // 7. Risks & Quality
  if (p.includes('risk register') || p.includes('quality plan')) {
    return {
      risks: [
        { id: 'R001', risk: 'Data migration failure or corruption', category: 'Technical', probability: 4, impact: 5, score: 20, rating: 'Critical', owner: 'IT Lead', mitigation: 'Run 3 parallel test migrations before production cutover. Validate with automated checksums.', contingency: 'Roll back to legacy system. Engage vendor emergency support.', triggers: 'Test migration error rate above 0.1%' },
        { id: 'R002', risk: 'Vendor delivery delays', category: 'External', probability: 3, impact: 4, score: 12, rating: 'High', owner: 'Project Manager', mitigation: 'Contractual SLAs with penalty clauses. Weekly vendor delivery reviews.', contingency: 'Activate secondary vendor or extend timeline with Sponsor approval.', triggers: 'Vendor misses 2 consecutive weekly milestones' },
        { id: 'R003', risk: 'Employee resistance to new system', category: 'Resource', probability: 3, impact: 3, score: 9, rating: 'Medium', owner: 'Change Manager', mitigation: 'Early engagement, champion network, structured training program.', contingency: 'Extend hypercare support period, add 1:1 coaching.', triggers: 'Adoption rate below 50% at 30 days post-launch' },
        { id: 'R004', risk: 'Budget overrun due to scope creep', category: 'Budget', probability: 3, impact: 4, score: 12, rating: 'High', owner: 'Project Manager', mitigation: 'Strict change control process, weekly budget tracking, freeze period before go-live.', contingency: 'De-scope lower-priority features, request contingency drawdown from Sponsor.', triggers: 'Approved changes consume more than 50% of contingency reserve' },
        { id: 'R005', risk: 'Data privacy / compliance breach during migration', category: 'Compliance', probability: 2, impact: 5, score: 10, rating: 'High', owner: 'IT Lead + Legal', mitigation: 'Legal review of data handling processes. Encryption in transit and at rest. Penetration testing.', contingency: 'Halt migration, notify DPO, engage Legal immediately.', triggers: 'Any unauthorised data access detected in test or production environments' }
      ],
      top3CriticalRisks: ['R001', 'R002', 'R004'],
      immediateActions: [
        'R001: Schedule data migration dry run in Month 2 — do not wait for build completion',
        'R002: Finalise vendor contract with SLA penalties before project kick-off',
        'R004: Set up formal Change Control Board in Week 1 with Sponsor'
      ],
      qualityStandards: ['ISO 9001 process documentation', 'OWASP security standards for web application', 'GDPR / PIPEDA compliance for employee data'],
      qualityCheckpoints: [
        { checkpoint: 'Requirements Quality Gate', phase: 'Phase 1 exit', criteria: 'All requirements traceable, signed off by HR and IT' },
        { checkpoint: 'Architecture Review', phase: 'Phase 2 exit', criteria: 'Security assessment passed, architecture approved' },
        { checkpoint: 'Build Quality Gate', phase: 'Phase 3 exit', criteria: 'Unit test coverage >80%, no P1 defects open' },
        { checkpoint: 'UAT Sign-off', phase: 'Phase 4 exit', criteria: 'UAT pass rate >95%, all P1/P2 defects resolved' },
        { checkpoint: 'Go-live Approval', phase: 'Phase 5 entry', criteria: 'Go-live checklist 100% complete, Sponsor approval received' }
      ],
      defectTolerance: 'Zero P1 (critical) defects at go-live. P2 defects must have approved workaround.',
      testingApproach: 'Unit → Integration → System → UAT → Performance → Security (pen test)'
    };
  }

  return { mocked: true, message: 'Mock response — set AI_PROVIDER in .env.local to use a real model.' };
}
