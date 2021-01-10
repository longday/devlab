// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: blog.proto
// </auto-generated>
#pragma warning disable 0414, 1591
#region Designer generated code

using grpc = global::Grpc.Core;

namespace Blog {
  public static partial class Blog
  {
    static readonly string __ServiceName = "blog.Blog";

    static void __Helper_SerializeMessage(global::Google.Protobuf.IMessage message, grpc::SerializationContext context)
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (message is global::Google.Protobuf.IBufferMessage)
      {
        context.SetPayloadLength(message.CalculateSize());
        global::Google.Protobuf.MessageExtensions.WriteTo(message, context.GetBufferWriter());
        context.Complete();
        return;
      }
      #endif
      context.Complete(global::Google.Protobuf.MessageExtensions.ToByteArray(message));
    }

    static class __Helper_MessageCache<T>
    {
      public static readonly bool IsBufferMessage = global::System.Reflection.IntrospectionExtensions.GetTypeInfo(typeof(global::Google.Protobuf.IBufferMessage)).IsAssignableFrom(typeof(T));
    }

    static T __Helper_DeserializeMessage<T>(grpc::DeserializationContext context, global::Google.Protobuf.MessageParser<T> parser) where T : global::Google.Protobuf.IMessage<T>
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (__Helper_MessageCache<T>.IsBufferMessage)
      {
        return parser.ParseFrom(context.PayloadAsReadOnlySequence());
      }
      #endif
      return parser.ParseFrom(context.PayloadAsNewBuffer());
    }

    static readonly grpc::Marshaller<global::Blog.RequestMsg> __Marshaller_blog_RequestMsg = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::Blog.RequestMsg.Parser));
    static readonly grpc::Marshaller<global::Blog.ResponseMsg> __Marshaller_blog_ResponseMsg = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::Blog.ResponseMsg.Parser));

    static readonly grpc::Method<global::Blog.RequestMsg, global::Blog.ResponseMsg> __Method_GetBlogs = new grpc::Method<global::Blog.RequestMsg, global::Blog.ResponseMsg>(
        grpc::MethodType.Unary,
        __ServiceName,
        "GetBlogs",
        __Marshaller_blog_RequestMsg,
        __Marshaller_blog_ResponseMsg);

    /// <summary>Service descriptor</summary>
    public static global::Google.Protobuf.Reflection.ServiceDescriptor Descriptor
    {
      get { return global::Blog.BlogReflection.Descriptor.Services[0]; }
    }

    /// <summary>Base class for server-side implementations of Blog</summary>
    [grpc::BindServiceMethod(typeof(Blog), "BindService")]
    public abstract partial class BlogBase
    {
      public virtual global::System.Threading.Tasks.Task<global::Blog.ResponseMsg> GetBlogs(global::Blog.RequestMsg request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

    }

    /// <summary>Creates service definition that can be registered with a server</summary>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    public static grpc::ServerServiceDefinition BindService(BlogBase serviceImpl)
    {
      return grpc::ServerServiceDefinition.CreateBuilder()
          .AddMethod(__Method_GetBlogs, serviceImpl.GetBlogs).Build();
    }

    /// <summary>Register service method with a service binder with or without implementation. Useful when customizing the  service binding logic.
    /// Note: this method is part of an experimental API that can change or be removed without any prior notice.</summary>
    /// <param name="serviceBinder">Service methods will be bound by calling <c>AddMethod</c> on this object.</param>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    public static void BindService(grpc::ServiceBinderBase serviceBinder, BlogBase serviceImpl)
    {
      serviceBinder.AddMethod(__Method_GetBlogs, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::Blog.RequestMsg, global::Blog.ResponseMsg>(serviceImpl.GetBlogs));
    }

  }
}
#endregion
