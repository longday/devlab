namespace Server.Dto
{
    using NodaTime;
    using System;
    using System.Collections.Generic;

    public class Blog
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Instant CreateAt { get; set; }
        public List<Post> Posts {get; set;} = new ();
    }
}