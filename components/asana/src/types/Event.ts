export type Event = {
  action: string;
  change?: {
    action: string;
    added_value?: {
      gid: string;
      resource_type: string;
    };
    field: string;
    new_value?: {
      gid: string;
      resource_type: string;
    };
    removed_value?: {
      gid: string;
      resource_type: string;
    };
  };
  created_at: string;
  parent?: {
    gid: string;
    resource_type: string;
    name: string;
  } | null;
  resource: {
    gid: string;
    resource_type: string;
    name: string;
  };
  type?: string;
  user?: {
    gid: string;
    resource_type: string;
    name: string;
  } | null;
  task?: object;
  story?: object;
};
