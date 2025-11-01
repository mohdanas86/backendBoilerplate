import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';

// get current user controller
const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
});

// update user details controller
const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, 'At least one field is required to update');
  }

  User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select('-password');

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, 'User details updated successfully')
    );
});

export { getCurrentUser, updateUserDetails };
