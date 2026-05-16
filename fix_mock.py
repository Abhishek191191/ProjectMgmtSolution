import sys

filepath = 'src/services/llm.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Add startDate to mock WBS items
old_wbs = """      wbs: [
        { id: '1', level: 1, task: 'Project Management', description: 'Overall project coordination and governance', duration: '52 weeks', effort: '416 hours', owner: 'Project Manager', dependencies: [] },
        { id: '1.1', level: 2, task: 'Project Planning', description: 'Develop and maintain project plan', duration: '4 weeks', effort: '40 hours', owner: 'Project Manager', dependencies: [] },
        { id: '1.2', level: 2, task: 'Stakeholder Management', description: 'Ongoing stakeholder communication', duration: '52 weeks', effort: '104 hours', owner: 'Project Manager', dependencies: ['1.1'] },
        { id: '2', level: 1, task: 'Requirements & Design', description: 'Discovery, requirements, architecture', duration: '10 weeks', effort: '200 hours', owner: 'IT Lead', dependencies: ['1.1'] },
        { id: '2.1', level: 2, task: 'Requirements Gathering', description: 'Workshops, interviews, documentation', duration: '4 weeks', effort: '80 hours', owner: 'Business Analyst', dependencies: [] },
        { id: '2.2', level: 2, task: 'System Architecture', description: 'Technical design and approval', duration: '6 weeks', effort: '120 hours', owner: 'IT Lead', dependencies: ['2.1'] },
        { id: '3', level: 1, task: 'Build & Configure', description: 'Platform setup, development, migration', duration: '12 weeks', effort: '800 hours', owner: 'IT Lead + Vendor', dependencies: ['2.2'] },
        { id: '4', level: 1, task: 'Testing', description: 'SIT, UAT, performance testing', duration: '6 weeks', effort: '300 hours', owner: 'QA Lead', dependencies: ['3'] },
        { id: '5', level: 1, task: 'Training & Go-Live', description: 'Training delivery and cutover', duration: '4 weeks', effort: '160 hours', owner: 'Project Manager', dependencies: ['4'] }
      ],"""

new_wbs = """      wbs: [
        { id: '1', level: 1, task: 'Project Management', description: 'Overall project coordination and governance', duration: '52 weeks', startDate: '2024-01-01', effort: '416 hours', owner: 'Project Manager', dependencies: [] },
        { id: '1.1', level: 2, task: 'Project Planning', description: 'Develop and maintain project plan', duration: '4 weeks', startDate: '2024-01-01', effort: '40 hours', owner: 'Project Manager', dependencies: [] },
        { id: '1.2', level: 2, task: 'Stakeholder Management', description: 'Ongoing stakeholder communication', duration: '52 weeks', startDate: '2024-02-01', effort: '104 hours', owner: 'Project Manager', dependencies: ['1.1'] },
        { id: '2', level: 1, task: 'Requirements & Design', description: 'Discovery, requirements, architecture', duration: '10 weeks', startDate: '2024-01-15', effort: '200 hours', owner: 'IT Lead', dependencies: ['1.1'] },
        { id: '2.1', level: 2, task: 'Requirements Gathering', description: 'Workshops, interviews, documentation', duration: '4 weeks', startDate: '2024-01-15', effort: '80 hours', owner: 'Business Analyst', dependencies: [] },
        { id: '2.2', level: 2, task: 'System Architecture', description: 'Technical design and approval', duration: '6 weeks', startDate: '2024-02-15', effort: '120 hours', owner: 'IT Lead', dependencies: ['2.1'] },
        { id: '3', level: 1, task: 'Build & Configure', description: 'Platform setup, development, migration', duration: '12 weeks', startDate: '2024-04-01', effort: '800 hours', owner: 'IT Lead + Vendor', dependencies: ['2.2'] },
        { id: '4', level: 1, task: 'Testing', description: 'SIT, UAT, performance testing', duration: '6 weeks', startDate: '2024-07-01', effort: '300 hours', owner: 'QA Lead', dependencies: ['3'] },
        { id: '5', level: 1, task: 'Training & Go-Live', description: 'Training delivery and cutover', duration: '4 weeks', startDate: '2024-08-15', effort: '160 hours', owner: 'Project Manager', dependencies: ['4'] }
      ],"""

content = content.replace(old_wbs, new_wbs)

with open(filepath, 'w') as f:
    f.write(content)
