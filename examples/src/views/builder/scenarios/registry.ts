import type { ScenarioFixture } from './types';

/**
 * 场景注册表
 *
 * 自动收集 fixtures/ 下所有 *.ts 文件（default 导出 ScenarioFixture），
 * 路由与菜单都由它生成 —— 新增场景只需要往 fixtures/ 里放一个文件。
 */
const modules = import.meta.glob<{ default: ScenarioFixture }>(
  './fixtures/*.ts',
  { eager: true },
);

export const scenarioFixtures: ScenarioFixture[] = Object.entries(modules)
  .map(([path, mod]) => ({
    ...mod.default,
    key:
      mod.default.key ?? path.replace('./fixtures/', '').replace(/\.ts$/, ''),
  }))
  .sort((a, b) => (a.key as string).localeCompare(b.key as string));

export function getScenarioByKey(key: string) {
  return scenarioFixtures.find((item) => item.key === key);
}
