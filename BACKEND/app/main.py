from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core import database  # Import the database module


from app.route.product.category_routes import router as category_router
from app.route.product.order_routes import router as order_router
from app.route.product.product_routes import router as product_router
from app.route.product.review_routes import router as review_router
from app.route.user.user_routes import router as user_router
from app.route.user.address_routes import router as address_router
from app.route.user.cart_routes import router as cart_router
from app.route.utility.coupon_routes import router as coupon_router
from app.route.utility.wishlist_routes import router as wishlist_router

app = FastAPI(title='Ecom-framework')

app.include_router(category_router)
app.include_router(order_router)
app.include_router(product_router)
app.include_router(review_router)
app.include_router(user_router)
app.include_router(address_router)
app.include_router(cart_router)
app.include_router(coupon_router)
app.include_router(wishlist_router)

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def root():
    return{"message":"E-commerce is online"}