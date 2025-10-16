const { z } = require('zod');

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(1, 'Name cannot be empty').max(120).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update the profile'
  });

module.exports = {
  updateProfileSchema
};
