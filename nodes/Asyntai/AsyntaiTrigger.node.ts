import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import type { NodeConnectionType } from 'n8n-workflow';

export class AsyntaiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Asyntai Trigger',
		name: 'asyntaiTrigger',
		icon: { light: 'file:asyntai.svg', dark: 'file:asyntai.svg' },
		group: ['trigger'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts a workflow when events happen in your Asyntai chatbot',
		defaults: {
			name: 'Asyntai Trigger',
		},
		inputs: [],
		outputs: ['main' as NodeConnectionType],
		credentials: [
			{
				name: 'asyntaiApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: ['message.received'],
				options: [
					{
						name: 'Conversation Started',
						value: 'conversation.started',
						description: 'A visitor started a new chat conversation',
					},
					{
						name: 'Escalation Requested',
						value: 'escalation.requested',
						description: 'A visitor asked for a human',
					},
					{
						name: 'Message Received',
						value: 'message.received',
						description: 'A visitor sent a message to the chatbot',
					},
					{
						name: 'Takeover Started',
						value: 'takeover.started',
						description: 'A human agent took over the conversation',
					},
				],
			},
			{
				displayName: 'Website ID',
				name: 'websiteId',
				type: 'string',
				default: '',
				description:
					'Only trigger for a specific website ID. If empty, your primary website is used.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const webhookData = this.getWorkflowStaticData('node');
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'asyntaiApi',
					{
						method: 'GET',
						url: 'https://asyntai.com/api/v1/webhooks/',
						json: true,
					},
				);
				const webhooks = (response.webhooks as Array<{ id: string; url: string }>) ?? [];
				for (const webhook of webhooks) {
					if (webhook.url === webhookUrl) {
						webhookData.webhookId = webhook.id;
						return true;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const websiteId = this.getNodeParameter('websiteId') as string;
				const body: Record<string, unknown> = {
					url: webhookUrl,
					events,
				};
				if (websiteId) body.website_id = websiteId;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'asyntaiApi',
					{
						method: 'POST',
						url: 'https://asyntai.com/api/v1/webhooks/',
						body,
						json: true,
					},
				);
				const webhookData = this.getWorkflowStaticData('node');
				const webhook = (response.webhook ?? response) as { id?: string };
				if (!webhook.id) return false;
				webhookData.webhookId = webhook.id;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (!webhookData.webhookId) return true;
				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'asyntaiApi', {
						method: 'DELETE',
						url: `https://asyntai.com/api/v1/webhooks/${webhookData.webhookId}/`,
						json: true,
					});
				} catch (error) {
					// Surface the failure instead of hiding it — a webhook left
					// behind on the Asyntai side would keep sending events.
					this.logger.error(
						`Asyntai Trigger: failed to delete webhook ${webhookData.webhookId}`,
						{ error },
					);
					return false;
				}
				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
