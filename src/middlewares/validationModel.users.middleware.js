const { body, validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.mapped(),
    });
  }

  next();
};

exports.validationModelUser = [
  body("name", "El nombre es obligatorio")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("El nombre debe tener al menos 5 caracteres"),
  body("email")
    .not()
    .isEmpty()
    // .isEmail()
    // .matches(
    //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    // )
    .withMessage("El email es obligatorio"),
  body("password")
    .not()
    .isEmpty()
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)
    .withMessage(
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula."
    ),
  validateFields,
];
