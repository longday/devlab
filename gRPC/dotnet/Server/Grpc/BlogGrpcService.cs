// unset

namespace Server.Grpc
{
    using Blog;
    using global::Grpc.Core;
    using Google.Protobuf.Collections;
    using NodaTime.Serialization.Protobuf;
    using Services;
    using System.Linq;
    using System.Threading.Tasks;

    public class BlogGrpcService : Blog.BlogBase
    {
        private readonly BlogService _blogService;

        public BlogGrpcService(BlogService blogService)
        {
            _blogService = blogService;
        }

        public override async Task<ResponseMsg> GetBlogs(RequestMsg request, ServerCallContext context)
        {
            var blogs = await _blogService.Get(request.Limit);
            return new ResponseMsg
            {
                Blogs =
                {
                    new RepeatedField<BlogDto>
                    {
                        blogs.Select(c => new BlogDto
                        {
                            Id = c.Id.ToString(),
                            Name = c.Name,
                            CreateAt = c.CreateAt.ToTimestamp(),
                            Posts =
                            {
                                c.Posts.Select(z => new PostDto
                                {
                                    Id = z.Id.ToString(),
                                    Name = z.Name,
                                    CreateAt = z.CreateAt.ToTimestamp(),
                                    Tags = {z.Tags}
                                })
                            }
                        })
                    }
                }
            };
        }
    }
}