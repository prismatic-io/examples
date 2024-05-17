export const batchMessageEntriesExample = [
  {
    Id: "AN_ID",
    Message: "A_MESSAGE",
    Subject: "A_SUBJECT",
    MessageStructure: "A_MESSAGE_STRUCTURE",
    MessageAttributes: {
      "<keys>": {
        DataType: "Number",
        StringValue: "123",
      },
    },
    MessageDeduplicationId: "A_MESSAGE_DEDUPLICATION_ID",
    MessageGroupId: "A_MESSAGE_GROUP_ID",
  },
  {
    Id: "AN_ID",
    Message: "A_MESSAGE",
    Subject: "A_SUBJECT",
    MessageStructure: "A_MESSAGE_STRUCTURE",
    MessageAttributes: {
      "<keys>": {
        DataType: "String.Array",
        StringValue: '["test", true, 123]',
      },
    },
    MessageDeduplicationId: "A_MESSAGE_DEDUPLICATION_ID",
    MessageGroupId: "A_MESSAGE_GROUP_ID",
  },
  {
    Id: "AN_ID",
    Message: "A_MESSAGE",
    Subject: "A_SUBJECT",
    MessageStructure: "A_MESSAGE_STRUCTURE",
    MessageAttributes: {
      "<keys>": {
        DataType: "String",
        StringValue: "test",
      },
    },
    MessageDeduplicationId: "A_MESSAGE_DEDUPLICATION_ID",
    MessageGroupId: "A_MESSAGE_GROUP_ID",
  },
  {
    Id: "AN_ID",
    Message: "A_MESSAGE",
    Subject: "A_SUBJECT",
    MessageStructure: "A_MESSAGE_STRUCTURE",
    MessageAttributes: {
      "<keys>": {
        DataType: "Binary",
        BinaryValue: "ADD A BUFFER HERE WITH A TEMPLATE FIELD",
      },
    },
    MessageDeduplicationId: "A_MESSAGE_DEDUPLICATION_ID",
    MessageGroupId: "A_MESSAGE_GROUP_ID",
  },
];
