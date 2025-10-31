import { OAuth2Type, connection, oauth2Connection } from "@prismatic-io/spectral";

export const googleOAuthConnection = oauth2Connection({
	oauth2Type: OAuth2Type.AuthorizationCode,
	key: "googleOAuth",
	display: {
		label: "Google OAuth 2.0",
		description: "Authenticate requests to Google Cloud Storage using Google OAuth 2.0",
	},
	inputs: {
		authorizeUrl: {
			label: "Authorize URL",
			placeholder: "Enter authorize URL",
			type: "string",
			required: true,
			shown: false,
			default: "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent",
		},
		tokenUrl: {
			label: "Token URL",
			placeholder: "Enter token URL",
			type: "string",
			required: true,
			shown: false,
			default: "https://oauth2.googleapis.com/token",
		},
		scopes: {
			label: "Scopes",
			placeholder: "Enter OAuth scopes",
			type: "string",
			required: true,
			shown: true,
			default: "https://www.googleapis.com/auth/devstorage.read_write",
			comments:
				"OAuth scopes for Google Cloud Storage. See https://developers.google.com/identity/protocols/oauth2/scopes#storage for available scopes.",
		},
		clientId: {
			label: "Client ID",
			placeholder: "Enter Client ID",
			type: "string",
			required: true,
			shown: true,
			comments: "The Client ID from the Google Cloud Console OAuth credentials.",
			example: "123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com",
		},
		clientSecret: {
			label: "Client Secret",
			placeholder: "Enter Client Secret",
			type: "password",
			required: true,
			shown: true,
			comments: "The Client Secret from the Google Cloud Console OAuth credentials.",
		},
		projectId: {
			label: "Project ID",
			placeholder: "Enter GCP Project ID",
			type: "string",
			required: true,
			shown: true,
			comments: "The ID of the Google Cloud Platform project that hosts the storage bucket.",
			example: "my-project-123456",
		},
	},
});

export const googlePrivateKeyConnection = connection({
	key: "privateKey",
	display: {
		label: "Google Cloud Storage Private Key",
		description: "Authenticate requests to Google Cloud Storage using a Private Key",
	},
	inputs: {
		clientEmail: {
			label: "Client Email",
			placeholder: "Enter service account email",
			type: "string",
			required: true,
			shown: true,
			comments: "The service account email address from the JSON key file.",
			example: "my-service-account@my-project-123456.iam.gserviceaccount.com",
		},
		privateKey: {
			label: "Private Key",
			placeholder: "Enter private key",
			type: "text",
			required: true,
			shown: true,
			comments:
				"The private key from the JSON key file. Include the entire key including BEGIN and END markers.",
			example: "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBg...\\n-----END PRIVATE KEY-----\\n",
		},
		projectId: {
			label: "Project ID",
			placeholder: "Enter GCP Project ID",
			type: "string",
			required: true,
			shown: true,
			comments: "The ID of the Google Cloud Platform project that hosts the storage bucket.",
			example: "my-project-123456",
		},
	},
});

export default [googleOAuthConnection, googlePrivateKeyConnection];
