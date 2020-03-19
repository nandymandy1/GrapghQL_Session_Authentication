import { gql } from 'apollo-server-express';

export default gql`
    extend type Query {
        user(id: ID): User @auth
        users: [User!]! @auth
        me:User @auth
    }

    extend type Mutation {
        register(
            name: String!, 
            email: String!, 
            username: String!, 
            password: String!
        ): User @guest

        login(
            username: String!,
            password: String!
        ): User @guest
        
        logout:Boolean @auth
    }

    type User {
        id: ID!
        name: String!
        email: String!
        username: String!
        createdAt: String!
    }
`