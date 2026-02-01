import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export const questionSchema = z.object({
  question: z
    .string()
    .min(10, "Votre question est trop courte (minimum 10 caractères)")
    .max(500, "Votre question est trop longue (maximum 500 caractères)"),
});

export const profileSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  first_name: z.string().min(2, "Le prénom doit contenir au moins 2 caractères").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
