// // import { postData } from "@/lib/fetch-util"
// // import type { SignInFormData } from "@/routes/auth/sign-in"
// // import type { SignUpFormData } from "@/routes/auth/sign-up"
// import { fetchData, postData } from "@/lib/fetch-utils"
// // import { useMutation } from "@tanstack/react-query"
// import { SignUpFormData } from "../(auth-admin)/auth/register/page"
// import { SignInFormData } from "../(auth-admin)/auth/login/page"
// import { useMutation, useQuery } from "@tanstack/react-query"

// export const useSignUpMutation = () => {
//     return useMutation({
//         mutationFn: (data: SignUpFormData) => postData("/user/register", data)
//     })
// }

// export const useLoginMutation = () => {
//     return useMutation({
//         mutationFn: (data: SignInFormData) => postData("/user/login", data)
//     })
// }

// export const useUserQuery = () => {
//     return useQuery({
//         queryKey: ["user"],
//         queryFn: () => fetchData("/user/me"),
//     })
// }

// export const useLogoutMutation = () => {
//     return useMutation({
//         mutationFn: () => postData("/user/logout", {})
//     })
// }
// // export const useVerifyEmailMutation = () => {
// //     return useMutation({
// //         mutationFn: (data: { token: string }) => postData("/auth/verify-email", data)
// //     })
// // }

// // export const useForgotPasswordMutation = () => {
// //     return useMutation({
// //         mutationFn: (data: { email: string }) => postData("/auth/reset-password-request", data)
// //     })
// // }

// // export const useResetPasswordMutation = () => {
// //     return useMutation({
// //         mutationFn: (data: { token: string; newPassword: string; confirmPassword: string }) => postData("/auth/reset-password", data)
// //     })
// // }