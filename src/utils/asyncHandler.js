// function declaration
// 2nd approach(promises)
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
};

export { asyncHandler }; // in this way we export function

// high order function -> which take function as parameter or return as function

// const asyncHandler = () => {}
// const asyncHandler = (fun) => () => {};
// const asyncHandler = () => async() => {};
// we are making wrapper funtion (1st approach(using trycatch))

// const asyncHandler = (fun) => async(req, res, next) => {
//   try {
//     await fun(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// }
