"use strict";

import { ProjectCharter, ProjectLifecycle } from '../types';

export const INITIAL_CHARTER: ProjectCharter = {
  title: '',
  description: '',
  objectives: [''],
  stakeholders: [''],
  scope: '',
  constraints: [''],
  assumptions: [''],
};

export async function generateProjectLifecycle(charter: ProjectCharter): Promise<ProjectLifecycle> {
  const response = await fetch('/api/generate-lifecycle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ charter }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate project lifecycle');
  }

  return response.json();
}
