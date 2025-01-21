export const createConversationResponse = {
  ok: true,
  channels: [
    {
      id: "COZ7e3d",
      name: "example channel",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      is_archived: false,
      created: 6426934241,
      creator: "example",
      unlinked: 0,
      name_normalized: "example channel",
      shared_team_ids: ["TW2oP78"],
      purpose: {
        value: "This channel was created for an example response.",
      },
    },
  ],
};

export const closeConversationResponse = {
  ok: true,
  no_op: true,
  already_closed: true,
};

export const renameConversationResponse = {
  ok: true,
  channel: {
    id: "C012AB3CD",
    name: "general",
    is_channel: true,
    is_group: false,
    is_im: false,
    created: 1449252889,
    creator: "W012A3BCD",
    is_archived: false,
    is_general: true,
    unlinked: 0,
    name_normalized: "general",
    is_read_only: false,
    is_shared: false,
    is_ext_shared: false,
    is_org_shared: false,
    pending_shared: [],
    is_pending_ext_shared: false,
    is_member: true,
    is_private: false,
    is_mpim: false,
    last_read: "1502126650.228446",
    topic: {
      value: "For public discussion of generalities",
      creator: "W012A3BCD",
      last_set: 1449709364,
    },
    purpose: {
      value: "This part of the workspace is for fun. Make fun here.",
      creator: "W012A3BCD",
      last_set: 1449709364,
    },
    previous_names: ["specifics", "abstractions", "etc"],
    num_members: 23,
    locale: "en-US",
  },
};

export const getConversationsHistoryResponse = {
  ok: true,
  messages: [
    {
      client_msg_id: "123123-123123-123123",
      type: "message",
      text: "hello world",
      user: "U01QFFSE2QK",
      ts: "166149417.178179",
      team: "TH0GJM0M8",
    },
  ],
};

export const listConversationResponse = {
  ok: true,
  channels: [
    {
      id: "COZ7e3d",
      name: "example channel",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      is_archived: false,
      created: 6426934241,
      creator: "example",
      unlinked: 0,
      name_normalized: "example channel",
      shared_team_ids: ["TW2oP78"],
      purpose: {
        value: "This channel was created for an example response.",
      },
    },
  ],
};

export const leaveConversationResponse = {
  ok: true,
  not_in_channel: true,
};

export const listConversationMembersResponse = {
  ok: true,
  members: ["U023BECGF", "U061F7AUR", "W012A3CDE"],
  response_metadata: {
    next_cursor: "e3VzZXJfaWQ6IFcxMjM0NTY3fQ==",
  },
};

export const archiveConversationResponse = {
  ok: true,
};

export const inviteUserToConversationResponse = {
  ok: true,
  channel: {
    id: "C012AB3CD",
    name: "general",
    is_channel: true,
    is_group: false,
    is_im: false,
    created: 1449252889,
    creator: "W012A3BCD",
    is_archived: false,
    is_general: true,
    unlinked: 0,
    name_normalized: "general",
    is_read_only: false,
    is_shared: false,
    is_ext_shared: false,
    is_org_shared: false,
    pending_shared: [],
    is_pending_ext_shared: false,
    is_member: true,
    is_private: false,
    is_mpim: false,
    last_read: "1502126650.228446",
    topic: {
      value: "For public discussion of generalities",
      creator: "W012A3BCD",
      last_set: 1449709364,
    },
    purpose: {
      value: "This part of the workspace is for fun. Make fun here.",
      creator: "W012A3BCD",
      last_set: 1449709364,
    },
    previous_names: ["specifics", "abstractions", "etc"],
  },
};

const filesResponse = {
  id: "F0S43P1CZ",
  created: 1531763254,
  timestamp: 1531763254,
  name: "billair.gif",
  title: "billair.gif",
  mimetype: "image/gif",
  filetype: "gif",
  pretty_type: "GIF",
  user: "U061F7AUR",
  editable: false,
  size: 144538,
  mode: "hosted",
  is_external: false,
  external_type: "",
  is_public: true,
  public_url_shared: false,
  display_as_bot: false,
  username: "",
  url_private: "https://.../billair.gif",
  url_private_download: "https://.../billair.gif",
  thumb_64: "https://.../billair_64.png",
  thumb_80: "https://.../billair_80.png",
  thumb_360: "https://.../billair_360.png",
  thumb_360_w: 176,
  thumb_360_h: 226,
  thumb_160: "https://.../billair_=_160.png",
  thumb_360_gif: "https://.../billair_360.gif",
  image_exif_rotation: 1,
  original_w: 176,
  original_h: 226,
  deanimate_gif: "https://.../billair_deanimate_gif.png",
  pjpeg: "https://.../billair_pjpeg.jpg",
  permalink: "https://.../billair.gif",
  permalink_public: "https://.../...",
  channels: ["C0T8SE4AU"],
  groups: [],
  ims: [],
  comments_count: 0,
};

export const listFilesResponse = {
  ok: true,
  files: [filesResponse, filesResponse],
  paging: {
    count: 100,
    total: 2,
    page: 1,
    pages: 1,
  },
};

export const uploadFileResponse = {
  ok: true,
  file: {
    id: "F0TD0GUTS",
    created: 1532294750,
    timestamp: 1532294750,
    name: "-.txt",
    title: "Untitled",
    mimetype: "text/plain",
    filetype: "text",
    pretty_type: "Plain Text",
    user: "U0L4B9NSU",
    editable: true,
    size: 11,
    mode: "snippet",
    is_external: false,
    external_type: "",
    is_public: true,
    public_url_shared: false,
    display_as_bot: false,
    username: "",
    url_private: "https://.../.txt",
    url_private_download: "https://...download/-.txt",
    permalink: "https://.../.txt",
    permalink_public: "https://.../.txt",
    edit_link: "https://.../.txt/edit",
    preview: "launch plan",
    preview_highlight:
      '<div class="CodeMirror cm-s-default CodeMirrorServer" oncopy="if(event.clipboardData){event.clipboardData.setData(\'text/plain\',window.getSelection().toString().replace(/\\u200b/g,\'\'));event.preventDefault();event.stopPropagation();}">\n<div class="CodeMirror-code">\n<div><pre>launch plan</pre></div>\n</div>\n</div>\n',
    lines: 1,
    lines_more: 0,
    preview_is_truncated: false,
    comments_count: 0,
    is_starred: false,
    shares: {
      public: {
        C061EG9SL: [
          {
            reply_users: [],
            reply_users_count: 0,
            reply_count: 0,
            ts: "1532294750.000001",
            channel_name: "general",
            team_id: "T061EG9R6",
          },
        ],
      },
    },
    channels: ["C061EG9SL"],
    groups: [],
    ims: [],
    has_rich_preview: false,
  },
};

export const postMessageResponse = {
  ok: true,
  channel: "C011B7U3R9U",
  ts: "1646951430.367539",
  message: {
    type: "message",
    subtype: "bot_message",
    text: "The message I sent",
    ts: "1646951430.367539",
    username: "My Slack App",
    bot_id: "B036D2DCT54",
  },
  response_metadata: {
    scopes: [
      "identify",
      "chat:write",
      "chat:write.public",
      "chat.write.customize",
    ],
    acceptedScopes: ["chat:write"],
  },
};

export const updateMessageResponse = {
  ok: true,
  channel: "C123ABC456",
  ts: "1401383885.000061",
  text: "Updated text you carefully authored",
  message: {
    text: "Updated text you carefully authored",
    user: "U34567890",
  },
};

export const deletePendingMessageResponse = {
  ok: true,
};

export const deleteMessageResponse = {
  ok: true,
  channel: "C123ABC456",
  ts: "1401383885.000061",
};

export const postEphemeralMessageResponse = {
  ok: true,
  message_ts: "1502210682.580145",
};

export const webhookDefaultResponse = { text: "ok" };

export const postBlockMessageResponse = {
  ok: true,
  channel: "C011B7U3R9U",
  ts: "1646951430.367539",
  message: {
    type: "message",
    subtype: "bot_message",
    text: "The message I sent",
    ts: "1646951430.367539",
    username: "My Slack App",
    bot_id: "B036D2DCT54",
  },
  response_metadata: {
    scopes: [
      "identify",
      "chat:write",
      "chat:write.public",
      "chat:write.customize",
    ],
    acceptedScopes: ["chat:write"],
  },
};

export const listScheduledMessagesResponse = {
  ok: true,
  scheduled_messages: [
    {
      id: 1298393284,
      channel_id: "C1H9RESGL",
      post_at: 1551991428,
      date_created: 1551891734,
      text: "Here's a message for you in the future",
    },
  ],
  response_metadata: {
    next_cursor: "",
  },
};

export const getUserResponse = {
  ok: true,
  user: {
    id: "example",
    color: "example",
    deleted: false,
    real_name: "Example User",
    name: "Example User",
    tz: "America/Chicago",
    profile: {
      title: "example",
      phone: "example",
      skype: "example",
      real_name: "Slackbots",
      real_name_normalized: "example",
      first_name: "example",
      email: "example",
      team: "example",
      display_name: "example",
    },
  },
};

export const listUsersResponse = {
  ok: true,
  members: [
    {
      id: "Exmple",
      team_id: "34700c09vs0zx",
      name: "Example",
      deleted: false,
      color: "37373",
      profile: {
        title: "example",
        phone: "example",
        skype: "example",
        real_name: "Slackbots",
        real_name_normalized: "example",
        always_active: true,
        first_name: "example",
        email: "example",
        team: "example",
        display_name: "example",
      },
    },
  ],
  response_metadata: {
    next_cursor: "",
    scopes: ["admin", "idetify", "channels:read"],
  },
};

export const listUserConversationsResponse = {
  ok: true,
  channels: [
    {
      id: "COZ7e3d",
      name: "example channel",
      is_channel: true,
      is_group: false,
      is_im: false,
      is_private: false,
      is_archived: false,
      created: 6426934241,
      creator: "example",
      unlinked: 0,
      name_normalized: "example channel",
      shared_team_ids: ["TW2oP78"],
      purpose: {
        value: "This channel was created for an example response.",
      },
    },
  ],
};

export const openViewResponse = {
  ok: true,
  view: {
    id: "VMHU10V25",
    team_id: "T8N4K1JN",
    type: "modal",
    title: {
      type: "plain_text",
      text: "Quite a plain modal",
    },
    submit: {
      type: "plain_text",
      text: "Create",
    },
    blocks: [
      {
        type: "input",
        block_id: "a_block_id",
        label: {
          type: "plain_text",
          text: "A simple label",
          emoji: true,
        },
        optional: false,
        element: {
          type: "plain_text_input",
          action_id: "an_action_id",
        },
      },
    ],
    private_metadata: "Shh it is a secret",
    callback_id: "identify_your_modals",
    external_id: "",
    state: {
      values: {},
    },
    hash: "156772938.1827394",
    clear_on_close: false,
    notify_on_close: false,
    root_view_id: "VMHU10V25",
    app_id: "AA4928AQ",
    bot_id: "BA13894H",
  },
};

export const publishViewResponse = {
  ok: true,
  view: {
    id: "VMHU10V25",
    team_id: "T8N4K1JN",
    type: "home",
    close: null,
    submit: null,
    blocks: [
      {
        type: "section",
        block_id: "2WGp9",
        text: {
          type: "mrkdwn",
          text: "A simple section with some sample sentence.",
          verbatim: false,
        },
      },
    ],
    private_metadata: "Shh it is a secret",
    callback_id: "identify_your_home_tab",
    state: {
      values: {},
    },
    hash: "156772938.1827394",
    clear_on_close: false,
    notify_on_close: false,
    root_view_id: "VMHU10V25",
    previous_view_id: null,
    app_id: "AA4928AQ",
    external_id: "",
    bot_id: "BA13894H",
  },
};

export const searchAllResponse = {
  files: {
    matches: [
      {
        channels: [],
        comments_count: 1,
        created: 1508804330,
        display_as_bot: false,
        editable: false,
        external_type: "",
        filetype: "png",
        groups: [],
        id: "F7PKF1NR7",
        image_exif_rotation: 1,
        ims: [],
        initial_comment: {
          comment: "Sure! Here's the workflow diagram!",
          created: 1508804330,
          id: "Fc7NLL52E7",
          is_intro: true,
          timestamp: 1508804330,
          user: "U2U85N1RZ",
        },
        is_external: false,
        is_public: true,
        mimetype: "image/png",
        mode: "hosted",
        name: "slack workflow diagram.png",
        original_h: 117,
        original_w: 128,
        permalink:
          "https://example.slack.com/files/U2U85N1RZ/F7PKF1NR7/slack_workflow_diagram.png",
        permalink_public:
          "https://slack-files.com/T2U81E2FZ-F7PKF1NR7-bea9143f18",
        pretty_type: "PNG",
        preview: null,
        public_url_shared: false,
        score: "0.99982661240974",
        size: 35705,
        thumb_160:
          "https://files.slack.com/files-tmb/T2U81E2FZ-F7PKF1NR7-19f33fc256/slack_workflow_diagram_160.png",
        thumb_360:
          "https://files.slack.com/files-tmb/T2U81E2FZ-F7PKF1NR7-19f33fc256/slack_workflow_diagram_360.png",
        thumb_360_h: 117,
        thumb_360_w: 128,
        thumb_64:
          "https://files.slack.com/files-tmb/T2U81E2FZ-F7PKF1NR7-19f33fc256/slack_workflow_diagram_64.png",
        thumb_80:
          "https://files.slack.com/files-tmb/T2U81E2FZ-F7PKF1NR7-19f33fc256/slack_workflow_diagram_80.png",
        timestamp: 1508804330,
        title: "slack workflow diagram",
        top_file: false,
        url_private:
          "https://files.slack.com/files-pri/T2U81E2FZ-F7PKF1NR7/slack_workflow_diagram.png",
        url_private_download:
          "https://files.slack.com/files-pri/T2U81E2FZ-F7PKF1NR7/download/slack_workflow_diagram.png",
        user: "U2U85N1RZ",
        username: "amy",
      },
    ],
    pagination: {
      first: 1,
      last: 1,
      page: 1,
      page_count: 1,
      per_page: 20,
      total_count: 1,
    },
    paging: {
      count: 20,
      page: 1,
      pages: 1,
      total: 1,
    },
    total: 1,
  },
  messages: {
    matches: [
      {
        channel: {
          id: "C2U86NC6M",
          is_ext_shared: false,
          is_mpim: false,
          is_org_shared: false,
          is_pending_ext_shared: false,
          is_private: false,
          is_shared: false,
          name: "general",
          pending_shared: [],
        },
        iid: "35692677-e60e-43d9-ac45-1987cea88975",
        next: {
          iid: "6f510ea1-e1d3-4f3f-bdb9-f9c6f6e9d609",
          text: "Thanks!",
          ts: "1508804378.000219",
          type: "message",
          user: "U2U85HJ7R",
          username: "john",
        },
        permalink:
          "https://example.slack.com/archives/C2U86NC6M/p1508804330000296",
        previous: {
          iid: "aba8603c-0543-4fb2-9118-a5ac85f3d138",
          text: "Can you send me the Slack workflow diagram?",
          ts: "1508804301.000026",
          type: "message",
          user: "U2U85HJ7R",
          username: "john",
        },
        team: "T2U81E2FZ",
        text: "uploaded a file: <https://example.slack.com/files/U2U85N1RZ/F7PKF1NR7/slack_workflow_diagram.png|slack workflow diagram> and commented: Sure! Here's the workflow diagram!",
        ts: "1508804330.000296",
        type: "message",
        user: "U2U85N1RZ",
        username: "amy",
      },
    ],
    pagination: {
      first: 1,
      last: 1,
      page: 1,
      page_count: 1,
      per_page: 20,
      total_count: 1,
    },
    paging: {
      count: 20,
      page: 1,
      pages: 1,
      total: 1,
    },
    total: 1,
  },
  ok: true,
  posts: {
    matches: [],
    total: 0,
  },
  query: "diagram",
};

export const searchFilesResponse = {
  files: {
    matches: [
      {
        channels: [],
        comments_count: 1,
        created: 1507850315,
        deanimate_gif:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_deanimate_gif.png",
        display_as_bot: false,
        editable: false,
        external_type: "",
        filetype: "gif",
        groups: [],
        id: "F7H0D7ZBB",
        image_exif_rotation: 1,
        ims: [],
        is_external: false,
        is_public: true,
        mimetype: "image/gif",
        mode: "hosted",
        name: "computer.gif",
        original_h: 313,
        original_w: 500,
        permalink:
          "https://eventsdemo.slack.com/files/U2U85N1RZ/F7H0D7ZBB/computer.gif",
        permalink_public:
          "https://slack-files.com/T2U81E2BB-F7H0D7ZBB-85b7f5557e",
        pretty_type: "GIF",
        preview: null,
        public_url_shared: false,
        reactions: [
          {
            count: 1,
            name: "stuck_out_tongue_winking_eye",
            users: ["U2U85N1RZ"],
          },
        ],
        score: "0.38899223746309",
        size: 1639034,
        thumb_160:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_160.png",
        thumb_360:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_360.png",
        thumb_360_gif:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_360.gif",
        thumb_360_h: 225,
        thumb_360_w: 360,
        thumb_480:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_480.png",
        thumb_480_gif:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_480.gif",
        thumb_480_h: 300,
        thumb_480_w: 480,
        thumb_64:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_64.png",
        thumb_80:
          "https://files.slack.com/files-tmb/T2U81E2BB-F7H0D7ZBB-21624821e6/computer_80.png",
        timestamp: 1507850315,
        title: "computer.gif",
        top_file: false,
        url_private:
          "https://files.slack.com/files-pri/T2U81E2BB-F7H0D7ZBB/computer.gif",
        url_private_download:
          "https://files.slack.com/files-pri/T2U81E2BB-F7H0D7ZBB/download/computer.gif",
        user: "U2U85N1RZ",
        username: "",
      },
    ],
    pagination: {
      first: 1,
      last: 3,
      page: 1,
      page_count: 1,
      per_page: 20,
      total_count: 3,
    },
    paging: {
      count: 20,
      page: 1,
      pages: 1,
      total: 3,
    },
    total: 3,
  },
  ok: true,
  query: "computer.gif",
};

export const searchMessagesResponse = {
  messages: {
    matches: [
      {
        channel: {
          id: "C12345678",
          is_ext_shared: false,
          is_mpim: false,
          is_org_shared: false,
          is_pending_ext_shared: false,
          is_private: false,
          is_shared: false,
          name: "general",
          pending_shared: [],
        },
        iid: "cb64bdaa-c1e8-4631-8a91-0f78080113e9",
        permalink:
          "https://hitchhikers.slack.com/archives/C12345678/p1508284197000015",
        team: "T12345678",
        text: "The meaning of life the universe and everything is 42.",
        ts: "1508284197.000015",
        type: "message",
        user: "U2U85N1RV",
        username: "roach",
      },
      {
        channel: {
          id: "C12345678",
          is_ext_shared: false,
          is_mpim: false,
          is_org_shared: false,
          is_pending_ext_shared: false,
          is_private: false,
          is_shared: false,
          name: "random",
          pending_shared: [],
        },
        iid: "9a00d3c9-bd2d-45b0-988b-6cff99ae2a90",
        permalink:
          "https://hitchhikers.slack.com/archives/C12345678/p1508795665000236",
        team: "T12345678",
        text: "The meaning of life the universe and everything is 101010",
        ts: "1508795665.000236",
        type: "message",
        user: "",
        username: "robot overlord",
      },
    ],
    pagination: {
      first: 1,
      last: 2,
      page: 1,
      page_count: 1,
      per_page: 20,
      total_count: 2,
    },
    paging: {
      count: 20,
      page: 1,
      pages: 1,
      total: 2,
    },
    total: 2,
  },
  ok: true,
  query: "The meaning of life the universe and everything",
};
