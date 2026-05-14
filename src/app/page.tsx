"use client";

import { useState } from "react";
import { ProjectCharter, ProjectLifecycle } from "@/types";
import { INITIAL_CHARTER, generateProjectLifecycle } from "@/lib/api";
import { Card, Badge } from "@/components/UI";

export default function Home() {
  const [charter, setCharter] = useState<ProjectCharter>(INITIAL_CHARTER);
  const [lifecycle, setLifecycle] = useState<ProjectLifecycle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProjectCharter, value: string) => {
    setCharter({ ...charter, [field]: value });
  };

  const handleArrayChange = (field: keyof ProjectCharter, index: number, value: string) => {
    const newArray = [...(charter[field] as string[])];
    newArray[index] = value;
    setCharter({ ...charter, [field]: newArray });
  };

  const addArrayItem = (field: keyof ProjectCharter) => {
    setCharter({ ...charter, [field]: [...(charter[field] as string[]), ""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await generateProjectLifecycle(charter);
      setLifecycle(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Project Lifecycle Generator</h1>
          <p className="text-lg text-gray-600">Secure, Lightweight & PMI/Agile Compliant</p>
        </header>

        <section className="bg-white shadow rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Project Charter</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                value={charter.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                rows={3}
                value={charter.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
              {charter.objectives.map((obj, i) => (
                <input
                  key={i}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border mb-2"
                  value={obj}
                  onChange={(e) => handleArrayChange("objectives", i, e.target.value)}
                />
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("objectives")}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                + Add Objective
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-bold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Generating Draft..." : "Generate Project Lifecycle"}
            </button>
          </form>
          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </section>

        {lifecycle && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Generated Project Lifecycle</h2>

            <Card title="Methodology & Initiation">
              <div className="mb-6">
                <Badge color="green">{lifecycle.methodology}</Badge>
                <span className="text-gray-700 ml-2">Approach selected based on PMI & Agile standards.</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase">Refined Objectives</h4>
                  <ul className="list-disc ml-4 text-sm text-gray-700">
                    {lifecycle.initiation.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase">Stakeholders</h4>
                  <ul className="list-disc ml-4 text-sm text-gray-700">
                    {lifecycle.initiation.stakeholders.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-500 uppercase">Success Criteria</h4>
                  <ul className="list-disc ml-4 text-sm text-gray-700">
                    {lifecycle.initiation.successCriteria.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Project Stages">
                <ul className="space-y-4">
                  {lifecycle.stages.map((stage, i) => (
                    <li key={i} className="border-l-4 border-indigo-400 pl-4">
                      <h4 className="font-bold text-gray-800">{stage.name}</h4>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Resource Requirements">
                <ul className="divide-y divide-gray-200">
                  {lifecycle.resources.map((res, i) => (
                    <li key={i} className="py-2 flex justify-between">
                      <span className="font-medium">{res.role}</span>
                      <span className="text-gray-500">x{res.count}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card title="Work Breakdown Structure (WBS)">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencies</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lifecycle.wbs.map((item, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.task}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.duration}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.dependencies.join(', ') || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Estimated Expenses">
                <ul className="divide-y divide-gray-200">
                  {lifecycle.expenses.map((exp, i) => (
                    <li key={i} className="py-2 flex justify-between">
                      <div>
                        <span className="font-medium block">{exp.category}</span>
                        <span className="text-xs text-gray-500">{exp.description}</span>
                      </div>
                      <span className="font-bold text-green-600">\${exp.estimatedCost}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Timeline Summary">
                <div className="flex flex-col items-center justify-center h-full pb-6">
                  <div className="text-4xl font-black text-indigo-600 mb-2">{lifecycle.timeline}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Total Estimated Duration</div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Risk Log">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lifecycle.risks.map((risk, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 text-sm text-gray-900">{risk.risk}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge color={risk.impact === 'High' ? 'red' : 'yellow'}>{risk.impact}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card title="Issue Log">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lifecycle.issues.map((issue, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 text-sm text-gray-900">{issue.issue}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm"><Badge color={issue.severity === 'High' ? 'red' : 'yellow'}>{issue.severity}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
