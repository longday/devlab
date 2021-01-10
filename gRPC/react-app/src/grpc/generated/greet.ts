/* eslint-disable */
import { Observable } from 'rxjs';
import { BrowserHeaders } from 'browser-headers';
import { grpc } from '@improbable-eng/grpc-web';
import { Code } from '@improbable-eng/grpc-web/dist/typings/Code';
import { share } from 'rxjs/operators';
import { Writer, Reader } from 'protobufjs/minimal';
import { UnaryMethodDefinition } from '@improbable-eng/grpc-web/dist/typings/service';


/**
 *  The request message containing the user's name.
 */
export interface HelloRequest {
  name: string;
}

/**
 *  The response message containing the greetings
 */
export interface HelloReply {
  message: string;
}

const baseHelloRequest: object = {
  name: "",
};

const baseHelloReply: object = {
  message: "",
};

/**
 *  The greeting service definition.
 */
export interface Greeter {

  /**
   *  Sends a greeting
   */
  sayHello(request: DeepPartial<HelloRequest>, metadata?: grpc.Metadata): Promise<HelloReply>;

  sayHellos(request: DeepPartial<HelloRequest>, metadata?: grpc.Metadata): Observable<HelloReply>;

}

export class GreeterClientImpl implements Greeter {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  sayHello(request: DeepPartial<HelloRequest>, metadata?: grpc.Metadata): Promise<HelloReply> {
    return this.rpc.unary(GreetersayHelloDesc, HelloRequest.fromPartial(request), metadata);
  }

  sayHellos(request: DeepPartial<HelloRequest>, metadata?: grpc.Metadata): Observable<HelloReply> {
    return this.rpc.invoke(GreetersayHellosDesc, HelloRequest.fromPartial(request), metadata);
  }

}

interface Rpc {

  unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;

  invoke<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Observable<any>;

}

export class GrpcWebImpl implements Rpc {

  private host: string;

  private options: { transport?: grpc.TransportFactory, streamingTransport?: grpc.TransportFactory, debug?: boolean, metadata?: grpc.Metadata | undefined };

  constructor(host: string, options: { transport?: grpc.TransportFactory, streamingTransport?: grpc.TransportFactory, debug?: boolean, metadata?: grpc.Metadata | undefined }) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
        const maybeCombinedMetadata =
        metadata && this.options.metadata
          ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
          : metadata || this.options.metadata;
        return new Promise((resolve, reject) => {
          grpc.unary(methodDesc, {
            request,
            host: this.host,
            metadata: maybeCombinedMetadata,
            transport: this.options.transport,
            debug: this.options.debug,
            onEnd: function (response) {
              if (response.status === grpc.Code.OK) {
                resolve(response.message);
              } else {
                const err = new Error(response.statusMessage) as any;
                err.code = response.status;
                err.metadata = response.trailers;
                reject(err);
              }
            },
          });
        });}

  invoke<T extends UnaryMethodDefinitionish>(methodDesc: T, _request: any, metadata: grpc.Metadata | undefined): Observable<any> {
    const upStreamCodes = [2, 4, 8, 9, 10, 13, 14, 15]; /* Status Response Codes (https://developers.google.com/maps-booking/reference/grpc-api/status_codes) */
        const DEFAULT_TIMEOUT_TIME: number = 3 /* seconds */ * 1000 /* ms */;
        const request = { ..._request, ...methodDesc.requestType };
        const maybeCombinedMetadata =
        metadata && this.options.metadata
          ? new BrowserHeaders({ ...this.options?.metadata.headersMap, ...metadata?.headersMap })
          : metadata || this.options.metadata;
        return new Observable(observer => {
          const upStream = (() => {
            grpc.invoke(methodDesc, {
              host: this.host,
              request,
              transport: this.options.streamingTransport || this.options.transport,
              metadata: maybeCombinedMetadata,
              debug: this.options.debug,
              onMessage: (next) => observer.next(next),
              onEnd: (code: Code, message: string) => {
                if (code === 0) {
                  observer.complete();
                } else if (upStreamCodes.includes(code)) {
                  setTimeout(upStream, DEFAULT_TIMEOUT_TIME);
                } else {
                  observer.error(new Error(`Error ${code} ${message}`));
                }
              },
            });
          });
          upStream();
        }).pipe(share());
  }

}

export const protobufPackage = 'greet'

export const HelloRequest = {
  encode(message: HelloRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): HelloRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHelloRequest } as HelloRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): HelloRequest {
    const message = { ...baseHelloRequest } as HelloRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    return message;
  },
  fromPartial(object: DeepPartial<HelloRequest>): HelloRequest {
    const message = { ...baseHelloRequest } as HelloRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
  toJSON(message: HelloRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
};

export const HelloReply = {
  encode(message: HelloReply, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.message);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): HelloReply {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHelloReply } as HelloReply;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): HelloReply {
    const message = { ...baseHelloReply } as HelloReply;
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    }
    return message;
  },
  fromPartial(object: DeepPartial<HelloReply>): HelloReply {
    const message = { ...baseHelloReply } as HelloReply;
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    }
    return message;
  },
  toJSON(message: HelloReply): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },
};

export const GreeterDesc = {
  serviceName: "greet.Greeter",
}
export const GreetersayHelloDesc: UnaryMethodDefinitionish = {
  methodName: "sayHello",
  service: GreeterDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary: function serializeBinary() {
      return HelloRequest.encode(this).finish();
    }
    ,
  } as any,
  responseType: {
    deserializeBinary: function deserializeBinary(data: Uint8Array) {
      return { ...HelloReply.decode(data), toObject() { return this; } };
    }
    ,
  } as any,
}
export const GreetersayHellosDesc: UnaryMethodDefinitionish = {
  methodName: "sayHellos",
  service: GreeterDesc,
  requestStream: false,
  responseStream: true,
  requestType: {
    serializeBinary: function serializeBinary() {
      return HelloRequest.encode(this).finish();
    }
    ,
  } as any,
  responseType: {
    deserializeBinary: function deserializeBinary(data: Uint8Array) {
      return { ...HelloReply.decode(data), toObject() { return this; } };
    }
    ,
  } as any,
}
interface UnaryMethodDefinitionishR extends UnaryMethodDefinition<any, any> { requestStream: any; responseStream: any; };
type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string }
  ? { [K in keyof Omit<T, '$case'>]?: DeepPartial<T[K]> } & { $case: T['$case'] }
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;