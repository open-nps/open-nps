import Hook, { HookEvent } from '~/model/Hook';

type ResolveHook = (key: HookEvent, data: AnyObject) => Promise<Response[]>;
import { LoggerNamespace } from '~/util/logger';

export { HookEvent } from '~/model/Hook';
export const createResolveHooks = async (
  target: string
): Promise<ResolveHook> => {
  const logger = LoggerNamespace('HookResolver');
  const hooks = await Hook.findByTargetMappedByEvent(target);

  return async (key: HookEvent, data: AnyObject) => {
    logger('debug', 'will-start', { key, data });

    try {
      return await Promise.all(
        hooks[key].urls.map((url) =>
          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then((response) => {
            if (response.ok) {
              return response;
            }

            return response.text().then((txt) => {
              throw new Error(txt);
            });
          })
        )
      );
    } catch (error) {
      logger('error', 'Error', { key, error: error.toString() });
    }
  };
};
