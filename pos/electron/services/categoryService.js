import { getDatabase } from '../database/index.js';
import { createCategoryRepository } from '../database/repositories/categoryRepository.js';

export function getCategoryRepository() {
  return createCategoryRepository(getDatabase());
}

export function listCategories() {
  const repo = getCategoryRepository();
  return repo.list();
}

export function getCategoryById(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid category ID.');
  }
  return getCategoryRepository().getById(numId);
}

export function createCategory({ name, description }) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Category name is required.');
  }
  const trimmedName = name.trim();
  if (trimmedName.length > 80) {
    throw new Error('Category name cannot exceed 80 characters.');
  }

  const repo = getCategoryRepository();
  const existing = repo.getByName(trimmedName);
  if (existing) {
    throw new Error(`Category "${trimmedName}" already exists.`);
  }

  return repo.create({ name: trimmedName, description });
}

export function updateCategory(id, { name, description }) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid category ID.');
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Category name is required.');
  }
  const trimmedName = name.trim();
  if (trimmedName.length > 80) {
    throw new Error('Category name cannot exceed 80 characters.');
  }

  const repo = getCategoryRepository();
  const existing = repo.getByName(trimmedName);
  if (existing && existing.id !== numId) {
    throw new Error(`Category "${trimmedName}" is already used by another category.`);
  }

  const current = repo.getById(numId);
  if (!current) {
    throw new Error('Category not found.');
  }

  return repo.update(numId, { name: trimmedName, description });
}

export function deleteCategory(id) {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new Error('Invalid category ID.');
  }
  return getCategoryRepository().delete(numId);
}
