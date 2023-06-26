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
  body("date").notEmpty().withMessage("Date cannot be empty"),
  body("motorsNumber")
    .notEmpty()
    .withMessage("Motors Number cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Motors Number must be at least 6 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description cannot be empty"),
  validateFields,
];
