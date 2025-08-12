export interface IErrorSource {
	path: string;
	message: string;
}

export interface IGenericErrorResponse {
	statusCode: number;
	message: string;
	errorSources?: IErrorSource[];
}