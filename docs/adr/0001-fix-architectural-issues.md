# ADR-0001: 架构修复计划

## 状态
In Progress

## 背景
代码库探索发现以下架构问题需要系统性修复：
1. `deepCopy` 重复定义
2. 空占位目录
3. `ctx.js` 透传无意义
4. `ctx.js` ↔ `combat.js` 循环依赖
5. `actions.js` UI 泄漏
6. 全局单例 `s` 滥用
7. 数据模块含可执行行为
8. 零测试

## 决策

### Phase 1: 快速修复 (风险低) ✅
- [x] #6 消除 `deepCopy` 重复 - 统一到 `src/data/constants.js`
- [x] #7 清理空目录 `src/actions/`, `src/renderer/`

### Phase 2: 接口澄清 ✅
- [x] #1 + #5 消除 `ctx.js` ↔ `combat.js` 循环依赖 - `dealDamageToPlayer` 移至 `actions.js`

### Phase 3: 边界强化 ✅
- [x] #2 将 UI 调用从 `actions.js` 分离 - 移除 `flashEnemy`, `showDmgPopup`, `document.body.classList`

### Phase 4: 基础重构 ✅
- [x] #4 状态注入模式 - `setStateProvider()` / `getState()` 允许测试时注入 mock state
- [x] #3 分离数据与行为 - 卡牌 action 移至 `cardActions.js`，遗物 action 移至 `relicActions.js`，数据现在是纯可序列化对象

### Phase 5: 测试覆盖 ✅
- [x] 添加 Vitest 测试框架
- [x] 90 个单元测试通过

## 代价
- 重构期间可能引入 bug
- 需要全面回归测试
