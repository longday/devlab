namespace Server.Dto
{
    using NodaTime;
    using System;
    using System.Collections.Generic;

    public class PostDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Instant CreateAt { get; set; }
        public List<string> Tags { get; set; } = new ();
    }
}