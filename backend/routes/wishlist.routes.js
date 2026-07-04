import express from 'express'
import { protect } from '../middlewares/auth.middleware.js';
import { addWishlist, getWishList, removeWishlist } from '../controllers/wishlist.controller.js';

const wishlistRouter = express.Router()

wishlistRouter.post('/:propertyId', protect, addWishlist)
wishlistRouter.get('/', protect, getWishList)
wishlistRouter.delete('/:propertyId', protect, removeWishlist)

export default wishlistRouter