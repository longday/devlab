/* eslint-disable new-cap */
import { grpc } from '@improbable-eng/grpc-web';
import { BlogClientImpl, GrpcWebImpl } from './generated/blog';

export class GrpcClient {
  private baseUrl: string;

  private readonly authToken?: string;

  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private GetClientConfig = async () => {
    const headers = new Headers();
    if (this.authToken) {
      headers.append('Authorization', `Bearer ${this.authToken}`);
    }
    return {
      debug: true,
      metadata: new grpc.Metadata(headers),
    };
  };

  private blogClient?: BlogClientImpl;

  public GetBlogClient = async () => {
    if (!this.blogClient) {
      this.blogClient = new BlogClientImpl(
        new GrpcWebImpl(this.baseUrl, await this.GetClientConfig()),
      );
    }
    return this.blogClient;
  };
}
