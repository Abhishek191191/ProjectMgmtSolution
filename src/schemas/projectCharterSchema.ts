import { ProjectCharter } from '@/types';

export interface ValidationResult {
  success: boolean;
  errors?: string[];
  data?: ProjectCharter;
}

export function validateProjectCharter(data: any): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { success: false, errors: ['Invalid input: project charter must be an object'] };
  }

  const { title, description, objectives, stakeholders, scope, constraints, assumptions } = data;

  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required and must be a non-empty string');
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('description must be a string');
  }

  if (objectives !== undefined && (!Array.isArray(objectives) || !objectives.every(item => typeof item === 'string'))) {
    errors.push('objectives must be an array of strings');
  }

  if (stakeholders !== undefined && (!Array.isArray(stakeholders) || !stakeholders.every(item => typeof item === 'string'))) {
    errors.push('stakeholders must be an array of strings');
  }

  if (scope !== undefined && typeof scope !== 'string') {
    errors.push('scope must be a string');
  }

  if (constraints !== undefined && typeof constraints !== 'string') {
    errors.push('constraints must be a string');
  }

  if (assumptions !== undefined && typeof assumptions !== 'string') {
    errors.push('assumptions must be a string');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      title: title.trim(),
      description: description || '',
      objectives: objectives || [],
      stakeholders: stakeholders || [],
      scope: scope || '',
      constraints: constraints || '',
      assumptions: assumptions || '',
    }
  };
}
