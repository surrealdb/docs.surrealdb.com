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
        },
        {
          type: "link",
          label: "Surrealist",
          href: "/docs/surrealist"
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
          href: "/docs/sdk/rust"
        },
        {
          type: "link",
          label: "JavaScript",
          href: "/docs/sdk/javascript"
        },
        {
          type: "link",
          label: "Python",
          href: "/docs/sdk/python"
        },
        {
          type: "link",
          label: "Node.js",
          href: "/docs/sdk/javascript"
        },
        // {
        //   type: "link",
        //   label: "Deno",
        //   href: "/docs/sdk/javascript"
        // },
        {
          type: "link",
          label: ".NET",
          href: "/docs/sdk/dotnet"
        },
        {
          type: "link",
          label: "Golang",
          href: "/docs/sdk/golang"
        },
        {
          type: "link",
          label: "Java",
          href: "/docs/sdk/java"
        },
      ]
    }
  ]
}