export const portfolioPayload = {
  data: {
    data: {
      gid: "12345",
      resource_type: "portfolio",
      color: "light-green",
      name: "Bug Portfolio",
      created_at: "2012-02-22T02:06:58.147Z",
      created_by: {
        gid: "12345",
        resource_type: "user",
        name: "Greg Sanchez",
      },
      current_status_update: {
        gid: "12345",
        resource_type: "status_update",
        resource_subtype: "project_status_update",
        title: "Status Update - Jun 15",
      },
      custom_field_settings: [
        {
          gid: "12345",
          resource_type: "custom_field_setting",
          custom_field: {
            gid: "12345",
            resource_type: "custom_field",
            created_by: {
              gid: "12345",
              resource_type: "user",
              name: "Greg Sanchez",
            },
            currency_code: "EUR",
            custom_label: "gold pieces",
            custom_label_position: "suffix",
            description: "Development team priority",
            display_value: "blue",
            enabled: true,
            enum_options: [
              {
                gid: "12345",
                resource_type: "enum_option",
                color: "blue",
                enabled: true,
                name: "Low",
              },
            ],
            enum_value: {
              gid: "12345",
              resource_type: "enum_option",
              color: "blue",
              enabled: true,
              name: "Low",
            },
            format: "custom",
            has_notifications_enabled: true,
            is_global_to_workspace: true,
            multi_enum_values: [
              {
                gid: "12345",
                resource_type: "enum_option",
                color: "blue",
                enabled: true,
                name: "Low",
              },
            ],
            name: "Status",
            number_value: 5.2,
            precision: 2,
            resource_subtype: "text",
            text_value: "Some Value",
            type: "text",
          },
          is_important: false,
          parent: {
            gid: "12345",
            resource_type: "project",
            name: "Stuff to buy",
          },
          project: {
            gid: "12345",
            resource_type: "project",
            name: "Stuff to buy",
          },
        },
      ],
      due_on: "2019-09-15",
      members: [
        {
          gid: "12345",
          resource_type: "user",
          name: "Greg Sanchez",
        },
      ],
      owner: {
        gid: "12345",
        resource_type: "user",
        name: "Greg Sanchez",
      },
      permalink_url: "https://app.asana.com/0/resource/123456789/list",
      public: false,
      start_on: "2019-09-14",
      workspace: {
        gid: "12345",
        resource_type: "workspace",
        name: "My Company Workspace",
      },
    },
  },
};
