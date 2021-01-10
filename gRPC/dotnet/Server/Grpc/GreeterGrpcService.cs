// unset

namespace Server.Grpc
{
    using global::Grpc.Core;
    using Greet;
    using Services;
    using System;
    using System.Threading.Tasks;

    public class GreeterGrpcService : Greeter.GreeterBase
    {
        private readonly BlogService _blogService;

        public GreeterGrpcService(BlogService blogService)
        {
            _blogService = blogService;
        }

        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            return Task.FromResult(new HelloReply { Message = $"Hello {request.Name}" });
        }

        public override async Task SayHellos(HelloRequest request, IServerStreamWriter<HelloReply> responseStream, ServerCallContext context)
        {
            var i = 0;
            while (!context.CancellationToken.IsCancellationRequested)
            {
                await responseStream.WriteAsync(new HelloReply { Message = $"Hello {request.Name} {i}" });
                await Task.Delay(TimeSpan.FromSeconds(1));
                i++;
            }
        }
    }
}