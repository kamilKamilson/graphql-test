export default `
    type Boat {
        id: Int!
        title: String!
        description: String!
        userId: Int!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        allBoats: [Boat!]!
        getBoat(id: Int!): Boat!
    }

    extend type Mutation {
       createBoat(title: String!, description: String!): Boat
    }
`;
