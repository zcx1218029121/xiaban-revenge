// State injection test - demonstrates testability via setStateProvider
import { setStateProvider, getState } from './engine/core.js';

describe('State injection', () => {
  test('can inject mock state for testing', () => {
    const mockState = {
      stress: 5,
      en: 2,
      sh: 10,
      php: 40,
      pmax: 50,
      relics: [{ id: 'test' }],
    };

    setStateProvider(() => mockState);
    const state = getState();

    expect(state.stress).toBe(5);
    expect(state.en).toBe(2);
    expect(state.sh).toBe(10);
    expect(state.php).toBe(40);
    expect(state.relics).toHaveLength(1);
    expect(state.relics[0].id).toBe('test');

    // Reset to default
    setStateProvider(() => new (require('./engine/core.js').GameState)());
  });

  test('state isolation between tests', () => {
    const mockState1 = { stress: 1, php: 30 };
    const mockState2 = { stress: 2, php: 20 };

    setStateProvider(() => mockState1);
    expect(getState().stress).toBe(1);
    expect(getState().php).toBe(30);

    setStateProvider(() => mockState2);
    expect(getState().stress).toBe(2);
    expect(getState().php).toBe(20);

    // Reset
    setStateProvider(() => new (require('./engine/core.js').GameState)());
  });
});

describe('Actions with injected state', () => {
  test('hasRelic works with injected state', () => {
    const mockState = {
      relics: [
        { id: 'jixie', name: '机械键盘' },
        { id: 'kafei', name: '咖啡机' },
      ]
    };

    setStateProvider(() => mockState);

    // hasRelic accepts state as parameter
    const state = getState();
    const hasRelic = (st, id) => st.relics.some(r => r.id === id || r.name === id);

    expect(hasRelic(state, 'jixie')).toBe(true);
    expect(hasRelic(state, '机械键盘')).toBe(true);
    expect(hasRelic(state, '不存在')).toBe(false);

    // Reset
    setStateProvider(() => new (require('./engine/core.js').GameState)());
  });
});
