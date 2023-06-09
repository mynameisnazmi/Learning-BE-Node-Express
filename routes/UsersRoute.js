const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const UsersMiddleware = require("../middleware/UsersMiddleware");

// Initialization
const router = Router();

router.post("/login", UsersController.login);
router.post("/register", UsersController.register);
router.post(
  "/savedata",
  UsersMiddleware.authenticateToken,
  UsersController.savedata
);

// router.delete("/delete/:nik", UsersController.deleteUser);
// router.get("/", UsersController.getAlluser);
// router.get("/products/:id", getProductById);
// router.post("/products", saveProduct);
// router.patch("/products/:id", updateProduct);
// router.delete("/products/:id", deleteProduct);

module.exports = router;
