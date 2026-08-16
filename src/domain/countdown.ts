export interface CountdownParts {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getCountdownParts(target: Date, now = new Date()): CountdownParts {
  const totalMilliseconds = Math.max(0, target.getTime() - now.getTime());

  return {
    totalMilliseconds,
    days: Math.floor(totalMilliseconds / 86400000),
    hours: Math.floor((totalMilliseconds % 86400000) / 3600000),
    minutes: Math.floor((totalMilliseconds % 3600000) / 60000),
    seconds: Math.floor((totalMilliseconds % 60000) / 1000),
  };
}
