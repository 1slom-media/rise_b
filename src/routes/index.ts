import { Router } from "express";
import users from "../controllers/users";
import checkToken from "../middlewares/checkToken";
import country from "../controllers/country";
import upload from "../utils/multer";
import company from "../controllers/company";
import category from "../controllers/category";
import admin from "../controllers/admin";
import sub_category from "../controllers/sub_category";
import brand from "../controllers/brand";
import cards from "../controllers/cards";
import size from "../controllers/size";
import products from "../controllers/products";
import parametrs from "../controllers/parametrs";
import prices from "../controllers/prices";
import charactics from "../controllers/charactics";
import cart from "../controllers/cart";

const router = Router()

// route admin
router.get("/admin", admin.Get);
router.get("/admin/:id", admin.GetId);
router.post("/admin", upload.single('image'), checkToken, admin.Post);
router.post("/admin-login", admin.SignIn);
router.put("/admin/:id", upload.single('image'), checkToken, admin.Put);

// route users
router.get("/users", users.Get);
router.get("/users/:id", users.GetId);
router.post("/signup-email", users.SignUpEmail);
router.post("/signup-phone", users.SignUpPhone);
router.post("/signin-email", users.SignInEmail);
router.post("/signin-phone", users.SignInPhone);
router.post("/verify-email", users.VerifyEmail);
router.post("/verify-phone", users.VerifyPhone);
router.post("/resend-email", users.ResendCodeEmail);
router.post("/resend-phone", users.ResendCodePhone);
router.put("/users/:id", checkToken, users.Put);
router.get("/auth/google", users.GoogleAuth);
router.get("/auth/login/success", users.Succsess);
router.get("/auth/login/failed", users.Failed);
router.get("/auth/logout", users.LogOut);
router.get("/auth/google/callback", users.GoogleCallback);
router.delete("/forgot-password/:id", checkToken, users.ForgotPassword);

// route country
router.get("/country", country.Get);
router.get("/country/:id", country.GetId);
router.post("/country", upload.single('image'), checkToken, country.Post);
router.put("/country/:id", upload.single('image'), checkToken, country.Put);
router.delete("/country/:id", checkToken, country.Delete);

// route company
router.get("/company", company.Get);
router.get("/company/:id", company.GetId);
router.post("/company", upload.single('image'), checkToken, company.Post);
router.put("/company/:id", upload.single('image'), checkToken, company.Put);
router.delete("/company/:id", checkToken, company.Delete);

// route category
router.get("/category", category.Get);
router.get("/category/:id", category.GetId);
router.post("/category", upload.single('image'), checkToken, category.Post);
router.put("/category/:id", upload.single('image'), checkToken, category.Put);
router.delete("/category/:id", checkToken, category.Delete);

// route sub_category
router.get("/sub_category", sub_category.Get);
router.get("/sub_category/:id", sub_category.GetId);
router.post("/sub_category", checkToken, sub_category.Post);
router.put("/sub_category/:id", checkToken, sub_category.Put);
router.delete("/sub_category/:id", checkToken, sub_category.Delete);

// route brand
router.get("/brand", brand.Get);
router.get("/brand/:id", brand.GetId);
router.post("/brand", checkToken, brand.Post);
router.put("/brand/:id", checkToken, brand.Put);
router.delete("/brand/:id", checkToken, brand.Delete);

// route cart
router.get("/cart", cart.Get);
router.get("/cart/:id", cart.GetId);
router.post("/cart", checkToken, cart.Post);
router.put("/cart/:id", checkToken, cart.Put);
router.delete("/cart/:id", checkToken, cart.Delete);

// route cards
router.get("/cards", cards.Get);
router.get("/cards/:id", cards.GetId);
router.post("/cards", checkToken, cards.Post);
router.put("/cards/:id", checkToken, cards.Put);
router.delete("/cards/:id", checkToken, cards.Delete);

// route size
router.get("/size", size.Get);
router.get("/size/:id", size.GetId);
router.post("/size", checkToken, size.Post);
router.put("/size/:id", checkToken, size.Put);
router.delete("/size/:id", checkToken, size.Delete);

// route products
router.get("/products", products.Get);
router.get("/products/:id", products.GetId);
router.post("/products", checkToken, products.Post);
router.put("/products/:id", checkToken, products.Put);
router.delete("/products/:id", checkToken, products.Delete);

// route prices
router.get("/prices", prices.Get);
router.get("/prices/:id", prices.GetId);
router.post("/prices", checkToken, prices.Post);
router.put("/prices/:id", checkToken, prices.Put);
router.delete("/prices/:id", checkToken, prices.Delete);

// route charactics
router.get("/charactics", charactics.Get);
router.get("/charactics/:id", charactics.GetId);
router.post("/charactics", checkToken, charactics.Post);
router.put("/charactics/:id", checkToken, charactics.Put);
router.delete("/charactics/:id", checkToken, charactics.Delete);

// route parametrs
router.get("/parametrs", parametrs.Get);
router.get("/parametrs/:id", parametrs.GetId);
router.post("/parametrs", upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }]), checkToken, parametrs.Post);
router.put("/parametrs/:id", upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }]), checkToken, parametrs.Put);
router.delete("/parametrs/:id", checkToken, parametrs.Delete);

export default router;
