const express = require("express");
const app = express();

const PORT = 4000;
const userData = require("./MOCK_DATA.json");

const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require("graphql");
const { graphqlHTTP } = require("express-graphql");


const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
]

const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of Kings', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'this represent a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => book.id === author.id)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'this represent a Author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
});


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of all Authors',
            resolve: () => authors
        },
        author: {
            type: BookType,
            description: 'A single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => authors.find(author =>author.id === args.id)
        },
    })
})

const schema = new GraphQLSchema({

    query: RootQueryType
});


app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(PORT, () => {
    console.log(`server is running at PORT ${PORT}`);
})