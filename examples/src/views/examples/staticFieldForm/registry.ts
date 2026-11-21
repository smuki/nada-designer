// 由 specs/mocks/gen_static_form_fixture.py 生成，请勿手工修改。
import type { StaticFormExample } from './types';

const modules = import.meta.glob<{ default: StaticFormExample }>('./fixtures/*.ts', {
  eager: true,
});

export const staticFormExamples: StaticFormExample[] = Object.entries(modules)
  .map(([, mod]) => mod.default)
  .sort((a, b) => a.key.localeCompare(b.key));

export function getStaticFormExample(key: string) {
  return staticFormExamples.find((item) => item.key === key);
}
