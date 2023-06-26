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
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("El nombre debe tener al menos 5 caracteres"),
  body("email")
    .not()
    .isEmpty()
    .isLength({ min: 8, max: 50 })
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage(
      "Tu correo debe cumplir un formato parecido al siguiente: 'nombredeusuario@dominio.com'."
    ),
  body("password")
    .not()
    .isEmpty()
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)
    .withMessage(
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula."
    ),
  body("role").not().isEmpty().isLength({ min: 5 }),
  validateFields,
];

exports.validationModelUpdateUser = [
  body("currentPassword")
    .not()
    .isEmpty()
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)
    .withMessage(
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula."
    ),
  body("newPassword")
    .not()
    .isEmpty()
    .matches(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)
    .withMessage(
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula."
    ),
  validateFields,
];
