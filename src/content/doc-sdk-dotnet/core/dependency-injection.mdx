---
sidebar_position: 8
sidebar_label: Dependency Injection
title: Dependency Injection | .NET | SDK | Concepts
description: The SurrealDB SDK for .NET also supports the concept of Dependency Injection pattern.
---

# Dependency Injection

The .NET SDK also support Dependency Injection to ease the use of the <code>SurrealDbClient</code> in your application.

## Create a new project

Let's start by creating a new ASP.NET Core web app.

```sh
dotnet new webapp -o SurrealDbWeatherApi
cd SurrealDbWeatherApi
dotnet add package SurrealDb.Net
```

## Define a Connection String

Open <code>appsettings.Development.json</code> and replace everything in there with the following code.
We have added a new Connection String called <code>SurrealDB</code> with the default configuration.

```bash
{
  "AllowedHosts": "*",
  "Logging": {
    "LogLevel": {
    "Default": "Information",
    "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "SurrealDB": "Server=http://127.0.0.1:8000;Namespace=test;Database=test;Username=root;Password=root"
  }
}
```

## Register services

Open <code>Program.cs</code> and replace everything in there with the following code.
This code is using the <code>AddSurreal()</code> extension method to inject services automatically.
Notice that all we have to do is one line of code to configure the SurrealDB client with the previously set Connection String.

> [!NOTE]
> By default, this function will register both <code>ISurrealDbClient</code> and <code>SurrealDbClient</code> using the <code>Singleton</code> service lifetime.


```csharp
var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

services.AddControllers();
services.AddEndpointsApiExplorer();
services.AddSwaggerGen();
services.AddSurreal(configuration.GetConnectionString("SurrealDB"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

> [!NOTE]
> In this example, we use a [Connection String](/docs/sdk/dotnet/core/connection-strings) to configure services.
> This is the most convenient way to initialize the <code>SurrealDbClient</code> in your application.
> You can always choose to construct a Connection String manually via a <code>SurrealDbOptionsBuilder</code> and pass it to the <code>AddSurreal()</code> method.

## Consume the SurrealDB client

Open <code>WeatherForecastController.cs</code> and replace everything in there with the following code.
Finally, we can inject the <code>ISurrealDbClient</code> inside our Controller.

```csharp
using Microsoft.AspNetCore.Mvc;

namespace SurrealDbWeatherApi.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
	private const string Table = "weatherForecast";

	private readonly ISurrealDbClient _surrealDbClient;

	public WeatherForecastController(ISurrealDbClient surrealDbClient)
	{
		_surrealDbClient = surrealDbClient;
	}

	[HttpGet]
	[Route("/")]
	public Task<List<WeatherForecast>> GetAll(CancellationToken cancellationToken)
	{
		return _surrealDbClient.Select<WeatherForecast>(Table, cancellationToken);
	}

	[HttpPost]
	[Route("/")]
	public Task<WeatherForecast> Create(CreateWeatherForecast data, CancellationToken cancellationToken)
	{
		var weatherForecast = new WeatherForecast
		{
			Date = data.Date,
			Country = data.Country,
			TemperatureC = data.TemperatureC,
			Summary = data.Summary
		};

		return _surrealDbClient.Create(Table, weatherForecast, cancellationToken);
	}

    // ...
	// Other methods omitted for brevity
}

public class CreateWeatherForecast
{
	public DateTime Date { get; set; }
	public string? Country { get; set; }
	public int TemperatureC { get; set; }
	public string? Summary { get; set; }
}
```

Then make sure your SurrealDB server is running on <code>127.0.0.1:8000</code> and run your app from the command line with:

```sh
dotnet run
```