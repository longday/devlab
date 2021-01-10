namespace Server.Controllers
{
    using Dto;
    using Services;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Mvc;
    using System.Linq;
    using System.Threading.Tasks;

    [Route("api")]
    public class BlogController : ControllerBase
    {
        private readonly BlogService _blogService;

        public BlogController(BlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet("blogs/{limit}")]
        public async Task<List<BlogDto>> GetBlogs([FromRoute] int limit)
        {
            var list = await _blogService.Get(limit);
            return list.Select(c => new BlogDto
            {
                Id = c.Id,
                Name = c.Name,
                CreateAt = c.CreateAt,
                Posts = c.Posts.Select(z => new PostDto
                {
                    Id = z.Id, Name = z.Name, Tags = z.Tags, CreateAt = z.CreateAt
                }).ToList()
            }).ToList();
        }
    }
}