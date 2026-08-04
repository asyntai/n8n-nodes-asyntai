import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class AsyntaiApi implements ICredentialType {
	name = 'asyntaiApi';

	displayName = 'Asyntai API';

	icon: Icon = {
		light: 'file:../nodes/Asyntai/asyntai.svg',
		dark: 'file:../nodes/Asyntai/asyntai.dark.svg',
	};

	documentationUrl = 'https://asyntai.com/documentation/api/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your Asyntai API key. Find it at https://asyntai.com/settings/api/',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://asyntai.com/api/v1',
			url: '/account/',
		},
	};
}
