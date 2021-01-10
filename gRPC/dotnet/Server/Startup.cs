using Microsoft.AspNetCore.Mvc;

[assembly: ApiController]

namespace Server
{
    using Grpc;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using NodaTime;
    using NodaTime.Serialization.SystemTextJson;
    using Services;

    public class Startup
    {
        private IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<BlogService>();

            services
                .AddControllers()
                .AddJsonOptions((opt =>
                        opt
                            .JsonSerializerOptions
                            .ConfigureForNodaTime(DateTimeZoneProviders.Tzdb)
                    )
                );

            services.AddGrpc(o =>
            {
                o.EnableDetailedErrors = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage();
            app.UseRouting();

            app.UseGrpcWeb(new GrpcWebOptions {DefaultEnabled = true});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapGrpcService<BlogGrpcService>();
                endpoints.MapGrpcService<GreeterGrpcService>();
            });
        }
    }
}