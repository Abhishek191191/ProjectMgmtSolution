"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Brain, LayoutDashboard, FileText,
  Users, Target, ListChecks, ShieldAlert, BarChart3, Download,
  CheckCircle2, AlertTriangle, Plus, Trash2,
  Calendar
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts';

import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

import {
  ProjectCharter, ProjectLifecycle, StakeholderCharter, RiskCharter
} from "../types";

// --- UI Components ---

const Card = ({ title, children, className = "" }: { title?: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#1a1d27] border border-white/10 rounded-xl shadow-xl overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-4 border-b border-white/10 bg-white/5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const Badge = ({ children, color = "indigo" }: { children: React.ReactNode, color?: string }) => {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    red: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.indigo}`}>
      {children}
    </span>
  );
};

// --- Main Application ---

export default function Home() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [lifecycle, setLifecycle] = useState<ProjectLifecycle | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  const [charter, setCharter] = useState<ProjectCharter>({
    title: "",
    organizationName: "",
    industry: "Technology",
    projectType: "IT Implementation",
    description: "",
    businessProblem: "",
    expectedOutcomes: "",
    objectives: [""],
    sponsorName: "",
    sponsorRole: "",
    projectManagerName: "",
    stakeholders: [{ name: "", department: "", interest: "Medium" }],
    inScope: [""],
    outOfScope: [""],
    keyDeliverables: [""],
    totalBudget: 0,
    currency: "USD",
    deadline: "",
    teamSize: 1,
    constraints: "",
    assumptions: "",
    knownRisks: [{ description: "", initialImpact: "Medium" }],
    regulatoryRequirements: false,
    externalVendorDependency: false,
    previousSimilarProject: false,
    preferredMethodology: "Let AI Decide",
    reportingFrequency: "Weekly",
  });

  const handleInputChange = (field: keyof ProjectCharter, value: string | number | boolean | string[] | StakeholderCharter[] | RiskCharter[]) => {
    setCharter(prev => ({ ...prev, [field]: value }));
  };

  const handleListChange = (field: "objectives" | "inScope" | "outOfScope" | "keyDeliverables", index: number, value: string) => {
    const newList = [...charter[field]];
    newList[index] = value;
    setCharter(prev => ({ ...prev, [field]: newList }));
  };

  const addListItem = (field: "objectives" | "inScope" | "outOfScope" | "keyDeliverables") => {
    setCharter(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field: "objectives" | "inScope" | "outOfScope" | "keyDeliverables", index: number) => {
    if (charter[field].length <= 1) return;
    const newList = [...charter[field]];
    newList.splice(index, 1);
    setCharter(prev => ({ ...prev, [field]: newList }));
  };

  const handleStakeholderChange = (index: number, field: keyof StakeholderCharter, value: string | number | boolean | string[] | StakeholderCharter[] | RiskCharter[]) => {
    const newStakeholders = [...charter.stakeholders];
    newStakeholders[index] = { ...newStakeholders[index], [field]: value };
    setCharter(prev => ({ ...prev, stakeholders: newStakeholders }));
  };

  const handleRiskChange = (index: number, field: keyof RiskCharter, value: string | number | boolean | string[] | StakeholderCharter[] | RiskCharter[]) => {
    const newRisks = [...charter.knownRisks];
    newRisks[index] = { ...newRisks[index], [field]: value };
    setCharter(prev => ({ ...prev, knownRisks: newRisks }));
  };

  const generatePlan = async () => {
    setLoading(true);
    setGenerationStatus("Analyzing project complexity...");

    try {
      // Simulate status updates
      const statuses = [
        "Determining optimal methodology...",
        "Drafting executive summary...",
        "Aligning stakeholder strategies...",
        "Building project phases...",
        "Calculating Work Breakdown Structure...",
        "Allocating resources and budget...",
        "Evaluating risks and quality gates...",
        "Finalizing project lifecycle..."
      ];

      let statusIdx = 0;
      const statusInterval = setInterval(() => {
        if (statusIdx < statuses.length) {
          setGenerationStatus(statuses[statusIdx]);
          statusIdx++;
        } else {
          clearInterval(statusInterval);
        }
      }, 1500);

      const response = await fetch("/api/generate-lifecycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ charter }),
      });

      if (!response.ok) throw new Error("Failed to generate plan");

      const data = await response.json();
      setLifecycle(data);
      clearInterval(statusInterval);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const exportWord = async () => {
    if (!lifecycle) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Project Intelligence Report",
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Project: ${charter.title}`,
                  bold: true,
                  size: 28,
                }),
              ],
              spacing: { before: 400, after: 200 },
            }),
            new Paragraph({
              text: `Organization: ${charter.organizationName}`,
              spacing: { after: 400 },
            }),

            // Methodology
            new Paragraph({ text: "1. Methodology", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
              children: [
                new TextRun({ text: "Selected Approach: ", bold: true }),
                new TextRun(lifecycle.methodology.methodology),
              ],
              spacing: { before: 200 },
            }),
            new Paragraph({
              text: lifecycle.methodology.reasoning,
              spacing: { before: 100, after: 400 },
            }),

            // Executive Summary
            new Paragraph({ text: "2. Executive Summary", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({
              text: lifecycle.executiveSummary.overview,
              spacing: { before: 200, after: 400 },
            }),

            // Initiation - Stakeholders Table
            new Paragraph({ text: "3. Stakeholder Register", heading: HeadingLevel.HEADING_1 }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: ["Stakeholder", "Role", "Influence", "Strategy"].map(
                    (h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })
                  ),
                }),
                ...lifecycle.initiation.stakeholderRegister.map(
                  (s) =>
                    new TableRow({
                      children: [s.name, s.role, s.influence, s.engagementStrategy].map(
                        (val) => new TableCell({ children: [new Paragraph({ text: val })] })
                      ),
                    })
                ),
              ],
            }),

            // WBS Table
            new Paragraph({ text: "4. Work Breakdown Structure (WBS)", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: ["ID", "Task", "Duration", "Owner"].map(
                    (h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })
                  ),
                }),
                ...lifecycle.wbs.items.map(
                  (item) =>
                    new TableRow({
                      children: [item.id, item.task, item.duration, item.owner].map(
                        (val) => new TableCell({ children: [new Paragraph({ text: val })] })
                      ),
                    })
                ),
              ],
            }),

            // Risks Table
            new Paragraph({ text: "5. Risk Register", heading: HeadingLevel.HEADING_1, spacing: { before: 400 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: ["ID", "Risk", "Rating", "Mitigation"].map(
                    (h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })] })
                  ),
                }),
                ...lifecycle.risks.register.map(
                  (r) =>
                    new TableRow({
                      children: [r.id, r.risk, r.rating, r.mitigation].map(
                        (val) => new TableCell({ children: [new Paragraph({ text: val })] })
                      ),
                    })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${charter.title.replace(/\s+/g, "_")}_Project_Plan.docx`);
  };

  const exportExcel = () => {
    if (!lifecycle) return;
    const wb = XLSX.utils.book_new();

    // WBS Sheet
    const wbsData = lifecycle.wbs.items.map(item => ({
      ID: item.id,
      Level: item.level,
      Task: item.task,
      Duration: item.duration,
      Effort: item.effort,
      Owner: item.owner,
      Dependencies: item.dependencies.join(', ')
    }));
    const wsWbs = XLSX.utils.json_to_sheet(wbsData);
    XLSX.utils.book_append_sheet(wb, wsWbs, "WBS");

    // Risks Sheet
    const riskData = lifecycle.risks.register.map(risk => ({
      ID: risk.id,
      Risk: risk.risk,
      Category: risk.category,
      Probability: risk.probability,
      Impact: risk.impact,
      Score: risk.score,
      Rating: risk.rating,
      Owner: risk.owner,
      Mitigation: risk.mitigation
    }));
    const wsRisks = XLSX.utils.json_to_sheet(riskData);
    XLSX.utils.book_append_sheet(wb, wsRisks, "Risk Register");

    // Budget Sheet
    const budgetData = lifecycle.costs.breakdown.map(item => ({
      Category: item.category,
      Description: item.description,
      'Estimated Cost': item.estimatedCost,
      Phase: item.phase
    }));
    const wsBudget = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, wsBudget, "Budget");

    XLSX.writeFile(wb, `${charter.title.replace(/\s+/g, '_')}_Plan.xlsx`);
  };

  // --- Render Functions ---

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Project Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud ERP Migration"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.organizationName}
                  onChange={(e) => handleInputChange("organizationName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                <select
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                >
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Construction">Construction</option>
                  <option value="Government">Government</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Type</label>
                <select
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.projectType}
                  onChange={(e) => handleInputChange("projectType", e.target.value)}
                >
                  <option value="New Product Development">New Product Development</option>
                  <option value="IT Implementation">IT Implementation</option>
                  <option value="Process Improvement">Process Improvement</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Research">Research</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Project Brief</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Description</label>
                <textarea
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white h-32"
                  placeholder="Describe what you want to achieve..."
                  value={charter.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Business Problem Being Solved</label>
                <textarea
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white h-24"
                  placeholder="What pain point is this project addressing?"
                  value={charter.businessProblem}
                  onChange={(e) => handleInputChange("businessProblem", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Objectives</label>
                {charter.objectives.map((obj, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                      placeholder={`Objective ${idx + 1}`}
                      value={obj}
                      onChange={(e) => handleListChange("objectives", idx, e.target.value)}
                    />
                    <button onClick={() => removeListItem("objectives", idx)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button onClick={() => addListItem("objectives")} className="mt-2 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
                  <Plus size={16}/> Add Objective
                </button>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">People</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Sponsor</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white mb-2"
                  value={charter.sponsorName}
                  onChange={(e) => handleInputChange("sponsorName", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Role"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.sponsorRole}
                  onChange={(e) => handleInputChange("sponsorRole", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Manager</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.projectManagerName}
                  onChange={(e) => handleInputChange("projectManagerName", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-8">
              <label className="block text-sm font-medium text-slate-400 mb-4">Key Stakeholders</label>
              {charter.stakeholders.map((s, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-white/5 rounded-lg bg-white/2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                    value={s.name}
                    onChange={(e) => handleStakeholderChange(idx, "name", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    className="p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                    value={s.department}
                    onChange={(e) => handleStakeholderChange(idx, "department", e.target.value)}
                  />
                  <select
                    className="p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                    value={s.interest}
                    onChange={(e) => handleStakeholderChange(idx, "interest", e.target.value)}
                  >
                    <option value="High">High Interest</option>
                    <option value="Medium">Medium Interest</option>
                    <option value="Low">Low Interest</option>
                  </select>
                </div>
              ))}
              <button
                onClick={() => setCharter(prev => ({ ...prev, stakeholders: [...prev.stakeholders, { name: "", department: "", interest: "Medium" }] }))}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                <Plus size={16}/> Add Stakeholder
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Scope</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-emerald-400 mb-4">In-Scope Items</label>
                {charter.inScope.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                      value={item}
                      onChange={(e) => handleListChange("inScope", idx, e.target.value)}
                    />
                    <button onClick={() => removeListItem("inScope", idx)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button onClick={() => addListItem("inScope")} className="mt-2 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">
                  <Plus size={16}/> Add In-Scope
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-rose-400 mb-4">Out-of-Scope Items</label>
                {charter.outOfScope.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                      value={item}
                      onChange={(e) => handleListChange("outOfScope", idx, e.target.value)}
                    />
                    <button onClick={() => removeListItem("outOfScope", idx)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button onClick={() => addListItem("outOfScope")} className="mt-2 flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300">
                  <Plus size={16}/> Add Out-of-Scope
                </button>
              </div>
            </div>
            <div className="mt-8">
              <label className="block text-sm font-medium text-indigo-400 mb-4">Key Deliverables</label>
              {charter.keyDeliverables.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                    value={item}
                    onChange={(e) => handleListChange("keyDeliverables", idx, e.target.value)}
                  />
                  <button onClick={() => removeListItem("keyDeliverables", idx)} className="p-2 text-slate-500 hover:text-rose-500"><Trash2 size={20}/></button>
                </div>
              ))}
              <button onClick={() => addListItem("keyDeliverables")} className="mt-2 flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300">
                <Plus size={16}/> Add Deliverable
              </button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Constraints & Budget</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Total Budget</label>
                <div className="flex gap-2">
                  <select
                    className="p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white w-24"
                    value={charter.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                  >
                    <option>USD</option>
                    <option>CAD</option>
                    <option>GBP</option>
                    <option>EUR</option>
                  </select>
                  <input
                    type="number"
                    className="flex-1 p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                    value={charter.totalBudget}
                    onChange={(e) => handleInputChange("totalBudget", Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Target Deadline</label>
                <input
                  type="date"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.deadline}
                  onChange={(e) => handleInputChange("deadline", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Core Team Size</label>
                <input
                  type="number"
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.teamSize}
                  onChange={(e) => handleInputChange("teamSize", Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Known Constraints</label>
                <textarea
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white h-32"
                  placeholder="Technical, time, or resource constraints..."
                  value={charter.constraints}
                  onChange={(e) => handleInputChange("constraints", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Key Assumptions</label>
                <textarea
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white h-32"
                  placeholder="What are we assuming to be true?"
                  value={charter.assumptions}
                  onChange={(e) => handleInputChange("assumptions", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Risks & Compliance</h2>
            <div className="space-y-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Initial Risk Assessment</label>
              {charter.knownRisks.map((risk, idx) => (
                <div key={idx} className="flex gap-4 mb-4 items-start">
                  <input
                    type="text"
                    className="flex-1 p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                    placeholder="Risk description"
                    value={risk.description}
                    onChange={(e) => handleRiskChange(idx, "description", e.target.value)}
                  />
                  <select
                    className="p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white w-32"
                    value={risk.initialImpact}
                    onChange={(e) => handleRiskChange(idx, "initialImpact", e.target.value)}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              ))}
              <button
                onClick={() => setCharter(prev => ({ ...prev, knownRisks: [...prev.knownRisks, { description: "", initialImpact: "Medium" }] }))}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                <Plus size={16}/> Add Risk
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Regulatory Requirements?</span>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-indigo-500"
                    checked={charter.regulatoryRequirements}
                    onChange={(e) => handleInputChange("regulatoryRequirements", e.target.checked)}
                  />
                </div>
                {charter.regulatoryRequirements && (
                  <input
                    type="text"
                    placeholder="Which regulations? (e.g. GDPR, HIPAA)"
                    className="w-full p-2 bg-[#1a1d27] border border-white/10 rounded-lg text-white text-sm"
                    value={charter.regulatoryExplanation}
                    onChange={(e) => handleInputChange("regulatoryExplanation", e.target.value)}
                  />
                )}
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/2 flex items-center justify-between">
                <span className="text-white font-medium">Dependent on External Vendors?</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-indigo-500"
                  checked={charter.externalVendorDependency}
                  onChange={(e) => handleInputChange("externalVendorDependency", e.target.checked)}
                />
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/2 flex items-center justify-between">
                <span className="text-white font-medium">Has a similar project been done?</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-indigo-500"
                  checked={charter.previousSimilarProject}
                  onChange={(e) => handleInputChange("previousSimilarProject", e.target.checked)}
                />
              </div>
            </div>
          </motion.div>
        );
      case 7:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Preferred Methodology</label>
                <select
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.preferredMethodology}
                  onChange={(e) => handleInputChange("preferredMethodology", e.target.value)}
                >
                  <option value="Let AI Decide">Let AI Decide (Recommended)</option>
                  <option value="Agile">Agile</option>
                  <option value="Waterfall">Waterfall</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="PRINCE2">PRINCE2</option>
                  <option value="SAFe">SAFe</option>
                </select>
                <p className="mt-2 text-xs text-slate-500">Choosing &quot;Let AI Decide&quot; allows the engine to pick based on project complexity and industry.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Reporting Frequency</label>
                <select
                  className="w-full p-3 bg-[#1a1d27] border border-white/10 rounded-lg text-white"
                  value={charter.reportingFrequency}
                  onChange={(e) => handleInputChange("reportingFrequency", e.target.value)}
                >
                  <option value="Weekly">Weekly Status Reports</option>
                  <option value="Bi-weekly">Bi-weekly Status Reports</option>
                  <option value="Monthly">Monthly Steering Committee</option>
                </select>
              </div>
            </div>

            <div className="mt-12 p-8 border border-indigo-500/20 bg-indigo-500/5 rounded-2xl text-center">
              <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ready to Build Your Intelligence?</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Click below to generate a deep, AI-powered project lifecycle plan based on your professional inputs.</p>

              <button
                onClick={generatePlan}
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Generate Project Plan
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const renderDashboard = () => {
    if (!lifecycle) return null;

    const navItems = [
      { id: "summary", label: "Executive Summary", icon: LayoutDashboard },
      { id: "initiation", label: "Initiation", icon: FileText },
      { id: "planning", label: "Planning", icon: Target },
      { id: "wbs", label: "WBS", icon: ListChecks },
      { id: "resources", label: "Resources & Budget", icon: Users },
      { id: "risks", label: "Risk Register", icon: ShieldAlert },
      { id: "quality", label: "Quality Plan", icon: BarChart3 },
      { id: "gantt", label: "Gantt Chart", icon: Calendar },
    ];

    return (
      <div className="flex flex-col lg:flex-row gap-8 animate-fade-in min-h-screen pb-20">
        {/* Sidebar Nav */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "summary" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Health Status</p>
                      <div className="flex justify-center mt-2">
                        <Badge color={lifecycle.executiveSummary.healthScore.toLowerCase() === 'green' ? 'green' : lifecycle.executiveSummary.healthScore.toLowerCase() === 'amber' ? 'amber' : 'red'}>
                          {lifecycle.executiveSummary.healthScore}
                        </Badge>
                      </div>
                    </Card>
                    <Card className="text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-2xl font-bold text-white mt-1">{charter.currency} {charter.totalBudget.toLocaleString()}</p>
                    </Card>
                    <Card className="text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Methodology</p>
                      <p className="text-xl font-bold text-indigo-400 mt-1">{lifecycle.methodology.methodology}</p>
                    </Card>
                    <Card className="text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                      <p className="text-xl font-bold text-emerald-400 mt-1">{lifecycle.methodology.confidence}</p>
                    </Card>
                  </div>

                  <Card title="Executive Overview">
                    <div className="flex gap-4">
                       <div className="w-1 bg-indigo-500 rounded-full" />
                       <p className="text-slate-300 leading-relaxed italic">&quot;{lifecycle.executiveSummary.overview}&quot;</p>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Immediate Actions">
                      <ul className="space-y-4">
                        {lifecycle.executiveSummary.nextActions.map((action, i) => (
                          <li key={i} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                              {i+1}
                            </div>
                            <span className="text-sm text-slate-300">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                    <Card title="Methodology Insight">
                       <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-500" size={18} />
                            <span className="text-sm font-semibold text-white">Why {lifecycle.methodology.methodology}?</span>
                         </div>
                         <p className="text-sm text-slate-400 leading-relaxed">{lifecycle.methodology.reasoning}</p>
                         <div className="pt-4 border-t border-white/5">
                            <p className="text-xs text-slate-500 font-medium">ALTERNATIVE CONSIDERED: <span className="text-slate-300">{lifecycle.methodology.alternativeConsidered}</span></p>
                            <p className="text-xs text-slate-500 mt-1">DISCARDED BECAUSE: <span className="text-slate-300">{lifecycle.methodology.whyNotAlternative}</span></p>
                         </div>
                       </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "initiation" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card title="SMART Objectives">
                      <div className="space-y-4">
                        {lifecycle.initiation.smartObjectives.map((obj, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/2 border border-white/5">
                            <CheckCircle2 className="text-indigo-500 mt-1 shrink-0" size={18} />
                            <p className="text-sm text-slate-300">{obj}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card title="Success Criteria (KPIs)">
                      <div className="space-y-4">
                        {lifecycle.initiation.successCriteria.map((crit, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/2 border border-white/5">
                            <Target className="text-emerald-500 mt-1 shrink-0" size={18} />
                            <p className="text-sm text-slate-300">{crit}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  <Card title="Stakeholder Engagement Register">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Name & Role</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Department</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Interest</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Influence</th>
                            <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Engagement Strategy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {lifecycle.initiation.stakeholderRegister.map((s, i) => (
                            <tr key={i}>
                              <td className="px-4 py-4">
                                <div className="font-medium text-white">{s.name}</div>
                                <div className="text-xs text-slate-500">{s.role}</div>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-300">{s.department}</td>
                              <td className="px-4 py-4"><Badge color={s.interest.toLowerCase() === 'high' ? 'amber' : 'blue'}>{s.interest}</Badge></td>
                              <td className="px-4 py-4"><Badge color={s.influence.toLowerCase() === 'high' ? 'amber' : 'blue'}>{s.influence}</Badge></td>
                              <td className="px-4 py-4 text-sm text-slate-400">{s.engagementStrategy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  <Card title="Governance Structure">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="space-y-2">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Approval Authority</h4>
                         <p className="text-sm text-slate-300 leading-relaxed">{lifecycle.initiation.governanceStructure.approvalAuthority}</p>
                       </div>
                       <div className="space-y-2">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Escalation Path</h4>
                         <p className="text-sm text-slate-300 leading-relaxed">{lifecycle.initiation.governanceStructure.escalationPath}</p>
                       </div>
                       <div className="space-y-2">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Steering Committee</h4>
                         <p className="text-sm text-slate-300 leading-relaxed">{lifecycle.initiation.governanceStructure.steeringCommittee}</p>
                       </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "planning" && (
                <div className="space-y-8">
                   <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <ListChecks className="text-indigo-500" />
                      Project Phases
                    </h3>
                    <div className="space-y-4">
                      {lifecycle.phases.map((phase, i) => (
                        <Card key={i} className="hover:border-indigo-500/30 transition-colors">
                           <div className="flex flex-col md:flex-row gap-6">
                             <div className="md:w-64 shrink-0">
                               <div className="flex items-center gap-3 mb-2">
                                 <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                   {i+1}
                                 </div>
                                 <h4 className="font-bold text-white">{phase.name}</h4>
                               </div>
                               <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                 <ChevronRight size={14} className="text-indigo-500" />
                                 Duration: {phase.duration}
                               </div>
                               <Badge color="blue">Owner: {phase.owner}</Badge>
                             </div>
                             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                 <p className="text-sm text-slate-400 mb-4">{phase.description}</p>
                                 <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Key Activities</h5>
                                 <ul className="space-y-1">
                                   {phase.keyActivities.map((act, j) => (
                                     <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                                       <span className="text-indigo-500 font-bold">•</span> {act}
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                               <div className="space-y-4">
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Deliverables</h5>
                                    <p className="text-xs text-slate-400">{phase.deliverables.join(', ')}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h5 className="text-xs font-bold text-slate-500 uppercase mb-1 text-emerald-500/70">Entry Criteria</h5>
                                      <p className="text-[10px] text-slate-500 leading-tight">{phase.entryCriteria}</p>
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-bold text-slate-500 uppercase mb-1 text-rose-500/70">Exit Criteria</h5>
                                      <p className="text-[10px] text-slate-500 leading-tight">{phase.exitCriteria}</p>
                                    </div>
                                  </div>
                               </div>
                             </div>
                           </div>
                        </Card>
                      ))}
                    </div>
                   </div>
                </div>
              )}

              {activeTab === "wbs" && (
                <div className="space-y-8">
                  <Card title="Work Breakdown Structure">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-20">ID</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Task Name</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Owner</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Duration</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Effort</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Critical Path</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {lifecycle.wbs.items.map((item, i) => (
                              <tr key={i} className={`hover:bg-white/[0.02] ${item.level === 1 ? 'font-bold' : ''}`}>
                                <td className="px-4 py-4 text-xs text-slate-500">{item.id}</td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    {Array.from({ length: item.level - 1 }).map((_, l) => (
                                      <div key={l} className="w-4" />
                                    ))}
                                    <span className={item.level === 1 ? "text-white" : "text-slate-300 text-sm"}>{item.task}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-xs text-slate-400">{item.owner}</td>
                                <td className="px-4 py-4 text-xs text-slate-400">{item.duration}</td>
                                <td className="px-4 py-4 text-xs text-slate-400">{item.effort}</td>
                                <td className="px-4 py-4">
                                  {lifecycle.wbs.criticalPath.includes(item.id) && (
                                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Project Duration</p>
                        <div className="text-4xl font-black text-indigo-500">{lifecycle.wbs.totalDuration}</div>
                     </Card>
                     <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Estimated Effort</p>
                        <div className="text-4xl font-black text-emerald-500">{lifecycle.wbs.totalEffort}</div>
                     </Card>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card title="Resource Allocation Plan">
                         <div className="space-y-4">
                           {lifecycle.resources.map((res, i) => (
                             <div key={i} className="p-4 rounded-xl bg-white/2 border border-white/5 flex justify-between items-center">
                               <div>
                                 <h4 className="font-bold text-white text-sm">{res.role}</h4>
                                 <p className="text-xs text-slate-500 mt-1">{res.skills.slice(0, 3).join(', ')}</p>
                                 <div className="flex gap-2 mt-2">
                                   <Badge color="indigo">{res.type}</Badge>
                                   <Badge color="blue">{res.allocation} allocation</Badge>
                                 </div>
                               </div>
                               <div className="text-right">
                                 <div className="text-xl font-bold text-white">x{res.count}</div>
                                 <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Personnel</div>
                               </div>
                             </div>
                           ))}
                         </div>
                      </Card>
                      <Card title="Budget Allocation by Category">
                         <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={lifecycle.costs.breakdown}
                                  dataKey="estimatedCost"
                                  nameKey="category"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                >
                                  {lifecycle.costs.breakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                  ))}
                                </Pie>
                                <RechartsTooltip
                                  contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                  itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                              </PieChart>
                            </ResponsiveContainer>
                         </div>
                      </Card>
                   </div>

                   <Card title="Detailed Cost Breakdown">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Category</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Description</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Phase</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase text-right">Estimated Cost</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {lifecycle.costs.breakdown.map((item, i) => (
                              <tr key={i}>
                                <td className="px-4 py-4 text-sm font-medium text-white">{item.category}</td>
                                <td className="px-4 py-4 text-sm text-slate-400">{item.description}</td>
                                <td className="px-4 py-4 text-sm text-slate-400">{item.phase}</td>
                                <td className="px-4 py-4 text-sm text-white font-bold text-right">{charter.currency} {item.estimatedCost.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="bg-white/5">
                               <td colSpan={3} className="px-4 py-4 text-sm font-bold text-white uppercase text-right">Total Project Budget</td>
                               <td className="px-4 py-4 text-lg font-black text-indigo-500 text-right">{charter.currency} {lifecycle.costs.totalBudget.toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                   </Card>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card title="Budget Phasing Strategy">
                        <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{lifecycle.costs.budgetPhasing}&quot;</p>
                     </Card>
                     <Card title="Procurement Plan">
                        <p className="text-sm text-slate-300 leading-relaxed italic">&quot;{lifecycle.costs.procurementPlan}&quot;</p>
                     </Card>
                   </div>
                </div>
              )}

              {activeTab === "risks" && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <Card className="lg:col-span-2" title="Risk Heatmap (Probability vs Impact)">
                        <div className="p-4">
                          <div className="relative aspect-square md:aspect-video w-full border-l-2 border-b-2 border-slate-700">
                             {/* Heatmap zones */}
                             <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                               {Array.from({ length: 25 }).map((_, i) => {
                                 const r = Math.floor(i / 5); // 0 (top) to 4 (bottom) -> Impact 5 to 1
                                 const c = i % 5; // 0 (left) to 4 (right) -> Prob 1 to 5
                                 const prob = c + 1;
                                 const impact = 5 - r;
                                 const score = prob * impact;
                                 let color = "bg-emerald-500/10";
                                 if (score >= 15) color = "bg-rose-500/20";
                                 else if (score >= 8) color = "bg-amber-500/10";

                                 return <div key={i} className={`border border-white/5 ${color}`} />;
                               })}
                             </div>

                             {/* Risk points */}
                             {lifecycle.risks.register.map((risk, i) => (
                               <div
                                 key={i}
                                 className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[8px] font-bold text-white cursor-help group transition-transform hover:scale-150 z-10 ${
                                   risk.score >= 15 ? "bg-rose-500" : risk.score >= 8 ? "bg-amber-500" : "bg-emerald-500"
                                 }`}
                                 style={{
                                   left: `${(risk.probability - 1) * 20 + 10}%`,
                                   bottom: `${(risk.impact - 1) * 20 + 10}%`,
                                   transform: 'translate(-50%, 50%)'
                                 }}
                               >
                                 {risk.id.replace(/\D/g, '') || i+1}
                                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#0f1117] border border-white/10 rounded shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                                   <p className="text-[10px] text-white font-bold mb-1">{risk.risk}</p>
                                   <div className="flex justify-between text-[8px] text-slate-500">
                                     <span>Score: {risk.score}</span>
                                     <span>Owner: {risk.owner}</span>
                                   </div>
                                 </div>
                               </div>
                             ))}

                             {/* Labels */}
                             <div className="absolute -left-10 top-1/2 -rotate-90 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Impact</div>
                             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Probability</div>
                          </div>
                        </div>
                      </Card>
                      <Card title="Critical Risk Mitigation">
                        <div className="space-y-4">
                           {lifecycle.risks.immediateActions.map((action, i) => (
                             <div key={i} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex gap-3">
                               <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                               <p className="text-xs text-slate-300 leading-relaxed font-medium">{action}</p>
                             </div>
                           ))}
                        </div>
                      </Card>
                   </div>

                   <Card title="Complete Risk Register">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">ID</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Risk Description</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Category</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">P×I</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Score</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Rating</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Mitigation Strategy</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {lifecycle.risks.register.sort((a,b) => b.score - a.score).map((risk, i) => (
                              <tr key={i} className="hover:bg-white/[0.02]">
                                <td className="px-4 py-4 text-xs text-slate-500">{risk.id}</td>
                                <td className="px-4 py-4">
                                  <div className="text-sm font-medium text-white">{risk.risk}</div>
                                  <div className="text-[10px] text-slate-500 mt-1 uppercase">OWNER: {risk.owner}</div>
                                </td>
                                <td className="px-4 py-4 text-xs text-slate-400">{risk.category}</td>
                                <td className="px-4 py-4 text-xs text-slate-400">{risk.probability} × {risk.impact}</td>
                                <td className="px-4 py-4 text-sm font-bold text-white">{risk.score}</td>
                                <td className="px-4 py-4">
                                  <Badge color={risk.rating.toLowerCase() === 'critical' ? 'red' : risk.rating.toLowerCase() === 'high' ? 'amber' : 'green'}>
                                    {risk.rating}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-[10px] text-slate-400 leading-relaxed max-w-xs">{risk.mitigation}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </Card>
                </div>
              )}

              {activeTab === "gantt" && (
                <div className="space-y-8">
                  <Card title="Visual Project Timeline (Gantt Chart)">
                    <div className="overflow-x-auto pb-4">
                      <div className="min-w-[800px] bg-slate-900/50 rounded-lg p-6">
                        {/* Timeline Header (Months) */}
                        <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-0 border-b border-white/10 mb-4 pb-2">
                          <div className="col-span-3 text-xs font-bold text-slate-500 uppercase">Task Name</div>
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="text-center text-[10px] font-bold text-slate-600 uppercase border-l border-white/5">
                              Month {i + 1}
                            </div>
                          ))}
                        </div>

                        {/* Tasks */}
                        <div className="space-y-3">
                          {lifecycle.wbs.items.map((task, idx) => {
                            const startOffset = Math.min(idx, 8);
                            const width = Math.max(1, Math.min(2, 10 - startOffset));

                            return (
                              <div key={task.id} className="grid grid-cols-[repeat(13,minmax(0,1fr))] items-center gap-0 group">
                                <div className="col-span-3 pr-4">
                                  <p className={`text-xs truncate ${task.level === 1 ? 'font-bold text-white' : 'text-slate-400 pl-4'}`}>
                                    {task.task}
                                  </p>
                                </div>
                                <div className="col-span-10 h-8 relative flex items-center">
                                  <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                      <div key={i} className="border-l border-white/5 h-full" />
                                    ))}
                                  </div>
                                  <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: `${(width / 10) * 100}%`, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    style={{ marginLeft: `${(startOffset / 10) * 100}%` }}
                                    className={`h-6 rounded-md shadow-lg flex items-center px-2 cursor-pointer transition-all hover:brightness-110 relative z-10
                                      ${lifecycle.wbs.criticalPath.includes(task.id) ? 'bg-amber-500 shadow-amber-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}
                                    `}
                                  >
                                    <span className="text-[9px] font-black text-white uppercase truncate">
                                      {task.duration}
                                    </span>
                                  </motion.div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-6 justify-center">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                          <span className="text-xs text-slate-400 font-medium">Standard Task</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-amber-500" />
                          <span className="text-xs text-slate-400 font-medium">Critical Path</span>
                       </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "quality" && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card title="Quality Standards & Compliance">
                        <ul className="space-y-3">
                           {lifecycle.quality.standards.map((std, i) => (
                             <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                               {std}
                             </li>
                           ))}
                        </ul>
                     </Card>
                     <Card title="Defect Tolerance & Testing">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Defect Tolerance</h4>
                            <p className="text-sm text-slate-300">{lifecycle.quality.defectTolerance}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Testing Approach</h4>
                            <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
                              <p className="text-xs text-indigo-400 font-medium">{lifecycle.quality.testingApproach}</p>
                            </div>
                          </div>
                        </div>
                     </Card>
                   </div>

                   <Card title="Quality Checkpoints">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Checkpoint</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Phase</th>
                              <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Success Criteria</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {lifecycle.quality.checkpoints.map((cp, i) => (
                              <tr key={i}>
                                <td className="px-4 py-4 text-sm font-medium text-white">{cp.checkpoint}</td>
                                <td className="px-4 py-4 text-sm text-indigo-400">{cp.phase}</td>
                                <td className="px-4 py-4 text-sm text-slate-400">{cp.criteria}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                   </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0f1117] text-slate-200 font-inter selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Brain className="text-white" size={24} />
            </div>
            <div>
               <h1 className="text-xl font-black text-white tracking-tight">ProjectMind</h1>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Project Manager</p>
            </div>
          </div>

          {lifecycle && (
            <div className="flex items-center gap-3">
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-all"
              >
                <Download size={16} /> Excel
              </button>
              <button
                onClick={exportWord}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-all shadow-lg shadow-indigo-600/20"
              >
                <FileText size={16} /> Export Word
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!lifecycle ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Step {step} of 7</p>
                  <h2 className="text-2xl font-bold text-white">Project Chartering</h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-indigo-500">{Math.round((step/7) * 100)}%</p>
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step/7) * 100}%` }}
                  className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              </div>
            </div>

            <Card className="min-h-[400px] flex flex-col">
              <div className="flex-1">
                {renderStep()}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                <button
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  disabled={step === 1 || loading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    step === 1 || loading ? "opacity-0 pointer-events-none" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <ChevronLeft size={20} /> Back
                </button>

                {step < 7 && (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-[#0f1117] font-bold rounded-xl hover:bg-slate-200 transition-all shadow-lg active:scale-95"
                  >
                    Next Step <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </Card>

            {loading && (
              <div className="fixed inset-0 bg-[#0f1117]/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-8" />
                  <h3 className="text-2xl font-bold text-white mb-2">Generating Project Intelligence</h3>
                  <p className="text-slate-400 animate-pulse">{generationStatus}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          renderDashboard()
        )}
      </div>
    </main>
  );
}
