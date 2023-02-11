export const sleepUntil = async (f: CallableFunction, timeoutMs: number) => {
  return new Promise<void>((resolve, reject) => {
    const timeWas = Date.now();

    const wait = setInterval(function () {
      if (f()) {
        // // console.log('resolved after', Date.now() - timeWas, 'ms');
        clearInterval(wait);
        resolve();
      } else if (Date.now() - timeWas > timeoutMs) {
        // Timeout
        // // console.log('rejected after', Date.now() - timeWas, 'ms');
        clearInterval(wait);
        reject();
      }
    }, 20);
  });
};
