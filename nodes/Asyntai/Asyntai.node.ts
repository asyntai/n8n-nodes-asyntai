import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import type { NodeConnectionType } from 'n8n-workflow';

export class Asyntai implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Asyntai',
		name: 'asyntai',
		icon: 'file:asyntai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Interact with the Asyntai AI chatbot: send messages, fetch leads and conversations, manage the knowledge base',
		defaults: {
			name: 'Asyntai',
		},
		inputs: ['main' as NodeConnectionType],
		outputs: ['main' as NodeConnectionType],
		credentials: [
			{
				name: 'asyntaiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://asyntai.com/api/v1',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Conversation', value: 'conversation' },
					{ name: 'Knowledge', value: 'knowledge' },
					{ name: 'Lead', value: 'lead' },
					{ name: 'Session', value: 'session' },
					{ name: 'Website', value: 'website' },
				],
				default: 'chat',
			},

			// ---------- Chat ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['chat'] } },
				options: [
					{
						name: 'Send Message',
						value: 'send',
						action: 'Send a message to the AI',
						description: 'Send a message and receive an AI-generated response',
						routing: {
							request: {
								method: 'POST',
								url: '/chat/',
							},
						},
					},
				],
				default: 'send',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				default: '',
				description: 'The message to send to the AI',
				displayOptions: { show: { resource: ['chat'], operation: ['send'] } },
				routing: { send: { type: 'body', property: 'message' } },
			},
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				default: '',
				description:
					'Conversation identifier. Use the same session ID to maintain conversation history.',
				displayOptions: { show: { resource: ['chat'], operation: ['send'] } },
				routing: { send: { type: 'body', property: 'session_id' } },
			},
			{
				displayName: 'Website ID',
				name: 'websiteId',
				type: 'string',
				default: '',
				description: 'Specific website ID. If empty, your primary website is used.',
				displayOptions: { show: { resource: ['chat'], operation: ['send'] } },
				routing: { send: { type: 'body', property: 'website_id' } },
			},

			// ---------- Lead ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['lead'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many leads',
						description:
							'Retrieve collected leads (emails and phone numbers from chat conversations)',
						routing: {
							request: {
								method: 'GET',
								url: '/leads/',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { resource: ['lead'], operation: ['getAll'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},
			{
				displayName: 'Website ID',
				name: 'websiteId',
				type: 'string',
				default: '',
				description: 'Filter leads by a specific website ID',
				displayOptions: { show: { resource: ['lead'], operation: ['getAll'] } },
				routing: { send: { type: 'query', property: 'website_id' } },
			},

			// ---------- Conversation ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['conversation'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a conversation',
						description: 'Retrieve the message history of a chat session',
						routing: {
							request: {
								method: 'GET',
								url: '/conversations/',
							},
						},
					},
				],
				default: 'get',
			},
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				default: '',
				description: 'The chat session to retrieve',
				displayOptions: { show: { resource: ['conversation'], operation: ['get'] } },
				routing: { send: { type: 'query', property: 'session_id' } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 50,
				description: 'Max number of results to return',
				displayOptions: { show: { resource: ['conversation'], operation: ['get'] } },
				routing: { send: { type: 'query', property: 'limit' } },
			},

			// ---------- Session ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['session'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many sessions',
						description: 'List recent chat sessions',
						routing: {
							request: {
								method: 'GET',
								url: '/sessions/',
							},
						},
					},
				],
				default: 'getAll',
			},

			// ---------- Website ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['website'] } },
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many websites',
						description: 'List all websites on your account',
						routing: {
							request: {
								method: 'GET',
								url: '/websites/',
							},
						},
					},
				],
				default: 'getAll',
			},

			// ---------- Account ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get account info',
						description: 'Get account information and usage statistics',
						routing: {
							request: {
								method: 'GET',
								url: '/account/',
							},
						},
					},
				],
				default: 'get',
			},

			// ---------- Knowledge ----------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['knowledge'] } },
				options: [
					{
						name: 'Add Text',
						value: 'addText',
						action: 'Add text to the knowledge base',
						routing: {
							request: {
								method: 'POST',
								url: '/knowledge/text/',
							},
						},
					},
					{
						name: 'Add URL',
						value: 'addUrl',
						action: 'Add a URL to the knowledge base',
						description: 'Crawl a URL and add its content to the knowledge base',
						routing: {
							request: {
								method: 'POST',
								url: '/knowledge/url/',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a knowledge base entry',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/knowledge/{{$parameter.knowledgeId}}/',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many knowledge base entries',
						routing: {
							request: {
								method: 'GET',
								url: '/knowledge/',
							},
						},
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['knowledge'], operation: ['addText'] } },
				routing: { send: { type: 'body', property: 'title' } },
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['knowledge'], operation: ['addText'] } },
				routing: { send: { type: 'body', property: 'content' } },
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['knowledge'], operation: ['addUrl'] } },
				routing: { send: { type: 'body', property: 'url' } },
			},
			{
				displayName: 'Knowledge Entry ID',
				name: 'knowledgeId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the entry to delete (from Get Many)',
				displayOptions: { show: { resource: ['knowledge'], operation: ['delete'] } },
			},
			{
				displayName: 'Website ID',
				name: 'websiteId',
				type: 'string',
				default: '',
				description: 'Specific website ID. If empty, your primary website is used.',
				displayOptions: {
					show: { resource: ['knowledge'], operation: ['addText', 'addUrl', 'getAll'] },
				},
				routing: { send: { type: 'body', property: 'website_id' } },
			},
		],
	};
}
