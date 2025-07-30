import { App, Receiver, ReceiverEvent, StringIndexed } from "@slack/bolt";
import { TriggerPayload, util } from "@prismatic-io/spectral";

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

  public toHandler(): (request: TriggerPayload) => Promise<PrismaticResponse> {
    return async (request: TriggerPayload) => {
      const { headers, body } = request;

      let parsedBody: StringIndexed;

      // Check if this is an interactive payload (URL-encoded)
      if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
        const params = new URLSearchParams(util.types.toString(body.data));
        const payload = params.get("payload");
        parsedBody = JSON.parse(payload || "{}");
      } else {
        // This is a regular event (already JSON)
        parsedBody = body.data as StringIndexed;
      }

      // Convert prismatic payload to Bolt event
      const event: ReceiverEvent = {
        body: parsedBody,
        ack: async () => {
          console.log("Event acknowledged");
        },
      };

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
