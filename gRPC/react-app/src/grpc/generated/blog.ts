/* eslint-disable */
import { BrowserHeaders } from 'browser-headers';
import { grpc } from '@improbable-eng/grpc-web';
import { Timestamp } from './google/protobuf/timestamp';
import * as Long from 'long';
import { Writer, Reader, util, configure } from 'protobufjs/minimal';
import { UnaryMethodDefinition } from '@improbable-eng/grpc-web/dist/typings/service';


export interface RequestMsg {
  limit: number;
}

export interface ResponseMsg {
  blogs: BlogDto[];
}

export interface BlogDto {
  id: string;
  name: string;
  createAt?: Date;
  posts: PostDto[];
}

export interface PostDto {
  id: string;
  name: string;
  createAt?: Date;
  tags: string[];
}

const baseRequestMsg: object = {
  limit: 0,
};

const baseResponseMsg: object = {
};

const baseBlogDto: object = {
  id: "",
  name: "",
};

const basePostDto: object = {
  id: "",
  name: "",
  tags: "",
};

export interface Blog {

  getBlogs(request: DeepPartial<RequestMsg>, metadata?: grpc.Metadata): Promise<ResponseMsg>;

}

export class BlogClientImpl implements Blog {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  getBlogs(request: DeepPartial<RequestMsg>, metadata?: grpc.Metadata): Promise<ResponseMsg> {
    return this.rpc.unary(BloggetBlogsDesc, RequestMsg.fromPartial(request), metadata);
  }

}

interface Rpc {

  unary<T extends UnaryMethodDefinitionish>(methodDesc: T, request: any, metadata: grpc.Metadata | undefined): Promise<any>;

}

export class GrpcWebImpl implements Rpc {

  private host: string;

  private options: { transport?: grpc.TransportFactory, debug?: boolean, metadata?: grpc.Metadata | undefined };

  constructor(host: string, options: { transport?: grpc.TransportFactory, debug?: boolean, metadata?: grpc.Metadata | undefined }) {
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

}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds.toNumber() * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

export const protobufPackage = 'blog'

export const RequestMsg = {
  encode(message: RequestMsg, writer: Writer = Writer.create()): Writer {
    writer.uint32(8).int32(message.limit);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): RequestMsg {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRequestMsg } as RequestMsg;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.limit = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): RequestMsg {
    const message = { ...baseRequestMsg } as RequestMsg;
    if (object.limit !== undefined && object.limit !== null) {
      message.limit = Number(object.limit);
    }
    return message;
  },
  fromPartial(object: DeepPartial<RequestMsg>): RequestMsg {
    const message = { ...baseRequestMsg } as RequestMsg;
    if (object.limit !== undefined && object.limit !== null) {
      message.limit = object.limit;
    }
    return message;
  },
  toJSON(message: RequestMsg): unknown {
    const obj: any = {};
    message.limit !== undefined && (obj.limit = message.limit);
    return obj;
  },
};

export const ResponseMsg = {
  encode(message: ResponseMsg, writer: Writer = Writer.create()): Writer {
    for (const v of message.blogs) {
      BlogDto.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ResponseMsg {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseResponseMsg } as ResponseMsg;
    message.blogs = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blogs.push(BlogDto.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ResponseMsg {
    const message = { ...baseResponseMsg } as ResponseMsg;
    message.blogs = [];
    if (object.blogs !== undefined && object.blogs !== null) {
      for (const e of object.blogs) {
        message.blogs.push(BlogDto.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<ResponseMsg>): ResponseMsg {
    const message = { ...baseResponseMsg } as ResponseMsg;
    message.blogs = [];
    if (object.blogs !== undefined && object.blogs !== null) {
      for (const e of object.blogs) {
        message.blogs.push(BlogDto.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: ResponseMsg): unknown {
    const obj: any = {};
    if (message.blogs) {
      obj.blogs = message.blogs.map(e => e ? BlogDto.toJSON(e) : undefined);
    } else {
      obj.blogs = [];
    }
    return obj;
  },
};

export const BlogDto = {
  encode(message: BlogDto, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.name);
    if (message.createAt !== undefined && message.createAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createAt), writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.posts) {
      PostDto.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): BlogDto {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseBlogDto } as BlogDto;
    message.posts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.createAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 4:
          message.posts.push(PostDto.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): BlogDto {
    const message = { ...baseBlogDto } as BlogDto;
    message.posts = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.createAt !== undefined && object.createAt !== null) {
      message.createAt = fromJsonTimestamp(object.createAt);
    }
    if (object.posts !== undefined && object.posts !== null) {
      for (const e of object.posts) {
        message.posts.push(PostDto.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<BlogDto>): BlogDto {
    const message = { ...baseBlogDto } as BlogDto;
    message.posts = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.createAt !== undefined && object.createAt !== null) {
      message.createAt = object.createAt;
    }
    if (object.posts !== undefined && object.posts !== null) {
      for (const e of object.posts) {
        message.posts.push(PostDto.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: BlogDto): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.createAt !== undefined && (obj.createAt = message.createAt !== undefined ? message.createAt.toISOString() : null);
    if (message.posts) {
      obj.posts = message.posts.map(e => e ? PostDto.toJSON(e) : undefined);
    } else {
      obj.posts = [];
    }
    return obj;
  },
};

export const PostDto = {
  encode(message: PostDto, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.id);
    writer.uint32(18).string(message.name);
    if (message.createAt !== undefined && message.createAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createAt), writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.tags) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): PostDto {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...basePostDto } as PostDto;
    message.tags = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.createAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 4:
          message.tags.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): PostDto {
    const message = { ...basePostDto } as PostDto;
    message.tags = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    if (object.createAt !== undefined && object.createAt !== null) {
      message.createAt = fromJsonTimestamp(object.createAt);
    }
    if (object.tags !== undefined && object.tags !== null) {
      for (const e of object.tags) {
        message.tags.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<PostDto>): PostDto {
    const message = { ...basePostDto } as PostDto;
    message.tags = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    if (object.createAt !== undefined && object.createAt !== null) {
      message.createAt = object.createAt;
    }
    if (object.tags !== undefined && object.tags !== null) {
      for (const e of object.tags) {
        message.tags.push(e);
      }
    }
    return message;
  },
  toJSON(message: PostDto): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.createAt !== undefined && (obj.createAt = message.createAt !== undefined ? message.createAt.toISOString() : null);
    if (message.tags) {
      obj.tags = message.tags.map(e => e);
    } else {
      obj.tags = [];
    }
    return obj;
  },
};

export const BlogDesc = {
  serviceName: "blog.Blog",
}
export const BloggetBlogsDesc: UnaryMethodDefinitionish = {
  methodName: "getBlogs",
  service: BlogDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary: function serializeBinary() {
      return RequestMsg.encode(this).finish();
    }
    ,
  } as any,
  responseType: {
    deserializeBinary: function deserializeBinary(data: Uint8Array) {
      return { ...ResponseMsg.decode(data), toObject() { return this; } };
    }
    ,
  } as any,
}
interface UnaryMethodDefinitionishR extends UnaryMethodDefinition<any, any> { requestStream: any; responseStream: any; };
type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

if (util.Long !== Long as any) {
  util.Long = Long as any;
  configure();
}

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