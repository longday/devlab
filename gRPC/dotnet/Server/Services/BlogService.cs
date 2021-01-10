namespace Server.Services
{
    using Dto;
    using NodaTime;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class BlogService
    {
#pragma warning disable 1998
        public async Task<List<Blog>> Get(int length)
#pragma warning restore 1998
        {
            //db
            //await Task.Delay(0);
            
            var list = new List<Blog>();
            for (int i = 0; i < length; i++)
            {
                var posts = new List<Post>();
                for (int j = 0; j < length * 2; j++)
                {
                    posts.Add(new Post
                    {
                        Id = Guid.NewGuid(),
                        Name = Guid.NewGuid().ToString().ToLower().Replace("-", ""),
                        CreateAt = SystemClock.Instance.GetCurrentInstant(),
                        Tags = new List<string>
                        {
                            Guid.NewGuid().ToString().ToLower().Replace("-", ""),
                            Guid.NewGuid().ToString().ToLower().Replace("-", ""),
                            Guid.NewGuid().ToString().ToLower().Replace("-", ""),
                            Guid.NewGuid().ToString().ToLower().Replace("-", "")
                        }
                    });
                }
                
                list.Add(new Blog
                {
                    Id = Guid.NewGuid(),
                    Name = Guid.NewGuid().ToString().ToLower().Replace("-", ""),
                    CreateAt = SystemClock.Instance.GetCurrentInstant(),
                    Posts = posts
                });
            }
            return list;
        }
    }
}