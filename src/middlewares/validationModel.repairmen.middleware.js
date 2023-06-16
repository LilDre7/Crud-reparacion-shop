const { validationResult, body } = require("express-validator");

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

exports.validationModelRepair = [
  body("Date")
    .not()
    .notEmpty()
    .isDate()
    .isNumeric()
    .withMessage(
      "Es campo en requerido y debe ser tipo DATE en dato tipo numerico"
    ),
  body("motorsNumber")
    .not()
    .notEmpty()
    .isNumeric()
    .isNumeric()
    .withMessage("Es campo requerido deber ser tipo numerico"),
  body("description")
    .not()
    .notEmpty()
    .withMessage("Es campo requerido deber ser tipo string"),
  validateFields,
];
