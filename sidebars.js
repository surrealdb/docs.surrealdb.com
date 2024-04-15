export default {
  default: [
    {
      type: 'doc',
      id: 'index',
      label: "overview"
    },
    {
      type: "category",
      label: "Products",
      items: [
        {
          type: "link",
          label: "SurrealDB",
          href: "/docs/surrealdb"
        },
        {
          type: "link",
          label: "SurrealML",
          href: "/docs/surrealml"
        }
      ]
    },
    {
      type: "category",
      label: "SDKs",
      items: [
        {
          type: "link",
          label: "Rust",
          href: "/docs/surrealdb/integration/sdks/rust"
        },
        {
          type: "link",
          label: "JavaScript",
          href: "/docs/surrealdb/integration/sdks/javascript"
        },
        {
          type: "link",
          label: "Python",
          href: "/docs/surrealdb/integration/sdks/python"
        },
        {
          type: "link",
          label: "Node.js",
          href: "/docs/surrealdb/integration/sdks/nodejs"
        },
        {
          type: "link",
          label: "Deno",
          href: "/docs/surrealdb/integration/sdks/deno"
        },
        {
          type: "link",
          label: ".NET",
          href: "/docs/surrealdb/integration/sdks/dotnet"
        },
        {
          type: "link",
          label: "Golang",
          href: "/docs/surrealdb/integration/sdks/golang"
        },
        {
          type: "link",
          label: "Java",
          href: "/docs/surrealdb/integration/sdks/java"
        },
      ]
    },
    {
      type: "category",
      label: "Tools",
      items: [
        {
          type: "link",
          label: "CLI Tool",
          href: "/docs/surrealdb/cli"
        },
        {
          type: "link",
          label: "Surrealist",
          href: "/docs/surrealist"
        }
      ]
    }
  ]
}