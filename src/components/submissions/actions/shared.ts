export type GenericActionConfig = Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color?: string;
  }
>;

export const getActionMeta = <T extends GenericActionConfig>(
  config: T,
  action: keyof T
) => {
  const meta = config[action];
  if (!meta) throw new Error(`Unknown action: ${String(action)}`);
  return meta;
};

export type ActionKey<T extends GenericActionConfig> = keyof T;
export type ActionMeta<T extends GenericActionConfig> = T[ActionKey<T>];
