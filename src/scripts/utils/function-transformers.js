export const runOnCondition = fn => condition => condition && fn();

export const addParams = (...params) => fn => fn.bind(null, ...params);
