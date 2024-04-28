import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag'; 


/* The `interface Product` in the provided TypeScript code is defining the structure of a product
object. It specifies the properties that a product object can have along with their data types.
Here's a breakdown of the properties defined in the `Product` interface: */
interface Product {
  id: number;
  title: string;
  description?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
}


/* The `dummyProducts` object is serving as a placeholder for a collection of products. It contains an
array named `products` which holds individual product objects. Each product object within the
`products` array represents a specific product with properties like `id`, `title`, `description`,
`price`, `discountPercentage`, `rating`, `stock`, `brand`, and `category`. */
let dummyProducts = {
  products: [
    {
      id: 1,
      title: 'iPhone 9',
      description: 'An apple mobile which is nothing like apple',
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      brand: 'Apple',
      category: 'smartphones',
    },
  ],
  total: 100,
  skip: 0,
  limit: 30,
};


/* The `const typeDefs` in the provided TypeScript code is defining the GraphQL schema using the `gql`
function from the `graphql-tag` library. This schema defines the structure of the GraphQL API that
the server will expose. Here's a breakdown of what the schema is doing: */
const typeDefs = gql`
  type Query {
    getProducts: [Product]
  }

  type Mutation {
    createProduct(product: ProductInput): Product
    deleteProduct(id: Int!): String
  }

  input ProductInput {
    title: String
    description: String
    price: Float
    discountPercentage: Float
    rating: Float
    brand: String
    category: String
    thumbnail: String
    images: [String]
  }

  type Product {
    id: Int
    title: String
    description: String
    price: Float
    discountPercentage: Float
    rating: Float
    brand: String
    category: String
    thumbnail: String
    stock: Int
    images: [String]
  }

  type Image {
    url: String
  }
`;

/* The `const resolvers` object in the provided TypeScript code is defining resolver functions for the
GraphQL operations defined in the schema. Resolvers are responsible for fetching the data for the
fields in the schema. Here's a breakdown of what each resolver function is doing: */
const resolvers = {
  Query: {
    getProducts: () => dummyProducts.products,
  },
  Mutation: {
    createProduct: (
      root: unknown,
      args: { product: ProductInput },
      context: unknown,
      info: unknown
    ): Product => {
      const newProduct = {
        ...args.product,
        id: dummyProducts.products.length + 1, 
      };
      dummyProducts.products.push(newProduct); 
      return newProduct;
    },
    deleteProduct: (
      root: unknown,
      args: { id: number },
      context: unknown,
      info: unknown
    ): string => {
      const productIndex = dummyProducts.products.findIndex(
        (product) => product.id === args.id
      );
      if (productIndex !== -1) {
        dummyProducts.products.splice(productIndex, 1);
        return 'Product successfully deleted';
      }
      return 'Product not found';
    },
  },
};


/* The code snippet you provided is setting up an Apollo Server instance with the defined GraphQL
schema (`typeDefs`) and resolver functions (`resolvers`). */
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
