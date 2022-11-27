//DTO ===> Data Transfer Object
import {VendorPayload} from './vendor.dto'
import {UserPayload} from './user.dto'

export type AuthPayload = VendorPayload | UserPayload