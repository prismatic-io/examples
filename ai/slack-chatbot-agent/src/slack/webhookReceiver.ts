/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Receiver, ReceiverEvent, StringIndexed } from "@slack/bolt";
import { TriggerPayload } from "@prismatic-io/spectral";

export interface PrismaticResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: any;
}

export class PrismaticWebhookReceiver implements Receiver {
  private app?: App;

  constructor() {
    // No configuration needed!
  }
  init(app: App): void {
    this.app = app;
  }

  public async start(): Promise<
    (request: TriggerPayload) => Promise<PrismaticResponse>
  > {
    return this.toHandler();
  }

  public stop(): Promise<unknown> {
    return Promise.resolve();
  }
  public trigger(): Promise<unknown> {
    return Promise.resolve();
  }

  public toHandler(): (request: TriggerPayload) => Promise<PrismaticResponse> {
    return async (request: TriggerPayload) => {
      const {
        body: { data },
      } = request;

      // Create Bolt event
      const event: ReceiverEvent = {
        body: data as StringIndexed,
        ack: async () => {
          console.log("Event acknowledged");
        },
      };

      // Process the event through Bolt
      try {
        if (this.app) {
          await this.app.processEvent(event);
        }

        return {
          statusCode: 200,
          body: { success: true },
        };
      } catch (e) {
        const error = e as Error;
        console.error("Error processing event:", error);
        return {
          statusCode: 200,
          body: { success: false, error: error.message },
        };
      }
    };
  }
}
