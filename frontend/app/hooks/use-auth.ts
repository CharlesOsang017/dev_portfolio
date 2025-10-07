// import { postData } from "@/lib/fetch-util"
// import type { SignInFormData } from "@/routes/auth/sign-in"
// import type { SignUpFormData } from "@/routes/auth/sign-up"
import { postData } from "@/lib/fetch-utils"
// import { useMutation } from "@tanstack/react-query"
import { SignUpFormData } from "../(admin)/section/register/page"
import { SignInFormData } from "../(admin)/section/login/page"
import { useMutation } from "@tanstack/react-query"

export const useSignUpMutation = () => {
    return useMutation({
        mutationFn: (data: SignUpFormData) => postData("/user/register", data)
    })
}

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (data: SignInFormData) => postData("/user/login", data)
    })
}

// export const useVerifyEmailMutation = () => {
//     return useMutation({
//         mutationFn: (data: { token: string }) => postData("/auth/verify-email", data)
//     })
// }

// export const useForgotPasswordMutation = () => {
//     return useMutation({
//         mutationFn: (data: { email: string }) => postData("/auth/reset-password-request", data)
//     })
// }

// export const useResetPasswordMutation = () => {
//     return useMutation({
//         mutationFn: (data: { token: string; newPassword: string; confirmPassword: string }) => postData("/auth/reset-password", data)
//     })
// }