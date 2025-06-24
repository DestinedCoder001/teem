export const canRequestOtp = (lastUpdated: Date): boolean => {
  const secondsSinceLast = (Date.now() - lastUpdated.getTime()) / 1000;
  return secondsSinceLast >= 300;
};


export const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();