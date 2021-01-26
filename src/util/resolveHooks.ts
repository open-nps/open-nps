import Hook, { HookEvent } from '~/model/Hook';

type ResolveHook = (key: HookEvent, data: AnyObject) => Promise<Response[]>;

export { HookEvent } from '~/model/Hook';
export const createResolveHooks = async (
  target: string
): Promise<ResolveHook> => {
  const hooks = await Hook.findByTargetMappedByEvent(target);

  return async (key: HookEvent, data: AnyObject) => {
    try {
      return Promise.all(
        hooks[key].urls.map((url) =>
          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
        )
      );
    } catch (e) {
      // @TODO: Something with error
    }
  };
};
