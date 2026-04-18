import { gql } from 'graphql-tag';

export const ordersTypeDefs = gql`
    enum OrderStatus {
        pending
        confirmed
        paid
        shipped
        completed
        cancelled
    }

    type OrderCustomer {
        _id: ID!
        firstName: String
        lastName: String
        email: String!
    }

    type OrderItem {
        product: ID!
        title: String!
        price: Float!
        quantity: Int!
        coverImage: String
        seller: ID!
    }

    type DeliveryInfo {
        provider: String!
        cityId: String!
        cityName: String!
        warehouseId: String!
        warehouseName: String!
        recipientFullName: String!
        recipientPhone: String!
        postalCode: String
        addressLine: String
    }

    type Order {
        _id: ID!
        customer: OrderCustomer!
        items: [OrderItem!]!
        subtotal: Float!
        deliveryCost: Float!
        total: Float!
        status: OrderStatus!
        paymentMethod: String!
        delivery: DeliveryInfo!
        createdAt: String!
        updatedAt: String!
    }

    type OrdersListResponse {
        items: [Order!]!
        total: Int!
    }

    extend type Query {
        adminOrders(
            page: Int = 1
            limit: Int = 10
            status: OrderStatus
            search: String
        ): OrdersListResponse!

        adminOrder(id: ID!): Order
    }

    extend type Mutation {
        adminUpdateOrderStatus(id: ID!, status: OrderStatus!): Order!
    }
`;